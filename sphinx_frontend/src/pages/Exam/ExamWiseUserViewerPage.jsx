import { ChevronDown, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useAPI from "../../hooks/useAPI";
import { failureToast } from "../../utils/toast";

export default function ExamWiseUserViewer() {
  //   const exams = [
  //     {
  //       examId: "1",
  //       examName: "Java Exam",
  //       users: [
  //         { partyId: "123", name: "John Doe" },
  //         { partyId: "456", name: "Jane Smith" },
  //       ],
  //     },
  //     {
  //       examId: "2",
  //       examName: "React Exam",
  //       users: [],
  //     },
  //   ];
  const { apiPost } = useAPI();
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);

  const handleChange = (examId) => {
    if (examId) {
      setSelectedExamId(examId);
    }
  };

  const partyId = useSelector((state) => state.auth?.partyId);

  useEffect(() => {
    const getUsersForExam = async () => {
      if (!selectedExamId) {
        return;
      }
      const response = await apiPost("/exam/getAssignedUsers", {
        examId: selectedExamId,
      });

      if (response.responseMessage && response.responseMessage === "success") {
        setAssignedUsers(response.data);
      } else {
        failureToast(
          response.errorMessage || response.error || "Failed to Load data!",
        );
        setAssignedUsers([]);
      }
    };
    getUsersForExam();
  }, [selectedExamId]);

  useEffect(() => {
    const getAllExamsByAdmin = async () => {
      const response = await apiPost("/exam/getAllExamsByAdmin", { partyId });
      if (response.responseMessage && response.responseMessage === "success") {
        setExams(response.data);
      } else {
        failureToast(
          response.errorMessage || response.error || "Failed to load Data!",
        );
      }
    };

    getAllExamsByAdmin();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Users className="text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Assigned Users</h2>
      </div>

      {/* Dropdown */}
      <div className="relative mb-6">
        <select
          value={selectedExamId}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 pr-10 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select an Exam</option>
          {exams.length > 0 &&
            exams.map((exam) => (
              <option key={exam.examId} value={exam.examId}>
                {exam.examName}
              </option>
            ))}
        </select>

        <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
      </div>

      {/* User List */}
      {selectedExamId && assignedUsers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {assignedUsers.length > 0 &&
            assignedUsers.map((u, index) => {
              const initials = u.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                    {u.firstName[0] + u.lastName[0] || <User size={18} />}
                  </div>

                  {/* Info */}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {u.firstName + " " + u.lastName || "Unnamed User"}
                    </p>
                    <p className="text-xs text-gray-500">ID: {u.partyId}</p>
                    <p className="text-xs text-gray-500">
                      Allowed Attempts: {u.partyId}
                    </p>
                    <p className="text-xs text-gray-500">
                      Timeout Days: {u.partyId}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Empty States */}
      {selectedExamId && assignedUsers.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <User className="mx-auto mb-2 opacity-50" />
          No users assigned to this exam
        </div>
      )}

      {!selectedExamId && (
        <div className="text-center py-10 text-gray-400">
          <Users className="mx-auto mb-2 opacity-50" />
          Select an exam to view users
        </div>
      )}
    </div>
  );
}
