import {
  Alert,
  Button,
  Checkbox,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useAPI from "../../hooks/useAPI";
import { useTopics } from "../../hooks/useTopics";
import { validateQuestionForm } from "../../utils/ValidateQuestionForm";

function AddQuestionPage() {
  const { apiGet, apiPost, apiPut, isError } = useAPI();
  const DEFAULT_OPTIONS_COUNT = useSelector(
    (state) => state.question.DEFAULT_OPTIONS_COUNT,
  );
  const location = useLocation();
  const questionForUpdate = location.state;

  const { topics } = useTopics();

  const [loading, setLoading] = useState(false);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [questionType, setQuestionType] = useState(
    questionForUpdate?.questionType || "",
  );
  const [questionDetail, setQuestionDetail] = useState(
    questionForUpdate?.questionDetail || "",
  );
  const [selectedTopic, setSelectedTopic] = useState(
    questionForUpdate?.topicId || "",
  );
  const [difficultyLevel, setDifficultyLevel] = useState(
    questionForUpdate?.difficultyLevel || "Easy",
  );
  const [options, setOptions] = useState(
    questionForUpdate
      ? [
          questionForUpdate.optionA || "",
          questionForUpdate.optionB || "",
          questionForUpdate.optionC || "",
          questionForUpdate.optionD || "",
        ]
      : Array(DEFAULT_OPTIONS_COUNT).fill(""),
  );

  // Answer states per question type
  const [singleChoiceAnswer, setSingleChoiceAnswer] = useState("");
  const [multipleChoiceAnswer, setMultipleChoiceAnswer] = useState([]);
  const [fillUpAnswer, setFillUpAnswer] = useState("");
  const [trueFalseAnswer, setTrueFalseAnswer] = useState("");
  const [detailedAnswer, setDetailedAnswer] = useState("");

  const [errors, setErrors] = useState({});

  // Load question types on mount
  useEffect(() => {
    if (questionForUpdate) {
      if (questionForUpdate.questionType === "MULTIPLE_CHOICE") {
        setMultipleChoiceAnswer(questionForUpdate.answer.split(","));
      } else if (questionForUpdate.questionType === "SINGLE_CHOICE") {
        setSingleChoiceAnswer(questionForUpdate.answer);
      } else if (questionForUpdate.questionType === "FILL_UP") {
        setFillUpAnswer(questionForUpdate.answer);
      } else if (questionForUpdate.questionType === "TRUE_FALSE") {
        setTrueFalseAnswer(questionForUpdate.answer);
      } else if (questionForUpdate.questionType === "DETAILED_ANSWER") {
        setDetailedAnswer(questionForUpdate.answer);
      }
    }

    const getTypes = async () => {
      try {
        const response = await apiGet("/questions/questionTypes");
        if (!isError(response) && response.data) {
          setQuestionTypes(response.data);
        } else {
          notifications.show({
            title: "Error",
            message: response.errorMessage || "Failed to Load Question Types!",
            color: "red",
          });
        }
      } catch (err) {
        console.error(err);
        notifications.show({
          title: "Error",
          message: "Something Went Wrong! Try Again Later!",
          color: "red",
        });
      }
    };
    getTypes();
  }, []);

  const validate = () => {
    let currentAnswer = "";
    if (questionType === "SINGLE_CHOICE") currentAnswer = singleChoiceAnswer;
    else if (questionType === "MULTIPLE_CHOICE")
      currentAnswer = multipleChoiceAnswer;
    else if (questionType === "FILL_UP") currentAnswer = fillUpAnswer;
    else if (questionType === "TRUE_FALSE") currentAnswer = trueFalseAnswer;
    else if (questionType === "DETAILED_ANSWER") currentAnswer = detailedAnswer;

    const answerObj = {
      SINGLE_CHOICE: singleChoiceAnswer,
      MULTIPLE_CHOICE: multipleChoiceAnswer,
      FILL_UP: fillUpAnswer,
      TRUE_FALSE: trueFalseAnswer,
      DETAILED_ANSWER: detailedAnswer,
    };

    const stateObj = {
      questionDetail,
      currentTab: questionType,
      selectedTopic,
      difficultyLevel,
      options,
      errors,
    };

    const validationErrors = validateQuestionForm(stateObj, answerObj);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const resetForm = () => {
    setQuestionDetail("");
    setQuestionType("");
    setSelectedTopic("");
    setDifficultyLevel("Easy");
    setOptions(Array(DEFAULT_OPTIONS_COUNT).fill(""));
    setSingleChoiceAnswer("");
    setMultipleChoiceAnswer([]);
    setFillUpAnswer("");
    setTrueFalseAnswer("");
    setDetailedAnswer("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let finalAnswer = "";
    let numOfAnswers = 1;

    if (questionType === "MULTIPLE_CHOICE") {
      numOfAnswers = multipleChoiceAnswer.length;
      finalAnswer = multipleChoiceAnswer.join(",");
    } else if (questionType === "SINGLE_CHOICE") {
      finalAnswer = singleChoiceAnswer;
    } else if (questionType === "FILL_UP") {
      finalAnswer = fillUpAnswer;
    } else if (questionType === "TRUE_FALSE") {
      finalAnswer = trueFalseAnswer;
    } else if (questionType === "DETAILED_ANSWER") {
      finalAnswer = detailedAnswer;
    }

    const payload = {
      questionDetail,
      questionType,
      topicId: selectedTopic,
      optionA: options[0],
      optionB: options[1],
      optionC: options[2],
      optionD: options[3],
      answer: finalAnswer,
      numAnswers: numOfAnswers,
      difficultyLevel,
      answerValue: finalAnswer,
    };

    setLoading(true);
    try {
      let res;
      if (questionForUpdate) {
        payload.questionId = questionForUpdate.questionId;
        res = await apiPut("/questions", payload);
      } else {
        res = await apiPost("/questions", payload);
      }

      if (isError(res)) {
        notifications.show({
          title: "Error",
          message: res.errorMessage || res.error || "Failed to perform action!",
          color: "red",
        });
      } else {
        notifications.show({
          title: "Success",
          message:
            res.successMessage ||
            (questionForUpdate
              ? "Question Updated Successfully!"
              : "Question Created Successfully!"),
          color: "green",
        });
        resetForm();
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to update a specific option
  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Get answer for current question type
  const getCurrentAnswer = () => {
    switch (questionType) {
      case "SINGLE_CHOICE":
        return singleChoiceAnswer;
      case "MULTIPLE_CHOICE":
        return multipleChoiceAnswer;
      case "FILL_UP":
        return fillUpAnswer;
      case "TRUE_FALSE":
        return trueFalseAnswer;
      case "DETAILED_ANSWER":
        return detailedAnswer;
      default:
        return "";
    }
  };

  // Render dynamic form based on question type
  const renderQuestionTypeForm = () => {
    switch (questionType) {
      case "SINGLE_CHOICE":
        return (
          <Paper withBorder p="md" radius="md">
            <Radio.Group
              label="Select the correct answer"
              value={singleChoiceAnswer}
              onChange={setSingleChoiceAnswer}
              error={errors.answers}
              required
            >
              <Stack mt="xs">
                {options.map((opt, idx) => (
                  <Radio
                    key={idx}
                    value={opt}
                    label={`${String.fromCharCode(65 + idx)}. ${opt || "Empty option"}`}
                    disabled={!opt.trim()}
                  />
                ))}
              </Stack>
            </Radio.Group>
            {/* { errors.answers &&  } */}
          </Paper>
        );

      case "MULTIPLE_CHOICE":
        return (
          <Paper withBorder p="md" radius="md">
            <Checkbox.Group
              label="Select all correct answers"
              value={multipleChoiceAnswer}
              onChange={setMultipleChoiceAnswer}
              error={errors.answers}
              required
            >
              <Stack mt="xs">
                {options.map((opt, idx) => (
                  <Checkbox
                    key={idx}
                    value={opt}
                    label={`${String.fromCharCode(65 + idx)}. ${opt || "Empty option"}`}
                    disabled={!opt.trim()}
                  />
                ))}
              </Stack>
            </Checkbox.Group>
          </Paper>
        );

      case "FILL_UP":
        return (
          <Paper withBorder p="md" radius="md">
            <TextInput
              label="Correct Answer"
              placeholder="Enter the exact expected answer"
              value={fillUpAnswer}
              onChange={(e) => setFillUpAnswer(e.target.value)}
              error={errors.answerValue}
              required
            />
          </Paper>
        );

      case "TRUE_FALSE":
        return (
          <Paper withBorder p="md" radius="md">
            <Radio.Group
              label="Select the correct answer"
              value={trueFalseAnswer}
              onChange={setTrueFalseAnswer}
              error={errors.answerValue}
              required
            >
              <Group mt="xs">
                <Radio value="True" label="True" />
                <Radio value="False" label="False" />
              </Group>
            </Radio.Group>
          </Paper>
        );

      case "DETAILED_ANSWER":
        return (
          <Paper withBorder p="md" radius="md">
            <Textarea
              label="Expected Answer (Descriptive)"
              placeholder="Provide a model answer or key points"
              value={detailedAnswer}
              onChange={(e) => setDetailedAnswer(e.target.value)}
              error={errors.answerValue}
              minRows={4}
              required
            />
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <Container size="lg" py="xl">
      <LoadingOverlay visible={loading} overlayBlur={2} />
      {/* 
      <TopicModal
        isOpen={openModal}
        onSave={createTopic}
        onClose={() => setOpenModal(false)}
      /> */}

      <Paper shadow="md" radius="lg" p="xl" withBorder>
        <Title order={2} mb="lg" ta="center">
          {questionForUpdate ? "Edit Question" : "Add New Question"}
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            {/* Topic Selection */}
            <Grid>
              <Grid.Col span={{ base: 12, sm: 8 }}>
                <Select
                  label="Select Topic"
                  placeholder="Choose a topic"
                  value={selectedTopic}
                  onChange={setSelectedTopic}
                  data={topics?.map((t) => ({
                    value: t.topicId,
                    label: t.topicName,
                  }))}
                  error={errors.topic}
                  required
                  clearable
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Select
                  label="Difficulty Level"
                  value={difficultyLevel}
                  onChange={setDifficultyLevel}
                  data={[
                    { value: "Easy", label: "Easy" },
                    { value: "Medium", label: "Medium" },
                    { value: "Hard", label: "Hard" },
                  ]}
                />
                {/* <Button
                  fullWidth
                  mt="28px"
                  variant="outline"
                  onClick={() => setOpenModal(true)}
                >
                  + Add Topic
                </Button> */}
              </Grid.Col>
            </Grid>

            {/* Question Type */}
            <Radio.Group
              label="Question Type"
              value={questionType}
              onChange={setQuestionType}
              error={errors.questionType}
              required
            >
              <Group mt="xs">
                {questionTypes.map((type) => (
                  <Radio
                    key={type.enumId}
                    value={type.enumId}
                    label={type.description}
                  />
                ))}
              </Group>
            </Radio.Group>

            {/* Question Detail & Difficulty */}
            <Grid>
              <Grid.Col span={{ base: 12, md: 12 }}>
                <Textarea
                  label="Question"
                  placeholder="Enter your question here..."
                  value={questionDetail}
                  onChange={(e) => setQuestionDetail(e.target.value)}
                  error={errors.questionDetail}
                  resize="vertical"
                />
              </Grid.Col>
              {/* <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label="Difficulty Level"
                  value={difficultyLevel}
                  onChange={setDifficultyLevel}
                  data={[
                    { value: "Easy", label: "Easy" },
                    { value: "Medium", label: "Medium" },
                    { value: "Hard", label: "Hard" },
                  ]}
                  required
                />
              </Grid.Col> */}
            </Grid>

            {/* Options (for MCQs) - Only show when needed */}
            {(questionType === "SINGLE_CHOICE" ||
              questionType === "MULTIPLE_CHOICE") && (
              <Paper withBorder p="md" radius="md">
                <Title order={4} mb="sm">
                  Answer Options
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  {options.map((opt, idx) => (
                    <TextInput
                      key={idx}
                      label={`Option ${String.fromCharCode(65 + idx)}`}
                      placeholder={`Enter option ${String.fromCharCode(65 + idx)}`}
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      error={errors[`option${String.fromCharCode(65 + idx)}`]}
                    />
                  ))}
                </SimpleGrid>
                {errors.options && (
                  <Alert color="red" mt="sm" variant="light">
                    {errors.options}
                  </Alert>
                )}
              </Paper>
            )}

            {/* Dynamic Form based on question type */}
            {questionType && renderQuestionTypeForm()}

            {/* Action Buttons */}
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={resetForm} type="button">
                Clear
              </Button>
              <Button
                type="submit"
                loading={loading}
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
              >
                {questionForUpdate ? "Update Question" : "Add Question"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default AddQuestionPage;
