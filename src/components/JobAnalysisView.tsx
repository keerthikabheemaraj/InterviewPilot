import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  Wrench,
  BookOpen,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { JobRoleAnalysis, CandidateProfile } from '../types/interview';
import { SAMPLE_JOB_ANALYSES } from '../data/demoData';

interface JobAnalysisViewProps {
  jobAnalysis: JobRoleAnalysis | null;
  onSetJobAnalysis: (analysis: JobRoleAnalysis) => void;
  onAnalyzeJobApi: (params: { roleTitle: string; experienceLevel: any; customDescription?: string }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  profile: CandidateProfile;
  onChangeProfile: (profile: CandidateProfile) => void;
  onContinue: () => void;
}

export const JobAnalysisView: React.FC<JobAnalysisViewProps> = ({
  jobAnalysis,
  onSetJobAnalysis,
  onAnalyzeJobApi,
  isLoading,
  error,
  profile,
  onChangeProfile,
  onContinue,
}) => {
  const [customNotes, setCustomNotes] = useState('');

  const quickRoles = [
    'Data Analyst',
    'Full Stack Software Engineer',
    'Machine Learning Engineer',
    'DevOps Engineer',
    'Frontend React Developer',
    'Cloud Security Engineer',
  ];

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!profile.targetRole.trim()) return;

    await onAnalyzeJobApi({
      roleTitle: profile.targetRole,
      experienceLevel: profile.experienceLevel,
      customDescription: customNotes,
    });
  };

  const handleSelectPreset = (roleName: string) => {
    onChangeProfile({ ...profile, targetRole: roleName });
    if (SAMPLE_JOB_ANALYSES[roleName]) {
      onSetJobAnalysis(SAMPLE_JOB_ANALYSES[roleName]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Step 4 & 5 • Job Role Profiling</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Target Job Role Intelligence</h2>
          <p className="text-sm text-slate-400">
            Define your desired job role to generate industry competency benchmarks and interview expectations.
          </p>
        </div>

        {jobAnalysis && (
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition self-start sm:self-auto"
          >
            <span>Proceed to Skill Gap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Target Role Config Card */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Target Role Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={profile.targetRole}
                onChange={(e) => onChangeProfile({ ...profile, targetRole: e.target.value })}
                placeholder="e.g. Data Analyst or Full Stack Software Engineer"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-500 text-sm transition"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Target Level
              </label>
              <div className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm font-medium">
                {profile.experienceLevel}
              </div>
            </div>
          </div>

          {/* Quick select presets */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-400">Popular Role Presets:</span>
            <div className="flex flex-wrap gap-2">
              {quickRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleSelectPreset(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    profile.targetRole === role
                      ? 'bg-indigo-600 text-white border border-indigo-400'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Optional Job Description / Focus Areas (Job posting snippet)
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Requires deep SQL, A/B experimentation, Snowflake, and cohort analysis..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white placeholder-slate-600 text-xs transition"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Uses Gemini 3.8 Flash for market requirements synthesis</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !profile.targetRole.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Analyzing Role...' : 'Analyze Role with AI'}</span>
            </button>
          </div>
        </form>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 p-6 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-300">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">
              Benchmarking {profile.targetRole} competencies with Gemini AI...
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Analysis Output */}
      {jobAnalysis && (
        <div className="space-y-6">
          {/* Role Overview Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-indigo-400" />
                <span>{jobAnalysis.roleTitle}</span>
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{jobAnalysis.industryDemand}</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{jobAnalysis.overview}</p>
          </div>

          {/* Grid: Required Technical Skills & Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Required Technical Skills */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="text-base font-bold text-white">Required Technical Skills</h4>
              </div>
              <ul className="space-y-2">
                {jobAnalysis.requiredTechnicalSkills?.map((skill, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200 flex items-center justify-between"
                  >
                    <span>{skill}</span>
                    <span className="text-[10px] font-mono text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40">
                      Core
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expected Tools */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <Wrench className="w-5 h-5" />
                <h4 className="text-base font-bold text-white">Expected Tools & Platforms</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobAnalysis.expectedTools?.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-cyan-200 flex items-center gap-1.5"
                  >
                    <Wrench className="w-3 h-3 text-cyan-400" />
                    <span>{tool}</span>
                  </span>
                ))}
              </div>

              {/* Soft Skills */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Lightbulb className="w-4 h-4" />
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Required Soft Skills
                  </h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobAnalysis.requiredSoftSkills?.map((ss, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 text-xs font-medium"
                    >
                      {ss}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid: Important Concepts & Typical Interview Topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Important Concepts */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <BookOpen className="w-5 h-5" />
                <h4 className="text-base font-bold text-white">Important Concepts</h4>
              </div>
              <ul className="space-y-2">
                {jobAnalysis.importantConcepts?.map((concept, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Typical Interview Topics */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <HelpCircle className="w-5 h-5" />
                <h4 className="text-base font-bold text-white">Typical Interview Topics</h4>
              </div>
              <ul className="space-y-2">
                {jobAnalysis.typicalInterviewTopics?.map((topic, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Call to Action */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Role profile benchmarks synthesized</h4>
              <p className="text-xs text-slate-400">
                Next, compare candidate skills directly against these requirements to identify gaps.
              </p>
            </div>
            <button
              onClick={onContinue}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition"
            >
              <span>Run Skill Gap Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
