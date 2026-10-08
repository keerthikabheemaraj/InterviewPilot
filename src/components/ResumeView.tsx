import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Code2,
  Wrench,
  FolderGit2,
  Briefcase,
  Award,
  Zap,
  ArrowRight,
  FileCheck,
  RotateCcw,
  Info,
} from 'lucide-react';
import { ResumeData, CandidateProfile } from '../types/interview';
import { DEMO_CANDIDATES } from '../data/demoData';

interface ResumeViewProps {
  resumeData: ResumeData | null;
  onSetResumeData: (data: ResumeData) => void;
  onAnalyzeResumeApi: (params: { pdfBase64?: string; resumeText?: string; candidateName?: string }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onContinue: () => void;
  profile: CandidateProfile;
}

export const ResumeView: React.FC<ResumeViewProps> = ({
  resumeData,
  onSetResumeData,
  onAnalyzeResumeApi,
  isLoading,
  error,
  onContinue,
  profile,
}) => {
  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'text'>('upload');
  const [resumeTextInput, setResumeTextInput] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file format.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      await onAnalyzeResumeApi({
        pdfBase64: base64,
        candidateName: profile.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeTextInput.trim()) return;
    await onAnalyzeResumeApi({
      resumeText: resumeTextInput,
      candidateName: profile.name,
    });
  };

  const handleLoadDemoResume = (demoId: string) => {
    const demo = DEMO_CANDIDATES.find((d) => d.id === demoId) || DEMO_CANDIDATES[0];
    onSetResumeData(demo.resume);
    setResumeTextInput(demo.rawResumeText);
    setFileName(`${demo.profile.name.replace(' ', '_')}_Resume.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Title & Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Step 2 & 3 • Resume Upload & AI Extraction</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Multimodal Resume Analyzer</h2>
          <p className="text-sm text-slate-400">
            Upload your candidate PDF resume. Gemini extracts your projects, skills, education, and strengths.
          </p>
        </div>

        {resumeData && (
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition self-start sm:self-auto"
          >
            <span>Proceed to Job Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Input Options Card */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Tabs for Upload vs Text */}
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 w-fit">
            <button
              onClick={() => setActiveInputTab('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeInputTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF Resume</span>
            </button>
            <button
              onClick={() => setActiveInputTab('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeInputTab === 'text'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Resume Text</span>
            </button>
          </div>

          {/* Quick Demo Pre-load buttons */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden md:inline">Or load demo resume:</span>
            {DEMO_CANDIDATES.map((cand) => (
              <button
                key={cand.id}
                type="button"
                onClick={() => handleLoadDemoResume(cand.id)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition font-medium"
              >
                {cand.profile.name} (Sample)
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: PDF File Dropzone */}
        {activeInputTab === 'upload' && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-slate-950/50 hover:bg-slate-950/80 transition group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                {fileName ? fileName : 'Choose or Drag & Drop Resume PDF'}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Supported format: PDF. Gemini AI will analyze education, projects, skills, and experience directly.
              </p>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold group-hover:bg-indigo-600 group-hover:text-white transition"
              >
                {fileName ? 'Replace PDF File' : 'Browse PDF File'}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Textarea input */}
        {activeInputTab === 'text' && (
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <textarea
              rows={8}
              value={resumeTextInput}
              onChange={(e) => setResumeTextInput(e.target.value)}
              placeholder="Paste raw resume text here (Education, Skills, Experience, Projects)..."
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 text-xs font-mono placeholder-slate-600 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !resumeTextInput.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Extract & Analyze Text with Gemini AI</span>
            </button>
          </form>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 p-6 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-300">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">
              Extracting candidate entities, skills, and projects with Gemini 3.8 Flash...
            </span>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Structured Resume Analysis Results */}
      {resumeData && (
        <div className="space-y-6">
          {/* Identification & Summary Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold text-white">{resumeData.candidateName}</h3>
                {resumeData.extractedFromPdf && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    PDF Multimodal Extracted
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-3">
                {resumeData.email && <span>{resumeData.email}</span>}
                {resumeData.phone && <span>{resumeData.phone}</span>}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 text-xs leading-relaxed">
              <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1 text-[11px] uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" />
                <span>Resume Summary</span>
              </div>
              {resumeData.summary}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>Verified candidate extraction: distinguishes source resume facts from downstream AI assessment.</span>
            </div>
          </div>

          {/* Grid of Sections: Skills, Languages, Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Technical Skills */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <Code2 className="w-4 h-4" />
                <h4 className="text-sm font-bold text-white">Technical Skills</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {resumeData.technicalSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-200 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Programming Languages */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-sky-400">
                <Code2 className="w-4 h-4" />
                <h4 className="text-sm font-bold text-white">Programming Languages</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {resumeData.programmingLanguages?.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-200 text-xs font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools & Frameworks */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Wrench className="w-4 h-4" />
                <h4 className="text-sm font-bold text-white">Tools & Frameworks</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {resumeData.toolsAndFrameworks?.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-200 text-xs font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <FolderGit2 className="w-5 h-5" />
              <h4 className="text-base font-bold text-white">Extracted Projects</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeData.projects?.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2.5 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-sm font-bold text-slate-100">{proj.title}</h5>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies?.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                  {proj.impact && (
                    <div className="text-[11px] text-emerald-400/90 bg-emerald-950/30 px-2.5 py-1 rounded border border-emerald-900/50">
                      <strong>Impact:</strong> {proj.impact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Two Columns: Education & Internships/Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <GraduationCap className="w-5 h-5" />
                <h4 className="text-base font-bold text-white">Education</h4>
              </div>
              <div className="space-y-3">
                {resumeData.education?.map((edu, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="font-semibold text-sm text-slate-200">{edu.degree}</div>
                    <div className="text-xs text-slate-400">{edu.institution}</div>
                    <div className="flex items-center gap-3 text-[11px] text-indigo-400 mt-1">
                      {edu.year && <span>{edu.year}</span>}
                      {edu.cgpaOrGrade && <span>GPA/Score: {edu.cgpaOrGrade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Internships & Experience */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <Briefcase className="w-5 h-5" />
                <h4 className="text-base font-bold text-white">Internships & Work Experience</h4>
              </div>
              <div className="space-y-3">
                {resumeData.internshipsAndExperience?.length ? (
                  resumeData.internshipsAndExperience.map((work, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-200">{work.role}</span>
                        {work.duration && (
                          <span className="text-[10px] text-slate-400">{work.duration}</span>
                        )}
                      </div>
                      <div className="text-xs text-indigo-300">{work.company}</div>
                      <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 mt-1">
                        {work.highlights?.map((h, hIdx) => (
                          <li key={hIdx}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No formal employment entries extracted.</p>
                )}
              </div>
            </div>
          </div>

          {/* Certifications & Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certifications */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Award className="w-5 h-5" />
                <h4 className="text-base font-bold text-white">Certifications</h4>
              </div>
              <ul className="space-y-2">
                {resumeData.certifications?.length ? (
                  resumeData.certifications.map((cert, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-300 flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{cert}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No formal certifications listed.</p>
                )}
              </ul>
            </div>

            {/* Key Strengths */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Zap className="w-5 h-5" />
                <h4 className="text-base font-bold text-white">Extracted Key Strengths</h4>
              </div>
              <ul className="space-y-2">
                {resumeData.keyStrengths?.map((str, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-300 flex items-start gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Call to Action */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Resume extraction complete!</h4>
              <p className="text-xs text-slate-400">
                Next, benchmark this candidate against the target role requirements.
              </p>
            </div>
            <button
              onClick={onContinue}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition"
            >
              <span>Continue to Job Role Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
