import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TopicSection from "../../components/TopicSection";

import useAPI from "../../hooks/useAPI";
import { failureToast, successToast } from "../../utils/toast";
import { ExamFormValidation } from "../../utils/ValidationService";

function ExamCreationPage() {
  const { apiGet, apiPost, apiPut } = useAPI();

  const [examName, setExamName] = useState("");
  const [description, setDescription] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState("");
  const [duration, setDuration] = useState("");
  const [passPercentage, setPassPercentage] = useState("");
  const [questionsRandomized, setQuestionsRandomized] = useState("0");
  const [answersMust, setAnswersMust] = useState("");
  const [allowNegativeMarks, setAllowNegativeMarks] = useState("0");
  const [negativeMarkValue, setNegativeMarkValue] = useState("");

  const [responseError, setResponseError] = useState("");
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [createdExamId, setCreatedExamId] = useState(""); // For create mode

  const location = useLocation();
  const exam = location.state?.exam;
  const isUpdateMode = !!exam?.examId;

  const partyId = useSelector((state) => state.auth?.partyId);

  // console.log("partyId => ", partyId);

  useEffect(() => {
    if (!isUpdateMode) return;

    const getExamById = async () => {
      const response = await apiGet(`/exam/${exam.examId}`);
      if (response.responseMessage === "success") {
        const data = response.exam;
        setCreatedExamId(data.examId); // reuse for consistency
        setExamName(data.examName || "");
        setDescription(data.description || "");
        setNoOfQuestions(data.noOfQuestions?.toString() || "");
        setDuration(data.duration?.toString() || "");
        setPassPercentage(data.passPercentage?.toString() || "");
        setQuestionsRandomized(data.questionsRandomized?.toString() || "0");
        setAnswersMust(data.answersMust?.toString() || "");
        setAllowNegativeMarks(data.allowNegativeMarks?.toString() || "0");
        setNegativeMarkValue(data.negativeMarkValue?.toString() || "");
      } else {
        failureToast(response.errorMessage || "Failed to load exam");
      }
    };

    getExamById();
  }, [isUpdateMode, exam?.examId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError({});
    setResponseError("");
    setIsLoading(true);

    const examFormData = {
      partyId,
      examName,
      description,
      noOfQuestions,
      duration,
      passPercentage,
      questionsRandomized,
      answersMust,
      allowNegativeMarks,
      negativeMarkValue,
    };

    const errors = ExamFormValidation(examFormData);
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      setIsLoading(false);
      return;
    }

    const response = await apiPost("/exam", examFormData);

    if (response.responseMessage === "success") {
      successToast("Exam created successfully");
      setCreatedExamId(response.examId);
    } else {
      setResponseError(response.errorMessage);
      failureToast(response.errorMessage);
    }

    setIsLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const examUpdateData = {
      examId: exam.examId,
      partyId: partyId,
      examName,
      description,
      noOfQuestions,
      duration,
      passPercentage,
      questionsRandomized,
      answersMust,
      allowNegativeMarks: "0",
      negativeMarkValue,
    };

    const response = await apiPut("/exam", examUpdateData);

    if (response.responseMessage && response.responseMessage === "success") {
      successToast("Exam updated successfully");
    } else {
      failureToast(response.errorMessage || "Failed to update exam");
    }

    setIsLoading(false);
  };

  const activeExamId = isUpdateMode ? exam.examId : createdExamId;

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className=" px-8 py-6">
            <h1 className="text-3xl font-bold  tracking-tight">
              {isUpdateMode ? "Update Assessment" : "Create New Assessment"}
            </h1>
            <p className="mt-1 text-sm">
              {isUpdateMode
                ? "Modify exam details and manage topics"
                : "Fill in the details to create a new assessment"}
            </p>
          </div>

          <div className="p-6 md:p-8">
            {/* Error Alert */}
            {responseError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{responseError}</p>
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={isUpdateMode ? handleUpdate : handleSubmit}
              className="space-y-8"
            >
              {/* Exam Name */}
              <div>
                <label
                  htmlFor="examName"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="examName"
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g., Frontend Developer Assessment"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 shadow-sm
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                           transition-all duration-200 outline-none
                           placeholder:text-gray-400 text-gray-800"
                />
                {formError.examName && (
                  <p className="mt-1 text-sm text-red-600">
                    {formError.examName}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the purpose, topics covered, and any special instructions..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 shadow-sm
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                           transition-all duration-200 outline-none resize-y
                           placeholder:text-gray-400 text-gray-800"
                />
                {formError.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {formError.description}
                  </p>
                )}
              </div>

              {/* Three-column grid for numeric fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="noOfQuestions"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Total Questions <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="noOfQuestions"
                    type="number"
                    min="1"
                    value={noOfQuestions}
                    onChange={(e) => setNoOfQuestions(e.target.value)}
                    placeholder="e.g., 30"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 shadow-sm
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                             transition-all duration-200 outline-none"
                  />
                  {formError.noOfQuestions && (
                    <p className="mt-1 text-sm text-red-600">
                      {formError.noOfQuestions}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="duration"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 60"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 shadow-sm
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                             transition-all duration-200 outline-none"
                  />
                  {formError.duration && (
                    <p className="mt-1 text-sm text-red-600">
                      {formError.duration}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="passPercentage"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Pass Percentage (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="passPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={passPercentage}
                    onChange={(e) => setPassPercentage(e.target.value)}
                    placeholder="e.g., 70"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 shadow-sm
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                             transition-all duration-200 outline-none"
                  />
                  {formError.passPercentage && (
                    <p className="mt-1 text-sm text-red-600">
                      {formError.passPercentage}
                    </p>
                  )}
                </div>
              </div>

              {/* Two-column for visibility & minimum questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Question Visibility <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={questionsRandomized}
                    onChange={(e) => setQuestionsRandomized(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 shadow-sm
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                             transition-all duration-200 outline-none bg-white"
                  >
                    <option value="0">Random Order</option>
                    <option value="1">Same Order</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="mustAnswer"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Minimum Questions to Attend{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="mustAnswer"
                    type="number"
                    min="1"
                    value={answersMust}
                    onChange={(e) => setAnswersMust(e.target.value)}
                    placeholder="Minimum required answers"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 shadow-sm
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                             transition-all duration-200 outline-none"
                  />
                  {formError.answersMust && (
                    <p className="mt-1 text-sm text-red-600">
                      {formError.answersMust}
                    </p>
                  )}
                </div>
              </div>

              {/* Negative Marks Section (commented toggle, but we keep conditional field) */}
              {/* Hidden negative marks toggle - can be uncommented if needed */}
              {allowNegativeMarks === "1" && (
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <label
                    htmlFor="negativeMarkValue"
                    className="block text-sm font-semibold text-amber-800 mb-1"
                  >
                    Negative Marks Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="negativeMarkValue"
                    type="number"
                    step="0.5"
                    min="0"
                    value={negativeMarkValue}
                    onChange={(e) => setNegativeMarkValue(e.target.value)}
                    placeholder="e.g., 0.25"
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white
                             focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                             transition-all duration-200 outline-none"
                  />
                  {formError.negativeMarkValue && (
                    <p className="mt-1 text-sm text-red-600">
                      {formError.negativeMarkValue}
                    </p>
                  )}
                  <p className="text-xs text-amber-600 mt-2">
                    ⚠️ Negative marks will be deducted for incorrect answers.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || (!isUpdateMode && !!createdExamId)}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white
                         bg-gradient-to-r from-indigo-600 to-violet-600
                         hover:from-indigo-500 hover:to-violet-500
                         active:scale-[0.98] transform transition-all duration-200
                         shadow-lg shadow-indigo-500/30
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
                         flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isUpdateMode ? "Updating..." : "Creating..."}
                  </>
                ) : isUpdateMode ? (
                  "Update Exam"
                ) : createdExamId ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Exam Created ✓
                  </>
                ) : (
                  "Create Exam"
                )}
              </button>
            </form>
          </div>
          {/* Topic Section - only shown after exam creation */}
          {activeExamId && (
            <div className="my-8 px-10">
              <TopicSection
                examId={activeExamId}
                noOfQuestions={noOfQuestions}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamCreationPage;
