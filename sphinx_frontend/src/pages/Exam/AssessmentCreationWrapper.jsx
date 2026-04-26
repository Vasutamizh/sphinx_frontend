// AssessmentCreationWizard.tsx
import {
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Paper,
  Progress,
  Stack,
  Stepper,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowRight,
  IconChecklist,
  IconClock,
  IconFileDescription,
  IconPercentage,
  IconQuestionMark,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

// Child components (import your actual implementations)
import { ShieldCheck } from "lucide-react";
import TopicCard from "../../components/Topic_Components/TopicCard";
import AddQuestionPage from "../Question/AddQuestionPage";
import AddQuestionToAssessmentWrapper from "../Question/AddQuestionToAssessmentWrapper";
import { AssessmentTopicManager } from "../Topics/AssessmentTopicManager";
import AssignUsersToAssessmentWrapper from "../User/AssignUsersToAssessmentWrapper";
import { AssessmentInfoStep } from "./AssessmentInfo";

export function AssessmentCreationWizard() {
  const theme = useMantineTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [topicIdxForShow, setTopicIdxForShow] = useState("");
  const [topicForEdit, setTopicForEdit] = useState("");

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
    { label: "Assign Users", component: AssignUsersToAssessmentWrapper },
  ];

  const isLastStep = activeStep === steps.length - 1;
  const isFirstStep = activeStep === 0;

  // Calculate progress percentage (each step is 25% of total)
  const progress = ((activeStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      // Submit the entire assessment to your backend
      console.log("Final assessment data:", assessment);
      // alert('Assessment created!');
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleTopicDelete = (topicId) => {
    // Remove the Topic from the topics.
    setTopics((prev) => prev.filter((t) => t.topicId !== topicId));
  };

  const handleTopicEdit = (topicId) => {
    const tempTopic = topics.find((t) => t.topicId === topicId);
    if (!tempTopic) return;
    setTopicForEdit(tempTopic);
    setActiveStep(1); // set current step for topicEdit 1 => Topic Add page.
    setTopicIdxForShow(""); // close the pop over for topic here.
  };

  const totalPct = useMemo(() => {
    return topics.reduce((sum, t) => sum + Number(t.percentage), 0);
  }, [topics]);

  useEffect(() => {
    setTopicIdxForShow("");
  }, [topics]);

  return (
    <Container size="xl" my="xl">
      <Paper shadow="sm" radius="md" p="xl" withBorder>
        <Grid>
          <Grid.Col span={4}>
            <Stack>
              <Group>
                <ShieldCheck size={18} color="blue" />
                <Text fw={600} fz={18}>
                  Assessment Information
                </Text>
              </Group>

              {assessment && (
                <Paper
                  shadow="sm"
                  radius="lg"
                  p="md"
                  withBorder
                  style={{
                    borderLeft: `4px solid ${theme.colors.forestGreen[8]}`,
                  }}
                >
                  <Group justify="space-between" align="center" mb="xs">
                    <Group gap="xs">
                      <ThemeIcon
                        variant="light"
                        color={theme.colors.forestGreen[8]}
                        size="md"
                        radius="xl"
                      >
                        <IconFileDescription size={18} />
                      </ThemeIcon>
                      <Text fw={700} size="md" c={theme.colors.forestGreen[8]}>
                        Assessment Summary
                      </Text>
                    </Group>
                  </Group>

                  <Divider my="sm" />

                  <Grid gutter="xs">
                    <Grid.Col span={12}>
                      <Group gap="xs" wrap="nowrap">
                        <ThemeIcon variant="transparent" color="gray" size="xs">
                          <IconFileDescription size={14} />
                        </ThemeIcon>
                        <Text size="sm" c="dimmed" style={{ width: 100 }}>
                          Name:
                        </Text>
                        <Text size="sm" fw={500}>
                          {assessment.examName || "—"}
                        </Text>
                      </Group>
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Group gap="xs" wrap="nowrap">
                        <ThemeIcon
                          variant="transparent"
                          color="orange"
                          size="xs"
                        >
                          <IconClock size={14} />
                        </ThemeIcon>
                        <Text size="sm" c="dimmed">
                          Duration:
                        </Text>
                        <Text size="sm" fw={500}>
                          {assessment.duration || 0} min
                        </Text>
                      </Group>
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Group gap="xs" wrap="nowrap">
                        <ThemeIcon
                          variant="transparent"
                          color="violet"
                          size="xs"
                        >
                          <IconQuestionMark size={14} />
                        </ThemeIcon>
                        <Text size="sm" c="dimmed">
                          Total Qs:
                        </Text>
                        <Text size="sm" fw={500}>
                          {assessment.noOfQuestions || 0}
                        </Text>
                      </Group>
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Group gap="xs" wrap="nowrap">
                        <ThemeIcon variant="transparent" color="teal" size="xs">
                          <IconPercentage size={14} />
                        </ThemeIcon>
                        <Text size="sm" c="dimmed">
                          Pass %:
                        </Text>
                        <Text size="sm" fw={500}>
                          {assessment.passPercentage || 0}%
                        </Text>
                      </Group>
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Group gap="xs" wrap="nowrap">
                        <ThemeIcon variant="transparent" color="red" size="xs">
                          <IconChecklist size={14} />
                        </ThemeIcon>
                        <Text size="sm" c="dimmed">
                          Mandatory:
                        </Text>
                        <Text size="sm" fw={500}>
                          {assessment.answersMust || 0}
                        </Text>
                      </Group>
                    </Grid.Col>
                  </Grid>

                  {/* Optional: Show progress indicators if topics/questions exist */}
                  {assessment.topics && assessment.topics.length > 0 && (
                    <>
                      <Divider my="sm" />
                      <Group gap="xs">
                        <ThemeIcon
                          variant="light"
                          color="gray"
                          size="xs"
                          radius="xl"
                        >
                          <IconQuestionMark size={12} />
                        </ThemeIcon>
                        <Text size="xs" c="dimmed">
                          {assessment.topics.length} topic(s) added
                        </Text>
                      </Group>
                    </>
                  )}
                </Paper>
              )}

              <Group>
                <ShieldCheck size={18} color="blue" />
                <Text fw="600">Added Topics</Text>
              </Group>
              {topics.length <= 0 ? (
                <Text mt={10} ml={10} c={theme.colors.slate[5]}>
                  No Topic Available
                </Text>
              ) : (
                <Stack style={{ overflow: "visible", minHeight: "400px" }}>
                  <div>
                    Total allocated: <strong>{totalPct}%</strong>
                    {totalPct === 100 && (
                      <span style={{ color: "#1D9E75", marginLeft: "8px" }}>
                        — Fully allocated ✓
                      </span>
                    )}
                    {totalPct < 100 && (
                      <span style={{ marginLeft: "8px" }}>
                        — {100 - totalPct}% remaining
                      </span>
                    )}
                    {totalPct > 100 && (
                      <span style={{ color: "#BA7517", marginLeft: "8px" }}>
                        — Over 100%!
                      </span>
                    )}
                  </div>
                  {topics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="relative"
                      // onMouseEnter={() => {
                      //   setTopicIdxForShow(idx);
                      // }}
                      // onMouseLeave={() => {
                      //   setTimeout(() => setTopicIdxForShow(""), 500);
                      // }}
                    >
                      <Paper
                        shadow="md"
                        radius="md"
                        bg="white"
                        className={`cursor-pointer hover:text-[${theme.colors.forestGreen[8]}]`}
                        onClick={() => {
                          if (topicIdxForShow === idx) {
                            setTopicIdxForShow("");
                          } else {
                            setTopicIdxForShow(idx);
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <Flex justify="space-between" align="center">
                          <Text>{topic.topicId}</Text>
                          <IconArrowRight
                            color={theme.colors.forestGreen[8]}
                            size={28}
                          />
                        </Flex>
                      </Paper>
                      {topicIdxForShow === idx && (
                        <div className="absolute z-1000 left-[350px] top-0">
                          <TopicCard
                            onDelete={() => handleTopicDelete(topic.topicId)}
                            onEdit={() => handleTopicEdit(topic.topicId)}
                            topic={topic}
                            key={topic.topicId}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </Stack>
              )}
            </Stack>
          </Grid.Col>
          <Grid.Col span={8}>
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
                navProps={{ handleBack, handleNext, isLastStep, isFirstStep }}
              />
            )}

            {activeStep === 3 && (
              <AssignUsersToAssessmentWrapper
                navProps={{ handleBack, handleNext, isLastStep, isFirstStep }}
              />
            )}
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
}
