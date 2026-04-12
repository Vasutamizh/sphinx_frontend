import { QUESTION_TYPES } from "./questionConfig";

export const validateQuestionForm = (state, answer) => {
  const {
    questionDetail,
    selectedTopic,
    currentTab,
    options,
    selectedAnswers,
    answerValue,
  } = state;

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

  if (
    currentTab === QUESTION_TYPES.SINGLE ||
    currentTab === QUESTION_TYPES.MULTIPLE
  ) {
    options.forEach((opt, idx) => {
      if (!opt || !opt.trim()) {
        errors[`option_${idx}`] = `Option ${idx + 1} is required`;
      }
    });

    if (currentTab === QUESTION_TYPES.SINGLE) {
      if (!answer[QUESTION_TYPES.SINGLE]) {
        errors.singleAnswer = "Select the correct answer";
      }
    }
    if (currentTab === QUESTION_TYPES.MULTIPLE) {
      if (
        !answer[QUESTION_TYPES.MULTIPLE] ||
        answer[QUESTION_TYPES.MULTIPLE].length === 0
      ) {
        errors.answers = "Select Atleast One Correct Answer";
      }
    }
  }

  if (
    currentTab === QUESTION_TYPES.FILL_UP &&
    !answer[QUESTION_TYPES.FILL_UP]
  ) {
    errors.answerValue = "Answer is required";
  }

  if (
    currentTab === QUESTION_TYPES.TRUE_FALSE &&
    !answer[QUESTION_TYPES.TRUE_FALSE]
  ) {
    errors.answerValue = "Answer is required";
  }

  if (
    currentTab === QUESTION_TYPES.DETAILED &&
    !answer[QUESTION_TYPES.DETAILED]
  ) {
    errors.answerValue = "Answer is required";
  }

  return errors;
};
