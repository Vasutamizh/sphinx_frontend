import {
  FormErrorMessage,
  HelperText,
  MandatoryInp,
  Section,
  StyledTextarea,
} from "../styles/common.styles";

function DescriptiveQuestionForm({
  descriptiveAnswer,
  setDescriptiveAnswer,
  errors,
}) {
  return (
    <Section>
      <label>
        Answer <MandatoryInp>*</MandatoryInp>{" "}
        <HelperText>Max 50 words</HelperText>
      </label>
      <StyledTextarea
        value={descriptiveAnswer}
        onChange={(e) => setDescriptiveAnswer(e.target.value)}
        placeholder="Enter detailed answer"
      />
      {errors.descriptiveAnswer && (
        <FormErrorMessage>{errors.descriptiveAnswer}</FormErrorMessage>
      )}
    </Section>
  );
}

export default DescriptiveQuestionForm;
