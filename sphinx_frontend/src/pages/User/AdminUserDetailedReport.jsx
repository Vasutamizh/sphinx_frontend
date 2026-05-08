import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconChartBar,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useAPI from "../../hooks/useAPI";
import { loaderActions } from "../../store/LoaderReducer";
import { failureToast } from "../../utils/toast";

export default function AdminUserDetailedReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const examData = location.state; // Data passed from previous component

  const [topicReport, setTopicReport] = useState([]);

  const [examInfo, setExamInfo] = useState(null);

  const dispatch = useDispatch();

  const { apiGet, isError } = useAPI();

  async function fetchTopicWiseReport(performanceId) {
    try {
      dispatch(loaderActions.loaderOn());

      const response = await apiGet(
        `/exam/exam-report?performanceId=${performanceId}`,
      );

      if (isError(response)) {
        failureToast(response.errorMessage || response.error);
        return;
      }

      if (response.topicWiseReport) {
        setTopicReport(response.topicWiseReport);
      }
    } catch (err) {
      console.error("Error While fetching Detailed Report => ", err);
      failureToast("Error While fetching Detailed Report");
    } finally {
      dispatch(loaderActions.loaderOff());
    }
  }

  useEffect(() => {
    // console.log("EXAM =>", examData);
    if (!examData || !examData.performanceId) {
      failureToast("Failed to load!");
      return;
    }

    // Store exam summary info for display
    setExamInfo({
      examName: examData.examName,
      score: examData.score,
      scorePercentage: examData.scorePercentage,
      status: examData.status,
      date: examData.date,
      totalCorrect: examData.totalCorrect,
      totalWrong: examData.totalWrong,
      noOfQuestions: examData.noOfQuestions,
      passPercentage: examData.passPercentage,
      attemptNo: examData.attemptNo,
      performanceId: examData.performanceId,
    });

    fetchTopicWiseReport(examData.performanceId);
  }, []);

  const getStatusColor = (passed) => (passed === 1 ? "green" : "red");
  const getStatusText = (passed) => (passed === 1 ? "Passed" : "Failed");

  return (
    <Container size="lg" pb="xl">
      {/* Header with back button */}
      <Group mb="lg">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate(-1)}
        >
          Back to Reports
        </Button>
      </Group>

      <Title order={1} mb="xs">
        Topic-wise Performance
      </Title>
      <Text c="dimmed" mb="xl">
        Detailed analysis of your answers by topic
      </Text>

      {/* {loading && (
        <Group justify="center" my="xl">
          <Loader type="dots" />
          <Text>Loading topic-wise report...</Text>
        </Group>
      )} */}

      {/* {error && (
        <Alert title="Error" color="red" variant="filled" mb="xl">
          {error}
        </Alert>
      )} */}

      {examInfo && (
        <Stack gap="xl">
          {/* Exam Summary Card */}
          <Card withBorder shadow="sm" radius="md" p="lg">
            <Title order={3} mb="md">
              Assessment Summary
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              <div>
                <Text size="sm" c="dimmed">
                  Assessment Name
                </Text>
                <Text fw={500}>{examInfo.examName}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  Attempt
                </Text>
                <Text fw={500}>Attempt {examInfo.attemptNo}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  Attended Date
                </Text>
                <Text fw={500}>{new Date(examInfo.date).toLocaleString()}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  Score
                </Text>
                <Text fw={500}>
                  {examInfo.totalCorrect} / {examInfo.noOfQuestions}
                </Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  Percentage
                </Text>
                <Group gap="xs">
                  <Text fw={500}>{examInfo.scorePercentage}%</Text>
                  <Badge
                    color={examInfo.status === "PASSED" ? "green" : "red"}
                    variant="light"
                  >
                    {examInfo.status}
                  </Badge>
                </Group>
              </div>
              <div>
                <Text size="sm" c="dimmed">
                  Passing Requirement
                </Text>
                <Text fw={500}>{examInfo.passPercentage}%</Text>
              </div>
            </SimpleGrid>
          </Card>

          {/* Topic-wise Performance Table */}
          <Card withBorder shadow="sm" radius="md" p="lg">
            <Title order={3} mb="md">
              Performance by Topic
            </Title>
            {topicReport.length > 0 ? (
              <Table striped highlightOnHover withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Topic</Table.Th>
                    <Table.Th>Correct / Total</Table.Th>
                    <Table.Th>Score %</Table.Th>
                    <Table.Th>Result</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {topicReport.map((topic) => (
                    <Table.Tr key={topic.detailedPerformanceId}>
                      <Table.Td fw={500}>{topic.topicId}</Table.Td>
                      <Table.Td>
                        {topic.correctQuestionsInthisTopic} of{" "}
                        {topic.totalQuestionsInThisTopic} Questions Correct
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Text size="sm" fw={500}>
                            {topic.userTopicPercentage}%
                          </Text>
                          <Progress
                            value={topic.userTopicPercentage}
                            color={
                              topic.userTopicPercentage >= 60
                                ? "teal"
                                : "orange"
                            }
                            size="sm"
                            style={{ width: 100 }}
                          />
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={getStatusColor(topic.userPassedThisTopic)}
                          variant="light"
                          leftSection={
                            topic.userPassedThisTopic === 1 ? (
                              <IconCheck size={12} />
                            ) : (
                              <IconX size={12} />
                            )
                          }
                        >
                          {getStatusText(topic.userPassedThisTopic)}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No topic-wise data available for this exam.
              </Text>
            )}
          </Card>

          {/* Optional insight message */}
          {topicReport.length > 0 && (
            <Alert
              title="Performance Insight"
              color="blue"
              variant="light"
              icon={<IconChartBar size={16} />}
            >
              {topicReport.every((t) => t.userPassedThisTopic === 1)
                ? "Excellent! You have passed all topic sections."
                : "Review the topics where you scored below the passing threshold to improve."}
            </Alert>
          )}
        </Stack>
      )}

      {/* {!error && !examInfo && (
        <Alert title="No Data" color="yellow" variant="outline">
          No exam information available. Please go back and select a valid exam.
        </Alert>
      )} */}
    </Container>
  );
}
