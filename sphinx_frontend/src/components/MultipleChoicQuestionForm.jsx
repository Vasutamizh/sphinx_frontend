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
  errors = {},
  storeAnswer,
  isExam = false,
}) {
  const idxIdentifier = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
  };
  const handleCheck = (idx) => {
    let newAnswers = [];
    let answer = idxIdentifier[idx];
    if (selectedAnswers.includes(answer)) {
      newAnswers = selectedAnswers.filter((i) => i !== answer);
    } else {
      // newAnswers.push(answer);
      newAnswers = [...selectedAnswers, answer];
    }
    if (updateState) {
      updateState("selectedAnswers", newAnswers);
    }
    storeAnswer("MULTIPLE_CHOICE", newAnswers);
  };

  // useEffect(() => {
  //   console.log("selectedAnswers => ", selectedAnswers);
  // }, [selectedAnswers]);

  return (
    <div>
      <BlackInputLabel className="mt-5">Enter the Answer</BlackInputLabel>
      {!isExam && (
        <FormHint>
          <strong>Tip - </strong> Enter all options and mark the correct
          answer(s) using the checkbox.
        </FormHint>
      )}
      <Section>
        <h4>
          Options
          {!isExam && (
            <>
              <MandatoryInp>*</MandatoryInp>
              <HelperText>All options are mandatory</HelperText>
            </>
          )}
        </h4>

        {options.map((opt, idx) => (
          <div key={idx}>
            <OptionRow key={idx}>
              <input
                type="checkbox"
                name="check"
                checked={selectedAnswers.includes(idxIdentifier[idx])}
                onChange={() => handleCheck(idx)}
                className="cursor-pointer"
              />

              <TextInput
                value={opt}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[idx] = e.target.value;
                  updateState("options", newOptions);
                }}
                placeholder={`Option ${idx + 1}`}
                disabled={isExam}
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
