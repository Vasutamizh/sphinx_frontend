import {
  FormErrorMessage,
  HelperText,
  MandatoryInp,
  OptionRow,
  Section,
  TextInput,
} from "../styles/common.styles";
import FormHint from "./FormHint";

function SingleChoiceQuestionForm({
  options,
  setOptions,
  singleAnswer,
  setSingleAnswer,
  errors,
}) {
  return (
    <div>
      <FormHint>
        Enter all options and mark the correct answer by clicking it.
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
                type="radio"
                name="singleAnswer"
                checked={singleAnswer === idx}
                onChange={() => setSingleAnswer(idx)}
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
      {errors.singleAnswer && (
        <FormErrorMessage>{errors.singleAnswer}</FormErrorMessage>
      )}
    </div>
  );
}

export default SingleChoiceQuestionForm;
