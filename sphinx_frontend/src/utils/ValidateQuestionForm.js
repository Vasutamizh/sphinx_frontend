import { QUESTION_TYPES } from "./questionConfig";

export const validateQuestionForm = (state) => {
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
      if (!opt.trim()) {
        errors[`option_${idx}`] = `Option ${idx + 1} is required`;
      }
    });

    if (currentTab === QUESTION_TYPES.SINGLE && !answerValue) {
      errors.singleAnswer = "Select the correct answer";
    }

    if (
      currentTab === QUESTION_TYPES.MULTIPLE &&
      selectedAnswers.length === 0
    ) {
      errors.answers = "Select at least one correct answer";
    }
  }

  if (
    [
      QUESTION_TYPES.FILL_UP,
      QUESTION_TYPES.TRUE_FALSE,
      QUESTION_TYPES.DETAILED,
    ].includes(currentTab)
  ) {
    if (!answerValue?.trim()) {
      errors.answerValue = "Answer is required";
    }
  }

  return errors;
};
