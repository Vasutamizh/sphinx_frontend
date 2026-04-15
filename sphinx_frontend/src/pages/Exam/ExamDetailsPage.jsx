import {
  AlertCircle,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Info,
  Play,
  RefreshCw,
  Target,
} from "lucide-react";
import { useState } from "react";
import { MdTopic } from "react-icons/md";
import { useLocation } from "react-router-dom";

function ExamDetailsPage() {
  const location = useLocation();

  const exam = location.state?.exam || {
    examName: "Java Certification Test",
    description: "Basic Java programming assessment",
    noOfQuestions: 50,
    duration: 60,
    passPercentage: 40,
    allowNegativeMarks: false,
    fromDate: "2026-04-01T10:00:00",
    thruDate: "2026-04-30T18:00:00",
    examId: "EXAM1001",
    partyId: "USER123",
    allowedAttempts: 3,
    noOfAttempts: 1,
    timeoutDays: 7,
  };

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function avgMinutes(questions, duration) {
    return (duration / questions).toFixed(1);
  }

  const attemptsLeft = exam.allowedAttempts - exam.noOfAttempts;
  const attemptPct = (exam.noOfAttempts / exam.allowedAttempts) * 100;

  const [launching, setLaunching] = useState(false);

  function handleLaunch() {
    setLaunching(true);
    // your logic here
    setTimeout(() => setLaunching(false), 2000);
  }
  return (
    <div className="min-h-screen bg-white rounded-2xl text-black font-['Sora',sans-serif] px-4 py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        .mono { font-family: 'Space Mono', monospace; }
        .glow-green { box-shadow: 0 0 0 1px #22c55e33, 0 0 24px #22c55e18; }
        .glow-btn { box-shadow: 0 0 0 1px #facc15aa, 0 4px 32px #facc1540; }
        .glow-btn:hover { box-shadow: 0 0 0 1px #facc15, 0 4px 48px #facc1560; }
        .stat-tile { background: white; color: black; border: 1px solid #252525; transition: border-color 0.2s; }
        .stat-tile:hover { border-color: #333; }
        .progress-track { background: #1e1e1e; border-radius: 999px; overflow: hidden; }
        .progress-fill { background: linear-gradient(90deg, #22c55e, #86efac); border-radius: 999px; transition: width 0.8s ease; }
        .tag-pill { font-family: 'Space Mono', monospace; font-size: 11px; border-radius: 4px; padding: 2px 8px; letter-spacing: 0.05em; }
        .section-card { background: white;  border-radius: 16px; }
        .rule-row { border-bottom: 1px solid #1a1a1a; }
        .rule-row:last-child { border-bottom: none; }
        .accent-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e; display: inline-block; }
      `}</style>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="section-card p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-black leading-tight mb-1">
                {exam.examName}
              </h1>
              <p className="text-sm text-neutral-400">{exam.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs rounded-[4px] px-[8px] py-[2px] tracking-[0.05em] bg-green-600 text-white border border-green-800/50">
                Eligible
              </span>
            </div>
          </div>

          {/* Attempt progress */}
          <div className="mt-5 bg-white rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <RefreshCw size={13} className="text-neutral-500" />
                Attempts used
              </span>
              <div>
                <span className="font-bold text-black">
                  {exam.noOfAttempts} out of {exam.allowedAttempts} used{"  "}
                </span>
                <span>
                  ( Remaining : {attemptsLeft} attempt
                  {attemptsLeft !== 1 ? "s" : ""})
                </span>
              </div>
            </div>
            <div className="progress-track h-1.5 w-full">
              <div
                className="progress-fill h-full"
                style={{ width: `${attemptPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              icon: <BookOpen size={14} className="text-blue-400" />,
              label: "Questions",
              value: exam.noOfQuestions,
              sub: "items",
            },
            {
              icon: <Clock size={14} className="text-amber-400" />,
              label: "Duration",
              value: exam.duration,
              sub: "minutes",
            },
            {
              icon: <Target size={14} className="text-red-400" />,
              label: "Pass mark",
              value: `${exam.passPercentage}%`,
              sub: "required",
            },
            {
              icon: <MdTopic size={14} className="text-purple-400" />,
              label: "Topics",
              value: 10,
              sub: "topics",
            },
          ].map((s) => (
            <div key={s.label} className="stat-tile rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 mb-2">
                {s.icon}
                <span className="text-xs text-neutral-500">{s.label}</span>
              </div>
              <p className="mono text-xl font-bold text-black">{s.value}</p>
              <p className="text-xs text-neutral-600 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Schedule + Rules */}
        <div className="grid grid-cols-2 gap-4">
          <div className="section-card p-5">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mono mb-4">
              Schedule
            </p>
            <div className="space-y-3">
              <div className="rule-row pb-3">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                  <Calendar size={11} /> Opens
                </div>
                <p className="font-semibold text-black">
                  {formatDate(exam.fromDate)}
                </p>
              </div>
              <div className="rule-row pb-3">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                  <Calendar size={11} /> Closes
                </div>
                <p className="font-semibold text-black">
                  {formatDate(exam.thruDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="section-card p-5">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mono mb-4">
              Rules
            </p>
            <div className="space-y-3">
              <div className="rule-row pb-3 flex justify-between items-center">
                <div className="flex gap-2 items-center text-xs text-neutral-400">
                  <AlertCircle size={11} /> <span> Negative marks</span>
                </div>
                <span
                  className={`tag-pill ${exam.allowNegativeMarks ? "bg-red-950 text-red-400 border border-red-800/50" : "bg-green-950 text-green-400 border border-green-800/50"}`}
                >
                  {exam.allowNegativeMarks ? "YES" : "NO"}
                </span>
              </div>
              <div className="rule-row pb-3 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <RefreshCw size={11} className="text-neutral-500" /> Max
                  attempts
                </div>
                <span className="mono text-sm font-bold text-black">
                  {exam.allowedAttempts}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 px-1">
          <Info size={13} className="text-neutral-600 mt-0.5" />
          <p className="text-xs text-neutral-600 leading-relaxed">
            Once launched, the {exam.duration}-minute timer begins immediately
            and cannot be paused. Ensure a stable internet connection before
            starting.
          </p>
        </div>

        <button
          onClick={handleLaunch}
          disabled={launching}
          className="bg-[#facc15] hover:bg-[#fde047] text-[#0d0d0d] rounded-[12px] font-[700] text-md letter-[0.02em] glow-btn w-full py-4 flex items-center justify-center gap-3 cursor-pointer  disabled:opacity-[0.6] disabled:cursor-not-allowed;"
        >
          {launching ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Launching…
            </>
          ) : (
            <>
              <Play size={18} fill="#0d0d0d" />
              Launch Assessment
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ExamDetailsPage;
