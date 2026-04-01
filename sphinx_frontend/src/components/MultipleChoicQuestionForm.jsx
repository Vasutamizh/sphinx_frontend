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
  updateState,
  selectedAnswers,
  errors,
}) {
  const handleCheck = (idx) => {
    let newAnswers = [];
    if (selectedAnswers.includes(idx)) {
      newAnswers = selectedAnswers.filter((i) => i !== idx);
    } else {
      newAnswers = [...selectedAnswers, idx];
    }
    updateState("selectedAnswers", newAnswers);
  };

  // useEffect(() => {
  //   console.log("selectedAnswers => ", selectedAnswers);
  // }, [selectedAnswers]);

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
      {errors.answers && <FormErrorMessage>{errors.answers}</FormErrorMessage>}
    </div>
  );
}

export default MultipleChoicQuestionForm;
