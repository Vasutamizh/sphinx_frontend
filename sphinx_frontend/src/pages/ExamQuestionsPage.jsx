import React, { useEffect, useState } from "react";
import { apiGet } from "../services/ApiService";
import { failureToast, successToast } from "../utils/toast";
import { useLocation } from "react-router-dom";

function ExamQuestionsPage() {
  const [examQuestions, setExamQuestions] = useState([]);

  const location = useLocation();
  const exam = location.state?.exam;
  console.log(exam.examId);

  useEffect(() => {
    const getAllExamQuestions = async () => {
      const response = await apiGet(
        `/exam/getAllExamQuestions?examId=${exam.examId}`,
      );
      if (response.responseMessage === "success") {
        setExamQuestions(response.data || []);
        successToast(response.successMessage);
      } else {
        failureToast(response.errorMessage);
      }
    };

    getAllExamQuestions();
  }, [exam?.examId]);

  return (
    <div>
      <div>
        <div>
          {examQuestions.length === 0 ? (
            <h2>No questions found for this exam.</h2>
          ) : (
            examQuestions.map((question) => (
              <div key={question.qId}>
                <p>{question.topicId}</p>
                <p>{question.questionDetail}</p>
                <p>{question.optionA ?? ""}</p>
                <p>{question.optionB ?? ""}</p>
                <p>{question.optionC ?? ""}</p>
                <p>{question.optionD ?? ""}</p>
                <p>{question.optionE ?? ""}</p>
                <p>{question.answer}</p>
                <p>{question.numAnswers}</p>
                <p>{question.questiontype}</p>
                <p>{question.difficultyLevel}</p>
                <p>{question.answerValue}</p>
                <p>{question.negativeMarkValue}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamQuestionsPage;
