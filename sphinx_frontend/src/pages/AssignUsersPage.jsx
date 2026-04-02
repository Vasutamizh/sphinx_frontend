import { AlignLeft, Clock, FileText, HelpCircle, Percent } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiGet, apiPost } from "../services/ApiService";
import { failureToast, successToast } from "../utils/toast";

const usersMock = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Alice Smith" },
  { id: 3, name: "David Johnson" },
  { id: 4, name: "Priya Kumar" },
];

export default function AssignUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [attemptsAllowed, setAttempts] = useState("");
  const [timeoutDays, setTimeoutValue] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);

  // getting exam from state location.
  const location = useLocation();
  const exam = location.state?.exam || null;

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await apiGet("/auth/getAllUsers");
      if (response.responseMessage && response.responseMessage === "success") {
        setUsers(response.users);
      } else {
        failureToast(response.errorMessage || response.error);
      }
    };

    getAllUsers();
  }, []);

  const handleAddUser = () => {
    if (!selectedUserId || !attemptsAllowed || !timeoutDays) return;

    const user = users.find((u) => u.partyId === selectedUserId);

    const newEntry = {
      ...user,
      examId: exam.examId,
      attemptsAllowed,
      timeoutDays,
    };

    setAssignedUsers([...assignedUsers, newEntry]);

    // Reset form
    setSelectedUserId("");
    setAttempts("");
    setTimeoutValue("");
  };

  const handleRemove = (id) => {
    setAssignedUsers(assignedUsers.filter((u) => u.id !== id));
  };

  const handleSubmit = async () => {
    if (assignedUsers.length === 0) {
      alert("Please assign at least one user.");
      return;
    }

    // Prepare payload
    const payload = {
      users: assignedUsers.map((user) => ({
        partyId: user.partyId,
        examId: exam.examId,
        allowedAttempts: parseInt(user.attemptsAllowed),
        timeoutDays: Number(user.timeoutDays),
      })),
    };

    console.log("Final Payload:", payload);

    const response = await apiPost("/exam/assignUser", payload);

    if (response.responseMessage && response.responseMessage === "success") {
      successToast(response.successMessage || "User Assigned Successfully!");
    } else {
      failureToast(response.errorMessage || response.error || "Action Failed!");
    }

    setAssignedUsers([]);
  };

  if (exam) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Assign Users to Exam
        </h2>

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

        {/* Form Card */}
        <div className="bg-white shadow-md rounded-xl p-5 mb-6">
          <div className="flex items-center gap-4">
            <div>
              <label className="font-bold" htmlFor="userSelect">
                Select User
              </label>
              {/* User Dropdown */}
              <select
                id="userSelect"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.partyId} value={user.partyId}>
                    {user.firstName +
                      " " +
                      user.lastName +
                      " ( " +
                      user.partyId +
                      " ) "}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold" htmlFor="attempts">
                Allowed Attempts
              </label>
              {/* Attempts */}
              <input
                type="number"
                id="attempts"
                placeholder="Allowed Attempts"
                value={attemptsAllowed}
                onChange={(e) => setAttempts(e.target.value)}
                className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="font-bold" htmlFor="timeout">
                Exam Timeout in Days
              </label>
              {/* Timeout */}
              <input
                type="number"
                id="timeout"
                placeholder="Exam Timeout(days)"
                value={timeoutDays}
                onChange={(e) => setTimeoutValue(e.target.value)}
                className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              {/* Add Button */}
              <button
                onClick={handleAddUser}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 flex items-center justify-center gap-2 mt-5"
              >
                {/* Plus Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Assign
              </button>
            </div>
          </div>
        </div>

        {/* Assigned Users */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Assigned Users
          </h3>

          {assignedUsers.length === 0 ? (
            <p className="text-gray-500">No users assigned yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {assignedUsers.map((user) => (
                <div
                  key={user.partyId}
                  className="bg-gray-50 border rounded-xl p-4 flex justify-between items-center shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {user.firstName +
                        " " +
                        user.lastName +
                        " ( " +
                        user.partyId +
                        " ) "}
                    </p>
                    <p className="text-sm text-gray-600">
                      Attempts: {user.attemptsAllowed} | Timeout:{" "}
                      {user.timeoutDays} days
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(user.id)}
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg 
             bg-gradient-to-r from-red-500 to-pink-500 
             text-white shadow-md 
             hover:from-red-600 hover:to-pink-600 
             hover:shadow-lg hover:scale-105 
             transition-all duration-200"
                  >
                    {/* Trash Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg 
               hover:bg-green-700 shadow-md hover:shadow-lg 
               transition-all duration-200 flex items-center gap-2"
          >
            {/* Check Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Submit All
          </button>
        </div>
      </div>
    );
  } else {
    return <>Not Found</>;
  }
}
