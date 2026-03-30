import { useEffect, useState } from "react";
import { toast } from "sonner";
import DescriptiveQuestionForm from "../components/DescriptiveQuestionForm";
import FillUpQuestionForm from "../components/FillUpQuestionForm";
import Loader from "../components/Loader";
import MultipleChoicQuestionForm from "../components/MultipleChoicQuestionForm";
import SingleChoiceQuestionForm from "../components/SingleChoiceQuestionForm";
import TopicModal from "../components/TopicFormModal";
import TrueFalseQuestionForm from "../components/TrueFalseQuestionForm";
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
  const [isLoading, setIsLoading] = useState(false);

  const [topics, setTopics] = useState([]);

  const [questioTypes, setQuestionTypes] = useState(() => {});
  const [currentTab, setCurrentTab] = useState(null);

  const [selectedTopic, setSelectedTopic] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [answerValue, setAnswerValue] = useState("");
  const [isAddTopic, setIsAddTopic] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const formData = {
      questionDetail: questionText,
      questionType: currentTab,
      topicId: selectedTopic,
      optionA: options[0],
      optionB: options[1],
      optionC: options[2],
      optionD: options[3],
      answer: answerValue,
      numAnswers: selectedAnswers.length,
      difficultyLevel,
      answerValue,
    };
    console.log("formData", formData);
  }, [
    selectedAnswers,
    questionText,
    currentTab,
    selectedTopic,
    options,
    answerValue,
    difficultyLevel,
  ]);

  useEffect(() => {
    const getAllQuestionTypes = async () => {
      setIsLoading(true);
      const response = await apiGet("/questions/questionTypes");
      if (response.responseMessage && response.responseMessage === "success") {
        setQuestionTypes(response.data);
      } else {
        setResponseError(response.errorMessage);
        setQuestionTypes([]);
        toast.error("Failed to get question types from server", {
          position: "top-right",
        });
      }
      setIsLoading(false);
    };

    getAllQuestionTypes();

    const getAllTopics = async () => {
      setIsLoading(true);
      const response = await apiGet("/topics");
      if (response.responseMessage && response.responseMessage === "success") {
        setTopics(response.topicList);
      } else {
        setResponseError(response.errorMessage);
        toast.error("Failed to get topics from server", {
          position: "top-right",
        });
        setTopics([]);
      }
      setIsLoading(false);
    };

    getAllTopics();
  }, []);

  useEffect(() => {
    setAnswerValue("");
  }, [currentTab]);

  useEffect(() => {
    if (!topics || topics.length <= 0) {
      return;
    } else {
      setSelectedTopic(topics[0].topicId);
    }

    setDifficultyLevel("Easy");
  }, [topics]);

  const createTopic = async (topicName) => {
    setIsLoading(true);
    const response = await apiPost("/topics", { topicName });
    if (response.responseMessage && response.responseMessage === "success") {
      // set locally the responded topic
      setTopics((prev) => {
        return [
          ...prev,
          { topicName: response.topicName, topicId: response.topicId },
        ];
      });
      toast.success(response.successMessage, { position: "top-right" });
    } else {
      toast.error(response.errorMessage, { position: "top-right" });
    }
    setIsLoading(false);
  };

  // Validation

  const validateForm = () => {
    setErrors({});
    const newErrors = {};

    if (!questionText || !questionText.trim()) {
      newErrors.questionText = "Question is required";
    }

    if (!selectedTopic) {
      newErrors.topic = "Please select a topic";
    }

    if (!currentTab) {
      newErrors.questionType = "Please select one topic!";
    }
    // MCQ (both single & multi)
    if (currentTab === "SINGLE_CHOICE" || currentTab === "MULTIPLE_CHOICE") {
      options.forEach((opt, idx) => {
        if (!opt.trim()) {
          newErrors[`option_${idx}`] = `Option ${idx + 1} is required`;
        }
      });

      if (currentTab === "SINGLE_CHOICE" && answerValue === "") {
        newErrors.singleAnswer = "Select the correct answer";
      }

      if (currentTab === "MULTIPLE_CHOICE" && selectedAnswers.length === 0) {
        newErrors.answers = "Select at least one correct answer";
      }
    }

    // Fill up
    if (
      currentTab === "FILL_UP" ||
      currentTab === "DETAILED_ANSWER" ||
      currentTab === "TRUE_FALSE"
    ) {
      if (!answerValue && !answerValue.trim()) {
        newErrors.answerValue = "Answer is required";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // combine options into single string with comma seperated.
      if (currentTab === "MULTIPLE_CHOICE") {
        setAnswerValue(selectedAnswers.join(","));
      }

      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = {
      questionDetail: questionText,
      questionType: currentTab,
      topicId: selectedTopic,
      optionA: options[0],
      optionB: options[1],
      optionC: options[2],
      optionD: options[3],
      answer: answerValue,
      numAnswers: selectedAnswers.length,
      difficultyLevel,
      answerValue,
    };

    setIsLoading(true);
    const response = await apiPost("/questions", formData);
    if (response.responseMessage && response.responseMessage === "success") {
      toast.success(response.successMessage, { position: "top-right" });
    } else {
      toast.error(response.errorMessage, { position: "top-right" });
    }

    setIsLoading(false);
  };

  const clearForm = () => {
    setOptions(["", "", "", ""]);
    setSelectedAnswers([]);
    setQuestionText("");
    setCurrentTab("");
    setAnswerValue("");
  };

  return (
    <div>
      {isLoading && <Loader />}
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
            <StyledSelect
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
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
          {errors.questionType && (
            <FormErrorMessage>{errors.questionType}</FormErrorMessage>
          )}
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
            <StyledSelect
              onChange={(e) => setDifficultyLevel(e.target.value)}
              value={difficultyLevel}
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
        {currentTab === "MULTIPLE_CHOICE" && (
          <MultipleChoicQuestionForm
            options={options}
            setOptions={setOptions}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
            errors={errors}
          />
        )}
        {currentTab === "SINGLE_CHOICE" && (
          <SingleChoiceQuestionForm
            options={options}
            setOptions={setOptions}
            setSingleAnswer={setAnswerValue}
            errors={errors}
          />
        )}
        {currentTab === "FILL_UP" && (
          <FillUpQuestionForm
            answerValue={answerValue}
            setAnswerValue={setAnswerValue}
            errors={errors}
          />
        )}
        {currentTab === "DETAILED_ANSWER" && (
          <DescriptiveQuestionForm
            descriptiveAnswer={answerValue}
            setDescriptiveAnswer={setAnswerValue}
            errors={errors}
          />
        )}

        {currentTab === "TRUE_FALSE" && (
          <TrueFalseQuestionForm
            errors={errors}
            setSingleAnswer={setAnswerValue}
          />
        )}

        <div className="flex gap-5 mt-5">
          <StyledButton type="button" onClick={clearForm}>
            Clear
          </StyledButton>
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
