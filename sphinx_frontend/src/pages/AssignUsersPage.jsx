import { useState } from "react";

const usersMock = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Alice Smith" },
  { id: 3, name: "David Johnson" },
  { id: 4, name: "Priya Kumar" },
];

export default function AssignUsers() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [attempts, setAttempts] = useState("");
  const [timeout, setTimeoutValue] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);

  const handleAddUser = () => {
    if (!selectedUserId || !attempts || !timeout) return;

    const user = usersMock.find((u) => u.id === Number(selectedUserId));

    const newEntry = {
      ...user,
      attempts,
      timeout,
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

  const handleSubmit = () => {
    if (assignedUsers.length === 0) {
      alert("Please assign at least one user.");
      return;
    }

    // Prepare payload
    const payload = assignedUsers.map((user) => ({
      partyId: user.id,
      attempts: Number(user.attempts),
      timeoutDays: Number(user.timeout),
    }));

    console.log("Final Payload:", payload);

    // 👉 CALL YOUR API HERE
    // await api.assignUsersToExam(payload);

    // Optional: Reset after submit
    setAssignedUsers([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Assign Users to Exam
      </h2>

      {/* Form Card */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6 border">
        <div className="grid md:grid-cols-4 gap-4">
          {/* User Dropdown */}
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select User</option>
            {usersMock.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {/* Attempts */}
          <input
            type="number"
            placeholder="Attempts"
            value={attempts}
            onChange={(e) => setAttempts(e.target.value)}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          />

          {/* Timeout */}
          <input
            type="number"
            placeholder="Timeout (days)"
            value={timeout}
            onChange={(e) => setTimeoutValue(e.target.value)}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          />

          {/* Add Button */}
          <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 flex items-center justify-center gap-2"
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
                key={user.id}
                className="bg-gray-50 border rounded-xl p-4 flex justify-between items-center shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">
                    Attempts: {user.attempts} | Timeout: {user.timeout} days
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
}
