import { Clock10 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DescriptiveQuestionForm from "../../components/DescriptiveQuestionForm";
import FillUpQuestionForm from "../../components/FillUpQuestionForm";
import ConfimationModal from "../../components/Modal_Components/ConfimationModal";
import MultipleChoicQuestionForm from "../../components/MultipleChoicQuestionForm";
import SingleChoiceQuestionForm from "../../components/SingleChoiceQuestionForm";
import TrueFalseQuestionForm from "../../components/TrueFalseQuestionForm";
import useAPI from "../../hooks/useAPI";
import { failureToast, successToast } from "../../utils/toast";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function QuestionAttendPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { exam, totalQuestions } = location.state || {};

  const { apiGet, apiPost, isError } = useAPI();

  // Question navigation
  const [current, setCurrent] = useState(1);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);

  // Answer state for current question
  const [answer, setAnswer] = useState({
    SINGLE_CHOICE: "",
    MULTIPLE_CHOICE: "",
    FILL_UP: "",
    TRUE_FALSE: "",
    DETAILED_ANSWER: "",
  });

  // Track answered status for all questions (1‑based index)
  const [questionStatus, setQuestionStatus] = useState(() =>
    Array(totalQuestions)
      .fill()
      .map(() => ({ answered: false, flagged: false, answer: null })),
  );

  const [timeLeft, setTimeLeft] = useState(exam?.duration * 60 || 0);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  // Redirect if missing data
  useEffect(() => {
    if (!exam || !totalQuestions) {
      navigate("/userDashboard");
    }
  }, [exam, totalQuestions, navigate]);

  // Warn on refresh/close
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // Helper: format time
  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const timePct = (timeLeft / (exam?.duration * 60)) * 100;
  const timerColor =
    timeLeft <= 60
      ? "text-red-500"
      : timeLeft <= 180
        ? "text-amber-500"
        : "text-emerald-600";
  const timerBg =
    timeLeft <= 60
      ? "bg-red-50 border-red-200"
      : timeLeft <= 180
        ? "bg-amber-50 border-amber-200"
        : "bg-emerald-50 border-emerald-200";
  const timerBar =
    timeLeft <= 60
      ? "bg-red-400"
      : timeLeft <= 180
        ? "bg-amber-400"
        : "bg-emerald-400";

  // Update answer for current question type
  const storeAnswer = (key, value) => {
    setAnswer((prev) => ({ ...prev, [key]: value }));
  };

  // Submit answer for current question
  const submitCurrentAnswer = async () => {
    console.log("INSIDE", question);
    if (!question) return false;
    let selectedAnswer = answer[question.questionType];
    if (!selectedAnswer) return false; // nothing to submit

    if (question.questionType === "MULTIPLE_CHOICE") {
      selectedAnswer = selectedAnswer.join(",");
    }

    const payload = {
      qId: question.qId,
      examId: exam.examId,
      partyId: exam.partyId,
      submittedAnswer: selectedAnswer,
      sNo: 1,
      isFlagged: questionStatus[current - 1]?.flagged ? 1 : 0,
    };
    const response = await apiPost("/userExam/submitanswer", payload);
    if (isError(response)) {
      failureToast(response.errorMessage || response.error);
      return false;
    }
    console.log("Answer Submitted");
    // Mark this question as answered
    setQuestionStatus((prev) => {
      const updated = [...prev];
      updated[current - 1] = {
        ...updated[current - 1],
        answered: true,
        answer: selectedAnswer,
      };
      return updated;
    });
    return true;
  };

  // Load a specific question by number
  const getQuestion = async (questionNumber) => {
    const response = await apiGet(
      `/userExam/examQuestion?examId=${exam.examId}&partyId=${exam.partyId}&questionNumber=${questionNumber}`,
    );
    if (isError(response)) {
      failureToast(response.errorMessage || response.error);
      return;
    }

    const questionData = response.data[0].question;
    const existingAnswer = response.data[0].answer;

    // Set options for MCQs
    if (
      questionData.questionType === "SINGLE_CHOICE" ||
      questionData.questionType === "MULTIPLE_CHOICE"
    ) {
      setOptions([
        questionData.optionA,
        questionData.optionB,
        questionData.optionC,
        questionData.optionD,
      ]);
    }
    setQuestion(questionData);

    // Populate answer state if previously answered
    let procAnswer = existingAnswer?.submittedAnswer || "";
    if (questionData.questionType === "MULTIPLE_CHOICE" && procAnswer) {
      procAnswer = procAnswer.split(",");
      storeAnswer("MULTIPLE_CHOICE", procAnswer);
    } else {
      storeAnswer(questionData.questionType, procAnswer);
    }

    // Update global status for this question
    if (procAnswer && procAnswer !== "") {
      setQuestionStatus((prev) => {
        const updated = [...prev];
        updated[questionNumber - 1] = {
          ...updated[questionNumber - 1],
          answered: true,
          answer: procAnswer,
        };
        return updated;
      });
    }
  };

  // Load first question on mount
  useEffect(() => {
    if (totalQuestions && exam) {
      getQuestion(current || 1);
    }
  }, [current]);

  const handleNext = async () => {
    if (current >= totalQuestions) return;
    await submitCurrentAnswer(); // save before moving
    getQuestion(current + 1);
    setCurrent((prev) => prev + 1);
    setAnswer({
      SINGLE_CHOICE: "",
      MULTIPLE_CHOICE: "",
      FILL_UP: "",
      TRUE_FALSE: "",
      DETAILED_ANSWER: "",
    });
  };

  const handlePrev = async () => {
    if (current === 1) return;
    await submitCurrentAnswer();
    getQuestion(current - 1);
    setCurrent((prev) => prev - 1);
    setAnswer({
      SINGLE_CHOICE: "",
      MULTIPLE_CHOICE: "",
      FILL_UP: "",
      TRUE_FALSE: "",
      DETAILED_ANSWER: "",
    });
  };

  const handleJumpToQuestion = async (qNum) => {
    if (qNum === current) return;
    await submitCurrentAnswer(); // save current progress
    getQuestion(qNum);
    setCurrent(qNum);
    setAnswer({
      SINGLE_CHOICE: "",
      MULTIPLE_CHOICE: "",
      FILL_UP: "",
      TRUE_FALSE: "",
      DETAILED_ANSWER: "",
    });
  };

  const toggleFlag = async () => {
    setQuestionStatus((prev) => {
      const updated = [...prev];
      updated[current - 1].flagged = !updated[current - 1].flagged;
      return updated;
    });
    // Optionally call an API to persist flag status
    // await apiPost("/userExam/flagQuestion", { ... });
  };

  const handleFinishExam = async () => {
    const payload = {
      partyId: exam.partyId,
      examId: exam.examId,
    };
    const response = await apiPost("/userExam/submit", payload);
    if (isError(response)) {
      failureToast(
        response.errorMessage ||
          response.error ||
          "Assessment Submission Failed!",
      );
    } else {
      successToast(response.successMessage);
      navigate("/assessmentResult", { state: { exam, examResult: response } });
    }
  };

  const handleFinalSubmit = async () => {
    const isAnswerSubmitted = await submitCurrentAnswer();
    if (!isAnswerSubmitted) {
      failureToast("Failed to Submit Answer!");
    }
    setIsConfirmationModalOpen(true);
  };

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinishExam();
      return;
    }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  if (!exam || !totalQuestions) return null;

  return (
    <>
      <ConfimationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onCancel={() => setIsConfirmationModalOpen(false)}
        message="Are you sure you want to submit the entire assessment?"
        type="success"
        onOk={handleFinishExam}
      />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Leave alert overlay (same as before) */}
        {showLeaveAlert && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
              <div className="text-3xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                You left the exam tab!
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Switching tabs or windows during the exam is not allowed. Please
                stay on this page.
              </p>
              <button
                onClick={() => setShowLeaveAlert(false)}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold"
              >
                Return to exam
              </button>
            </div>
          </div>
        )}

        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {exam.examName}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              Question {current} of {totalQuestions}
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold",
              timerBg,
              timerColor,
            )}
          >
            <Clock10 size={18} />
            <span>{fmt(timeLeft)}</span>
          </div>
          <button
            onClick={() => setIsConfirmationModalOpen(true)}
            className="text-sm font-semibold text-gray-700 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition"
          >
            Submit
          </button>
        </div>

        {/* Timer bar */}
        <div className="h-1 bg-gray-100">
          <div
            className={cn("h-1 transition-all duration-1000", timerBar)}
            style={{ width: `${timePct}%` }}
          />
        </div>

        {/* Main area: Sidebar + Question content */}
        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 py-6 gap-6">
          {/* Question navigation panel */}
          <div className="md:w-64 lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-20">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
                Questions
                <span className="text-xs text-gray-400">
                  {questionStatus.filter((q) => q.answered).length} /{" "}
                  {totalQuestions} answered
                </span>
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-4 gap-2">
                {Array.from({ length: totalQuestions }, (_, idx) => {
                  const qNum = idx + 1;
                  const status = questionStatus[idx];
                  const isCurrent = qNum === current;
                  let bgClass = "bg-white border-gray-200";
                  if (status.answered) bgClass = "bg-green-50 border-green-300";
                  if (isCurrent)
                    bgClass =
                      "bg-blue-100 border-blue-500 ring-2 ring-blue-200";
                  return (
                    <button
                      key={qNum}
                      onClick={() => handleJumpToQuestion(qNum)}
                      className={cn(
                        "w-10 h-10 rounded-xl text-sm font-medium transition-all duration-150 border",
                        bgClass,
                        status.answered
                          ? "text-green-700 hover:bg-green-100"
                          : "text-gray-600 hover:bg-gray-50",
                        isCurrent && "shadow-sm",
                      )}
                    >
                      {qNum}
                      {status.flagged && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Optional legend */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>{" "}
                  Answered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-400"></span>{" "}
                  Current
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gray-200 border"></span>{" "}
                  Unanswered
                </span>
              </div>
            </div>
          </div>

          {/* Question content area */}
          <div className="flex-1 max-w-2xl mx-auto w-full">
            {question && (
              <>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full self-start mb-4 inline-block">
                  {question.topicId}
                </span>

                <h2 className="text-lg font-semibold text-gray-900 leading-relaxed mb-8">
                  Question: {question.questionDetail}
                </h2>

                {/* Answer forms */}
                {question.questionType === "MULTIPLE_CHOICE" && (
                  <MultipleChoicQuestionForm
                    options={options}
                    storeAnswer={storeAnswer}
                    selectedAnswers={answer.MULTIPLE_CHOICE}
                    isExam={true}
                  />
                )}
                {question.questionType === "SINGLE_CHOICE" && (
                  <SingleChoiceQuestionForm
                    options={options}
                    storeAnswer={storeAnswer}
                    answer={answer}
                    isExam={true}
                  />
                )}
                {question.questionType === "FILL_UP" && (
                  <FillUpQuestionForm
                    answer={answer}
                    storeAnswer={storeAnswer}
                    isExam={true}
                  />
                )}
                {question.questionType === "DETAILED_ANSWER" && (
                  <DescriptiveQuestionForm
                    answer={answer}
                    storeAnswer={storeAnswer}
                    isExam={true}
                  />
                )}
                {question.questionType === "TRUE_FALSE" && (
                  <TrueFalseQuestionForm
                    answer={answer}
                    storeAnswer={storeAnswer}
                    isExam={true}
                  />
                )}

                {/* Flag button (optional) */}
                <div className="mt-4">
                  <button
                    onClick={toggleFlag}
                    className={cn(
                      "text-sm px-3 py-1.5 rounded-lg border transition",
                      questionStatus[current - 1]?.flagged
                        ? "border-amber-300 text-amber-600 bg-amber-50"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50",
                    )}
                  >
                    {questionStatus[current - 1]?.flagged
                      ? "★ Flagged"
                      : "☆ Flag for review"}
                  </button>
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center justify-end mt-10 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <button
                      disabled={current === 1}
                      onClick={handlePrev}
                      className="cursor-pointer px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition"
                    >
                      ← Prev
                    </button>
                    {current !== totalQuestions ? (
                      <button
                        onClick={handleNext}
                        className="cursor-pointer px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition"
                      >
                        Save & Next →
                      </button>
                    ) : (
                      <button
                        onClick={handleFinalSubmit}
                        className="cursor-pointer px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition"
                      >
                        Save & Submit
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
