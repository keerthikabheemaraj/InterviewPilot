import React from 'react';
import { User, Briefcase, Award, Sparkles, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { CandidateProfile, ExperienceLevel, InterviewType } from '../types/interview';
import { DEMO_CANDIDATES } from '../data/demoData';

interface ProfileViewProps {
  profile: CandidateProfile;
  onChangeProfile: (profile: CandidateProfile) => void;
  onContinue: () => void;
  onLoadDemo: (demoId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onChangeProfile,
  onContinue,
  onLoadDemo,
}) => {
  const popularRoles = [
    'Data Analyst',
    'Full Stack Software Engineer',
    'Machine Learning Engineer',
    'DevOps Engineer',
    'Frontend React Developer',
    'Cybersecurity Analyst',
  ];

  const experienceLevels: ExperienceLevel[] = [
    'Entry Level (Fresher)',
    'Junior (1-2 Years)',
    'Mid-Level (3-5 Years)',
    'Senior (5+ Years)',
  ];

  const interviewTypes: { type: InterviewType; desc: string }[] = [
    { type: 'Mixed', desc: 'Balanced blend of technical concepts, resume projects, and behavioral questions.' },
    { type: 'Technical', desc: 'Focuses deeply on coding, system design, databases, and problem solving.' },
    { type: 'Behavioral', desc: 'Evaluates team communication, conflict resolution, and leadership.' },
    { type: 'HR', desc: 'Explores cultural fit, career trajectory, expectations, and workplace ethics.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) return;
    onContinue();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
          <User className="w-3.5 h-3.5" />
          <span>Step 1 of 8 • Candidate Profile</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white">Candidate Information & Target Role</h2>
        <p className="text-sm text-slate-400">
          Configure your baseline credentials, target engineering position, and interview format preferences to tailor the AI interviewer.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Name & Target Role Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Candidate Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => onChangeProfile({ ...profile, name: e.target.value })}
              placeholder="e.g. Alex Chen"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-500 text-sm transition"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Target Job Role <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={profile.targetRole}
              onChange={(e) => onChangeProfile({ ...profile, targetRole: e.target.value })}
              placeholder="e.g. Data Analyst"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-500 text-sm transition"
            />
          </div>
        </div>

        {/* Popular Role Quick Badges */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-slate-400">Quick-Select Popular Roles:</span>
          <div className="flex flex-wrap gap-2">
            {popularRoles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => onChangeProfile({ ...profile, targetRole: role })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  profile.targetRole === role
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 border border-indigo-400/40'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Experience Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {experienceLevels.map((lvl) => {
              const isSelected = profile.experienceLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onChangeProfile({ ...profile, experienceLevel: lvl })}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-semibold">{lvl}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {lvl.includes('Fresher')
                      ? 'Academic & campus projects'
                      : lvl.includes('Junior')
                      ? '1-2 years foundational industry experience'
                      : lvl.includes('Mid')
                      ? 'Independent feature ownership'
                      : 'Architecture & technical leadership'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Interview Type */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Preferred Interview Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {interviewTypes.map((item) => {
              const isSelected = profile.interviewType === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => onChangeProfile({ ...profile, interviewType: item.type })}
                  className={`p-4 rounded-xl border text-left transition ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{item.type} Interview</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Number of Interview Questions */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Interview Question Count
          </label>
          <div className="flex items-center gap-3">
            {[3, 5, 7].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onChangeProfile({ ...profile, numberOfQuestions: num })}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition ${
                  profile.numberOfQuestions === num
                    ? 'bg-indigo-600 text-white border-indigo-400'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {num} Questions {num === 5 && '(Recommended)'}
              </button>
            ))}
          </div>
        </div>

        {/* Submit and Demo Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Or populate demo profile:</span>
            {DEMO_CANDIDATES.map((cand) => (
              <button
                key={cand.id}
                type="button"
                onClick={() => onLoadDemo(cand.id)}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700"
              >
                {cand.profile.name}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition active:scale-95"
          >
            <span>Save Profile & Analyze Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
