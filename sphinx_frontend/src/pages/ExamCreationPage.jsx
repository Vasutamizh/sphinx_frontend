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
import TopicSection from "../components/TopicSection";
import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../services/ApiService";
import { failureToast, successToast } from "../utils/toast";

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
  const [examId, setExamId] = useState("");

  const location = useLocation();
  const exam = location.state?.exam;
  console.log(exam);

  useEffect(() => {
    const getAllExam = async () => {
      const response = await apiGet("/exam");
      if (response.responseMessage === "success") {
        setExamId(response.examList.examId);
        setExamName(response.examList.examName);
        successToast(response.successMessage);
      } else {
        failureToast(response.errorMessage);
      }
    };
    getAllExam();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError({});
    setResponseError("");
    setIsLoading(true);

    const examFormData = {
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
    if (Object.keys(errors).length === 0) {
      const response = await apiPost("/exam", examFormData);
      if (response.responseMessage === "success") {
        successToast(response.successMessage);
        setExamId(response.examId);
      } else {
        setResponseError(response.errorMessage);
        failureToast(response.errorMessage);
      }
    } else {
      setFormError(errors);
    }
    setIsLoading(false);
  };

  const updateExam = async () => {
    const examUpdateData = {
      examId,
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
    if (response.responseMessage === "success") {
      successToast(response.successMessage);
    } else {
      failureToast(response.errorMessage);
    }
  };
  return (
    <>
      <h1>{exam ? "Exam Updation Screen" : "Exam Creation Screen"}</h1>
      {responseError && <ErrorBox>{responseError}</ErrorBox>}

      <form onSubmit={examId ? updateExam : handleSubmit}>
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

        <BlackInputLabel htmlFor="description">
          Exam Description
        </BlackInputLabel>
        <TextArea
          id="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
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
              onChange={(e) => setNoOfQuestions(e.target.value)}
              value={noOfQuestions}
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
              onChange={(e) => setDuration(e.target.value)}
              value={duration}
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
              onChange={(e) => setPassPercentage(e.target.value)}
              value={passPercentage}
              placeholder="Enter Exam Pass Percentage"
            />
            {formError.passPercentage && (
              <FormErrorMessage>{formError.passPercentage}</FormErrorMessage>
            )}
          </div>
        </div>
        <br />

        <div className="flex flex-colum gap-25">
          <div>
            <BlackInputLabel htmlFor="randomQuestion">
              Select Question Visibility <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <StyledSelect
              onChange={(e) => setQuestionsRandomized(e.target.value)}
            >
              <option value="0">Random Order</option>
              <option value="1">Same Order</option>
            </StyledSelect>
            {formError.questionsRandomized && (
              <FormErrorMessage>
                {formError.questionsRandomized}
              </FormErrorMessage>
            )}
          </div>
          <div>
            <BlackInputLabel htmlFor="mustAnswer">
              Minimum Questions To Attend <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <TextInput
              id="mustAnswer"
              type="number"
              onChange={(e) => setAnswersMust(e.target.value)}
              value={answersMust}
              placeholder="Enter the Minimum questions to attend"
            />
            {formError.answersMust && (
              <FormErrorMessage>{formError.answersMust}</FormErrorMessage>
            )}
          </div>
        </div>
        <br />

        <div className="flex flex-colum gap-70">
          <div>
            <BlackInputLabel htmlFor="negativeMarks">
              Allow Negative Marks <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <StyledSelect
              onChange={(e) => setAllowNegativeMarks(e.target.value)}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </StyledSelect>
            {formError.allowNegativeMarks && (
              <FormErrorMessage>
                {formError.allowNegativeMarks}
              </FormErrorMessage>
            )}
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
                  onChange={(e) => setNegativeMarkValue(e.target.value)}
                  value={negativeMarkValue}
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
          disabled={isLoading || !!examId}
          className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white
                     bg-gradient-to-r from-indigo-600 to-violet-600
                     hover:from-indigo-500 hover:to-violet-500
                     active:scale-[0.98] transition-all duration-200
                     shadow-lg shadow-indigo-500/25
                     disabled:opacity-60 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 animate-spin"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Creating Exam...
            </span>
          ) : examId ? (
            "Exam Created"
          ) : (
            "Create Exam"
          )}
        </button>
      </form>

      {examId && <TopicSection examId={examId} noOfQuestions={noOfQuestions} />}
    </>
  );
}

export default ExamCreationPage;
