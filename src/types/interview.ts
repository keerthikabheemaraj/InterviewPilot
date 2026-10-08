export type InterviewType = 'Technical' | 'HR' | 'Behavioral' | 'Mixed';
export type ExperienceLevel = 'Entry Level (Fresher)' | 'Junior (1-2 Years)' | 'Mid-Level (3-5 Years)' | 'Senior (5+ Years)';

export interface ProjectItem {
  title: string;
  technologies: string[];
  description: string;
  impact?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year?: string;
  cgpaOrGrade?: string;
}

export interface WorkItem {
  role: string;
  company: string;
  duration?: string;
  highlights: string[];
}

export interface ResumeData {
  candidateName: string;
  email?: string;
  phone?: string;
  summary: string;
  education: EducationItem[];
  technicalSkills: string[];
  programmingLanguages: string[];
  toolsAndFrameworks: string[];
  projects: ProjectItem[];
  internshipsAndExperience: WorkItem[];
  certifications: string[];
  keyStrengths: string[];
  extractedFromPdf?: boolean;
}

export interface JobRoleAnalysis {
  roleTitle: string;
  overview: string;
  requiredTechnicalSkills: string[];
  requiredSoftSkills: string[];
  expectedTools: string[];
  importantConcepts: string[];
  typicalInterviewTopics: string[];
  industryDemand: string;
}

export interface SkillItem {
  name: string;
  category: 'Technical' | 'Tool' | 'Soft Skill' | 'Concept';
  details?: string;
}

export interface SkillGapAnalysis {
  matchingSkills: SkillItem[];
  partiallyMatchingSkills: {
    name: string;
    candidateSkill: string;
    gapDescription: string;
  }[];
  missingSkills: SkillItem[];
  skillGapPercentage: number; // e.g. 35%
  matchPercentage: number; // e.g. 65%
  readinessVerdict: string;
  recommendedLearningAreas: string[];
}

export interface InterviewQuestion {
  id: string;
  questionNumber: number;
  question: string;
  category: 'Technical' | 'Resume-based' | 'Behavioral' | 'Situational' | 'HR';
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  targetedCompetency: string;
  contextHint?: string;
}

export interface AnswerEvaluation {
  questionId: string;
  questionText: string;
  candidateAnswer: string;
  relevanceScore: number; // 0-100
  technicalAccuracyScore: number; // 0-100
  completenessScore: number; // 0-100
  communicationScore: number; // 0-100
  overallScore: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  improvementSuggestion: string;
  idealAnswerOutline: string;
  assessmentDisclaimer: string;
}

export interface FinalInterviewReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  relevanceScore: number;
  completenessScore: number;
  totalQuestions: number;
  strongestAreas: string[];
  areasRequiringImprovement: string[];
  summaryFeedback: string;
  hireReadiness: 'Ready for Interview' | 'Needs Targeted Practice' | 'Requires Foundational Study';
  evaluations: AnswerEvaluation[];
}

export interface RoadmapItem {
  id: string;
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  whatToLearn: string[];
  practiceTask: string;
  suggestedInterviewPractice: string;
  estimatedTimeline: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface CandidateProfile {
  name: string;
  targetRole: string;
  experienceLevel: ExperienceLevel;
  interviewType: InterviewType;
  numberOfQuestions: number;
}
