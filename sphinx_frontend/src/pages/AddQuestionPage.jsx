import { useEffect, useState } from "react";
import { toast } from "sonner";
import DescriptiveQuestionForm from "../components/DescriptiveQuestionForm";
import FillUpQuestionForm from "../components/FillUpQuestionForm";
import MultipleChoicQuestionForm from "../components/MultipleChoicQuestionForm";
import SingleChoiceQuestionForm from "../components/SingleChoiceQuestionForm";
import ButtonWithLoading from "../components/StyledButton";
import TopicModal from "../components/TopicFormModal";
import TrueFalseQuestionForm from "../components/TrueFalseQuestionForm";
import { useQuestionForm } from "../hooks/useQuestionForm";
import { useTopics } from "../hooks/useTopics";
import { apiPost } from "../services/ApiService";
import {
  BlackInputLabel,
  Form,
  FormErrorMessage,
  HiddenRadio,
  MandatoryInp,
  RadioButton,
  RadioLabel,
  RadioWrapper,
  StyledButton,
  StyledSelect,
  TextInput,
} from "../styles/common.styles";
import { useQuestionConfig } from "../utils/questionConfig";

function AddQuestionPage() {
  const [loading, setLoading] = useState(false);
  const { state, update, computedAnswer, validate, resetForm } =
    useQuestionForm();

  useEffect(() => {
    update("errors", {});
  }, []);

  const { topics, createTopic, openModal, setOpenModal } = useTopics();

  const { questionTypes } = useQuestionConfig();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Before Validation!");
    if (!validate()) return;
    console.log("After Validation!");
    const payload = {
      questionDetail: state.questionDetail,
      questionType: state.currentTab,
      topicId: state.selectedTopic,
      optionA: state.options[0],
      optionB: state.options[1],
      optionC: state.options[2],
      optionD: state.options[3],
      answer: computedAnswer,
      numAnswers: state.selectedAnswers.length,
      difficultyLevel: state.difficultyLevel,
      answerValue: computedAnswer,
    };

    update("errors", {});

    try {
      setLoading(true);
      const res = await apiPost("/questions", payload);

      if (res.responseMessage === "success") {
        toast.success(res.successMessage, { position: "top-right" });
        resetForm();
      } else {
        toast.error(res.errorMessage, { position: "top-right" });
      }
    } catch {
      toast.error("Something went wrong", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {openModal && (
        <TopicModal
          isOpen={openModal}
          onSave={createTopic}
          onClose={() => setOpenModal(false)}
        />
      )}

      <h1>Add Question Screen</h1>
      <Form>
        <div>
          <BlackInputLabel htmlFor="topicId">
            Select Topic <MandatoryInp>*</MandatoryInp>
          </BlackInputLabel>
          <div className="flex gap-5 items-center">
            <StyledSelect
              value={state.selectedTopic}
              onChange={(e) => update("selectedTopic", e.target.value)}
            >
              <option value={""}>Select any topic</option>
              {topics &&
                topics.map((item, idx) => (
                  <option
                    selected={idx === 0 ? true : false}
                    value={item.topicId}
                    key={idx}
                  >
                    {item.topicName}
                  </option>
                ))}
            </StyledSelect>
            <StyledButton type="button" onClick={() => setOpenModal(true)}>
              Add Topic
            </StyledButton>
          </div>
          {state.errors.topic && (
            <FormErrorMessage>{state.errors.topic}</FormErrorMessage>
          )}
        </div>

        <div>
          <BlackInputLabel htmlFor="questionType">
            Question Type <MandatoryInp>*</MandatoryInp>
          </BlackInputLabel>
          <RadioWrapper>
            {questionTypes &&
              questionTypes.map((item, idx) => (
                <RadioLabel key={idx}>
                  {/* {console.log("idx =>", item)} */}
                  <HiddenRadio
                    name="questionType"
                    value={item.description}
                    checked={state.currentTab === item.enumId}
                    onChange={() => update("currentTab", item.enumId)}
                  />
                  <RadioButton>{item.description}</RadioButton>
                </RadioLabel>
              ))}
          </RadioWrapper>
          {state.errors.questionType && (
            <FormErrorMessage>{state.errors.questionType}</FormErrorMessage>
          )}
        </div>

        {/* Question */}

        <div className="flex gap-5">
          <div className="flex-2">
            <BlackInputLabel>
              Enter the Question <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <TextInput
              value={state.questionDetail}
              onChange={(e) => update("questionDetail", e.target.value)}
              placeholder="Enter your question"
            />
            {state.errors.questionDetail && (
              <FormErrorMessage>{state.errors.questionDetail}</FormErrorMessage>
            )}
          </div>
          <div>
            <BlackInputLabel>
              Select the Difficulty Level <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <StyledSelect
              onChange={(e) => update("difficultyLevel", e.target.value)}
              value={state.difficultyLevel}
            >
              <option value="Easy" selected={true}>
                Easy
              </option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </StyledSelect>
          </div>
        </div>

        {/* Difficulty Level */}

        {/* form based on the tab selection  */}
        {state.currentTab === "MULTIPLE_CHOICE" && (
          <MultipleChoicQuestionForm
            options={state.options}
            updateState={update}
            selectedAnswers={state.selectedAnswers}
            errors={state.errors}
          />
        )}
        {state.currentTab === "SINGLE_CHOICE" && (
          <SingleChoiceQuestionForm
            options={state.options}
            updateState={update}
            errors={state.errors}
          />
        )}
        {state.currentTab === "FILL_UP" && (
          <FillUpQuestionForm
            answerValue={state.answerValue}
            updateState={update}
            errors={state.errors}
          />
        )}
        {state.currentTab === "DETAILED_ANSWER" && (
          <DescriptiveQuestionForm
            descriptiveAnswer={state.answerValue}
            updateState={update}
            errors={state.errors}
          />
        )}

        {state.currentTab === "TRUE_FALSE" && (
          <TrueFalseQuestionForm errors={state.errors} updateState={update} />
        )}

        <div className="flex gap-5 mt-5">
          <StyledButton type="button" onClick={resetForm}>
            Clear
          </StyledButton>
          {/* <StyledButton type="button" onClick={handleSubmit}>
            Submit
          </StyledButton> */}
          <ButtonWithLoading
            isLoading={loading}
            buttonText={"Add Question +"}
            onAction={handleSubmit}
          />
          {/* <StyledButton type="button" onClick={handleSubmit}>
            Submit & Add another
          </StyledButton> */}
        </div>
      </Form>
    </div>
  );
}

export default AddQuestionPage;
