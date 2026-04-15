import { useState } from "react";
import { useDispatch } from "react-redux";
import { apiPost, apiPut } from "../../services/ApiService";
import { loaderActions } from "../../store/LoaderReducer";
import {
  FormErrorMessage,
  MandatoryInp,
  TextInput,
} from "../../styles/common.styles";
import { failureToast, successToast } from "../../utils/toast";
import { emailValidator } from "../../utils/ValidationService";
import Modal from "../Modal";
import ButtonWithLoading from "../StyledButton";

function UserAddUpdateModal({ isOpen, onClose, user, updateUsers }) {
  //   console.log("User => ", user);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearForm = () => {
    setState({
      firstName: "",
      lastName: "",
      email: "",
      dept: "",
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!state.firstName) newErrors.firstName = "Firstname is Required";
    if (!state.lastName) newErrors.lastName = "Lastname is Required";

    if (!state.email) newErrors.email = "Email is Required";

    const emailErr = emailValidator(state.email);
    if (emailErr) newErrors.email = emailErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    let payload = {
      ...state,
      role: "user",
    };

    try {
      dispatch(loaderActions.loaderOn());
      const addUser = async () => {
        let response;
        if (user) {
          payload.partyId = user.partyId;
          response = await apiPost("/auth/signup", payload);
        } else {
          response = await apiPut("/auth", payload);
        }

        if (
          response.responseMessage &&
          response.responseMessage === "success"
        ) {
          successToast(response.successMessage);
          clearForm();
          updateUsers(payload); // update the users array in the parent comp.
          onClose();
        } else {
          failureToast(response.errorMessage || response.error);
        }
      };

      addUser();
    } catch (err) {
      failureToast("Someting went wrong!", { position: "top-right" });
    } finally {
      // setLoading(false);
      dispatch(loaderActions.loaderOff());
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        type={"create"}
        onClose={onClose}
        title={"Create A New User"}
        subtitle={"Please Enter all the Mandatory Details!"}
      >
        <form>
          <div className="rounded-xl p-3">
            <div className="flex flex-col gap-4">
              <div>
                <label>
                  First Name <MandatoryInp>*</MandatoryInp>
                </label>
                <TextInput
                  label="First Name"
                  value={state.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Enter employee first name"
                  error={errors.firstName}
                />
                {errors.firstName && (
                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                )}
              </div>

              <div>
                <label>
                  Last Name <MandatoryInp>*</MandatoryInp>
                </label>
                <TextInput
                  label="Last Name"
                  value={state.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Enter employee last name"
                  error={errors.lastName}
                />
                {errors.lastName && (
                  <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                )}
              </div>

              <div>
                <label>
                  Email Address <MandatoryInp>*</MandatoryInp>
                </label>
                <TextInput
                  label="Mail ID"
                  value={state.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter employee email address"
                />
                {errors.email && (
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                )}
              </div>
            </div>
            <div>
              <ButtonWithLoading
                type="button"
                loading={false}
                onAction={handleSubmit}
                buttonText={"Add User +"}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UserAddUpdateModal;
