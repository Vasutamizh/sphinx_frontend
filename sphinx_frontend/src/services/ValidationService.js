export const emailValidator = (value) => {
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    return "";
  } else {
    return "Invalid Email Format";
  }
};

export const passwordValidator = (value) => {
  if (
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      value,
    )
  ) {
    return "";
  } else {
    console.log("Password validation failed => ", value);

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
  msg = passwordValidator(formData.password);

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

  if (!formData.userName) {
    errors.userName = "User Login Id is required";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  }

  return errors;
};

export const ExamFormValidation = (formData) => {
  let errors = {};
  if (!formData.examName) {
    errors.examName = "Exam Name  is required";
  }
  if (!formData.description) {
    errors.description = "Exam Description is required";
  }
  if (!formData.noOfQuestions) {
    errors.noOfQuestions = "Number of question is required";
  }
  if (formData.noOfQuestions > 100) {
    errors.noOfQuestions = " Total no of questions should be less than 100";
  }
  if (!formData.duration) {
    errors.duration = "Exam Duration is required ";
  }
  if (formData.duration > 180) {
    errors.duration = "Exam duration should be less than 180 minutes";
  }
  if (!formData.passPercentage) {
    errors.passPercentage = "Exam Pass Percentage is required ";
  }
  if (formData.passPercentage > 100) {
    errors.passPercentage = "Pass percentage should be less than 100";
  }
  if (!formData.questionsRandomized) {
    errors.questionsRandomized = "Question Random option is required ";
  }
  if (!formData.answersMust) {
    errors.answersMust = "Minimun Answers to attend is required";
  }
  if (formData.answersMust > formData.noOfQuestions) {
    errors.answersMust = "Minimum answers should be less than total questions";
  }
  if (formData.allowNegativeMarks && formData.allowNegativeMarks === "1") {
    if (!formData.negativeMarkValue) {
      errors.negativeMarkValue = "Negative Marks is required ";
    }
  }
  if (!formData.allowNegativeMarks) {
    errors.allowNegativeMarks = "Negative Marks is required ";
  }
  return errors;
};

export const validateTopicForm = (
  selectedTopicId,
  percentage,
  examTopics,
  editTopicId,
) => {
  const errors = {};
  if (!selectedTopicId) errors.selectedTopicId = "Please select a topic.";
  if (!percentage || percentage <= 0 || percentage > 100)
    errors.percentage = "Enter a valid percentage (1–100).";

  // check total % doesn't exceed 100
  const othersTotal = examTopics
    .filter((t) => t.topicId !== editTopicId)
    .reduce((sum, t) => sum + Number(t.percentage), 0);
  if (!errors.percentage && othersTotal + Number(percentage) > 100)
    errors.percentage = `Only ${100 - othersTotal}% remaining.`;

  return errors;
};
