import { useState } from "react";
import { toast } from "sonner";
import ButtonWithLoading from "../components/StyledButton";
import { apiPost } from "../services/ApiService";
import {
  FormErrorMessage,
  MandatoryInp,
  TextInput,
} from "../styles/common.styles";
import { emailValidator } from "../utils/ValidationService";
import { failureToast, successToast } from "../utils/toast";

function AddUser() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    peopleWiseId: "",
    firstName: "",
    lastName: "",
    email: "",
    dept: "",
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
      peopleWiseId: "",
      firstName: "",
      lastName: "",
      email: "",
      dept: "",
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!state.peopleWiseId)
      newErrors.peopleWiseId = "People Wise ID is Required";
    if (!state.firstName) newErrors.firstName = "Firstname is Required";
    if (!state.lastName) newErrors.lastName = "Lastname is Required";

    if (!state.email) newErrors.email = "Email is Required";

    const emailErr = emailValidator(state.email);
    if (emailErr) newErrors.email = emailErr;

    if (!state.dept) newErrors.dept = "Department is Required";

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
      setLoading(true);
      const addUser = async () => {
        const response = await apiPost("/auth/signup", payload);
        if (
          response.responseMessage &&
          response.responseMessage === "success"
        ) {
          successToast(response.successMessage);
          clearForm();
        } else {
          failureToast(response.errorMessage);
        }
      };

      addUser();
    } catch (err) {
      toast.error("Someting went wrong!", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add User</h1>

      <div>
        <div>
          <label>
            PeopleWise ID <MandatoryInp>*</MandatoryInp>
          </label>
          <TextInput
            value={state.peopleWiseId}
            onChange={(e) => handleChange("peopleWiseId", e.target.value)}
            placeholder="Enter employee people wise ID"
            error={errors.peopleWiseId}
          />
          {errors.peopleWiseId && (
            <FormErrorMessage>{errors.peopleWiseId}</FormErrorMessage>
          )}
        </div>

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
          {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
        </div>

        <div>
          <label>
            Department <MandatoryInp>*</MandatoryInp>
          </label>
          <TextInput
            label="Department"
            value={state.dept}
            onChange={(e) => handleChange("dept", e.target.value)}
            placeholder="Enter employee department"
          />
          {errors.dept && <FormErrorMessage>{errors.dept}</FormErrorMessage>}
        </div>
      </div>

      <div>
        <ButtonWithLoading
          loading={loading}
          onAction={handleSubmit}
          buttonText={"Add User +"}
        />
      </div>
    </div>
  );
}

export default AddUser;
