import { useEffect, useState } from "react";
import { apiGet } from "../services/ApiService";

export function useQuestionConfig() {
  const [questionTypes, setQuestionTypes] = useState([]);

  useEffect(() => {
    const getTypes = async () => {
      const response = await apiGet("/questions/questionTypes");
      if (response.data) {
        setQuestionTypes(response.data);
        console.log("Question types set!");
      }
    };
    getTypes();
  }, []);

  return {
    questionTypes,
  };
}

export const QUESTION_TYPES = {
  SINGLE: "SINGLE_CHOICE",
  MULTIPLE: "MULTIPLE_CHOICE",
  FILL_UP: "FILL_UP",
  TRUE_FALSE: "TRUE_FALSE",
  DETAILED: "DETAILED_ANSWER",
};

const types = apiGet("/questions/questionTypes").then((res) => res);

console.log("Types response", types);

export const DEFAULT_OPTIONS_COUNT = 4;

export const QUESTION_TYPE_META = {
  [QUESTION_TYPES.SINGLE]: { hasOptions: true, multi: false },
  [QUESTION_TYPES.MULTIPLE]: { hasOptions: true, multi: true },
  [QUESTION_TYPES.FILL_UP]: { hasOptions: false },
  [QUESTION_TYPES.TRUE_FALSE]: { hasOptions: false },
  [QUESTION_TYPES.DETAILED]: { hasOptions: false },
};
