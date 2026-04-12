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

function SingleChoiceQuestionForm({
  options,
  updateState,
  answer,
  errors,
  storeAnswer,
}) {
  const idxIdentifier = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
  };
  // const [isChecked, setIsChecked] = useState("");
  const singleChoiceAnswer = answer["SINGLE_CHOICE"];
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
                checked={singleChoiceAnswer === idxIdentifier[idx]}
                style={{ cursor: "pointer" }}
                onChange={() => {
                  storeAnswer("SINGLE_CHOICE", idxIdentifier[idx]);
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
