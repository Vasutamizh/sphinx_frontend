import { useState } from "react";
import { failureToast } from "../../utils/toast";

export default function AssignUserModal({ isOpen, onClose, onAssign, user }) {
  const [allowedAttempts, setAllowedAttempts] = useState(1);
  const [timeoutDays, setTimeoutDays] = useState(3);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (allowedAttempts <= 0 || allowedAttempts > 5) {
      failureToast("Allowed attempts must be between 1 and 5");
      return;
    }

    if (timeoutDays < 0 || timeoutDays > 5) {
      failureToast("Timeout days must be between 0 and 5");
      return;
    }

    onAssign({
      allowedAttempts,
      timeoutDays,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Assign User</h2>

        <p className="mb-4 text-gray-600">
          {user?.firstName} {user?.lastName}
        </p>

        {/* Allowed Attempts */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Allowed Attempts</label>
          <input
            type="number"
            value={allowedAttempts}
            onChange={(e) => setAllowedAttempts(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Timeout Days */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Timeout Days</label>
          <input
            type="number"
            value={timeoutDays}
            onChange={(e) => setTimeoutDays(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Assign User
          </button>
        </div>
      </div>
    </div>
  );
}
