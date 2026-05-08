import {
  Badge,
  Card,
  Container,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconChartBar,
  IconCheck,
  IconClock,
  IconUserSearch,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAPI from "../../hooks/useAPI";
import { loaderActions } from "../../store/LoaderReducer";
import { failureToast } from "../../utils/toast";

// Helper function to format timestamp
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Status badge component
const StatusBadge = ({ status }) => {
  const color =
    status === "PASSED"
      ? "green"
      : status === "FAILED"
        ? "red"
        : status === "PENDING"
          ? "yellow"
          : "gray";
  return (
    <Badge color={color} variant="light" size="sm">
      {status}
    </Badge>
  );
};

export default function AdminUserReport() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [reportData, setReportData] = useState(null);
  const { apiGet, isError } = useAPI();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      dispatch(loaderActions.loaderOn());

      const response = await apiGet("/user/getAllUsers");

      if (isError(response)) {
        failureToast(
          response.errorMessage || response.error || "Failed to load data!",
        );
      } else {
        if (response.users) {
          const processedUserData = response.users.map((user) => {
            return {
              label:
                user?.firstName + user?.lastName + " ( " + user?.partyId + " )",
              value: user?.partyId,
            };
          });
          //   console.info("User Data => ", processedUserData);
          setUsers(processedUserData);
          return;
        }
        setUsers([]);
      }
    } catch (err) {
      console.error("Error While Fetching Users => ", err);
    } finally {
      dispatch(loaderActions.loaderOff());
    }
  };

  const handleUserChange = async () => {
    if (!selectedUserId) {
      setReportData(null);
      return;
    }

    try {
      dispatch(loaderActions.loaderOn());

      const response = await apiGet(`/exam/report?partyId=${selectedUserId}`);
      if (isError(response)) {
        failureToast("Failed to retrieve assessment report");
      } else {
        if (response) {
          setReportData(response);
        }
      }
    } catch (err) {
      console.error("Error While Fetching Reports => :", err);
      failureToast(
        "Unable to fetch report. Please check your connection and try again.",
      );
    } finally {
      dispatch(loaderActions.loaderOff());
    }
  };

  // Helper to calculate pass rate from attended exams
  const getPassRate = () => {
    if (!reportData?.attendedExams?.length) return "N/A";
    const passed = reportData.attendedExams.filter(
      (exam) => exam.status === "PASSED",
    ).length;
    return `${((passed / reportData.attendedExams.length) * 100).toFixed(0)}%`;
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    handleUserChange();
  }, [selectedUserId]);

  return (
    <Container size="xl" pb="xl">
      {/* <Title order={1} mb="md" ta="center">
        Assessment Report Dashboard
      </Title>
      <Text c="dimmed" mb="xl" ta="center">
        Select a user to view their detailed exam performance report
      </Text> */}

      <div className="header mb-10 ">
        <div className="title flex justify-between items-center">
          <div className="titleText">
            <span className="text-2xl  block">Assessment Report Dashboard</span>
            <span className="text-gray-500 text-sm">
              Select a user to view their detailed exam performance report
            </span>
          </div>
        </div>
      </div>

      {/* User Selection Card */}
      <Card withBorder shadow="sm" radius="md" mb="xl">
        <Group align="flex-end">
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500} mb={4}>
              Select User
            </Text>
            <Select
              placeholder="Choose a user..."
              data={users || []}
              //   value={selectedUser}
              onChange={(value) => {
                // console.log("Value => ", value);
                setSelectedUserId(value);
              }}
              searchable
              clearable
              leftSection={<IconUserSearch size={16} />}
              styles={{ root: { width: "100%" } }}
            />
          </div>
        </Group>
      </Card>

      {/* Loading State
      {loading && (
        <Group justify="center" my="xl">
          <Loader type="bars" />
          <Text>Loading assessment report...</Text>
        </Group>
      )} */}

      {/* Error State */}
      {/* {error && (
        <Alert title="Error" color="red" variant="filled" mb="xl">
          {error}
        </Alert>
      )} */}

      {/* Report Data Display */}
      {reportData && (
        <Stack gap="xl">
          {/* Summary Cards */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            <Paper withBorder p="md" radius="md" shadow="sm">
              <Group>
                <ThemeIcon color="blue" variant="light" size="lg">
                  <IconChartBar size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Total Assigned
                  </Text>
                  <Text fw={700} size="xl">
                    {reportData.totalAssigned}
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper withBorder p="md" radius="md" shadow="sm">
              <Group>
                <ThemeIcon color="green" variant="light" size="lg">
                  <IconCheck size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Total Attended
                  </Text>
                  <Text fw={700} size="xl">
                    {reportData.totalAttended}
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper withBorder p="md" radius="md" shadow="sm">
              <Group>
                <ThemeIcon color="yellow" variant="light" size="lg">
                  <IconClock size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Pending Assessment
                  </Text>
                  <Text fw={700} size="xl">
                    {reportData.totalPending}
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper withBorder p="md" radius="md" shadow="sm">
              <Group>
                <ThemeIcon
                  color={
                    getPassRate() !== "N/A" && parseInt(getPassRate()) >= 70
                      ? "teal"
                      : "orange"
                  }
                  variant="light"
                  size="lg"
                >
                  <IconChartBar size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Pass Rate
                  </Text>
                  <Text fw={700} size="xl">
                    {getPassRate()}
                  </Text>
                </div>
              </Group>
            </Paper>
          </SimpleGrid>

          {/* Assigned Assessment Section */}
          <Card withBorder shadow="sm" radius="md" p="lg">
            <Title order={3} mb="md">
              Assigned / Pending Assessment
            </Title>
            {reportData.assignedExams?.length > 0 ? (
              <Table striped highlightOnHover withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Exam Name</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>Duration</Table.Th>
                    <Table.Th>Questions</Table.Th>
                    <Table.Th>Pass %</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {reportData.assignedExams.map((exam, idx) => (
                    // <Table.Tr key={"ASIEX_" + idx}>
                    <Table.Tr key={idx}>
                      <Table.Td fw={500}>{exam.examName}</Table.Td>
                      <Table.Td>{exam.description}</Table.Td>
                      <Table.Td>{exam.duration} min</Table.Td>
                      <Table.Td>{exam.noOfQuestions}</Table.Td>
                      <Table.Td>{exam.passPercentage}%</Table.Td>
                      <Table.Td>
                        <StatusBadge status={exam.status} />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No assigned Assessment found for this user.
              </Text>
            )}
          </Card>

          {/* Attended Exams Section */}
          <Card withBorder shadow="sm" radius="md" p="lg">
            <Title order={3} mb="md">
              Completed Assessment History
            </Title>
            {reportData.attendedExams?.length > 0 ? (
              <Table striped highlightOnHover withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Exam Name</Table.Th>
                    <Table.Th>Attempt Date</Table.Th>
                    <Table.Th>Attempt #</Table.Th>
                    <Table.Th>Score</Table.Th>
                    <Table.Th>Percentage</Table.Th>
                    <Table.Th>Result</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {reportData.attendedExams.map((exam, idx) => (
                    // <Table.Tr key={"ATDEX_" + idx}>
                    <Table.Tr
                      key={idx}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate("/detailedReport", { state: exam })
                      }
                    >
                      <Table.Td fw={500}>{exam.examName}</Table.Td>
                      <Table.Td>{formatDate(exam.date)}</Table.Td>
                      <Table.Td>{exam.attemptNo}</Table.Td>
                      <Table.Td>
                        {exam.totalCorrect} / {exam.noOfQuestions}
                      </Table.Td>
                      <Table.Td fw={500}>{exam.scorePercentage}%</Table.Td>
                      <Table.Td>
                        <StatusBadge status={exam.status} />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No completed Assessment found for this user.
              </Text>
            )}
          </Card>

          {/* Additional Details
          {reportData.successMessage && (
            <Alert title="Report Status" color="green" variant="light">
              {reportData.successMessage}
            </Alert>
          )} */}
        </Stack>
      )}

      {/* Empty State when no user selected */}
      {/* {!selectedUser && !loading && !error && ( */}
      {!selectedUserId && (
        <Card withBorder shadow="sm" radius="md" p="xl" ta="center">
          <ThemeIcon
            size={60}
            radius="md"
            color="gray"
            variant="light"
            mx="auto"
            mb="md"
          >
            <IconUserSearch size={30} />
          </ThemeIcon>
          <Title order={3} mb="sm">
            No User Selected
          </Title>
          <Text c="dimmed">
            Please select a user from the dropdown above to view their
            assessment report.
          </Text>
        </Card>
      )}
    </Container>
  );
}
