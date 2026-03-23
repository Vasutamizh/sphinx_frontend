export const emailValidator = (value) => {
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    return "";
  } else {
    return "Invalid Email Format";
  }
};

export const passwordValidator = (value) => {
  if (
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]).{8,}$/.test(
      value,
    )
  ) {
    return "";
  } else {
    return "Password should contain 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Numeric and 8-16 characters long.";
  }
};

export const signupFormValidator = (formData) => {
  const errors = {};

  // Username validation
  if (!formData.userName) {
    errors.userName = "Username is required";
  } else if (!/^[a-zA-Z0-9]{3,15}$/.test(formData.userName)) {
    errors.userName =
      "Username must be 3–15 characters and contain only letters and numbers";
  }

  // First Name validation
  if (!formData.firstName) {
    errors.firstName = "First name is required";
  } else if (!/^[A-Za-z]+$/.test(formData.firstName)) {
    errors.firstName = "First name must contain only letters";
  }

  // Last Name validation
  if (!formData.lastName) {
    errors.lastName = "Last name is required";
  } else if (!/^[A-Za-z]+$/.test(formData.lastName)) {
    errors.lastName = "Last name must contain only letters";
  }

  if (!formData.mobileNo) {
    errors.mobileNo = "Mobile number is required";
  }

  // email validation
  let msg = emailValidator(formData.email);

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (msg) {
    errors.email = msg;
  }

  // password validation
  msg = passwordValidator(formData.email);

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (msg) {
    errors.password = msg;
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Password is required";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Password and confirm password should be same";
  }

  return errors;
};

export const loginFormValidator = (formData) => {
  let errors = {};

  if (!formData.userLoginId) {
    errors.username = "User Login Id is required";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  }

  return errors;
};
