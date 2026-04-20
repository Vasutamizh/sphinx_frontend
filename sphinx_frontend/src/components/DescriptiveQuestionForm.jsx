import {
  BlackInputLabel,
  FormErrorMessage,
  HelperText,
  MandatoryInp,
  Section,
  StyledTextarea,
} from "../styles/common.styles";
import FormHint from "./FormHint";

function DescriptiveQuestionForm({ answer, errors = {}, storeAnswer, isExam }) {
  const descriptiveAnswer = answer["DETAILED_ANSWER"];
  return (
    <div>
      <BlackInputLabel className="mt-5">Enter the Answer</BlackInputLabel>
      {isExam === false && (
        <FormHint>
          <strong>Tip - </strong> Enter the correct answer in below textbox
        </FormHint>
      )}
      <Section>
        <label>
          Answer <MandatoryInp>*</MandatoryInp>{" "}
          <HelperText>Max 50 words</HelperText>
        </label>
        <StyledTextarea
          value={descriptiveAnswer}
          onChange={(e) => {
            storeAnswer("DETAILED_ANSWER", e.target.value);
          }}
          placeholder="Enter detailed answer"
        />
        {errors.answerValue && (
          <FormErrorMessage>{errors.answerValue}</FormErrorMessage>
        )}
      </Section>
    </div>
  );
}

export default DescriptiveQuestionForm;
