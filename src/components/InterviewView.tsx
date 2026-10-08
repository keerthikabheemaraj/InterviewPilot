import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  HelpCircle,
  Mic,
  MicOff,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Clock,
  Send,
  Award,
  BookOpen,
  Info,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Brain,
} from 'lucide-react';
import {
  InterviewQuestion,
  AnswerEvaluation,
  CandidateProfile,
  ResumeData,
  SkillGapAnalysis,
  JobRoleAnalysis,
} from '../types/interview';
import { evaluateAnswer } from '../services/api';

interface InterviewViewProps {
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  evaluations: AnswerEvaluation[];
  onSetEvaluations: (evals: AnswerEvaluation[]) => void;
  onSetCurrentQuestionIndex: (idx: number) => void;
  onFinishInterview: () => void;
  profile: CandidateProfile;
  resumeData: ResumeData | null;
  skillGap: SkillGapAnalysis | null;
  jobAnalysis: JobRoleAnalysis | null;
  onGenerateQuestionsApi: () => Promise<void>;
  isGeneratingQuestions: boolean;
}

export const InterviewView: React.FC<InterviewViewProps> = ({
  questions,
  currentQuestionIndex,
  evaluations,
  onSetEvaluations,
  onSetCurrentQuestionIndex,
  onFinishInterview,
  profile,
  resumeData,
  skillGap,
  jobAnalysis,
  onGenerateQuestionsApi,
  isGeneratingQuestions,
}) => {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentEvaluation, setCurrentEvaluation] = useState<AnswerEvaluation | null>(null);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const currentQ = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Sync existing evaluation if user is re-visiting this question
  useEffect(() => {
    const existing = evaluations.find((e) => e.questionId === currentQ?.id);
    if (existing) {
      setCurrentEvaluation(existing);
      setCurrentAnswer(existing.candidateAnswer);
    } else {
      setCurrentEvaluation(null);
      setCurrentAnswer('');
    }
    setSecondsElapsed(0);
  }, [currentQuestionIndex, currentQ?.id, evaluations]);

  // Timer tick
  useEffect(() => {
    if (currentEvaluation) return; // Stop timer once answered
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentEvaluation, currentQuestionIndex]);

  // Setup Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setCurrentAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        setSpeechError('Microphone dictation unavailable or permission denied.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please type your answer.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmitAnswer = async () => {
    if (!currentQ || currentAnswer.trim().length < 5) {
      setSubmitError('Please provide a complete answer with at least a few words.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsSubmittingAnswer(true);
    setSubmitError(null);

    try {
      const evaluation = await evaluateAnswer({
        question: currentQ,
        candidateAnswer: currentAnswer.trim(),
        jobRole: profile.targetRole,
        experienceLevel: profile.experienceLevel,
      });

      setCurrentEvaluation(evaluation);

      // Append or replace in evaluations state
      const updated = evaluations.filter((e) => e.questionId !== currentQ.id);
      onSetEvaluations([...updated, evaluation]);
    } catch (err: any) {
      console.error('Error evaluating answer:', err);
      setSubmitError(err.message || 'Failed to evaluate answer.');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      onFinishInterview();
    } else {
      onSetCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // If questions not yet generated
  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white">AI Mock Interview Room</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Ready to generate {profile.numberOfQuestions} personalized questions for{' '}
            <span className="text-white font-semibold">{profile.name}</span> targeting the{' '}
            <span className="text-indigo-400 font-semibold">{profile.targetRole}</span> position.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-md mx-auto text-left space-y-3 text-xs text-slate-300">
          <div className="font-semibold text-white flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-indigo-400">
            <Info className="w-3.5 h-3.5" /> Interview Parameters
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Interview Format:</span>
            <span className="font-semibold text-white">{profile.interviewType}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Experience Level:</span>
            <span className="font-semibold text-white">{profile.experienceLevel}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Question Count:</span>
            <span className="font-semibold text-white">{profile.numberOfQuestions} Questions</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Skill Gaps Linked:</span>
            <span className="font-semibold text-emerald-400">
              {skillGap ? `${skillGap.missingSkills.length} Identified Gaps` : 'Standard Benchmarks'}
            </span>
          </div>
        </div>

        <button
          onClick={onGenerateQuestionsApi}
          disabled={isGeneratingQuestions}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-xl shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGeneratingQuestions ? 'Synthesizing Questions...' : 'Start Mock Interview'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Top Bar: Progress and Timers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div className="w-32 sm:w-48 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Elapsed: {formatTimer(secondsElapsed)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Examiner Active</span>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentQ.category}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                currentQ.difficulty === 'Challenging'
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : currentQ.difficulty === 'Medium'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {currentQ.difficulty}
            </span>
          </div>

          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>Competency: {currentQ.targetedCompetency}</span>
          </span>
        </div>

        {/* The Question Text */}
        <div className="space-y-3">
          <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {currentQ.contextHint && (
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-300">Examiner Context: </strong>
                {currentQ.contextHint}
              </div>
            </div>
          )}
        </div>

        {/* Candidate Answer Textarea */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Candidate Response
            </span>
            <div className="flex items-center gap-3">
              <span>{currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0} words</span>
              {/* Audio Dictation button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Toggle microphone speech-to-text dictation"
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isListening ? 'Stop Recording' : 'Voice Dictate'}</span>
              </button>
            </div>
          </div>

          <textarea
            rows={7}
            disabled={Boolean(currentEvaluation)}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your structured answer here (e.g. outline your methodology, key technologies, metrics, and conclusions)..."
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 text-sm leading-relaxed placeholder-slate-600 disabled:opacity-85 transition"
          />

          {speechError && (
            <div className="text-[11px] text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{speechError}</span>
            </div>
          )}

          {submitError && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
              {submitError}
            </div>
          )}
        </div>

        {/* Submit or Navigation Actions */}
        {!currentEvaluation ? (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500 italic">
              * The correct answer or scoring is only revealed after you submit your response.
            </p>

            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmittingAnswer || currentAnswer.trim().length < 5}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition active:scale-95"
            >
              {isSubmittingAnswer ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Evaluating Answer with Gemini...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Answer for Evaluation</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <span>{isLastQuestion ? 'Complete Interview & View Results' : 'Proceed to Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Answer Evaluation Card - Displayed after submission */}
      {currentEvaluation && (
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/40 space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Award className="w-6 h-6 text-indigo-400" />
              <div>
                <h4 className="text-lg font-bold text-white">Answer Evaluation & Diagnostics</h4>
                <p className="text-xs text-slate-400">
                  Detailed rubric breakdown evaluated across four core performance pillars.
                </p>
              </div>
            </div>

            {/* Overall Score Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30">
              <span className="text-xs uppercase font-semibold text-slate-400">Overall Score:</span>
              <span className="text-xl font-extrabold text-indigo-300">
                {currentEvaluation.overallScore}/100
              </span>
            </div>
          </div>

          {/* 4 Score Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Relevance
              </span>
              <div className="text-2xl font-extrabold text-white">
                {currentEvaluation.relevanceScore}%
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${currentEvaluation.relevanceScore}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Technical Accuracy
              </span>
              <div className="text-2xl font-extrabold text-cyan-300">
                {currentEvaluation.technicalAccuracyScore}%
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${currentEvaluation.technicalAccuracyScore}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Completeness
              </span>
              <div className="text-2xl font-extrabold text-emerald-300">
                {currentEvaluation.completenessScore}%
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${currentEvaluation.completenessScore}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Communication
              </span>
              <div className="text-2xl font-extrabold text-purple-300">
                {currentEvaluation.communicationScore}%
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{ width: `${currentEvaluation.communicationScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-emerald-950/50 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                  Demonstrated Strengths
                </h5>
              </div>
              <ul className="space-y-2">
                {currentEvaluation.strengths?.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-rose-950/50 space-y-3">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                  Identified Weaknesses / Gaps
                </h5>
              </div>
              <ul className="space-y-2">
                {currentEvaluation.weaknesses?.map((w, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Specific Improvement Suggestion */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              Actionable Improvement Suggestion
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentEvaluation.improvementSuggestion}
            </p>
          </div>

          {/* Ideal Answer Outline */}
          {currentEvaluation.idealAnswerOutline && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Benchmark Model Answer Blueprint
              </span>
              <p className="text-xs text-slate-400 font-mono whitespace-pre-line leading-relaxed">
                {currentEvaluation.idealAnswerOutline}
              </p>
            </div>
          )}

          {/* Clarification Disclaimer */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              {currentEvaluation.assessmentDisclaimer ||
                'AI-generated textual assessment based on answer content. Does not measure psychological or biometric traits.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
