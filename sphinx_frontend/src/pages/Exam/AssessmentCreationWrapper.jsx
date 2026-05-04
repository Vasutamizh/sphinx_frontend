// AssessmentCreationWizard.tsx
import {
  ActionIcon,
  Card,
  Flex,
  Grid,
  Paper,
  Progress,
  ScrollArea,
  Stack,
  Stepper,
  Switch,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";

// Child components (import your actual implementations)
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAPI from "../../hooks/useAPI";
import { failureToast, successToast } from "../../utils/toast";
import AddQuestionPage from "../Question/AddQuestionPage";
import AddQuestionToAssessmentWrapper from "../Question/AddQuestionToAssessmentWrapper";
import QuestionSelectionPage from "../Question/QuestionSelectionPage";
import { AssessmentTopicManager } from "../Topics/AssessmentTopicManager";
import AssignUsersToAssessmentWrapper from "../User/AssignUsersToAssessmentWrapper";
import { AssessmentInfoStep } from "./AssessmentInfo";

export function AssessmentCreationWizard() {
  const theme = useMantineTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [topicIdxForShow, setTopicIdxForShow] = useState("");
  const [topicForEdit, setTopicForEdit] = useState("");
  const { apiDelete } = useAPI();
  const navigate = useNavigate();

  // Central state for the whole assessment
  const [assessment, setAssessment] = useState({
    examName: "",
    description: "",
    duration: 0,
    passPercentage: 0,
    noOfQuestions: 0,
    answersMust: 0,
  });
  const [topics, setTopics] = useState([]);

  // Helper to update assessment fields
  const updateAssessment = (updates) => {
    setAssessment(updates);
  };

  // Step definitions (visible labels)
  const steps = [
    { label: "Assessment Info", component: AssessmentInfoStep },
    { label: "Topics", component: AssessmentTopicManager },
    { label: "Questions", component: AddQuestionPage },
    { label: "Select Questions", component: QuestionSelectionPage },
    { label: "Assign Users", component: AssignUsersToAssessmentWrapper },
  ];

  const isLastStep = activeStep === steps.length - 1;
  const isFirstStep = activeStep === 0;

  // Calculate progress percentage (each step is 25% of total)
  const progress = ((activeStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      // redirect to dashboard.
      navigate("/");
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleDeleteTopic = async (topicId) => {
    const response = await apiDelete("/exam/topics", {
      examId: assessment.examId,
      topicId,
    });
    if (response.responseMessage === "success") {
      successToast("Topic removed from Assessment.");
      setTopics((prev) => prev.filter((t) => t.topicId !== topicId));
      // if (editTopicId === topicId) resetTopicForm();
    } else {
      failureToast(response.errorMessage || response.error);
    }
  };

  const handleTopicEdit = (topic) => {
    setTopicForEdit(topic);
    setActiveStep(1);
    setTopicIdxForShow("");
  };

  const totalPct = useMemo(() => {
    return topics.reduce((sum, t) => sum + Number(t.percentage), 0);
  }, [topics]);

  useEffect(() => {
    setTopicIdxForShow("");
  }, [topics]);

  return (
    <Paper shadow="sm" radius="md" p="xl" withBorder>
      <Grid>
        <Grid.Col span={9}>
          <Title order={2} mb="md">
            Create New Assessment
          </Title>

          {/* Mantine Progress Bar – shows completion percentage */}
          <Progress value={progress} size="lg" mb="lg" radius="xl" />
          <Text size="sm" c="dimmed" mb="xl">
            Step {activeStep + 1} of {steps.length}: {steps[activeStep].label}
          </Text>

          {/* Optional: Mantine Stepper for visual step markers */}
          <Stepper active={activeStep} mb="xl" size="sm">
            {steps.map((step, idx) => (
              <Stepper.Step key={idx} label={step.label} />
            ))}
          </Stepper>

          {/* Current step component – receives state and updater */}
          {activeStep === 0 && (
            <AssessmentInfoStep
              assessment={assessment}
              updateAssessment={updateAssessment}
              navProps={{ handleBack, handleNext, isLastStep, isFirstStep }}
            />
          )}
          {activeStep === 1 && (
            <AssessmentTopicManager
              assessmentId={assessment.examId}
              topics={topics}
              topicForEdit={topicForEdit}
              setTopicForEdit={setTopicForEdit}
              totalPct={totalPct}
              setTopics={setTopics}
              navProps={{ handleBack, handleNext, isLastStep, isFirstStep }}
            />
          )}

          {activeStep === 2 && (
            <AddQuestionToAssessmentWrapper
              assessmentId={assessment.examId}
              navProps={{ handleBack, handleNext, isLastStep, isFirstStep }}
            />
          )}

          {activeStep === 3 && (
            <QuestionSelectionPage
              assessment={assessment}
              assessmentId={assessment.examId}
              navProps={{ handleBack, handleNext, isLastStep, isFirstStep }}
            />
          )}

          {activeStep === 4 && (
            <AssignUsersToAssessmentWrapper
              assessmentId={assessment.examId}
              navProps={{ handleBack, handleNext, isLastStep, isFirstStep }}
            />
          )}
        </Grid.Col>
        <Grid.Col span={3}>
          {/* style={{ height: "80vh" }} */}
          <ScrollArea type="always" style={{ height: "100%" }}>
            <Stack my={10}>
              {assessment.examName && (
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} mb="sm">
                    Assessment Info
                  </Title>
                  <Flex>
                    <Text size="sm" fw={500}>
                      Name:
                    </Text>
                    <Text size="sm" fw={600}>
                      {assessment.examName}
                    </Text>
                  </Flex>
                  <Text size="sm" mt="xs">
                    Description: {assessment.description}
                  </Text>
                  <Text size="sm" mt="xs">
                    Duration: {assessment.duration} minutes
                  </Text>
                  <Text size="sm" mt="xs">
                    Pass Percentage: {assessment.passPercentage}%
                  </Text>
                  <Text size="sm" mt="xs">
                    Total Questions: {assessment.noOfQuestions}
                  </Text>
                  <Text size="sm" mt="xs">
                    Answers Must: {assessment.answersMust}
                  </Text>
                </Card>
              )}
              {topics && topics.length > 0 && (
                <>
                  <Flex align="center" gap="xs">
                    <ShieldCheck color="blue" size={18} />
                    <Text>Assigned Topics </Text>
                  </Flex>
                  <Text size="sm" c="dimmed">
                    Total Weightage:{totalPct}%
                  </Text>
                  <Text size="sm" c="dimmed">
                    Remaining Weightage: {100 - totalPct}%
                  </Text>
                  <Progress.Root size={30} mt="sm" mb="md">
                    {topics.map((topic) => (
                      <Tooltip label={`${topic.topicId}: ${topic.percentage}%`}>
                        <Progress.Section
                          key={topic.topicId}
                          value={topic.percentage}
                        >
                          <Progress.Label>{topic.topicId}</Progress.Label>
                        </Progress.Section>
                      </Tooltip>
                    ))}
                  </Progress.Root>

                  {topics.map((topic, index) => (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Flex align="center" gap="xs" justify="space-between">
                        <Text weight={600} size="lg">
                          {topic.topicId}
                        </Text>

                        <Flex align="center" gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleDeleteTopic(topic.topicId)}
                          >
                            <IconTrash size={18} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleTopicEdit(topic)}
                          >
                            <IconEdit size={18} />
                          </ActionIcon>
                        </Flex>
                      </Flex>

                      <Text size="sm" mt="xs">
                        Question Weightage: {topic.percentage}%
                      </Text>

                      <Progress
                        value={topic.percentage}
                        color={theme.colors.forestGreen[6]}
                        mt="sm"
                      />

                      <Text size="sm" mt="sm">
                        Pass Percentage: {topic.passPercentage}%
                      </Text>

                      <Switch
                        checked={topic.savePermanently}
                        label="Save Permanently"
                        mt="md"
                        readOnly
                      />
                    </Card>
                  ))}
                </>
              )}
            </Stack>
          </ScrollArea>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
