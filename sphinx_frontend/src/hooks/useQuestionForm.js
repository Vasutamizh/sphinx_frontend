import { useMemo, useState } from "react";
import { validateQuestionForm } from "../utils/ValidateQuestionForm";
import { DEFAULT_OPTIONS_COUNT, QUESTION_TYPES } from "../utils/questionConfig";

export const useQuestionForm = (questionForUpdate) => {
  const [state, setState] = useState({
    questionDetail: "",
    currentTab: "",
    selectedTopic: "",
    difficultyLevel: "Easy",
    options: Array(DEFAULT_OPTIONS_COUNT).fill(""),
    selectedAnswers: [],
    answerValue: "",
    errors: {},
  });

  const update = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const computedAnswer = useMemo(() => {
    if (state.currentTab === QUESTION_TYPES.MULTIPLE) {
      return state.selectedAnswers.join(",");
    }
    return state.answerValue;
  }, [state.currentTab, state.selectedAnswers, state.answerValue]);

  const validate = () => {
    const errors = validateQuestionForm(state);
    update("errors", errors);
    // console.log("Errors => ", errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setState({
      questionDetail: "",
      currentTab: "",
      selectedTopic: "",
      difficultyLevel: "Easy",
      options: Array(DEFAULT_OPTIONS_COUNT).fill(""),
      selectedAnswers: [],
      answerValue: "",
      errors: {},
    });
  };

  return {
    state,
    update,
    computedAnswer,
    validate,
    resetForm,
  };
};
