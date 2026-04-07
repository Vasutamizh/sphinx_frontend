import { StyledButton } from "../../styles/common.styles";
import Modal from "../Modal";

function ConfimationModal({ isOpen, onClose, onOk, onCancel, message }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Confirmation Required!"}
      subtitle={"You are Performing a Critical Operation!"}
      type={"warning"}
      size={"80%"}
    >
      <div className="text-center flex flex-col items-center">
        <span className="font-bold text-md">{message}</span>
        <div className="flex gap-10 my-5">
          <StyledButton type="button" onClick={onOk}>
            Yes Proceed!
          </StyledButton>
          <StyledButton type="button" onClick={onCancel}>
            Cancel
          </StyledButton>
        </div>
      </div>
    </Modal>
  );
}

export default ConfimationModal;
