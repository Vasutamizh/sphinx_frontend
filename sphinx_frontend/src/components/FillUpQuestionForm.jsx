import {
  FormErrorMessage,
  MandatoryInp,
  Section,
  TextInput,
} from "../styles/common.styles";
import FormHint from "./FormHint";

function FillUpQuestionForm({ fillAnswer, setFillAnswer, errors }) {
  return (
    <div>
      <FormHint>Enter the correct answer in below textbox</FormHint>
      <Section>
        <label>
          Correct Answer <MandatoryInp>*</MandatoryInp>
        </label>
        <TextInput
          value={fillAnswer}
          onChange={(e) => setFillAnswer(e.target.value)}
          placeholder="Enter correct answer"
        />
        {errors.fillAnswer && (
          <FormErrorMessage>{errors.fillAnswer}</FormErrorMessage>
        )}
      </Section>
    </div>
  );
}

export default FillUpQuestionForm;
