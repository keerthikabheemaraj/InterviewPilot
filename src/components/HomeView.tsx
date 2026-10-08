import React from 'react';
import {
  Sparkles,
  FileText,
  Target,
  ArrowRight,
  Award,
  CheckCircle2,
  Cpu,
  Brain,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  ListOrdered,
  ChevronRight,
  Play,
} from 'lucide-react';
import { TabKey } from './Navbar';
import { DEMO_CANDIDATES } from '../data/demoData';

interface HomeViewProps {
  onNavigate: (tab: TabKey) => void;
  onLoadDemo: (demoId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onLoadDemo }) => {
  return (
    <div className="space-y-16 py-6 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-8 sm:p-12 lg:p-16 shadow-2xl">
        {/* Glow backdrop decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold tracking-wide">
            <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>CSE Engineering Demonstration Project • Powered by Gemini AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            InterviewPilot <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-indigo-200/90 tracking-tight">
            “Your Personal AI Interview Coach”
          </p>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Analyze your resume, practice personalized interviews, identify skill gaps, and improve your interview performance with Gemini AI.
          </p>

          {/* Core Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('interview')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Start Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('resume')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700 shadow-md transition active:scale-95"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Analyze Resume</span>
            </button>
          </div>

          {/* Quick Demo Launch Strip */}
          <div className="pt-8 border-t border-slate-800/80 mt-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" /> Instant Demo Presets:
              </span>
              <div className="flex flex-wrap items-center gap-2 justify-center">
                {DEMO_CANDIDATES.map((cand) => (
                  <button
                    key={cand.id}
                    onClick={() => onLoadDemo(cand.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/50 text-slate-200 hover:text-white transition flex items-center gap-1.5 font-medium"
                  >
                    <span>{cand.label}</span>
                    <ChevronRight className="w-3 h-3 text-indigo-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 High-Impact Capability Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition group">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Multimodal Resume Parsing</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Extracts projects, technical skills, frameworks, internships, and certifications directly from your PDF or text with Gemini reasoning.
          </p>
          <button
            onClick={() => onNavigate('resume')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 mt-4"
          >
            Explore Resume Analyzer <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition group">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-105 transition-transform">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Automated Skill Gap Matrix</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Benchmarks candidate credentials against modern industry expectations: matching skills, partial gaps, and missing competencies.
          </p>
          <button
            onClick={() => onNavigate('skill-gap')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 mt-4"
          >
            View Skill Gap Engine <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Objective Answer Scoring</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            One-by-one interactive mock interview evaluating technical accuracy, relevance, completeness, and clarity with customized feedback.
          </p>
          <button
            onClick={() => onNavigate('interview')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 mt-4"
          >
            Launch Mock Room <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* 10-Step Architecture Flow Diagram */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 sm:p-10 space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            End-to-End System Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Complete 10-Step AI Evaluation Lifecycle
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Engineered specifically to simulate a real-world technical screening and managerial round.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Candidate Profile', desc: 'Target role, experience, & interview type selection' },
            { step: '02', title: 'Resume Upload', desc: 'PDF parsing & structured schema extraction' },
            { step: '03', title: 'Resume Extraction', desc: 'Projects, stacks, experience, & strengths breakdown' },
            { step: '04', title: 'Job Role Profiling', desc: 'Industry benchmark of technical & soft skills' },
            { step: '05', title: 'Skill Gap Analysis', desc: 'Exact matching vs partial vs missing skill metrics' },
            { step: '06', title: 'Question Engine', desc: 'AI generation personalized to candidate gaps' },
            { step: '07', title: 'Interactive Mock', desc: 'One-by-one timed answering & audio dictation' },
            { step: '08', title: 'Answer Scoring', desc: 'Four-pillar metric evaluation + specific tips' },
            { step: '09', title: 'Performance Dashboard', desc: 'Aggregate scores, strengths & weak spots' },
            { step: '10', title: 'Improvement Roadmap', desc: 'Prioritized learning tasks & interview drills' },
          ].map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400">{item.step}</span>
                <h4 className="text-sm font-semibold text-white mt-1">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demonstration Banner & Ethics Disclaimer */}
      <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-200">
              Ethical AI & Objective Assessment Principle
            </h4>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              InterviewPilot AI analyzes answer relevance, technical correctness, completeness, and clarity. It explicitly avoids pseudoscience: no facial biometric lie detection or psychological personality scoring.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('profile')}
          className="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
        >
          Setup Profile Now
        </button>
      </section>
    </div>
  );
};
