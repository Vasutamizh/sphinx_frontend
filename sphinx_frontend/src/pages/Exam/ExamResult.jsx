import { useLocation } from "react-router-dom";

export default function ExamResult() {
  const location = useLocation();

  const { exam, examResult } = location.state;

  const total = examResult.totalCorrect + examResult.totalWrong;
  const unanswered = total - examResult.totalCorrect - examResult.totalWrong;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (examResult.scorePercentage / 100) * circ;
  const passed = examResult.userPassed === 1;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">
            Attempt {examResult.attemptNo} · {Date.now().toLocaleString()}
          </p>
          <h1 className="text-2xl font-bold text-slate-800">{exam.examName}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's a detailed breakdown of your performance.
          </p>
        </div>

        {/* Top row */}
        <div className="grid grid-cols-3 gap-5 mb-5">
          {/* Score ring card */}
          <div className="col-span-1 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-5">
              Overall Score
            </p>
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 130 130" className="w-full h-full -rotate-90">
                <circle
                  cx="65"
                  cy="65"
                  r={r}
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="10"
                />
                <circle
                  cx="65"
                  cy="65"
                  r={r}
                  fill="none"
                  stroke={passed ? "#16a34a" : "#ef4444"}
                  strokeWidth="10"
                  strokeDasharray={`${dash} ${circ}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">
                  {examResult.scorePercentage}%
                </span>
                <span className="text-xs text-slate-400 mt-0.5">score</span>
              </div>
            </div>
            <div
              className={`mt-5 px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide border ${passed ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}
            >
              {passed ? "✓  Passed" : "✗  Not Passed"}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Pass mark: {examResult.passPercentage}%
            </p>
          </div>

          {/* Stats grid */}
          <div className="col-span-2 grid grid-cols-2 gap-5">
            {[
              {
                label: "Correct Answers",
                value: examResult.totalCorrect,
                sub: `out of ${exam.noOfQuestions} Questions`,
                icon: "✓",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-100",
              },
              {
                label: "Wrong Answers",
                value: examResult.totalWrong,
                sub: `out of ${exam.noOfQuestions} Questions`,
                icon: "✗",
                color: "text-red-500",
                bg: "bg-red-50",
                border: "border-red-100",
              },
              {
                label: "Total Score",
                value: examResult.score.toFixed(1),
                sub: "points earned",
                icon: "★",
                color: "text-indigo-600",
                bg: "bg-indigo-50",
                border: "border-indigo-100",
              },
            ].map(({ label, value, sub, icon, color, bg, border }) => (
              <div
                key={label}
                className={`bg-white border ${border} rounded-2xl p-5 shadow-sm`}
              >
                <div
                  className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center text-base mb-4 ${color}`}
                >
                  {icon}
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                  {label}
                </p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-400 mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Topic breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">
            Topic Performance
          </p>
          <p className="text-base font-semibold text-slate-800 mb-6">
            How you did per topic
          </p>
          <div className="space-y-5">
            {examResult?.topicWisePerfomance?.map((t, i) => {
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-700 font-medium">
                      {t.topicId}
                    </span>
                    <span
                      className={`text-xs font-semibold ${t.userTopicPercentage === 100 ? "text-emerald-600" : t.userTopicPercentage === 0 ? "text-red-500" : "text-amber-600"}`}
                    >
                      {t.correctQuestionsInthisTopic}/
                      {t.totalQuestionsInThisTopic} correct
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${t.userTopicPercentage === 100 ? "bg-emerald-400" : t.userTopicPercentage === 0 ? "bg-red-400" : "bg-amber-400"}`}
                      style={{ width: `${t.userTopicPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer remark */}
        <div
          className={`rounded-2xl border px-6 py-5 flex items-start gap-4 ${passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          <div>
            <p
              className={`text-sm font-semibold ${passed ? "text-green-800" : "text-red-700"}`}
            >
              {passed
                ? "Great work! You cleared this assessment."
                : "You did not pass this time."}
            </p>
            <p
              className={`text-xs mt-1 ${passed ? "text-green-600" : "text-red-500"}`}
            >
              {passed
                ? "Your score of " +
                  examResult.scorePercentage +
                  "% exceeds the passing threshold of " +
                  exam.passPercentage +
                  "%. Keep up the momentum."
                : "Review the topics where you lost marks and reattempt when ready. You need " +
                  examResult.passPercentage +
                  "% to pass."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
