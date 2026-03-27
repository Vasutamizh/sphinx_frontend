import { useEffect } from "react";
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

function MultipleChoicQuestionForm({
  options,
  setOptions,
  selectedAnswers,
  setSelectedAnswers,
  errors,
}) {
  const handleCheck = (idx) => {
    setSelectedAnswers((prev) => {
      if (prev.includes(idx)) {
        return prev.filter((i) => i !== idx);
      } else {
        return [...prev, idx];
      }
    });
  };

  useEffect(() => {
    console.log("selectedAnswers => ", selectedAnswers);
  }, [selectedAnswers]);

  return (
    <div>
      <BlackInputLabel className="mt-5">Enter the Answer</BlackInputLabel>
      <FormHint>
        <strong>Tip - </strong> Enter all options and mark the correct answer(s)
        using the checkbox.
      </FormHint>
      <Section>
        <h4>
          Options <MandatoryInp>*</MandatoryInp>
          <HelperText>All options are mandatory</HelperText>
        </h4>

        {options.map((opt, idx) => (
          <div key={idx}>
            <OptionRow key={idx}>
              <input
                type="checkbox"
                name="check"
                checked={selectedAnswers.includes(idx) === true}
                onChange={() => handleCheck(idx)}
              />

              <TextInput
                value={opt}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[idx] = e.target.value;
                  setOptions(newOptions);
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
      {errors.answers && <FormErrorMessage>{errors.answers}</FormErrorMessage>}
    </div>
  );
}

export default MultipleChoicQuestionForm;
