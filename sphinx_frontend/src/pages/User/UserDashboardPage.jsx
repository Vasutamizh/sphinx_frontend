import { ChevronRight, Clock, NotepadText } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiPost, isError } from "../../services/ApiService";
import { loaderActions } from "../../store/LoaderReducer";
import { failureToast } from "../../utils/toast";

function UserDashboardPage() {
  const partyId = useSelector((state) => state.auth?.partyId);
  const dispatch = useDispatch();
  const [exams, setExams] = useState([
    {
      examName: "Java Certification Test",
      description: "Basic Java programming assessment",
      noOfQuestions: 50,
      duration: 60,
      passPercentage: 40,
      allowNegativeMarks: false,
      fromDate: "2026-04-01T10:00:00",
      thruDate: "2026-04-30T18:00:00",

      examId: "EXAM1001",
      partyId: "USER123",
      allowedAttempts: 3,
      noOfAttempts: 1,
      timeoutDays: 7,
    },
  ]);

  const getAllAssessments = async () => {
    dispatch(loaderActions.loaderOn());
    try {
      const response = await apiPost("/examUser/getAllExamAssignedForUser", {
        partyId,
      });
      if (isError(response)) {
        failureToast(
          response.errorMessage ||
            response.error ||
            "Failed to load Assessments!",
        );
      } else {
        setExams(response.data || []);
      }
    } catch (err) {
      console.log("Error while fetching data ... ", err);
      failureToast("Failed to load Assessments!");
    } finally {
      dispatch(loaderActions.loaderOff());
    }
  };

  useEffect(() => {
    getAllAssessments();
  }, []);

  const navigate = useNavigate();
  return (
    <div>
      <div className="container">
        <div className="title flex justify-between items-center">
          <div className="titleText">
            <span className="text-2xl  block">Dashboard</span>
            <span className="text-gray-500 text-sm">
              Manage Your Assessments & Your Perfomance
            </span>
          </div>
        </div>

        <div>
          <p className="text-2xl mb-2 mt-5">Assessments For You!</p>
          <hr />
        </div>
        <div className="mt-5">
          {exams &&
            exams.length > 0 &&
            exams.map((exam) => (
              <div className="exam-card flex items-center justify-between bg-white rounded shadow-md py-5 px-10">
                <div className="flex gap-5 items-center">
                  <NotepadText size={20} className="text-sky-700" />
                  <div>
                    <p className="text-xl text-slate">{exam.examName}</p>
                    <p className="text-gray-600">{exam.description}</p>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <Clock size={20} className="text-orange-500" />
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-semibold">{exam.duration} Minutes</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500">Deadline</p>
                  <p className="font-semibold">
                    {new Date(exam.thruDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Status</p>
                  <span className="bg-green-400 text-xs font-semibold py-1 px-2 rounded-2xl">
                    Active
                  </span>
                </div>

                <button
                  className="flex items-center p-2 text-gray-500 cursor-pointer"
                  onClick={() => {
                    navigate("/assesmentDetails", { state: { exam } });
                  }}
                >
                  {/* <LucideEye size={18} /> */}
                  <ChevronRight size={20} />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboardPage;
