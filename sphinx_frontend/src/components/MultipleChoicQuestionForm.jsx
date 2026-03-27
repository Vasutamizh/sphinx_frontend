import {
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
  singleAnswer,
  setSelectedAnswers,
  errors,
}) {
  return (
    <div>
      <FormHint>
        Enter all options and mark the correct answer(s) using the checkbox.
      </FormHint>
      <Section>
        <h4>
          Options <MandatoryInp>*</MandatoryInp>
          <HelperText>All options are mandatory</HelperText>
        </h4>

        {options.map((opt, idx) => (
          <div>
            <OptionRow key={idx}>
              <input
                type="checkbox"
                name={idx}
                checked={singleAnswer === idx}
                onChange={() => {
                  setSelectedAnswers(
                    (prev) =>
                      prev.includes(idx)
                        ? prev.filter((i) => i !== idx) // remove if already selected
                        : [...prev, idx], // add if not selected
                  );
                }}
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
      {errors.answer && <FormErrorMessage>{errors.answer}</FormErrorMessage>}
    </div>
  );
}

export default MultipleChoicQuestionForm;
