import {
  BlackInputLabel,
  FormErrorMessage,
  MandatoryInp,
  Section,
  TextInput,
} from "../styles/common.styles";
import FormHint from "./FormHint";

function FillUpQuestionForm({ answerValue, updateState, errors }) {
  return (
    <div>
      <BlackInputLabel className="mt-5">Enter the Answer</BlackInputLabel>
      <FormHint>
        <strong>Tip - </strong> Enter the correct answer in below textbox
      </FormHint>
      <Section>
        <label>
          Correct Answer <MandatoryInp>*</MandatoryInp>
        </label>
        <TextInput
          value={answerValue}
          onChange={(e) => updateState("answerValue", e.target.value)}
          placeholder="Enter correct answer"
        />
        {errors.answerValue && (
          <FormErrorMessage>{errors.answerValue}</FormErrorMessage>
        )}
      </Section>
    </div>
  );
}

export default FillUpQuestionForm;
