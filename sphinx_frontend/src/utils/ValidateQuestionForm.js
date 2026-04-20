export const validateQuestionForm = (state, answer) => {
  const { questionDetail, selectedTopic, currentTab, options } = state;

  const errors = {};

  if (!questionDetail || !questionDetail.trim()) {
    errors.questionDetail = "Question is required";
  }

  if (!selectedTopic) {
    errors.topic = "Please select a topic";
  }

  if (!currentTab) {
    errors.questionType = "Please select a question type";
  }

  // console.log("currentTab => ", currentTab);
  if (currentTab === "MULTIPLE_CHOICE" || currentTab === "SINGLE_CHOICE") {
    options.forEach((opt, idx) => {
      if (!opt || !opt.trim()) {
        errors[`option_${idx}`] = `Option ${idx + 1} is required`;
      }
    });

    if (currentTab === "SINGLE_CHOICE") {
      if (!answer["SINGLE_CHOICE"]) {
        errors.singleAnswer = "Select the correct answer";
      }
    }

    if (currentTab === "MULTIPLE_CHOICE") {
      // console.log("Multiple CHoice => ", answer["MULTIPLE_CHOICE"]);
      if (
        !answer["MULTIPLE_CHOICE"] ||
        answer["MULTIPLE_CHOICE"].length === 0
      ) {
        errors.answers = "Select Atleast One Correct Answer";
      }
    }
  }

  if (currentTab === "FILL_UP" && !answer["FILL_UP"]) {
    errors.answerValue = "Answer is required";
  }

  if (currentTab === "TRUE_FALSE" && !answer["TRUE_FALSE"]) {
    errors.answerValue = "Answer is required";
  }

  if (currentTab === "DETAILED_ANSWER" && !answer["DETAILED_ANSWER"]) {
    errors.answerValue = "Answer is required";
  }

  return errors;
};
