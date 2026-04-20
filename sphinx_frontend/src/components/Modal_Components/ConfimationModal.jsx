import { Button } from "@/components/ui/button";
import Modal from "../Modal";

function ConfimationModal({
  isOpen,
  onClose,
  onOk,
  onCancel,
  message,
  type = "warning",
}) {
  // console.log("type => ", type);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Confirmation Required!"}
      subtitle={"You are Performing a Critical Operation and can't be undone!"}
      type={type}
      size={"40%"}
    >
      <div className="text-center flex flex-col items-center">
        <span className="font-bold text-md">{message}</span>
        <div className="flex gap-10 my-5">
          <Button
            size="lg"
            type="button"
            onClick={() => {
              onOk();
              onClose();
            }}
          >
            Yes Proceed!
          </Button>
          <Button size="lg" variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfimationModal;
