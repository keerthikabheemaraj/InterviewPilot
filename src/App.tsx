/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, TabKey } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ProfileView } from './components/ProfileView';
import { ResumeView } from './components/ResumeView';
import { JobAnalysisView } from './components/JobAnalysisView';
import { SkillGapView } from './components/SkillGapView';
import { InterviewView } from './components/InterviewView';
import { ResultsView } from './components/ResultsView';
import { RoadmapView } from './components/RoadmapView';
import { DemoPresetModal } from './components/DemoPresetModal';
import {
  CandidateProfile,
  ResumeData,
  JobRoleAnalysis,
  SkillGapAnalysis,
  InterviewQuestion,
  AnswerEvaluation,
  RoadmapItem,
} from './types/interview';
import {
  DEMO_CANDIDATES,
  SAMPLE_JOB_ANALYSES,
  SAMPLE_SKILL_GAPS,
  SAMPLE_QUESTIONS,
  SAMPLE_ROADMAP,
} from './data/demoData';
import {
  analyzeResume,
  analyzeJobRole,
  analyzeSkillGap,
  generateInterviewQuestions,
  generateRoadmap,
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeDemoId, setActiveDemoId] = useState<string>('data-analyst');

  // Candidate Profile State - initialized with sensible defaults for quick testing
  const [profile, setProfile] = useState<CandidateProfile>({
    name: 'Alex Chen',
    targetRole: 'Data Analyst',
    experienceLevel: 'Entry Level (Fresher)',
    interviewType: 'Mixed',
    numberOfQuestions: 5,
  });

  // Main Data States
  const [resumeData, setResumeData] = useState<ResumeData | null>(DEMO_CANDIDATES[0].resume);
  const [jobAnalysis, setJobAnalysis] = useState<JobRoleAnalysis | null>(
    SAMPLE_JOB_ANALYSES['Data Analyst']
  );
  const [skillGap, setSkillGap] = useState<SkillGapAnalysis | null>(
    SAMPLE_SKILL_GAPS['Data Analyst']
  );
  const [questions, setQuestions] = useState<InterviewQuestion[]>(
    SAMPLE_QUESTIONS['Data Analyst']
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [evaluations, setEvaluations] = useState<AnswerEvaluation[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>(SAMPLE_ROADMAP);

  // Loading States
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);

  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);

  const [isLoadingGap, setIsLoadingGap] = useState(false);
  const [gapError, setGapError] = useState<string | null>(null);

  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);

  // Load a demo profile bundle
  const handleLoadDemo = (demoId: string) => {
    const demo = DEMO_CANDIDATES.find((d) => d.id === demoId) || DEMO_CANDIDATES[0];
    setActiveDemoId(demo.id);
    setProfile(demo.profile);
    setResumeData(demo.resume);

    const matchingJob =
      SAMPLE_JOB_ANALYSES[demo.profile.targetRole] || SAMPLE_JOB_ANALYSES['Data Analyst'];
    setJobAnalysis(matchingJob);

    const matchingGap =
      SAMPLE_SKILL_GAPS[demo.profile.targetRole] || SAMPLE_SKILL_GAPS['Data Analyst'];
    setSkillGap(matchingGap);

    const matchingQs =
      SAMPLE_QUESTIONS[demo.profile.targetRole] || SAMPLE_QUESTIONS['Data Analyst'];
    setQuestions(matchingQs);
    setCurrentQuestionIndex(0);
    setEvaluations([]);
    setRoadmap(SAMPLE_ROADMAP);
  };

  // API Handler: Analyze Resume
  const handleAnalyzeResumeApi = async (params: {
    pdfBase64?: string;
    resumeText?: string;
    candidateName?: string;
  }) => {
    setIsLoadingResume(true);
    setResumeError(null);
    try {
      const data = await analyzeResume(params);
      setResumeData(data);
      if (data.candidateName) {
        setProfile((prev) => ({ ...prev, name: data.candidateName }));
      }
    } catch (err: any) {
      console.error(err);
      setResumeError(err.message || 'Failed to extract resume with AI.');
    } finally {
      setIsLoadingResume(false);
    }
  };

  // API Handler: Analyze Job
  const handleAnalyzeJobApi = async (params: {
    roleTitle: string;
    experienceLevel: any;
    customDescription?: string;
  }) => {
    setIsLoadingJob(true);
    setJobError(null);
    try {
      const analysis = await analyzeJobRole(params);
      setJobAnalysis(analysis);
    } catch (err: any) {
      console.error(err);
      setJobError(err.message || 'Failed to analyze job role.');
    } finally {
      setIsLoadingJob(false);
    }
  };

  // API Handler: Skill Gap
  const handleAnalyzeSkillGapApi = async () => {
    if (!resumeData || !jobAnalysis) return;
    setIsLoadingGap(true);
    setGapError(null);
    try {
      const gap = await analyzeSkillGap({
        resumeData,
        jobAnalysis,
      });
      setSkillGap(gap);
    } catch (err: any) {
      console.error(err);
      setGapError(err.message || 'Failed to evaluate skill gap.');
    } finally {
      setIsLoadingGap(false);
    }
  };

  // API Handler: Generate Questions
  const handleGenerateQuestionsApi = async () => {
    setIsGeneratingQuestions(true);
    try {
      const res = await generateInterviewQuestions({
        resumeData: resumeData || undefined,
        jobRole: profile.targetRole,
        skillGaps: skillGap || undefined,
        interviewType: profile.interviewType,
        experienceLevel: profile.experienceLevel,
        count: profile.numberOfQuestions,
      });
      setQuestions(res.questions);
      setCurrentQuestionIndex(0);
      setEvaluations([]);
    } catch (err: any) {
      console.error(err);
      // Fallback questions if error
      if (SAMPLE_QUESTIONS[profile.targetRole]) {
        setQuestions(SAMPLE_QUESTIONS[profile.targetRole]);
      } else {
        setQuestions(SAMPLE_QUESTIONS['Data Analyst']);
      }
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // API Handler: Generate Roadmap
  const handleGenerateRoadmapApi = async () => {
    setIsLoadingRoadmap(true);
    setRoadmapError(null);
    try {
      const res = await generateRoadmap({
        skillGapAnalysis: skillGap || undefined,
        jobRole: profile.targetRole,
        evaluations,
      });
      setRoadmap(res.roadmap);
    } catch (err: any) {
      console.error(err);
      setRoadmapError(err.message || 'Failed to generate improvement roadmap.');
      setRoadmap(SAMPLE_ROADMAP);
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  // Update a single roadmap item's status
  const handleUpdateRoadmapItemStatus = (
    id: string,
    status: 'Not Started' | 'In Progress' | 'Completed'
  ) => {
    setRoadmap((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasResume={Boolean(resumeData)}
        hasJobAnalysis={Boolean(jobAnalysis)}
        hasSkillGap={Boolean(skillGap)}
        hasInterviewResults={evaluations.length > 0}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
        candidateName={profile.name}
        targetRole={profile.targetRole}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={setActiveTab}
            onLoadDemo={(id) => {
              handleLoadDemo(id);
              setActiveTab('interview');
            }}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            onChangeProfile={setProfile}
            onContinue={() => setActiveTab('resume')}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeView
            resumeData={resumeData}
            onSetResumeData={setResumeData}
            onAnalyzeResumeApi={handleAnalyzeResumeApi}
            isLoading={isLoadingResume}
            error={resumeError}
            profile={profile}
            onContinue={() => setActiveTab('job')}
          />
        )}

        {activeTab === 'job' && (
          <JobAnalysisView
            jobAnalysis={jobAnalysis}
            onSetJobAnalysis={setJobAnalysis}
            onAnalyzeJobApi={handleAnalyzeJobApi}
            isLoading={isLoadingJob}
            error={jobError}
            profile={profile}
            onChangeProfile={setProfile}
            onContinue={() => setActiveTab('skill-gap')}
          />
        )}

        {activeTab === 'skill-gap' && (
          <SkillGapView
            skillGap={skillGap}
            resumeData={resumeData}
            jobAnalysis={jobAnalysis}
            onAnalyzeGapApi={handleAnalyzeSkillGapApi}
            isLoading={isLoadingGap}
            error={gapError}
            onContinue={() => setActiveTab('interview')}
            onBackToResume={() => setActiveTab('resume')}
            onBackToJob={() => setActiveTab('job')}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewView
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            evaluations={evaluations}
            onSetEvaluations={setEvaluations}
            onSetCurrentQuestionIndex={setCurrentQuestionIndex}
            onFinishInterview={() => setActiveTab('results')}
            profile={profile}
            resumeData={resumeData}
            skillGap={skillGap}
            jobAnalysis={jobAnalysis}
            onGenerateQuestionsApi={handleGenerateQuestionsApi}
            isGeneratingQuestions={isGeneratingQuestions}
          />
        )}

        {activeTab === 'results' && (
          <ResultsView
            evaluations={
              evaluations.length > 0
                ? evaluations
                : [
                    {
                      questionId: 'demo_eval_1',
                      questionText: questions[0]?.question || 'Technical sample question',
                      candidateAnswer:
                        'I handled preprocessing by calculating RFM scores, filtering transaction outliers, and clustering data using KMeans.',
                      relevanceScore: 88,
                      technicalAccuracyScore: 84,
                      completenessScore: 80,
                      communicationScore: 85,
                      overallScore: 84,
                      strengths: [
                        'Clear methodology and business context.',
                        'Appropriate use of algorithmic clustering terminology.',
                      ],
                      weaknesses: [
                        'Could mention data validation edge cases and missing value imputation.',
                      ],
                      improvementSuggestion:
                        'Quantify the business impact or latency improvement achieved.',
                      idealAnswerOutline:
                        '1. Cleaning strategy\n2. Metric formulation\n3. Business validation',
                      assessmentDisclaimer:
                        'AI-generated textual assessment based on answer content. Does not measure psychological or biometric traits.',
                    },
                  ]
            }
            profile={profile}
            skillGap={skillGap}
            onNavigateToRoadmap={() => setActiveTab('roadmap')}
            onRetakeInterview={() => {
              setEvaluations([]);
              setCurrentQuestionIndex(0);
              setActiveTab('interview');
            }}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            roadmap={roadmap}
            onUpdateRoadmapItemStatus={handleUpdateRoadmapItemStatus}
            onGenerateRoadmapApi={handleGenerateRoadmapApi}
            isLoading={isLoadingRoadmap}
            error={roadmapError}
            profile={profile}
            skillGap={skillGap}
            evaluations={evaluations}
            onRetakeInterview={() => {
              setEvaluations([]);
              setCurrentQuestionIndex(0);
              setActiveTab('interview');
            }}
          />
        )}
      </main>

      {/* Demo Modal */}
      <DemoPresetModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectCandidate={(id) => handleLoadDemo(id)}
        activeCandidateId={activeDemoId}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            InterviewPilot AI • Personalized AI Mock Interview & Performance Evaluation System
          </span>
          <span className="font-mono text-slate-400">
            Final-Year Computer Science & Engineering Capstone
          </span>
        </div>
      </footer>
    </div>
  );
}
