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
  const { exam, totalQuestions } = location.state;

  const [examDetails, setExamDetails] = useState(exam);
  useEffect(() => {
    console.log("state location => ", exam, totalQuestions);
  }, []);

  useEffect(() => {
    if (!exam || !totalQuestions) {
      navigate("/userDasboard");
    }
  }, []);

  const { apiGet, apiPost, isError } = useAPI();

  const [current, setCurrent] = useState(1);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");
  const [answer, setAnswer] = useState({
    SINGLE_CHOICE: "",
    MULTIPLE_CHOICE: "",
    FILL_UP: "",
    TRUE_FALSE: "",
    DETAILED_ANSWER: "",
  });
  const [selected, setSelected] = useState(Array(totalQuestions).fill(null));
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const answered = selected.filter((s) => s !== null).length;
  const timePct = (timeLeft / (exam.duration * 60)) * 100;

  useEffect(() => {
    console.log("ANSWER => ", answer);
  }, [answer]);

  // Timer
  useEffect(() => {
    // if (submitted) return;
    if (timeLeft <= 0) {
      //   setSubmitted(true);
      // auto call to submit the exam.
      return;
    }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);

    return () => clearInterval(t);
  }, [timeLeft]);

  // Warn on refresh/close
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  //   useEffect(() => {
  //     if (submitted) return;
  //     const onBlur = () => setShowLeaveAlert(true);
  //     window.addEventListener("blur", onBlur);
  //     return () => window.removeEventListener("blur", onBlur);
  //   }, [submitted]);

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
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

  const handleSelect = (idx) => {
    if (submitted) return;
    const updated = [...selected];
    updated[current] = idx;
    setSelected(updated);
  };

  const storeAnswer = (key, value) => {
    const newObj = { ...answer };
    newObj[key] = value;
    setAnswer(newObj);
  };

  const getQuestion = async (questionNumber = 1) => {
    const response = await apiGet(
      `/userExam/examQuestion?examId=${examDetails.examId}&partyId=${examDetails.partyId}&questionNumber=${questionNumber}`,
    );

    if (isError(response)) {
      failureToast(response.errorMessage || response.error);
    } else {
      let questionData = response.data[0].question;
      let answer = response.data[0].answer; // [{question: {}, answer:{}}]
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
      if (answer) {
        let procAnswer = answer?.submittedAnswer;
        if (questionData.questionType === "MULTIPLE_CHOICE") {
          procAnswer = procAnswer?.split(",");
          storeAnswer("MULTIPLE_CHOICE", procAnswer || "");
        } else {
          storeAnswer(questionData.questionType, procAnswer);
        }
      }
    }
  };

  useEffect(() => {
    getQuestion();
  }, []);

  const handleSubmit = async () => {
    // grab the answer;
    let selectedAnswer = answer[question.questionType];
    if (!selectedAnswer) return;

    if (question.questionType === "MULTIPLE_CHOICE") {
      selectedAnswer = selectedAnswer.join(",");
    }

    let payload = {
      qId: question.qId,
      examId: exam.examId,
      partyId: exam.partyId,
      submittedAnswer: selectedAnswer,
      sNo: 1,
      isFlagged: 0,
    };
    const response = await apiPost("/userExam/submitanswer", payload);
    if (isError(response)) {
      failureToast(response.errorMessage || response.error);
    }

    setSubmitted(true);
    setShowConfirm(false);
  };

  //   console.log("question => ", question);

  const handleNext = () => {
    if (current >= totalQuestions) return;
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

  const handlePrev = () => {
    if (current === 1) return;
    getQuestion(current - 1);
    setCurrent((prev) => prev - 1);
  };

  const handleFinishExam = async () => {
    const payload = {
      partyId: examDetails.partyId,
      examId: examDetails.examId,
    };
    const response = await apiPost("/userExam/submit", payload);

    if (isError(response)) {
      failureToast(response.errorMessage || response.error);
    } else {
      successToast(response.successMessage);
      navigate("/assessmentResult", { state: { exam, examResult: response } });
    }
  };

  return (
    <>
      <ConfimationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onCancel={() => setIsConfirmationModalOpen(false)}
        message={"Are you sure want to Submit the Assessment!"}
        type="success"
        onOk={handleFinishExam}
      />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Leave alert overlay */}
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

        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {examDetails.examName}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              Question {`${current} of ${totalQuestions}`}
            </p>
          </div>

          {/* Timer */}
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold",
              timerBg,
              timerColor,
            )}
          >
            <span>
              <Clock10 size={18} />
            </span>
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

        <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-6 py-8">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full self-start mb-4">
            {question.topicId}
          </span>

          <h2 className="text-lg font-semibold text-gray-900 leading-relaxed mb-8">
            {question.questionDetail}
          </h2>
          {/* Answer Part */}
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

          <div className="flex items-center justify-end mt-10 pt-6 border-t border-gray-100">
            {/* <button
            onClick={() =>
              setFlagged((f) => {
                const n = [...f];
                n[current] = !n[current];
                return n;
              })
            }
            className={cn(
              "text-sm font-medium px-4 py-2 rounded-xl border transition",
              flagged[current]
                ? "border-amber-300 text-amber-600 bg-amber-50"
                : "border-gray-200 text-gray-400 hover:bg-gray-50",
            )}
          >
            {flagged[current] ? " Flagged" : "🏳 Flag"}
          </button> */}

            <div className="flex items-center gap-3">
              <button
                disabled={current === 1}
                onClick={() => {
                  handlePrev();
                  handleSubmit;
                }}
                className="cursor-pointer px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition"
              >
                ← Prev
              </button>
              {current !== totalQuestions ? (
                <button
                  onClick={() => {
                    handleNext();
                    handleSubmit();
                  }}
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  Save & Next →
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleSubmit();
                    setIsConfirmationModalOpen(true);
                  }}
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  Save & Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
