import { AlignLeft, Clock, FileText, HelpCircle, Percent } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiGet } from "../services/ApiService";
import { failureToast } from "../utils/toast";

function ExamQuestionsPage() {
  const [examQuestions, setExamQuestions] = useState([]);

  const location = useLocation();
  const exam = location.state?.exam;
  // console.log(exam.examId);
  if (!exam) return;

  useEffect(() => {
    const getAllExamQuestions = async () => {
      const response = await apiGet(
        `/exam/getAllExamQuestions?examId=${exam.examId}`,
      );
      if (response.responseMessage === "success") {
        setExamQuestions(response.data || []);
      } else {
        failureToast(response.errorMessage || "Failed to load Questions!");
      }
    };

    getAllExamQuestions();
  }, [exam?.examId]);

  return (
    <div>
      <div>
        <h1>Exam Wise Questions</h1>
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            Exam Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <FileText className="text-blue-500 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500">Exam Name</p>
                <p className="font-bold text-gray-800">{exam.examName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlignLeft className="text-purple-500 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-bold text-gray-800">{exam.description}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HelpCircle className="text-green-500 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500">Questions</p>
                <p className="font-bold text-gray-800">{exam.noOfQuestions}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="text-orange-500 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-bold text-gray-800">{exam.duration} mins</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Percent className="text-red-500 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500">Pass Percentage</p>
                <p className="font-bold text-gray-800">
                  {exam.passPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div>
          {examQuestions.length === 0 ? (
            <h2>No questions found for this exam.</h2>
          ) : (
            examQuestions.map((question) => (
              <div key={question.qId}>
                <p>Topic : {question.topicId}</p>
                <p>Question: {question.questionDetail}</p>
                <p>Option A :{question.optionA ?? "N/A"}</p>
                <p>Option B :{question.optionB ?? "N/A"}</p>
                <p>Option C :{question.optionC ?? "N/A"}</p>
                <p>Option D :{question.optionD ?? "N/A"}</p>
                <p>Option E :{question.optionE || "N/A"}</p>
                <p>Answer : {question.answer}</p>
                <p>Number of Answers: {question.numAnswers}</p>
                <p>Question Type: {question.questiontype}</p>
                <p>Difficulty Level: {question.difficultyLevel}</p>
                <p>{question.answerValue}</p>
                <p>Negative Mark : {question.negativeMarkValue || "N/A"}</p>
                <hr />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamQuestionsPage;
