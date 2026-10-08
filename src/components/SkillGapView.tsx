import React from 'react';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  BookOpen,
  Award,
  Zap,
} from 'lucide-react';
import { SkillGapAnalysis, ResumeData, JobRoleAnalysis } from '../types/interview';

interface SkillGapViewProps {
  skillGap: SkillGapAnalysis | null;
  resumeData: ResumeData | null;
  jobAnalysis: JobRoleAnalysis | null;
  onAnalyzeGapApi: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onContinue: () => void;
  onBackToResume: () => void;
  onBackToJob: () => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  skillGap,
  resumeData,
  jobAnalysis,
  onAnalyzeGapApi,
  isLoading,
  error,
  onContinue,
  onBackToResume,
  onBackToJob,
}) => {
  const hasInputs = Boolean(resumeData && jobAnalysis);

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
            <Target className="w-3.5 h-3.5" />
            <span>Step 6 • Skill Gap Analyzer</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Comparative Skill Gap Matrix</h2>
          <p className="text-sm text-slate-400">
            Automated alignment scoring comparing candidate background with {jobAnalysis?.roleTitle || 'target job'} expectations.
          </p>
        </div>

        {skillGap && (
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition self-start sm:self-auto"
          >
            <span>Proceed to Mock Interview</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Input Status Reminder */}
      {!hasInputs && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 text-amber-400">
            <AlertCircle className="w-5 h-5" />
            <h4 className="text-sm font-bold text-white">Prerequisites Needed</h4>
          </div>
          <p className="text-xs text-slate-300">
            To run a comprehensive skill gap analysis, please make sure both resume extraction and job role analysis have been initialized.
          </p>
          <div className="flex gap-3">
            {!resumeData && (
              <button
                onClick={onBackToResume}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white"
              >
                Analyze Resume First
              </button>
            )}
            {!jobAnalysis && (
              <button
                onClick={onBackToJob}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white"
              >
                Setup Job Role First
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trigger Button if not computed */}
      {hasInputs && !skillGap && (
        <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Ready for Skill Gap Evaluation</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Candidate: <span className="text-white font-semibold">{resumeData?.candidateName}</span> vs{' '}
            Role: <span className="text-white font-semibold">{jobAnalysis?.roleTitle}</span>
          </p>
          <button
            onClick={onAnalyzeGapApi}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Calculating Gap Matrix...' : 'Compute Skill Gap with Gemini AI'}</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center gap-3 p-6 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-300">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">
            Cross-referencing candidate credentials against role requirements...
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Skill Gap Results Display */}
      {skillGap && (
        <div className="space-y-8">
          {/* Visual Skill Gap Indicator & Readiness Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Visual Circular Gauge / Percentage */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-slate-800"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-indigo-500 transition-all duration-1000 ease-out"
                      strokeWidth="8"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * skillGap.matchPercentage) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-white">{skillGap.matchPercentage}%</span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Match Score</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Match: {skillGap.matchPercentage}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>Gap: {skillGap.skillGapPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Readiness Verdict & Learning Areas */}
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    AI Readiness Verdict
                  </span>
                  <h3 className="text-xl font-bold text-white">{skillGap.readinessVerdict}</h3>
                </div>

                {/* Progress Bar Visual Indicator */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>Role Qualification Coverage</span>
                    <span>{skillGap.matchPercentage}% Alignment</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                    <div
                      style={{ width: `${skillGap.matchPercentage}%` }}
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                    />
                  </div>
                </div>

                {/* Recommended Priority Learning Areas */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                    Recommended Learning Areas
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {skillGap.recommendedLearningAreas?.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800/80 text-indigo-200 text-xs font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* THREE MANDATORY SECTIONS: MATCHING SKILLS, PARTIAL MATCH, MISSING SKILLS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. MATCHING SKILLS */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-900/40 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-950">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <h4 className="text-base font-bold text-white uppercase tracking-wider">
                    Matching Skills
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300">
                  {skillGap.matchingSkills?.length || 0}
                </span>
              </div>

              <div className="space-y-3">
                {skillGap.matchingSkills?.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-900/30 space-y-1 hover:border-emerald-700/50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-100">{skill.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                        {skill.category}
                      </span>
                    </div>
                    {skill.details && (
                      <p className="text-xs text-slate-400 leading-snug">{skill.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. PARTIAL MATCH */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-900/40 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-950">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h4 className="text-base font-bold text-white uppercase tracking-wider">
                    Partial Match
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300">
                  {skillGap.partiallyMatchingSkills?.length || 0}
                </span>
              </div>

              <div className="space-y-3">
                {skillGap.partiallyMatchingSkills?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-900/30 space-y-2 hover:border-amber-700/50 transition"
                  >
                    <div className="text-sm font-bold text-slate-100">{item.name}</div>
                    <div className="text-xs text-amber-300/90 font-medium bg-amber-950/40 px-2 py-1 rounded">
                      Current: {item.candidateSkill}
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">
                      <strong>Gap:</strong> {item.gapDescription}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. MISSING SKILLS */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-rose-900/40 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-950">
                <div className="flex items-center gap-2 text-rose-400">
                  <XCircle className="w-5 h-5" />
                  <h4 className="text-base font-bold text-white uppercase tracking-wider">
                    Missing Skills
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-300">
                  {skillGap.missingSkills?.length || 0}
                </span>
              </div>

              <div className="space-y-3">
                {skillGap.missingSkills?.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-900/30 space-y-1 hover:border-rose-700/50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-100">{skill.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/50">
                        {skill.category}
                      </span>
                    </div>
                    {skill.details && (
                      <p className="text-xs text-slate-400 leading-snug">{skill.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Call to Action */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Skill Gap Analysis Complete</h4>
              <p className="text-xs text-slate-400">
                The AI will now synthesize personalized interview questions targeting these exact strengths and gaps.
              </p>
            </div>
            <button
              onClick={onContinue}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition"
            >
              <span>Launch Mock Interview Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
