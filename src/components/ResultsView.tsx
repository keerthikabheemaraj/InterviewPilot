import React, { useEffect } from 'react';
import {
  Award,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Download,
  Share2,
  BarChart2,
  Brain,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  AnswerEvaluation,
  CandidateProfile,
  FinalInterviewReport,
  SkillGapAnalysis,
} from '../types/interview';

interface ResultsViewProps {
  evaluations: AnswerEvaluation[];
  profile: CandidateProfile;
  skillGap: SkillGapAnalysis | null;
  onNavigateToRoadmap: () => void;
  onRetakeInterview: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  evaluations,
  profile,
  skillGap,
  onNavigateToRoadmap,
  onRetakeInterview,
}) => {
  // Compute aggregate scores
  const totalQuestions = evaluations.length;
  const overallAvg = totalQuestions
    ? Math.round(evaluations.reduce((acc, curr) => acc + curr.overallScore, 0) / totalQuestions)
    : 0;
  const technicalAvg = totalQuestions
    ? Math.round(
        evaluations.reduce((acc, curr) => acc + curr.technicalAccuracyScore, 0) / totalQuestions
      )
    : 0;
  const communicationAvg = totalQuestions
    ? Math.round(
        evaluations.reduce((acc, curr) => acc + curr.communicationScore, 0) / totalQuestions
      )
    : 0;
  const relevanceAvg = totalQuestions
    ? Math.round(evaluations.reduce((acc, curr) => acc + curr.relevanceScore, 0) / totalQuestions)
    : 0;
  const completenessAvg = totalQuestions
    ? Math.round(evaluations.reduce((acc, curr) => acc + curr.completenessScore, 0) / totalQuestions)
    : 0;

  // Trigger celebration on high score
  useEffect(() => {
    if (overallAvg >= 75) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#38bdf8', '#34d399', '#f59e0b'],
      });
    }
  }, [overallAvg]);

  // Aggregate strongest and weakest points
  const allStrengths = evaluations.flatMap((e) => e.strengths || []);
  const allWeaknesses = evaluations.flatMap((e) => e.weaknesses || []);

  const hireVerdict =
    overallAvg >= 80
      ? 'Strong Hire / Ready for Interview'
      : overallAvg >= 65
      ? 'Targeted Practice Recommended'
      : 'Requires Foundational Study';

  const handleExportJson = () => {
    const reportData = {
      candidate: profile.name,
      role: profile.targetRole,
      date: new Date().toISOString(),
      overallScore: overallAvg,
      technicalScore: technicalAvg,
      communicationScore: communicationAvg,
      relevanceScore: relevanceAvg,
      completenessScore: completenessAvg,
      questionsAnswered: totalQuestions,
      evaluations,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.replace(/\s+/g, '_')}_Interview_Report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Step 10 & 11 • Performance Evaluation Dashboard</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Interview Assessment Report</h2>
          <p className="text-sm text-slate-400">
            Comprehensive multi-metric diagnostics for{' '}
            <span className="text-white font-semibold">{profile.name}</span> —{' '}
            <span className="text-indigo-400 font-semibold">{profile.targetRole}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onNavigateToRoadmap}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/40 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Circular Hero Gauge */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-slate-800"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={263.89}
                  strokeDashoffset={263.89 - (263.89 * overallAvg) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-white">{overallAvg}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Composite Score
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  overallAvg >= 80
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : overallAvg >= 65
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {hireVerdict}
              </span>
            </div>
          </div>

          {/* Core Four Pillar Metrics */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {/* Technical Score */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">
                  Technical Accuracy
                </span>
                <span className="font-extrabold text-cyan-300 text-lg">{technicalAvg}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${technicalAvg}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">Correctness of algorithms, tools & concepts</p>
            </div>

            {/* Communication Score */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">
                  Communication
                </span>
                <span className="font-extrabold text-purple-300 text-lg">{communicationAvg}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="bg-purple-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${communicationAvg}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">Clarity, articulation & structured tone</p>
            </div>

            {/* Relevance Score */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">
                  Question Relevance
                </span>
                <span className="font-extrabold text-indigo-300 text-lg">{relevanceAvg}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="bg-indigo-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${relevanceAvg}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">Directly addressed the core prompt</p>
            </div>

            {/* Completeness Score */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">
                  Completeness
                </span>
                <span className="font-extrabold text-emerald-300 text-lg">{completenessAvg}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${completenessAvg}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">Coverage of edge cases and outcomes</p>
            </div>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold">
              {totalQuestions}
            </span>
            <span>Questions Attempted & Evaluated</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold">
              {skillGap ? `${skillGap.matchPercentage}%` : 'N/A'}
            </span>
            <span>Initial Resume Match Alignment</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 font-bold">
              {profile.interviewType}
            </span>
            <span>Interview Track Evaluated</span>
          </div>
        </div>
      </div>

      {/* Aggregate Strengths vs Areas Requiring Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strongest Areas */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-950/60 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 pb-2 border-b border-slate-800">
            <CheckCircle2 className="w-5 h-5" />
            <h4 className="text-base font-bold text-white uppercase tracking-wider">
              Strongest Demonstrated Skills
            </h4>
          </div>
          <ul className="space-y-2.5">
            {allStrengths.slice(0, 5).map((str, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas Requiring Improvement */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-rose-950/60 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 pb-2 border-b border-slate-800">
            <AlertTriangle className="w-5 h-5" />
            <h4 className="text-base font-bold text-white uppercase tracking-wider">
              Areas Requiring Targeted Improvement
            </h4>
          </div>
          <ul className="space-y-2.5">
            {allWeaknesses.slice(0, 5).map((w, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question-wise Scores and Breakdown Accordion */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              <span>Question-wise Performance Breakdown</span>
            </h4>
            <p className="text-xs text-slate-400">
              Review every answer given, scoring breakdown, and feedback.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {evaluations.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-sm text-slate-100">
                  Question {idx + 1}: {item.questionText}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-800/50 self-start sm:self-auto">
                  Score: {item.overallScore}/100
                </span>
              </div>

              {/* Candidate Answer */}
              <div className="p-3 rounded-lg bg-slate-900/70 text-xs text-slate-300 font-mono">
                <strong className="text-slate-400 uppercase text-[10px] block mb-1">
                  Candidate Response:
                </strong>
                {item.candidateAnswer}
              </div>

              {/* Individual sub-scores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-center font-medium">
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  Relevance: <span className="font-bold text-white">{item.relevanceScore}%</span>
                </div>
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  Technical: <span className="font-bold text-cyan-300">{item.technicalAccuracyScore}%</span>
                </div>
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  Completeness: <span className="font-bold text-emerald-300">{item.completenessScore}%</span>
                </div>
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  Communication: <span className="font-bold text-purple-300">{item.communicationScore}%</span>
                </div>
              </div>

              {/* Feedback snippet */}
              <div className="text-xs text-indigo-300 bg-indigo-950/20 p-3 rounded-lg border border-indigo-900/40">
                <strong>Specific Improvement: </strong>
                {item.improvementSuggestion}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retake and Continue Buttons */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onRetakeInterview}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Mock Interview</span>
        </button>

        <button
          onClick={onNavigateToRoadmap}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition"
        >
          <span>View Personalized Improvement Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
