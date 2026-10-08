import React, { useState } from 'react';
import {
  MapPin,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Code2,
  HelpCircle,
  AlertCircle,
  Layers,
  Calendar,
  Filter,
} from 'lucide-react';
import { RoadmapItem, CandidateProfile, SkillGapAnalysis, AnswerEvaluation } from '../types/interview';

interface RoadmapViewProps {
  roadmap: RoadmapItem[];
  onUpdateRoadmapItemStatus: (id: string, status: 'Not Started' | 'In Progress' | 'Completed') => void;
  onGenerateRoadmapApi: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  profile: CandidateProfile;
  skillGap: SkillGapAnalysis | null;
  evaluations: AnswerEvaluation[];
  onRetakeInterview: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  onUpdateRoadmapItemStatus,
  onGenerateRoadmapApi,
  isLoading,
  error,
  profile,
  skillGap,
  evaluations,
  onRetakeInterview,
}) => {
  const [filterPriority, setFilterPriority] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const filteredItems = roadmap.filter((item) => {
    if (filterPriority === 'All') return true;
    return item.priority === filterPriority;
  });

  const completedCount = roadmap.filter((i) => i.status === 'Completed').length;
  const inProgressCount = roadmap.filter((i) => i.status === 'In Progress').length;
  const totalCount = roadmap.length;
  const progressPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Step 12 • Personalized Improvement Roadmap</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Actionable Skill Progression Plan</h2>
          <p className="text-sm text-slate-400">
            Tailored learning modules and concrete practice drills formulated from your interview evaluation and skill gaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {roadmap.length > 0 && (
            <button
              onClick={onGenerateRoadmapApi}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Regenerate with AI</span>
            </button>
          )}

          <button
            onClick={onRetakeInterview}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition"
          >
            <span>Practice Another Round</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* If roadmap not yet generated */}
      {roadmap.length === 0 && (
        <div className="p-8 sm:p-12 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Generate Your Personalized Roadmap</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Gemini AI will synthesize your identified skill gaps and interview weaknesses into a structured, step-by-step upskilling curriculum.
          </p>
          <button
            onClick={onGenerateRoadmapApi}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Synthesizing Curriculum...' : 'Generate Roadmap with Gemini AI'}</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center gap-3 p-6 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-300">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">
            Formulating prioritized learning milestones and mock interview drills...
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

      {/* Roadmap List & Progress Overview */}
      {roadmap.length > 0 && (
        <div className="space-y-6">
          {/* Progress Overview Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Candidate Progression
                </span>
                <h4 className="text-xl font-bold text-white">
                  Curriculum for {profile.targetRole}
                </h4>
              </div>

              {/* Progress counter */}
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="text-emerald-400">{completedCount} Mastered</span>
                <span className="text-amber-400">{inProgressCount} In Progress</span>
                <span className="text-slate-400">{totalCount - completedCount - inProgressCount} Queued</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>Overall Roadmap Completion</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Priority filter pills */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-400 font-medium mr-1">Filter Priority:</span>
              {(['All', 'High', 'Medium', 'Low'] as const).map((pri) => (
                <button
                  key={pri}
                  onClick={() => setFilterPriority(pri)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    filterPriority === pri
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {pri}
                </button>
              ))}
            </div>
          </div>

          {/* Cards for each roadmap item */}
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id || index}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 hover:border-slate-700 transition shadow-lg"
              >
                {/* Header: Skill Name, Priority, Timeline, Status selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">
                      0{index + 1}
                    </span>
                    <h4 className="text-lg font-bold text-white">{item.skill}</h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Priority badge */}
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        item.priority === 'High'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : item.priority === 'Medium'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      {item.priority} Priority
                    </span>

                    {/* Timeline */}
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{item.estimatedTimeline}</span>
                    </span>

                    {/* Status interactive selector */}
                    <select
                      value={item.status}
                      onChange={(e) =>
                        onUpdateRoadmapItemStatus(
                          item.id,
                          e.target.value as 'Not Started' | 'In Progress' | 'Completed'
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition ${
                        item.status === 'Completed'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : item.status === 'In Progress'
                          ? 'bg-amber-950 text-amber-300 border-amber-700'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Why Important Reason */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-indigo-400 uppercase text-[10px] block mb-0.5 tracking-wider">
                    Why this skill is critical for this role:
                  </strong>
                  {item.reason}
                </div>

                {/* Subtopics: What to Learn */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    Recommended Core Topics to Learn
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {item.whatToLearn?.map((topic, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Activities: Practice Task & Suggested Interview Practice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Practice Task */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                      Hands-On Practice Activity
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.practiceTask}</p>
                  </div>

                  {/* Interview Question Drill */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      Suggested Mock Interview Drill
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.suggestedInterviewPractice}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
