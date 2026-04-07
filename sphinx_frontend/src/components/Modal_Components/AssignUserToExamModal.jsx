import { useEffect, useState } from "react";
import { StyledSelect, TextInput } from "../../styles/common.styles";
import Modal from "../Modal";

function AssignUserToExamModal({
  isOpen,
  exam,
  users,
  newlyAssignedUsers,
  alreadyAssignedUsers,
  setNewlyAssignedUsers,
  onClose,
}) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [allowedAttempts, setAttempts] = useState("");
  const [timeoutDays, setTimeoutValue] = useState("");

  const handleAddUser = () => {
    if (!selectedUserId || !allowedAttempts || !timeoutDays) return;

    const user = users.find((u) => u.partyId === selectedUserId);

    const isAlreadyPresent =
      newlyAssignedUsers.find((u) => u.partyId === selectedUserId) &&
      alreadyAssignedUsers.find((u) => u.partyId === selectedUserId);

    if (isAlreadyPresent) {
      return;
    }

    const newEntry = {
      ...user,
      examId: exam.examId,
      allowedAttempts,
      timeoutDays,
    };

    setNewlyAssignedUsers([...newlyAssignedUsers, newEntry]);

    // Reset form
    setSelectedUserId("");
    setAttempts("");
    setTimeoutValue("");

    onClose();
  };

  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((u) => {
        const isAlreadAssigned = alreadyAssignedUsers.find(
          (au) => au.partyId === u.partyId,
        );
        const isNewlyAssigned = newlyAssignedUsers.find(
          (nu) => nu.partyId === u.partyId,
        );

        return !(isAlreadAssigned || isNewlyAssigned);
      }),
    );
  }, [users, alreadyAssignedUsers, newlyAssignedUsers]);

  return (
    <Modal
      isOpen={isOpen}
      type={"create"}
      onClose={onClose}
      title={"Assign New User to Exam"}
      subtitle={"Assign the users!"}
    >
      <form>
        <div className="rounded-xl p-3">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start">
              <label className="font-bold" htmlFor="userSelect">
                Select User
              </label>
              {/* User Dropdown */}
              <StyledSelect
                id="userSelect"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="bordered border-gray-500 w-full rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select User</option>
                {filteredUsers.map((user) => (
                  <option key={user.partyId} value={user.partyId}>
                    {user.firstName +
                      " " +
                      user.lastName +
                      " ( " +
                      user.partyId +
                      " ) "}
                  </option>
                ))}
              </StyledSelect>
            </div>

            <div className="flex flex-col items-start">
              <label className="font-bold" htmlFor="attempts">
                Allowed Attempts
              </label>
              {/* Attempts */}
              <TextInput
                type="number"
                id="attempts"
                placeholder="Allowed Attempts"
                value={allowedAttempts}
                onChange={(e) => setAttempts(e.target.value)}
                className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col items-start">
              <label className="font-bold" htmlFor="timeout">
                Exam Timeout in Days
              </label>
              {/* Timeout */}
              <TextInput
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
                type="button"
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
      </form>
    </Modal>
  );
}

export default AssignUserToExamModal;
