import React, { useState } from 'react';
import {
  Compass,
  FileText,
  Briefcase,
  Target,
  Sparkles,
  Award,
  MapPin,
  User,
  Menu,
  X,
  PlayCircle,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export type TabKey =
  | 'home'
  | 'profile'
  | 'resume'
  | 'job'
  | 'skill-gap'
  | 'interview'
  | 'results'
  | 'roadmap';

interface NavbarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  hasResume: boolean;
  hasJobAnalysis: boolean;
  hasSkillGap: boolean;
  hasInterviewResults: boolean;
  onOpenDemoModal: () => void;
  candidateName?: string;
  targetRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  hasResume,
  hasJobAnalysis,
  hasSkillGap,
  hasInterviewResults,
  onOpenDemoModal,
  candidateName,
  targetRole,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { key: TabKey; label: string; icon: React.ReactNode; completed?: boolean }[] = [
    { key: 'home', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { key: 'profile', label: 'Candidate Profile', icon: <User className="w-4 h-4" />, completed: Boolean(candidateName) },
    { key: 'resume', label: 'Resume Analysis', icon: <FileText className="w-4 h-4" />, completed: hasResume },
    { key: 'job', label: 'Job Analysis', icon: <Briefcase className="w-4 h-4" />, completed: hasJobAnalysis },
    { key: 'skill-gap', label: 'Skill Gap', icon: <Target className="w-4 h-4" />, completed: hasSkillGap },
    { key: 'interview', label: 'Mock Interview', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'results', label: 'Results', icon: <Award className="w-4 h-4" />, completed: hasInterviewResults },
    { key: 'roadmap', label: 'Roadmap', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 text-left group transition"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                    InterviewPilot
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Mock Interview & Performance Evaluation
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectTab(item.key)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'text-white bg-indigo-600/20 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.completed && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400/90 ml-0.5" />
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Demo Trigger & Candidate Tag */}
          <div className="flex items-center gap-2 sm:gap-3">
            {candidateName && (
              <div className="hidden md:flex flex-col text-right pr-2 border-r border-slate-800">
                <span className="text-xs font-medium text-slate-200 max-w-[130px] truncate">
                  {candidateName}
                </span>
                <span className="text-[10px] text-indigo-400 max-w-[130px] truncate">
                  {targetRole || 'Candidate'}
                </span>
              </div>
            )}

            <button
              onClick={onOpenDemoModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-95 transition"
              title="Load instant pre-filled sample profile for testing and presentation"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Load Demo Data</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Medium screens tab strip (for laptops/tablets between lg and xl) */}
        <div className="hidden lg:flex xl:hidden overflow-x-auto py-2 gap-1 border-t border-slate-900 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectTab(item.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'text-white bg-indigo-600/20 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.completed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onSelectTab(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'text-white bg-indigo-600/20 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.completed && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
