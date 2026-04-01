import { useState } from "react";
import {
  BlackInputLabel,
  FormErrorMessage,
  OptionRow,
  Section,
  TextInput,
} from "../styles/common.styles";
import FormHint from "./FormHint";

function TrueFalseQuestionForm({ errors, updateState }) {
  const options = [
    { key: "True", value: "true" },
    { key: "False", value: "false" },
  ];
  const [isChecked, setIsChecked] = useState("");
  return (
    <div>
      <BlackInputLabel className="mt-5">Enter the Answer</BlackInputLabel>
      <FormHint>
        <strong>Tip -</strong> Select the true or false as answer
      </FormHint>
      <Section>
        <label>Select One Answer</label>

        {options.map((opt, idx) => (
          <div key={idx}>
            <OptionRow>
              <input
                value={opt.value}
                type="radio"
                name="singleAnswer"
                checked={isChecked === idx}
                onChange={() => {
                  updateState("answerValue", opt.value);
                  setIsChecked(idx);
                }}
                style={{ cursor: "pointer" }}
              />

              <TextInput
                htmlFor="singleAnswer"
                value={opt.key}
                readOnly={true}
                disabled={true}
              />
            </OptionRow>
            {errors[`option_${idx}`] && (
              <FormErrorMessage>{errors[`option_${idx}`]}</FormErrorMessage>
            )}
          </div>
        ))}

        {errors.answerValue && (
          <FormErrorMessage>{errors.answerValue}</FormErrorMessage>
        )}
      </Section>
    </div>
  );
}

export default TrueFalseQuestionForm;
