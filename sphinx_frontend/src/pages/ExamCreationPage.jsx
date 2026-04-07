import { useLocation } from "react-router-dom";
import {
  BlackInputLabel,
  ErrorBox,
  FormErrorMessage,
  MandatoryInp,
  StyledSelect,
  TextArea,
  TextInput,
} from "../styles/common.styles";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TopicSection from "../components/TopicSection";
import { apiGet, apiPost, apiPut } from "../services/ApiService";
import { failureToast, successToast } from "../utils/toast";
import { ExamFormValidation } from "../utils/ValidationService";

function ExamCreationPage() {
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

  console.log("partyId => ", partyId);

  // Load exam data in update mode
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
      allowNegativeMarks,
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
    <>
      <h1>{isUpdateMode ? "Update Exam" : "Create Exam"}</h1>

      {responseError && <ErrorBox>{responseError}</ErrorBox>}

      <form onSubmit={isUpdateMode ? handleUpdate : handleSubmit}>
        <BlackInputLabel htmlFor="examName">
          Exam name <MandatoryInp>*</MandatoryInp>
        </BlackInputLabel>
        <TextInput
          id="examName"
          type="text"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          placeholder="Enter exam name"
        />
        {formError.examName && (
          <FormErrorMessage>{formError.examName}</FormErrorMessage>
        )}

        <br />
        <br />

        <BlackInputLabel htmlFor="description">
          Exam Description
        </BlackInputLabel>
        <TextArea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Exam Description"
        />
        {formError.description && (
          <FormErrorMessage>{formError.description}</FormErrorMessage>
        )}
        <br />
        <br />

        <div className="flex flex-colum gap-3">
          <div>
            <BlackInputLabel htmlFor="noOfQuestions">
              Total Number Of Questions <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <TextInput
              id="noOfQuestions"
              type="number"
              value={noOfQuestions}
              onChange={(e) => setNoOfQuestions(e.target.value)}
              placeholder="Enter No Of Questions"
            />
            {formError.noOfQuestions && (
              <FormErrorMessage>{formError.noOfQuestions}</FormErrorMessage>
            )}
          </div>

          <div>
            <BlackInputLabel htmlFor="duration">
              Exam Duration (In Minutes) <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <TextInput
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter Exam Duration"
            />
            {formError.duration && (
              <FormErrorMessage>{formError.duration}</FormErrorMessage>
            )}
          </div>

          <div>
            <BlackInputLabel htmlFor="passPercentage">
              Exam Pass Percentage (%) <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <TextInput
              id="passPercentage"
              type="number"
              value={passPercentage}
              onChange={(e) => setPassPercentage(e.target.value)}
              placeholder="Enter Exam Pass Percentage"
            />
            {formError.passPercentage && (
              <FormErrorMessage>{formError.passPercentage}</FormErrorMessage>
            )}
          </div>
        </div>
        <br />
        <br />

        <div className="flex flex-colum gap-25">
          <div>
            <BlackInputLabel>
              Select Question Visibility <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <StyledSelect
              value={questionsRandomized}
              onChange={(e) => setQuestionsRandomized(e.target.value)}
            >
              <option value="0">Random Order</option>
              <option value="1">Same Order</option>
            </StyledSelect>
          </div>

          <div>
            <BlackInputLabel htmlFor="mustAnswer">
              Minimum Questions To Attend <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <TextInput
              id="mustAnswer"
              type="number"
              value={answersMust}
              onChange={(e) => setAnswersMust(e.target.value)}
              placeholder="Enter the Minimum questions to attend"
            />
          </div>
        </div>
        {formError.answersMust && (
          <FormErrorMessage>{formError.answersMust}</FormErrorMessage>
        )}
        <br />

        <div className="flex flex-colum gap-70">
          <div>
            <BlackInputLabel>
              Allow Negative Marks <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <StyledSelect
              value={allowNegativeMarks}
              onChange={(e) => setAllowNegativeMarks(e.target.value)}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </StyledSelect>
          </div>

          <div>
            {allowNegativeMarks === "1" && (
              <>
                <BlackInputLabel htmlFor="negativeMarkValue">
                  Negative Marks Value <MandatoryInp>*</MandatoryInp>
                </BlackInputLabel>
                <TextInput
                  id="negativeMarkValue"
                  type="number"
                  value={negativeMarkValue}
                  onChange={(e) => setNegativeMarkValue(e.target.value)}
                  placeholder="Enter Negative Marks"
                />
                {formError.negativeMarkValue && (
                  <FormErrorMessage>
                    {formError.negativeMarkValue}
                  </FormErrorMessage>
                )}
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || (!isUpdateMode && !!createdExamId)}
          className="w-full mt-6 py-3 px-4 rounded-xl text-sm font-semibold text-white
                     bg-gradient-to-r from-indigo-600 to-violet-600
                     hover:from-indigo-500 hover:to-violet-500
                     active:scale-[0.98] transition-all duration-200
                     shadow-lg shadow-indigo-500/25
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading
            ? isUpdateMode
              ? "Updating..."
              : "Creating..."
            : isUpdateMode
              ? "Update Exam"
              : createdExamId
                ? "Exam Created ✓"
                : "Create Exam"}
        </button>
      </form>

      {activeExamId && (
        <TopicSection examId={activeExamId} noOfQuestions={noOfQuestions} />
      )}
    </>
  );
}

export default ExamCreationPage;
