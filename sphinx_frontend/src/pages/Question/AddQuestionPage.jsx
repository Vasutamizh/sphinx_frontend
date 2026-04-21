import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DescriptiveQuestionForm from "../../components/DescriptiveQuestionForm";
import FillUpQuestionForm from "../../components/FillUpQuestionForm";
import MultipleChoicQuestionForm from "../../components/MultipleChoicQuestionForm";
import SingleChoiceQuestionForm from "../../components/SingleChoiceQuestionForm";
import ButtonWithLoading from "../../components/StyledButton";
import TopicModal from "../../components/TopicFormModal";
import TrueFalseQuestionForm from "../../components/TrueFalseQuestionForm";
import useAPI from "../../hooks/useAPI";
import { useTopics } from "../../hooks/useTopics";
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
  StyledTextarea,
} from "../../styles/common.styles";

import { useSelector } from "react-redux";
import { failureToast, successToast } from "../../utils/toast";
import { validateQuestionForm } from "../../utils/ValidateQuestionForm";

function AddQuestionPage() {
  const { apiGet, apiPost, apiPut, isError } = useAPI();

  // getting states from redux.
  const DEFAULT_OPTIONS_COUNT = useSelector(
    (state) => state.question.DEFAULT_OPTIONS_COUNT,
  );

  const location = useLocation();
  const questionForUpdate = location.state;

  const { topics, createTopic, openModal, setOpenModal } = useTopics();

  const [loading, setLoading] = useState(false);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [state, setState] = useState({
    questionDetail: questionForUpdate?.questionDetail || "",
    currentTab: questionForUpdate?.questionType || "",
    selectedTopic: questionForUpdate?.topicId || "",
    difficultyLevel: questionForUpdate?.difficultyLevel || "Easy",
    options:
      Array(
        questionForUpdate?.optionA,
        questionForUpdate?.optionB,
        questionForUpdate?.optionC,
        questionForUpdate?.optionD,
      ) || Array(DEFAULT_OPTIONS_COUNT).fill(""),
    errors: {},
  });

  const [answer, setAnswer] = useState({
    SINGLE_CHOICE: "",
    MULTIPLE_CHOICE: "",
    FILL_UP: "",
    TRUE_FALSE: "",
    DETAILED_ANSWER: "",
  });

  // ==========================================API CALLS====================================

  useEffect(() => {
    update("errors", {});
    if (questionForUpdate) {
      // set Answers for Question Upadate (Not for New Questions)
      if (questionForUpdate.questionType === "MULTIPLE_CHOICE") {
        storeAnswer("MULTIPLE_CHOICE", questionForUpdate.answer.split(","));
      } else {
        storeAnswer(questionForUpdate.questionType, questionForUpdate.answer);
      }
    }

    const getTypes = async () => {
      try {
        console.log("== API CALL FOR QUESTION TYPES ==");
        const response = await apiGet("/questions/questionTypes");
        if (!isError(response)) {
          if (response.data) {
            setQuestionTypes(response.data);
          }
        } else {
          failureToast(
            response.errorMessage || response.error || "Failed to Load Data!",
          );
        }
      } catch (err) {
        console.error("Error While fetching Question Types => ", err);
        failureToast("Something Went Wrong! Try Again Later!");
      }
    };
    getTypes();
  }, []);

  const storeAnswer = (key, value) => {
    answer[key] = value;
    // const newObj = { ...answer, key: value };
    // setAnswer(newObj);
    setAnswer((prev) => {
      prev[key] = value;
      return { ...prev };
    });
  };

  const update = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const errors = validateQuestionForm(state, answer);
    update("errors", errors);
    // console.log("Errors => ", errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setState({
      questionDetail: "",
      currentTab: "",
      selectedTopic: "",
      difficultyLevel: "Easy",
      options: Array(DEFAULT_OPTIONS_COUNT).fill(""),
      answerValue: "",
      errors: {},
    });

    setAnswer({
      SINGLE_CHOICE: "",
      MULTIPLE_CHOICE: "",
      FILL_UP: "",
      TRUE_FALSE: "",
      DETAILED_ANSWER: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("Before Validation!");
    if (!validate()) return;
    // console.log("After Validation!");

    let finalAnswer = answer[state.currentTab];
    let numOfAnswers = 1;

    if (state.currentTab === "MULTIPLE_CHOICE") {
      numOfAnswers = finalAnswer.length;
      finalAnswer = finalAnswer.join(",");
    } else {
      numOfAnswers = 1;
    }

    const payload = {
      questionDetail: state.questionDetail,
      questionType: state.currentTab,
      topicId: state.selectedTopic,
      optionA: state.options[0],
      optionB: state.options[1],
      optionC: state.options[2],
      optionD: state.options[3],
      answer: finalAnswer,
      numAnswers: numOfAnswers,
      difficultyLevel: state.difficultyLevel,
      answerValue: finalAnswer,
    };

    // console.log("Payload => ", payload);

    update("errors", {});

    try {
      setLoading(true);
      let res;

      if (questionForUpdate) {
        payload.questionId = questionForUpdate.questionId;
        res = await apiPut("/questions", payload);
      } else {
        res = await apiPost("/questions", payload);
      }

      if (isError(res)) {
        failureToast(
          res.errorMessage || res.error || "Failed to perform action!",
        );
      } else {
        successToast(res.successMessage || "Question Created Successfully!");
        resetForm();
      }
    } catch {
      failureToast("Something went wrong");
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
                  <option value={item.topicId} key={idx}>
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
            <StyledTextarea
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

        {/* form based on the tab selection  */}

        {state.currentTab === "MULTIPLE_CHOICE" && (
          <MultipleChoicQuestionForm
            options={state.options}
            updateState={update}
            selectedAnswers={answer["MULTIPLE_CHOICE"]}
            errors={state.errors}
            storeAnswer={storeAnswer}
          />
        )}

        {state.currentTab === "SINGLE_CHOICE" && (
          <SingleChoiceQuestionForm
            options={state.options}
            updateState={update}
            answer={answer}
            errors={state.errors}
            storeAnswer={storeAnswer}
          />
        )}
        {state.currentTab === "FILL_UP" && (
          <FillUpQuestionForm
            answer={answer}
            errors={state.errors}
            storeAnswer={storeAnswer}
          />
        )}
        {state.currentTab === "DETAILED_ANSWER" && (
          <DescriptiveQuestionForm
            answer={answer}
            errors={state.errors}
            storeAnswer={storeAnswer}
          />
        )}

        {state.currentTab === "TRUE_FALSE" && (
          <TrueFalseQuestionForm
            errors={state.errors}
            answer={answer}
            storeAnswer={storeAnswer}
          />
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
            buttonText={
              questionForUpdate !== null ? "Update Question" : "Add Question +"
            }
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
