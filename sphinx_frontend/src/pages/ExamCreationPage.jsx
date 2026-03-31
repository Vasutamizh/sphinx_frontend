import { useState } from "react";
import { toast } from "sonner";
import { apiPost } from "../services/ApiService";
import { ExamFormValidation } from "../services/ValidationService";
import ExamForm from "../components/ExamForm";
import TopicSection from "../components/TopicSection";

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
        toast.success(response.successMessage, { position: "top-right" });
        setExamId(response.examId);
      } else {
        setResponseError(response.errorMessage);
        toast.error(response.errorMessage, { position: "top-right" });
      }
    } else {
      setFormError(errors);
    }
    setIsLoading(false);
  };

  return (
    <>
      <ExamForm
        formError={formError}
        responseError={responseError}
        isLoading={isLoading}
        examId={examId}
        examName={examName}
        setExamName={setExamName}
        description={description}
        setDescription={setDescription}
        noOfQuestions={noOfQuestions}
        setNoOfQuestions={setNoOfQuestions}
        duration={duration}
        setDuration={setDuration}
        passPercentage={passPercentage}
        setPassPercentage={setPassPercentage}
        questionsRandomized={questionsRandomized}
        setQuestionsRandomized={setQuestionsRandomized}
        answersMust={answersMust}
        setAnswersMust={setAnswersMust}
        allowNegativeMarks={allowNegativeMarks}
        setAllowNegativeMarks={setAllowNegativeMarks}
        negativeMarkValue={negativeMarkValue}
        setNegativeMarkValue={setNegativeMarkValue}
        onSubmit={handleSubmit}
      />

      {examId && <TopicSection examId={examId} noOfQuestions={noOfQuestions} />}
    </>
  );
}

export default ExamCreationPage;
