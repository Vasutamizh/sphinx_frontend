import React from "react";
import { FcCancel } from "react-icons/fc";
import { Trash2 } from "lucide-react";
import { apiDelete } from "../../services/ApiService";
import Modal from "../Modal";
import { successToast, failureToast } from "../../utils/toast";

function DeleteExamModal({ open, onClose, examId, onDeleteSuccess }) {
  if (!open) return null;

  const handleDelete = async () => {
    try {
      const response = await apiDelete("/exam", { examId });

      if (response?.responseMessage && response.responseMessage === "success") {
        successToast(response.successMessage || "Exam deleted successfully!");
        onDeleteSuccess(examId); 
        onClose();
      } else {
        failureToast(response?.errorMessage || "Failed to delete exam");
      }
    } catch (error) {
      failureToast("An unexpected error occurred while deleting the exam.");
    }
  };

  return (
    <Modal
      title={"Confirmation Required!"}
      subtitle={"This action cannot be undone."}
      isOpen={open}
      onClose={onClose}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Are you sure you want to delete this exam?
        </h3>

        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            <Trash2 size={18} />
            Delete
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition duration-200"
          >
            <FcCancel size={18} />
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteExamModal;
