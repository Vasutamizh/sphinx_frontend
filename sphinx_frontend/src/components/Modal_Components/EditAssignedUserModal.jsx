import { StyledButton, TextInput } from "../../styles/common.styles";
import Modal from "../Modal";

function EditAssignedUserModal({ open, user, onClose, setUser }) {
  const title =
    "Edit Assigned User" + " : " + user?.firstName + " " + user?.lastName;
  const modalType = "info";
  const subTittle =
    "Assigned User : " +
      user?.firstName +
      " " +
      user?.lastName +
      " - " +
      user.partyId || "N/A";

  const udateUser = (key, value) => {
    const updatedUser = { ...user, key: value };
    setUser(updatedUser);
  };

  // const handleUpdate = ();

  return (
    <>
      <Modal
        isOpen={open}
        title={title}
        type={modalType}
        subtitle={subTittle}
        onClose={onClose}
      >
        <form>
          <div>
            <label>Allowed Attempts</label>
            <TextInput
              type="text"
              value={user?.allowedAttempts}
              onChange={(e) => udateUser("allowedAttempts", e.target.value)}
              placeholder="Allowed Attepts"
            />
          </div>
          <div>
            <label>Timeout in Days</label>
            <TextInput
              type="text"
              value={user?.timeoutDays}
              onChange={(e) => udateUser("timeoutDays", e.target.value)}
              placeholder="Exam Timeout"
            />
          </div>
          <StyledButton style={{ marginTop: 20 }}>Update</StyledButton>
        </form>
      </Modal>
    </>
  );
}

export default EditAssignedUserModal;
