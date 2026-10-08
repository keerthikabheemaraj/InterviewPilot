import React from 'react';
import { X, Play, CheckCircle2, User, Sparkles, Briefcase } from 'lucide-react';
import { DEMO_CANDIDATES } from '../data/demoData';

interface DemoPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCandidate: (candidateId: string) => void;
  activeCandidateId?: string;
}

export const DemoPresetModal: React.FC<DemoPresetModalProps> = ({
  isOpen,
  onClose,
  onSelectCandidate,
  activeCandidateId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demonstration Presets</span>
            </div>
            <h3 className="text-xl font-bold text-white">Load Sample Candidate Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Pre-populate verified resume entities, job benchmarks, skill gap metrics, and sample interview questions instantly. Perfect for academic evaluations, professor demonstrations, and rapid testing without uploading a fresh PDF.
        </p>

        {/* Candidate options */}
        <div className="space-y-4">
          {DEMO_CANDIDATES.map((cand) => {
            const isSelected = activeCandidateId === cand.id;
            return (
              <div
                key={cand.id}
                onClick={() => {
                  onSelectCandidate(cand.id);
                  onClose();
                }}
                className={`p-5 rounded-2xl border text-left cursor-pointer transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-sm text-white">{cand.profile.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {cand.profile.experienceLevel}
                    </span>
                  </div>
                  <div className="text-xs text-indigo-300 font-medium">
                    Target Role: {cand.profile.targetRole} ({cand.profile.interviewType} Interview)
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 max-w-lg">
                    {cand.resume.summary}
                  </p>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Load Profile</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Notice */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 text-[11px] text-slate-400">
          <strong>Note:</strong> All sample candidates contain realistic Computer Science capstone projects, quantifiable metrics, and comprehensive skill matrices matching industry engineering standards.
        </div>
      </div>
    </div>
  );
};
