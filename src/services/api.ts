import {
  ResumeData,
  JobRoleAnalysis,
  SkillGapAnalysis,
  InterviewQuestion,
  AnswerEvaluation,
  RoadmapItem,
  InterviewType,
  ExperienceLevel,
} from '../types/interview';

export async function analyzeResume(params: {
  pdfBase64?: string;
  resumeText?: string;
  candidateName?: string;
}): Promise<ResumeData> {
  const response = await fetch('/api/analyze-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Resume analysis failed (${response.status})`);
  }

  return response.json();
}

export async function analyzeJobRole(params: {
  roleTitle: string;
  experienceLevel: ExperienceLevel;
  customDescription?: string;
}): Promise<JobRoleAnalysis> {
  const response = await fetch('/api/analyze-job', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Job role analysis failed (${response.status})`);
  }

  return response.json();
}

export async function analyzeSkillGap(params: {
  resumeData: ResumeData;
  jobAnalysis: JobRoleAnalysis;
}): Promise<SkillGapAnalysis> {
  const response = await fetch('/api/analyze-skill-gap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Skill gap calculation failed (${response.status})`);
  }

  return response.json();
}

export async function generateInterviewQuestions(params: {
  resumeData?: ResumeData;
  jobRole: string;
  skillGaps?: SkillGapAnalysis;
  interviewType: InterviewType;
  experienceLevel: ExperienceLevel;
  count: number;
}): Promise<{ questions: InterviewQuestion[] }> {
  const response = await fetch('/api/generate-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate questions (${response.status})`);
  }

  return response.json();
}

export async function evaluateAnswer(params: {
  question: InterviewQuestion;
  candidateAnswer: string;
  jobRole: string;
  experienceLevel: ExperienceLevel;
}): Promise<AnswerEvaluation> {
  const response = await fetch('/api/evaluate-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to evaluate answer (${response.status})`);
  }

  return response.json();
}

export async function generateRoadmap(params: {
  skillGapAnalysis?: SkillGapAnalysis;
  jobRole: string;
  evaluations: AnswerEvaluation[];
}): Promise<{ roadmap: RoadmapItem[] }> {
  const response = await fetch('/api/generate-roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate roadmap (${response.status})`);
  }

  return response.json();
}
