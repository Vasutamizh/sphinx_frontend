import { apiPost, isError } from "../../services/ApiService";
import { StyledButton, TextInput } from "../../styles/common.styles";
import { failureToast, successToast } from "../../utils/toast";
import Modal from "../Modal";

function EditAssignedUserModal({
  open,
  userForEdit,
  examId = "",
  onClose,
  setUser,
  onSuccessUpdate,
}) {
  if (!userForEdit) return;
  if (!onSuccessUpdate) return;

  const { user, flag } = userForEdit;

  if (!flag) return;

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

  const udateState = (key, value) => {
    const updatedUser = { ...user };
    updatedUser[key] = value;
    console.log("updated User => ", updatedUser);
    setUser({ user: updatedUser, flag });
  };

  const updateUser = async () => {
    if (flag === "AU") {
      if (!examId) {
        console.log("Exam Details Missing!");
        return;
      }
      // api call here
      const payload = {
        examId: examId,
        partyId: user.partyId,
        allowedAttempts: user.allowedAttempts,
        timeoutDays: user.timeoutDays,
      };

      const response = await apiPost("/exam/updateAssignedUser", payload);

      if (isError(response)) {
        failureToast(response.errorMessage || "Failed to Update the User!");
        return;
      } else {
        successToast(response.successMessage || "User Updated Successfully!");
      }
    }

    onSuccessUpdate(userForEdit);

    onClose();
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
              value={user.allowedAttempts}
              onChange={(e) => udateState("allowedAttempts", e.target.value)}
              placeholder="Allowed Attepts"
            />
          </div>
          <div>
            <label>Timeout in Days</label>
            <TextInput
              type="text"
              value={user.timeoutDays}
              onChange={(e) => udateState("timeoutDays", e.target.value)}
              placeholder="Exam Timeout"
            />
          </div>
          <StyledButton
            type="button"
            onClick={updateUser}
            style={{ marginTop: 20 }}
          >
            Update
          </StyledButton>
        </form>
      </Modal>
    </>
  );
}

export default EditAssignedUserModal;
