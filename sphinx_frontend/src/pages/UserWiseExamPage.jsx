import { BookOpen, CheckCircle, ChevronDown, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../services/ApiService";
import { failureToast } from "../utils/toast";

const UserExamDashboard = () => {
  // const users = [
  //   { id: 1, name: "Arjun" },
  //   { id: 2, name: "Priya" },
  // ];

  // const exams = [
  //   {
  //     id: 101,
  //     userId: 1,
  //     title: "Math Final",
  //     status: "completed",
  //     date: "2026-03-20",
  //   },
  //   {
  //     id: 102,
  //     userId: 1,
  //     title: "Physics Midterm",
  //     status: "pending",
  //   },
  // ];

  const [users, setUsers] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);

  const userExams = exams.filter((exam) => exam.userId === selectedUser?.id);

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await apiGet("/auth/getAllUsers");

      if (response.responseMessage && response.responseMessage === "success") {
        setUsers(response.users || []);
      } else {
        failureToast(
          response.errorMessage || response.error || "Failed to load data!",
        );
        setUsers([]);
      }
    };

    getAllUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    const getAssignedExams = async () => {
      const response = await apiPost("/exam/getAllExamAssignedForUser", {
        partyId: selectedUser.partyId,
      });

      if (response.responseMessage && response.responseMessage === "success") {
        setExams(response.data || []);
      } else {
        failureToast(
          response.errorMessage || response.error || "Failed to load data!",
        );
        setExams([]);
      }
    };

    getAssignedExams();
  }, [selectedUser]);

  useEffect(() => {
    console.log("exams =>", exams);
  }, [exams]);

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <User className="text-blue-600" />
        User Exams Dashboard
      </h2>

      {/* Dropdown */}
      <div className="relative w-full max-w-sm mb-8">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center border rounded-xl px-4 py-3 bg-white shadow-sm hover:shadow-md transition"
        >
          <span className="text-gray-700">
            {selectedUser
              ? selectedUser.firstName + " " + selectedUser.lastName
              : "Select a user"}
          </span>
          <ChevronDown
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute w-full mt-2 bg-white border rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.partyId}
                onClick={() => {
                  setSelectedUser(user);
                  setOpen(false);
                }}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition flex items-center gap-2"
              >
                <User size={16} />
                {user.firstName + " " + user.lastName}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exams Section */}
      <div>
        {selectedUser ? (
          userExams.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-5">
              {userExams.map((exam) => (
                <div
                  key={exam.examId}
                  className="p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg transition border"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BookOpen size={18} className="text-indigo-600" />
                      {exam.examName}
                    </h3>

                    <span
                      className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full ${
                        exam.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {exam.status === "completed" ? (
                        <CheckCircle size={14} />
                      ) : (
                        <Clock size={14} />
                      )}
                      {exam.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3">
                    {exam.description || "No description available"}
                  </p>

                  <div className="text-sm font-bold text-gray-400">
                    No of Questions: {exam.noOfQuestions || "N/A"}
                  </div>
                  <div className="text-sm font-bold text-gray-400">
                    Duration: {exam.duration + " Mins" || "N/A"}
                  </div>
                  <div className="text-sm font-bold text-gray-400">
                    Allowed Attemps: {exam.allowedAttempts || "N/A"}
                  </div>
                  <div className="text-sm font-bold text-gray-400">
                    Pass Percentage: {exam.passPercentage + " %" || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <Placeholder />
        )}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-16">
    <BookOpen className="mx-auto text-gray-300 mb-4" size={40} />
    <h3 className="text-lg font-semibold text-gray-600">No exams assigned</h3>
    <p className="text-gray-400 text-sm">
      This user doesn't have any exams yet.
    </p>
  </div>
);

const Placeholder = () => (
  <div className="text-center py-16">
    <User className="mx-auto text-gray-300 mb-4" size={40} />
    <h3 className="text-lg font-semibold text-gray-600">Select a user</h3>
    <p className="text-gray-400 text-sm">
      Choose a user to view assigned exams.
    </p>
  </div>
);

export default UserExamDashboard;
