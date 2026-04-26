import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConfimationModal from "../../components/Modal_Components/ConfimationModal";
import SecurityCodeModal from "../../components/Modal_Components/SecurityCodeModal";
import useAPI from "../../hooks/useAPI";
import { failureToast, successToast } from "../../utils/toast";

function formatDate(ms) {
  return new Date(ms).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ExamDetailsPage() {
  const navigate = useNavigate();
  const { apiGet, apiPost, isError } = useAPI();
  const location = useLocation();

  const [data, setData] = useState(location.state?.exam || {});
  const [started, setStarted] = useState(false);
  const [confirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const attemptsLeft = data.allowedAttempts - data.noOfAttempts;
  const [startExamPayload, setStartExamPayload] = useState({
    partyId: data?.partyId,
    examId: data?.examId,
    remainingTime: data?.duration,
    totalAnswered: 0,
    totalRemaining: data?.noOfQuestions,
    isExamActive: 1,
    currentSplitAttempt: 0,
  });

  const startExam = async () => {
    const response = await apiPost("/userExam", startExamPayload);

    if (isError(response)) {
      failureToast(
        response.errorMessage ||
          response.error ||
          "Failed to verify Security code!",
      );
    } else {
      successToast(response.successMessage);
      navigate("/attend", {
        state: { exam: data, totalQuestions: response.totalQuestions },
      });
    }
  };

  const verifyOtp = async (securityCode) => {
    const response = await apiPost("/userExam/verifyOtp", {
      examId: data.examId,
      partyId: data.partyId,
      securityCode,
    });

    if (isError(response)) {
      failureToast(
        response.errorMessage ||
          response.error ||
          "Failed to verify Security code!",
      );
    } else {
      successToast(response.successMessage);
      // start the exam.
      startExam();
    }
  };

  const sendOTP = async () => {
    const response = await apiGet(
      `/securityCode?examId=${data?.examId}&partyId=${data?.partyId}`,
    );

    if (isError(response)) {
      failureToast(
        response.errorMessage ||
          response.error ||
          "Failed to verify Security code!",
      );
    } else {
      successToast(response.successMessage);
    }
  };

  useEffect(() => {
    if (location.state === null || location.state === undefined) {
      navigate("/userDashboard");
    }
  }, []);

  return (
    <>
      <SecurityCodeModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onOk={verifyOtp}
        type="success"
      />

      <ConfimationModal
        isOpen={confirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onOk={() => {
          sendOTP();
          setOtpModalOpen(true);
        }}
        onCancel={() => setIsConfirmationModalOpen(false)}
        message={
          "Once you begin, the timer will start and cannot be paused. Please ensure you have a stable connection and are ready to complete the exam without interruptions."
        }
        type="info"
      />

      <div className="title flex justify-between items-center">
        <div className="titleText">
          <span className="text-2xl block">ASSESSMENT DETAILS</span>
          <span className="text-gray-500 text-sm">
            Detailed Information about Assessment
          </span>
        </div>
      </div>

      <div className="font-[Inter] bg-white min-h-screen px-6 py-10 rounded mx-auto">
        <div className="flex items-start">
          <div>
            <h1 className="text-[18px] font-bold text-gray-900 leading-tight mb-1.5">
              {data.examName}
            </h1>

            <p className="text-[14px] text-gray-500 mb-8">
              Advanced level · Available from {formatDate(data.fromDate)}
            </p>
          </div>

          <span className="ml-auto text-[12px] bg-green-50 text-green-600 px-3 py-[3px] rounded-full font-medium">
            Active
          </span>
        </div>

        {/* Stats row */}
        <div className="flex gap-8 mb-9 pb-8 border-b border-gray-100">
          {[
            { label: "Duration", value: `${data.duration} min` },
            { label: "Questions", value: data.noOfQuestions },
            { label: "Pass Percentage", value: `${data.passPercentage}%` },
            {
              label: "Attempts",
              value: `${data.noOfAttempts}/${data.allowedAttempts}`,
            },
            { label: "Timeout Period", value: `${data.timeoutDays} days` },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-400 uppercase tracking-[0.6px]">
                {label}
              </span>
              <span className="text-[20px] font-bold text-gray-900">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div className="mb-9">
          <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-[0.6px] mb-4">
            Rules
          </h2>

          <div className="grid grid-cols-2 gap-y-[10px] gap-x-6">
            {[
              [
                "Negative marking",
                data.allowNegativeMarks ? "Enabled" : "Disabled",
              ],
              ["Allowed attempts", `${data.allowedAttempts} attempt`],
              ["Auto-timeout", `${data.timeoutDays} days`],
              ["Validity", "No expiry"],
              ["Party ID", data.partyId],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between items-center py-2.5 border-b border-gray-100"
              >
                <span className="text-[13px] text-gray-500">{k}</span>
                <span className="text-[13px] font-semibold text-gray-900">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-[0.6px] mb-4">
            Topics Involved
          </h2>

          <div className="flex flex-col gap-3.5">
            {data.topics &&
              data.topics.map((t, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px] text-gray-700 font-medium">
                      Topic : {t.topicName}
                    </span>
                    <span className="text-[12px] text-gray-400">
                      {t.percentage}%
                    </span>
                  </div>

                  <div className="bg-gray-100 rounded-full h-1">
                    <div
                      className="h-1 rounded-full transition-all duration-700"
                      style={{
                        width: `${t.percentage}%`,
                        background: `hsl(${220 + i * 18}, 70%, 55%)`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Instructions */}

        <div className="mb-10">
          <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-[0.6px] mb-4">
            Assesment Instructions
          </h2>
          <ul className="pl-5">
            {[
              "Avoid using the back button or refreshing the page during the exam.",
              "Do not refresh or close the browser tab once the exam has started. Doing so may result in loss of progress.",
              "Ensure you have a stable internet connection throughout the exam.",
              "Do not navigate away from the exam window. Switching tabs or minimizing the browser may be recorded.",
              "The exam is time-bound. Make sure to complete all questions before the timer ends.",
              "All questions are important. Attempt every question to maximize your score.",
              "If negative marking is enabled, answer carefully—incorrect answers may reduce your score.",
              "Do not use external help, including books, notes, or online resources, unless explicitly allowed.",
              "Once submitted, the exam cannot be retaken unless additional attempts are permitted.",
              "Your progress may be auto-submitted if the time limit is exceeded.",
              "Carefully read each question before answering.",
            ].map((ins, idx) => (
              <li key={idx} className="list-disc">
                {ins}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div>
            <span className="text-[13px] text-gray-500">
              {attemptsLeft > 0
                ? `${attemptsLeft} attempt remaining`
                : "No attempts left"}
            </span>

            {data.allowNegativeMarks === 0 && (
              <p className="text-[12px] text-gray-400 mt-1">
                No negative marking — attempt all questions
              </p>
            )}
          </div>

          <button
            onClick={() => setIsConfirmationModalOpen(true)}
            disabled={attemptsLeft === 0}
            className={`cursor-pointer px-7 py-[11px] rounded-[10px] text-[14px] font-semibold transition 
        ${
          attemptsLeft === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : started
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-900 text-white hover:bg-black"
        }`}
          >
            {started
              ? "✓ Started"
              : attemptsLeft === 0
                ? "Unavailable"
                : "Start Assessment →"}
          </button>
        </div>
      </div>
    </>
  );
}
