import { useEffect, useState } from "react";
import { toast } from "sonner";
import DescriptiveQuestionForm from "../components/DescriptiveQuestionForm";
import FillUpQuestionForm from "../components/FillUpQuestionForm";
import MultipleChoicQuestionForm from "../components/MultipleChoicQuestionForm";
import SingleChoiceQuestionForm from "../components/SingleChoiceQuestionForm";
import TopicModal from "../components/TopicFormModal";
import { apiGet, apiPost } from "../services/ApiService";
import {
  BlackInputLabel,
  ErrorBox,
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

function AddQuestionPage() {
  const [responseError, setResponseError] = useState("");

  const [topics, setTopics] = useState(() => {});
  // [
  //   { enumId: "MULTIPLE_CHOICE", description: "Multiple Choice" },
  //   { enumId: "SINGLE_CHOICE", description: "Single Choice" },
  //   { enumId: "FILL_UP", description: "Fill Ups" },
  //   { enumId: "DETAILED_ANSWER", description: "Descriptive Answer" },
  // ]
  const [questioTypes, setQuestionTypes] = useState(() => {});
  const [currentTab, setCurrentTab] = useState(null);

  const [selectedTopic, setSelectedTopic] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [singleAnswer, setSingleAnswer] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [fillAnswer, setFillAnswer] = useState("");
  const [descriptiveAnswer, setDescriptiveAnswer] = useState("");
  const [isAddTopic, setIsAddTopic] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const getAllQuestionTypes = async () => {
      const response = await apiGet("/questions/questionTypes");
      if (response.responseMessage && response.responseMessage === "success") {
        setQuestionTypes(response.data);
      } else {
        setResponseError(response.errorMessage);
        setQuestionTypes([]);
      }
    };

    getAllQuestionTypes();

    const getAllTopics = async () => {
      const response = await apiGet("/topics");
      if (response.responseMessage && response.responseMessage === "success") {
        setTopics(response.topicList);
      } else {
        setResponseError(response.errorMessage);
        toast.error("API Call was unsuccessful", { position: "top-center" });
        setTopics([]);
      }
    };

    getAllTopics();
  }, []);

  const createTopic = async (topicName) => {
    const response = await apiPost("/topics", { topicName });
    if (response.responseMessage && response.responseMessage === "success") {
      toast.success(response.successMessage, { position: "top-right" });
    } else {
      toast.success(response.errorMessage, { position: "top-right" });
    }
  };

  // Validation

  const validateForm = () => {
    const newErrors = {};

    if (!questionText.trim()) {
      newErrors.questionText = "Question is required";
    }

    if (!selectedTopic) {
      newErrors.topic = "Please select a topic";
    }

    // MCQ (both single & multi)
    if (currentTab === "SINGLE_CHOICE" || currentTab === "MULTI_CHOICE") {
      options.forEach((opt, idx) => {
        if (!opt.trim()) {
          newErrors[`option_${idx}`] = `Option ${idx + 1} is required`;
        }
      });

      if (currentTab === "MCQ_SINGLE" && singleAnswer === "") {
        newErrors.singleAnswer = "Select the correct answer";
      }

      if (currentTab === "MCQ_MULTI" && options.length === 0) {
        newErrors.answers = "Select at least one correct answer";
      }
    }

    // Fill up
    if (currentTab === "FILL_UP" && !fillAnswer.trim()) {
      newErrors.fillAnswer = "Answer is required";
    }

    // Descriptive
    if (currentTab === "DETAILED_ANSWER" && !descriptiveAnswer.trim()) {
      newErrors.descriptiveAnswer = "Answer is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateForm()) return;
    setErrors({});

    const formData = {
      questionDetail: questionText,
      questionType: currentTab,
      topicId: selectedTopic,
      optionA: options[0],
      optionB: options[1],
      optionC: options[2],
      optionD: options[3],
      answer: fillAnswer,
      numAnswers: `${selectedAnswers.length}`,
      difficultyLevel: "2",
      answerValue: fillAnswer,
    };

    const response = await apiPost("/questions", formData);
    if (response.responseMessage && response.responseMessage === "success") {
      toast.success(response.successMessage, { position: "top-right" });
    } else {
      toast.error(response.errorMessage, { position: "top-right" });
    }
  };

  return (
    <div>
      {isAddTopic && (
        <TopicModal
          isOpen={isAddTopic}
          onSave={createTopic}
          onClose={() => setIsAddTopic(false)}
        />
      )}

      <h1>Add Question Screen</h1>
      {responseError && <ErrorBox>{responseError}</ErrorBox>}
      <Form>
        <div>
          <BlackInputLabel htmlFor="topicId">
            Select Topic <MandatoryInp>*</MandatoryInp>
          </BlackInputLabel>
          <div className="flex gap-5 items-center">
            <StyledSelect onChange={(e) => setSelectedTopic(e.target.value)}>
              {topics &&
                topics.map((item, idx) => (
                  <option value={item.topicId} key={idx}>
                    {item.topicName}
                  </option>
                ))}
            </StyledSelect>
            <StyledButton type="button" onClick={() => setIsAddTopic(true)}>
              Add Topic
            </StyledButton>
          </div>
          <FormErrorMessage>{errors.topic}</FormErrorMessage>
        </div>

        <div>
          <BlackInputLabel htmlFor="questionType">
            Question Type <MandatoryInp>*</MandatoryInp>
          </BlackInputLabel>
          <RadioWrapper>
            {questioTypes &&
              questioTypes.map((item, idx) => (
                <RadioLabel key={idx}>
                  <HiddenRadio
                    name="questionType"
                    value={item.enumId}
                    checked={currentTab === item.enumId}
                    onChange={() => setCurrentTab(item.enumId)}
                  />
                  <RadioButton>{item.description}</RadioButton>
                </RadioLabel>
              ))}
          </RadioWrapper>
        </div>

        {/* Question */}

        <div className="flex gap-5">
          <div className="flex-2">
            <BlackInputLabel>
              Enter the Question <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <TextInput
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question"
            />
            <FormErrorMessage>{errors.questionText}</FormErrorMessage>
          </div>
          <div>
            <BlackInputLabel>
              Select the Difficulty Level <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <StyledSelect>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </StyledSelect>
          </div>
        </div>

        {/* Difficulty Level */}

        <BlackInputLabel className="mt-5">Enter the Answer</BlackInputLabel>

        {/* form based on the tab selection  */}
        {currentTab === "MULTIPLE_CHOICE" && (
          <MultipleChoicQuestionForm
            options={options}
            setOptions={setOptions}
            singleAnswer={singleAnswer}
            setSelectedAnswers={setSelectedAnswers}
            errors={errors}
          />
        )}
        {currentTab === "SINGLE_CHOICE" && (
          <SingleChoiceQuestionForm
            options={options}
            setOptions={setOptions}
            singleAnswer={singleAnswer}
            setSingleAnswer={setSingleAnswer}
            errors={errors}
          />
        )}
        {currentTab === "FILL_UP" && (
          <FillUpQuestionForm
            fillAnswer={fillAnswer}
            setFillAnswer={setFillAnswer}
            errors={errors}
          />
        )}
        {currentTab === "DETAILED_ANSWER" && (
          <DescriptiveQuestionForm
            descriptiveAnswer={descriptiveAnswer}
            setDescriptiveAnswer={setDescriptiveAnswer}
            errors={errors}
          />
        )}

        <div className="flex gap-5 mt-5">
          <StyledButton type="button">Clear</StyledButton>
          <StyledButton type="button" onClick={handleSubmit}>
            Submit
          </StyledButton>
          <StyledButton type="button" onClick={handleSubmit}>
            Submit & Add another
          </StyledButton>
        </div>
      </Form>
    </div>
  );
}

export default AddQuestionPage;
