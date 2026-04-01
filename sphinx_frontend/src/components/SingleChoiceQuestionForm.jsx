import { useState } from "react";
import {
  BlackInputLabel,
  FormErrorMessage,
  HelperText,
  MandatoryInp,
  OptionRow,
  Section,
  TextInput,
} from "../styles/common.styles";
import FormHint from "./FormHint";

function SingleChoiceQuestionForm({ options, updateState, errors }) {
  const [isChecked, setIsChecked] = useState("");
  return (
    <div>
      <BlackInputLabel className="mt-5">Enter the Answer</BlackInputLabel>
      <FormHint>
        <strong>Tip -</strong> Enter all options and mark the correct answer by
        clicking it.
      </FormHint>

      <Section>
        <h4>
          Options <MandatoryInp>*</MandatoryInp>
          <HelperText>All options are mandatory</HelperText>
        </h4>

        {options.map((opt, idx) => (
          <div key={idx}>
            <OptionRow>
              <input
                type="radio"
                name="singleAnswer"
                checked={isChecked === idx}
                style={{ cursor: "pointer" }}
                onChange={() => {
                  updateState("answerValue", options[idx]);
                  setIsChecked(idx);
                }}
              />

              <TextInput
                value={opt}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[idx] = e.target.value;
                  updateState("options", newOptions);
                }}
                placeholder={`Option ${idx + 1}`}
              />
            </OptionRow>
            {errors[`option_${idx}`] && (
              <FormErrorMessage>{errors[`option_${idx}`]}</FormErrorMessage>
            )}
          </div>
        ))}
      </Section>
      {errors.singleAnswer && (
        <FormErrorMessage>{errors.singleAnswer}</FormErrorMessage>
      )}
    </div>
  );
}

export default SingleChoiceQuestionForm;
