import { Trash2 } from "lucide-react";
import { FcCancel } from "react-icons/fc";
import { apiDelete } from "../../services/ApiService";
import { failureToast, successToast } from "../../utils/toast";
import Modal from "../Modal";

function DeleteExamModal({ open, onClose, examId, onDeleteSuccess, message }) {
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
      type={"warning"}
    >
      <div className="bg-white rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800">{message}</h3>

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
