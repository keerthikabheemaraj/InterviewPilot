import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.8-flash';

// Helper to safely parse JSON from Gemini text response
function safeParseJson<T>(rawText: string, fallback: T): T {
  try {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }
    return JSON.parse(clean);
  } catch (err) {
    console.error('Failed to parse Gemini response as JSON:', err, rawText);
    return fallback;
  }
}

// 1. Resume Analyzer
app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { pdfBase64, resumeText, candidateName } = req.body;

    if (!pdfBase64 && !resumeText) {
      return res.status(400).json({ error: 'Please provide either a PDF resume or resume text.' });
    }

    if (!hasApiKey) {
      // Fallback extraction
      return res.json({
        candidateName: candidateName || 'Candidate',
        summary: 'Technical profile extracted in offline demo mode. Highlights foundation in computer science and software development.',
        education: [
          { degree: 'B.S. in Computer Science', institution: 'University', year: '2022 - 2026', cgpaOrGrade: '3.8 / 4.0' }
        ],
        technicalSkills: ['Programming Fundamentals', 'Problem Solving', 'Data Analysis', 'Web Development', 'Git'],
        programmingLanguages: ['Python', 'JavaScript', 'SQL', 'C++'],
        toolsAndFrameworks: ['Git', 'VS Code', 'Docker Basics', 'React Basics'],
        projects: [
          {
            title: 'Full-Stack Software Capstone',
            technologies: ['React', 'Node.js', 'SQL'],
            description: 'Designed and implemented end-to-end full-stack portal with authentication and database persistence.',
            impact: 'Achieved complete modular software lifecycle implementation.'
          }
        ],
        internshipsAndExperience: [
          {
            role: 'Software / Tech Intern',
            company: 'Tech Solutions',
            duration: 'Summer 2025',
            highlights: ['Assisted senior engineers in bug fixes and unit testing.', 'Built internal dashboard components.']
          }
        ],
        certifications: ['Certified Software Development Foundations'],
        keyStrengths: ['Quick learner', 'Clear logical communication', 'Solid technical fundamentals'],
        extractedFromPdf: Boolean(pdfBase64),
      });
    }

    const systemInstruction = `You are a Senior Technical Recruiter and AI Resume Parsing Specialist for InterviewPilot AI.
Extract structured information from the provided resume accurately.
Do not fabricate information. Clearly capture:
- Candidate Name
- Contact Info (if present)
- Summary (1-2 sentences capturing their profile)
- Education (Degree, institution, year, grade/GPA)
- Technical Skills
- Programming Languages
- Tools & Frameworks
- Projects (Title, technologies used, description, impact)
- Internships & Experience (Role, company, duration, key accomplishments)
- Certifications
- Key Strengths (3-4 bullet points)`;

    let contentsPayload: any;

    if (pdfBase64) {
      contentsPayload = {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: pdfBase64.includes('base64,') ? pdfBase64.split('base64,')[1] : pdfBase64,
            },
          },
          {
            text: 'Extract all candidate information from this resume PDF according to the required schema. Ensure high fidelity on projects, technologies, and metrics.',
          },
        ],
      };
    } else {
      contentsPayload = `Resume Text:\n${resumeText}\n\nCandidate Name if known: ${candidateName || 'Unknown'}\nExtract structured details according to schema.`;
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contentsPayload,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidateName: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            summary: { type: Type.STRING },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  year: { type: Type.STRING },
                  cgpaOrGrade: { type: Type.STRING },
                },
                required: ['degree', 'institution'],
              },
            },
            technicalSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            programmingLanguages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            toolsAndFrameworks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING },
                },
                required: ['title', 'technologies', 'description'],
              },
            },
            internshipsAndExperience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  company: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['role', 'company', 'highlights'],
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'candidateName',
            'summary',
            'education',
            'technicalSkills',
            'programmingLanguages',
            'toolsAndFrameworks',
            'projects',
            'keyStrengths',
          ],
        },
      },
    });

    const parsed = safeParseJson<any>(response.text || '{}', null);
    if (!parsed) {
      throw new Error('Could not parse resume data from AI response.');
    }

    parsed.extractedFromPdf = Boolean(pdfBase64);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-resume:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze resume. Please try again or use sample demo data.',
    });
  }
});

// 2. Job Role Analyzer
app.post('/api/analyze-job', async (req, res) => {
  try {
    const { roleTitle, experienceLevel, customDescription } = req.body;

    if (!roleTitle) {
      return res.status(400).json({ error: 'Role title is required.' });
    }

    if (!hasApiKey) {
      return res.json({
        roleTitle,
        overview: `Comprehensive industry profile for ${roleTitle} (${experienceLevel || 'Entry Level'}). Involves high-impact problem solving, tool proficiency, and engineering collaboration.`,
        requiredTechnicalSkills: ['Core Domain Knowledge', 'System Architecture', 'Database Management', 'Testing & Debugging', 'Version Control'],
        requiredSoftSkills: ['Analytical Communication', 'Cross-team Collaboration', 'Adaptability', 'Time Management'],
        expectedTools: ['Git', 'Docker', 'Cloud Services (AWS/GCP)', 'Issue Tracking Tools', 'CI/CD Pipelines'],
        importantConcepts: ['Scalability', 'Security Best Practices', 'Performance Tuning', 'Code Quality & Maintainability'],
        typicalInterviewTopics: ['System Design & Architecture', 'Algorithmic Efficiency', 'Incident Troubleshooting', 'Live Coding Scenarios'],
        industryDemand: 'High across global technology and enterprise sectors.',
      });
    }

    const prompt = `Analyze the target job role "${roleTitle}" for an applicant at the "${experienceLevel || 'Entry Level'}" level.
Optional custom role description/notes: "${customDescription || 'None'}".

Provide a structured, industry-accurate breakdown of:
1. Role overview
2. Required Technical Skills (at least 6 specific skills)
3. Required Soft Skills (at least 4 key skills)
4. Expected Tools & Frameworks
5. Important Concepts
6. Typical Interview Topics
7. Current Industry Demand summary`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roleTitle: { type: Type.STRING },
            overview: { type: Type.STRING },
            requiredTechnicalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            requiredSoftSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            expectedTools: { type: Type.ARRAY, items: { type: Type.STRING } },
            importantConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            typicalInterviewTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            industryDemand: { type: Type.STRING },
          },
          required: [
            'roleTitle',
            'overview',
            'requiredTechnicalSkills',
            'requiredSoftSkills',
            'expectedTools',
            'importantConcepts',
            'typicalInterviewTopics',
            'industryDemand',
          ],
        },
      },
    });

    const parsed = safeParseJson(response.text || '{}', null);
    if (!parsed) {
      throw new Error('Invalid format returned by job analyzer.');
    }
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-job:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze job role.' });
  }
});

// 3. Skill Gap Analyzer
app.post('/api/analyze-skill-gap', async (req, res) => {
  try {
    const { resumeData, jobAnalysis } = req.body;

    if (!resumeData || !jobAnalysis) {
      return res.status(400).json({ error: 'Both resumeData and jobAnalysis are required.' });
    }

    if (!hasApiKey) {
      return res.json({
        matchingSkills: [
          { name: 'Core Programming', category: 'Technical', details: 'Candidate possesses foundational coding ability in main languages.' },
          { name: 'Database Fundamentals', category: 'Concept', details: 'Familiar with basic query constructs and schemas.' },
          { name: 'Git & Source Control', category: 'Tool', details: 'Standard collaborative version control practice demonstrated.' }
        ],
        partiallyMatchingSkills: [
          {
            name: 'Cloud Infrastructure',
            candidateSkill: 'Local Deployment Only',
            gapDescription: 'Has run applications locally but lacks hands-on cloud provisioning (AWS/GCP).'
          },
          {
            name: 'Production Testing',
            candidateSkill: 'Manual Testing',
            gapDescription: 'Lacks automated integration or end-to-end testing suite experience.'
          }
        ],
        missingSkills: [
          { name: 'Distributed Systems & Microservices', category: 'Concept', details: 'No documented exposure to high-scale message queues or distributed caching.' },
          { name: 'CI/CD Pipeline Automation', category: 'Tool', details: 'Needs workflow automation experience with GitHub Actions or Jenkins.' }
        ],
        skillGapPercentage: 30,
        matchPercentage: 70,
        readinessVerdict: 'Promising candidate with solid fundamental capabilities; needs targeted preparation in enterprise tooling.',
        recommendedLearningAreas: [
          'Enterprise Cloud Services and container deployment',
          'Automated testing workflows and CI/CD pipelines',
          'System scalability and performance tuning'
        ]
      });
    }

    const prompt = `Compare candidate's resume with the target job role.

CANDIDATE RESUME:
- Name: ${resumeData.candidateName}
- Skills: ${resumeData.technicalSkills?.join(', ')}
- Languages: ${resumeData.programmingLanguages?.join(', ')}
- Tools: ${resumeData.toolsAndFrameworks?.join(', ')}
- Projects: ${resumeData.projects?.map((p: any) => `${p.title}: ${p.description}`).join(' | ')}
- Internships: ${resumeData.internshipsAndExperience?.map((i: any) => `${i.role} at ${i.company}`).join(' | ')}

TARGET JOB ROLE:
- Role: ${jobAnalysis.roleTitle}
- Required Tech Skills: ${jobAnalysis.requiredTechnicalSkills?.join(', ')}
- Expected Tools: ${jobAnalysis.expectedTools?.join(', ')}
- Important Concepts: ${jobAnalysis.importantConcepts?.join(', ')}
- Required Soft Skills: ${jobAnalysis.requiredSoftSkills?.join(', ')}

Analyze the alignment objectively:
1. MATCHING SKILLS: Skills candidate clearly possesses that match the target role.
2. PARTIALLY MATCHING SKILLS: Skills where candidate has related/foundational knowledge but lacks advanced enterprise depth (provide exact gap explanation).
3. MISSING SKILLS: Skills expected for the job that are absent from the resume.
4. Calculate integer skillGapPercentage (e.g. 25) and matchPercentage (e.g. 75), where they sum to 100.
5. Provide a realistic readinessVerdict.
6. Provide recommendedLearningAreas.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchingSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  details: { type: Type.STRING },
                },
                required: ['name', 'category'],
              },
            },
            partiallyMatchingSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  candidateSkill: { type: Type.STRING },
                  gapDescription: { type: Type.STRING },
                },
                required: ['name', 'candidateSkill', 'gapDescription'],
              },
            },
            missingSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  details: { type: Type.STRING },
                },
                required: ['name', 'category'],
              },
            },
            skillGapPercentage: { type: Type.NUMBER },
            matchPercentage: { type: Type.NUMBER },
            readinessVerdict: { type: Type.STRING },
            recommendedLearningAreas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'matchingSkills',
            'partiallyMatchingSkills',
            'missingSkills',
            'skillGapPercentage',
            'matchPercentage',
            'readinessVerdict',
            'recommendedLearningAreas',
          ],
        },
      },
    });

    const parsed = safeParseJson(response.text || '{}', null);
    if (!parsed) {
      throw new Error('Invalid format returned by skill gap analyzer.');
    }
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-skill-gap:', error);
    return res.status(500).json({ error: error.message || 'Failed to calculate skill gap.' });
  }
});

// 4. AI Question Generator
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { resumeData, jobRole, skillGaps, interviewType, experienceLevel, count = 5 } = req.body;

    if (!jobRole) {
      return res.status(400).json({ error: 'Job role is required.' });
    }

    if (!hasApiKey) {
      const sampleQs = [
        {
          id: 'q1',
          questionNumber: 1,
          question: `Can you walk me through the architecture and design decisions you made in your primary project, and what technical challenges you overcame?`,
          category: 'Resume-based',
          difficulty: 'Medium',
          targetedCompetency: 'Project Architecture & Ownership',
          contextHint: 'Focus on technology choices, data flow, and quantifiable impact.'
        },
        {
          id: 'q2',
          questionNumber: 2,
          question: `For a ${jobRole} role, how do you handle performance bottlenecks and optimize database queries or algorithmic execution?`,
          category: 'Technical',
          difficulty: 'Medium',
          targetedCompetency: 'System Performance & Optimization',
          contextHint: 'Discuss profiling, indexing, caching, and algorithmic time complexity.'
        },
        {
          id: 'q3',
          questionNumber: 3,
          question: `Suppose a critical bug or production incident occurs 30 minutes before a customer demo. How do you prioritize, isolate, and remediate the issue?`,
          category: 'Situational',
          difficulty: 'Challenging',
          targetedCompetency: 'Crisis Management & Root Cause Isolation',
          contextHint: 'Step through triage, rollback/hotfix strategy, and stakeholder communication.'
        },
        {
          id: 'q4',
          questionNumber: 4,
          question: `Looking at current industry requirements for ${jobRole}, how are you bridging modern skill gaps such as automated testing or cloud architectures?`,
          category: 'Technical',
          difficulty: 'Medium',
          targetedCompetency: 'Skill Gap Self-Awareness & Upskilling',
          contextHint: 'Highlight current hands-on experiments or self-directed learning.'
        },
        {
          id: 'q5',
          questionNumber: 5,
          question: `Describe a scenario where you received critical constructive feedback on your code or analytical report. How did you respond and adapt?`,
          category: 'Behavioral',
          difficulty: 'Medium',
          targetedCompetency: 'Receptiveness to Feedback & Growth Mindset',
          contextHint: 'Use the STAR technique with a positive learning outcome.'
        }
      ];
      return res.json({ questions: sampleQs.slice(0, count) });
    }

    const prompt = `Generate exactly ${count} highly personalized, realistic mock interview questions.

CANDIDATE CONTEXT:
- Name: ${resumeData?.candidateName || 'Candidate'}
- Target Role: ${jobRole}
- Experience Level: ${experienceLevel || 'Entry Level (Fresher)'}
- Preferred Interview Type: ${interviewType || 'Mixed'}
- Key Projects: ${resumeData?.projects?.map((p: any) => `${p.title} (${p.technologies?.join(', ')})`).join('; ') || 'General software projects'}
- Identified Skill Gaps: ${skillGaps?.missingSkills?.map((s: any) => s.name).join(', ') || 'Cloud, Distributed Systems'}
- Candidate Strengths: ${resumeData?.keyStrengths?.join(', ') || 'Problem solving'}

REQUIREMENTS:
- Tailor questions directly to the candidate's actual projects, identified skill gaps, and the ${interviewType} interview style.
- Mix categories appropriately: Technical, Resume-based, Behavioral, Situational, and HR.
- Each question must include an actionable contextHint explaining what recruiters evaluate.
- Assign an appropriate difficulty ('Easy' | 'Medium' | 'Challenging').`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  questionNumber: { type: Type.NUMBER },
                  question: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    enum: ['Technical', 'Resume-based', 'Behavioral', 'Situational', 'HR'],
                  },
                  difficulty: {
                    type: Type.STRING,
                    enum: ['Easy', 'Medium', 'Challenging'],
                  },
                  targetedCompetency: { type: Type.STRING },
                  contextHint: { type: Type.STRING },
                },
                required: ['id', 'questionNumber', 'question', 'category', 'difficulty', 'targetedCompetency'],
              },
            },
          },
          required: ['questions'],
        },
      },
    });

    const parsed = safeParseJson<any>(response.text || '{}', null);
    if (!parsed || !parsed.questions) {
      throw new Error('Failed to generate interview questions.');
    }
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/generate-questions:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate interview questions.' });
  }
});

// 5. Answer Evaluation
app.post('/api/evaluate-answer', async (req, res) => {
  try {
    const { question, candidateAnswer, jobRole, experienceLevel } = req.body;

    if (!question || !candidateAnswer) {
      return res.status(400).json({ error: 'Question and answer are required.' });
    }

    if (candidateAnswer.trim().length < 5) {
      return res.status(400).json({ error: 'Please enter a more complete response to evaluate.' });
    }

    if (!hasApiKey) {
      // Offline fallback heuristic
      const wordCount = candidateAnswer.trim().split(/\s+/).length;
      const baseScore = Math.min(92, Math.max(58, 60 + Math.floor(wordCount / 5)));
      return res.json({
        questionId: question.id || 'q_eval',
        questionText: question.question,
        candidateAnswer,
        relevanceScore: Math.min(95, baseScore + 2),
        technicalAccuracyScore: Math.min(95, baseScore - 3),
        completenessScore: Math.min(95, baseScore),
        communicationScore: Math.min(95, baseScore + 4),
        overallScore: baseScore,
        strengths: [
          'Directly addresses the premise of the prompt.',
          'Demonstrates professional intent and clear terminology.',
          'Highlights relevant technical perspective.'
        ],
        weaknesses: [
          'Could elaborate with concrete architectural metrics or measurable business outcomes.',
          'Could structure using STAR framework for greater impact.'
        ],
        improvementSuggestion: 'Incorporate specific quantitative metrics (e.g. % speedup, latency drop, table row count) to strengthen technical credibility.',
        idealAnswerOutline: '1. State direct technical approach or thesis\n2. Share concrete methodology or code pattern\n3. Highlight validation and measurable outcome.',
        assessmentDisclaimer: 'AI-generated textual assessment based on answer content. Does not measure psychological or biometric traits.'
      });
    }

    const prompt = `You are an expert Interview Assessor for ${jobRole || 'Engineering Candidates'} (${experienceLevel || 'Entry Level'}).
Evaluate the candidate's answer to the interview question with high objectivity.

INTERVIEW QUESTION:
"${question.question}"
Category: ${question.category}
Targeted Competency: ${question.targetedCompetency}

CANDIDATE ANSWER:
"${candidateAnswer}"

EVALUATION CRITERIA:
1. Relevance Score (0-100): How directly does it address what was asked?
2. Technical Accuracy Score (0-100): Are technical statements, methodologies, and concepts accurate?
3. Completeness Score (0-100): Did the candidate cover all required nuances (why, how, result)?
4. Communication Score (0-100): Clarity, structure, professional tone, and coherence.
5. Overall Score (0-100): Balanced composite rating.
6. Strengths: 2 to 3 specific positive aspects of their answer.
7. Weaknesses: 2 to 3 constructive areas lacking depth or precision.
8. Improvement Suggestion: 1 actionable recommendation to make this answer top-tier.
9. Ideal Answer Outline: Bulleted outline of what a 95+ score answer would mention.

NOTE: Do not claim to measure actual psychological confidence or personality. Clearly provide textual content evaluation.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            relevanceScore: { type: Type.INTEGER },
            technicalAccuracyScore: { type: Type.INTEGER },
            completenessScore: { type: Type.INTEGER },
            communicationScore: { type: Type.INTEGER },
            overallScore: { type: Type.INTEGER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementSuggestion: { type: Type.STRING },
            idealAnswerOutline: { type: Type.STRING },
          },
          required: [
            'relevanceScore',
            'technicalAccuracyScore',
            'completenessScore',
            'communicationScore',
            'overallScore',
            'strengths',
            'weaknesses',
            'improvementSuggestion',
            'idealAnswerOutline',
          ],
        },
      },
    });

    const parsed = safeParseJson<any>(response.text || '{}', null);
    if (!parsed) {
      throw new Error('Failed to evaluate candidate answer.');
    }

    return res.json({
      questionId: question.id,
      questionText: question.question,
      candidateAnswer,
      ...parsed,
      assessmentDisclaimer: 'AI-generated textual assessment based on answer content. Does not measure psychological or biometric traits.',
    });
  } catch (error: any) {
    console.error('Error in /api/evaluate-answer:', error);
    return res.status(500).json({ error: error.message || 'Failed to evaluate answer.' });
  }
});

// 6. Improvement Roadmap Generator
app.post('/api/generate-roadmap', async (req, res) => {
  try {
    const { skillGapAnalysis, jobRole, evaluations } = req.body;

    if (!hasApiKey) {
      return res.json({
        roadmap: [
          {
            id: 'rm-1',
            skill: 'Cloud Deployment & Containerization',
            priority: 'High',
            reason: `Mandatory requirement for ${jobRole || 'Engineering'} positions to deploy robust production microservices.`,
            whatToLearn: ['Docker container build optimization', 'Deploying containerized apps to AWS ECS or GCP Cloud Run', 'Environment secrets configuration'],
            practiceTask: 'Package a full-stack CRUD application in a multi-stage Docker container and deploy it to a free-tier cloud host.',
            suggestedInterviewPractice: 'Explain how you configure health checks and rollback strategies for containerized workloads.',
            estimatedTimeline: '1 - 2 Weeks',
            status: 'Not Started'
          },
          {
            id: 'rm-2',
            skill: 'Automated Testing & CI/CD Pipelines',
            priority: 'High',
            reason: 'Demonstrates professional software quality standards beyond raw coding ability.',
            whatToLearn: ['Unit and integration test suites with Jest/Vitest', 'GitHub Actions workflow triggers', 'Coverage reporting thresholds'],
            practiceTask: 'Add at least 10 automated unit test cases with GitHub Actions to fail pull requests below 80% coverage.',
            suggestedInterviewPractice: 'Mock question: "What is your testing pyramid strategy when delivering a new microservice?"',
            estimatedTimeline: '1 Week',
            status: 'In Progress'
          },
          {
            id: 'rm-3',
            skill: 'System Design & Scalability Trade-offs',
            priority: 'Medium',
            reason: 'Differentiates junior coders from strong software engineers capable of designing resilient architectures.',
            whatToLearn: ['Database indexing and execution plan reading', 'Redis caching invalidation patterns', 'Load balancing and rate limiting'],
            practiceTask: 'Draw and document the architecture for a URL shortening service handling 10,000 requests per second.',
            suggestedInterviewPractice: 'Conduct 2 peer mock interviews focusing on architectural trade-offs.',
            estimatedTimeline: '2 Weeks',
            status: 'Not Started'
          }
        ]
      });
    }

    const prompt = `Generate a personalized, prioritized improvement roadmap for a candidate who just completed an interview for "${jobRole || 'Target Role'}".

Identified Skill Gaps:
- Missing: ${skillGapAnalysis?.missingSkills?.map((s: any) => s.name).join(', ') || 'Cloud, System Design'}
- Partial: ${skillGapAnalysis?.partiallyMatchingSkills?.map((s: any) => `${s.name} (${s.gapDescription})`).join(', ') || 'Testing depth'}

Interview Evaluation Summary:
${evaluations?.map((e: any, idx: number) => `Q${idx + 1} (${e.overallScore}/100): Weaknesses: ${e.weaknesses?.join('; ')}`).join('\n') || 'General interview evaluation'}

Generate 4 to 5 high-impact, prioritized roadmap items (High, Medium, Low priority).
For each item, specify:
- Skill name
- Priority
- Why the skill is critical for this role
- What to Learn (3 specific subtopics)
- Concrete Practice Task (actionable mini-project or exercise)
- Suggested Interview Practice (exact mock interview question or drill)
- Estimated timeline`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  skill: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                  reason: { type: Type.STRING },
                  whatToLearn: { type: Type.ARRAY, items: { type: Type.STRING } },
                  practiceTask: { type: Type.STRING },
                  suggestedInterviewPractice: { type: Type.STRING },
                  estimatedTimeline: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ['Not Started', 'In Progress', 'Completed'] },
                },
                required: [
                  'id',
                  'skill',
                  'priority',
                  'reason',
                  'whatToLearn',
                  'practiceTask',
                  'suggestedInterviewPractice',
                  'estimatedTimeline',
                ],
              },
            },
          },
          required: ['roadmap'],
        },
      },
    });

    const parsed = safeParseJson<any>(response.text || '{}', null);
    if (!parsed || !parsed.roadmap) {
      throw new Error('Failed to generate improvement roadmap.');
    }

    // Default status to 'Not Started' if not present
    parsed.roadmap.forEach((item: any) => {
      if (!item.status) item.status = 'Not Started';
    });

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/generate-roadmap:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate improvement roadmap.' });
  }
});

// Vite middleware or static serving
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`InterviewPilot AI server running on port ${PORT}`);
});
