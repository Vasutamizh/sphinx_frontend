import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  Group,
  Progress,
  Select,
  Stack,
  Table,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconEdit, IconTrash } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAPI from "../../hooks/useAPI";
import { failureToast, successToast } from "../../utils/toast";

// Helper functions
const getTypeCounts = (questions, selectedIds) => {
  const typeMap = new Map();
  questions.forEach((q) => {
    const existing = typeMap.get(q.questionType) || { total: 0, selected: 0 };
    existing.total++;
    if (selectedIds.has(q.questionId)) existing.selected++;
    typeMap.set(q.questionType, existing);
  });
  return Array.from(typeMap.entries()).map(([type, counts]) => ({
    type,
    total: counts.total,
    selected: counts.selected,
  }));
};

export default function QuestionSelectionPage({
  assessment,
  assessmentId,
  navProps,
}) {
  const { handleBack, handleNext, isFirstStep } = navProps;
  const { noOfQuestions } = assessment;

  const theme = useMantineTheme();
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentTopicId, setCurrentTopicId] = useState(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState(new Set());
  const [targetTotalQuestions, setTargetTotalQuestions] = useState(
    noOfQuestions || 0,
  );
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [randomCount, setRandomCount] = useState(2);

  const { apiPost, apiGet, isError, apiPut } = useAPI();

  // get all questions for current topic
  async function getQuestionsByTopic() {
    if (!currentTopicId) return [];
    const response = await apiGet(`/questions?topicId=${currentTopicId}`);
    if (isError(response)) {
      failureToast(response.errorMessage || "Failed to load Questions!");
    } else {
      setQuestions(response.data);
    }
  }

  async function getAllTopics() {
    const response = await apiGet(`/examTopics?examId=${assessmentId}`);
    if (isError(response)) {
      failureToast(response.errorMessage || "Failed to load Questions!");
    } else {
      if (response.data && response.data.length > 0) {
        setCurrentTopicId(response.data[0].topicId);
      }
      setTopics(response.data || []);
    }
  }

  useEffect(() => {
    if (!currentTopicId) return;
    getQuestionsByTopic();
  }, [currentTopicId]);

  useEffect(() => {
    // get all topics
    getAllTopics();
  }, []);

  // Selected questions count from current topic
  const selectedCountFromCurrentTopic = useMemo(() => {
    if (!currentTopicId) return 0;
    return questions.filter((q) => selectedQuestionIds.has(q.questionId))
      .length;
  }, [questions, selectedQuestionIds, currentTopicId]);

  // Total selected questions
  const totalSelected = selectedQuestionIds.size;
  const completionPercentage = Math.min(
    100,
    (totalSelected / targetTotalQuestions) * 100,
  );
  const remainingNeeded = Math.max(0, targetTotalQuestions - totalSelected);

  // Type counts for current topic
  const typeCounts = useMemo(
    () => getTypeCounts(questions, selectedQuestionIds),
    [questions, selectedQuestionIds],
  );

  // Toggle question selection
  const toggleQuestionSelection = useCallback((questionId) => {
    setSelectedQuestionIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  }, []);

  // Select multiple questions at once
  const selectMultipleQuestions = useCallback((questionIds) => {
    setSelectedQuestionIds((prev) => {
      const newSet = new Set(prev);
      questionIds.forEach((id) => newSet.add(id));
      return newSet;
    });
  }, []);

  // Deselect multiple questions
  const deselectMultipleQuestions = useCallback((questionIds) => {
    setSelectedQuestionIds((prev) => {
      const newSet = new Set(prev);
      questionIds.forEach((id) => newSet.delete(id));
      return newSet;
    });
  }, []);

  //   // Random selection from current topic
  //   const handleRandomSelectFromTopic = useCallback(() => {
  //     if (!currentTopicId) return;
  //     const availableQuestions = currentQuestions.filter(
  //       (q) => !selectedQuestionIds.has(q.id),
  //     );
  //     if (availableQuestions.length === 0) {
  //       notifications.show({
  //         title: "Info",
  //         message: "No more questions available in this topic",
  //         color: "blue",
  //       });
  //       return;
  //     }
  //     const countToSelect = Math.min(randomCount, availableQuestions.length);
  //     const shuffled = [...availableQuestions];
  //     for (let i = shuffled.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  //     }
  //     const selected = shuffled.slice(0, countToSelect).map((q) => q.id);
  //     selectMultipleQuestions(selected);
  //     notifications.show({
  //       title: "Success",
  //       message: `Randomly selected ${countToSelect} questions from ${currentTopicId}`,
  //       color: "green",
  //     });
  //   }, [
  //     currentQuestions,
  //     selectedQuestionIds,
  //     randomCount,
  //     currentTopicId,
  //     selectMultipleQuestions,
  //   ]);

  // Random fill remaining needed questions from all topics
  //   const handleRandomFillRemaining = useCallback(() => {
  //     if (remainingNeeded <= 0) {
  //       notifications.show({
  //         title: "Info",
  //         message: "Target already reached!",
  //         color: "blue",
  //       });
  //       return;
  //     }

  //     const allAvailableQuestions = questions.filter(
  //       (q) => !selectedQuestionIds.has(q.id),
  //     );

  //     if (allAvailableQuestions.length === 0) {
  //       notifications.show({
  //         title: "Info",
  //         message: "No more questions available in any topic",
  //         color: "blue",
  //       });
  //       return;
  //     }
  //     const countToSelect = Math.min(
  //       remainingNeeded,
  //       allAvailableQuestions.length,
  //     );
  //     const shuffled = [...allAvailableQuestions];
  //     for (let i = shuffled.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  //     }
  //     const selected = shuffled.slice(0, countToSelect).map((q) => q.id);
  //     selectMultipleQuestions(selected);
  //     notifications.show({
  //       title: "Success",
  //       message: `Randomly selected ${countToSelect} questions to reach target`,
  //       color: "green",
  //     });
  //   }, [
  //     allQuestions,
  //     selectedQuestionIds,
  //     remainingNeeded,
  //     selectMultipleQuestions,
  //   ]);

  // Save assessment to DB
  const handleSaveAssessment = async () => {
    if (selectedQuestionIds.size === 0) {
      failureToast("No questions selected for assessment");
      return;
    }

    try {
      const response = await apiPost("/examTopics/mandatoryQuestions", {
        examId: assessmentId,
        topicId: currentTopicId,
        questionIds: Array.from(selectedQuestionIds).join(","),
      });
      if (isError(response)) {
        failureToast(response.errorMessage);
      } else {
        successToast(
          response.successMessage ||
            `Assessment saved with ${selectedQuestionIds.size} questions`,
        );
      }
    } catch (error) {
      console.error("Error While saving questions => ", error);
      failureToast("Failed to preform Action!");
    }
  };

  //   // Edit question
  //   const handleEditQuestion = useCallback(
  //     async (updatedQuestion) => {
  //       try {
  //         await mockApi.updateQuestion(updatedQuestion);
  //         setAllQuestions((prev) =>
  //           prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)),
  //         );
  //         // closeEditModal();
  //         notifications.show({
  //           title: "Success",
  //           message: "Question updated successfully",
  //           color: "green",
  //         });
  //       } catch (error) {
  //         notifications.show({
  //           title: "Error",
  //           message: "Failed to update question",
  //           color: "red",
  //         });
  //       }
  //     },
  //     [],
  //   );

  // Delete question
  //   const handleDeleteQuestion = useCallback(async () => {
  //     if (!questionToDelete) return;
  //     try {
  //       await mockApi.deleteQuestion(questionToDelete);
  //       setAllQuestions((prev) => prev.filter((q) => q.id !== questionToDelete));
  //       setSelectedQuestionIds((prev) => {
  //         const newSet = new Set(prev);
  //         newSet.delete(questionToDelete);
  //         return newSet;
  //       });
  //       closeDeleteModal();
  //       setQuestionToDelete(null);
  //       notifications.show({
  //         title: "Success",
  //         message: "Question deleted successfully",
  //         color: "green",
  //       });
  //     } catch (error) {
  //       notifications.show({
  //         title: "Error",
  //         message: "Failed to delete question",
  //         color: "red",
  //       });
  //     }
  //   }, [questionToDelete, closeDeleteModal]);

  // Clear all selections
  const handleClearAllSelections = useCallback(() => {
    setSelectedQuestionIds(new Set());
    notifications.show({
      title: "Cleared",
      message: "All selections cleared",
      color: "blue",
    });
  }, []);

  // Render edit modal
  //   const renderEditModal = () => (
  //     <Modal
  //       opened={editModalOpened}
  //       onClose={closeEditModal}
  //       title="Edit Question"
  //       size="lg"
  //     >
  //       {editingQuestion && (
  //         <Stack>
  //           <TextInput
  //             label="Question Text"
  //             value={editingQuestion.text}
  //             onChange={(e) =>
  //               setEditingQuestion({ ...editingQuestion, text: e.target.value })
  //             }
  //             required
  //           />
  //           <Select
  //             label="Question Type"
  //             data={["Multiple Choice", "Short Answer", "True/False", "Coding"]}
  //             value={editingQuestion.type}
  //             onChange={(value) =>
  //               value && setEditingQuestion({ ...editingQuestion, type: value })
  //             }
  //             required
  //           />
  //           <Group justify="flex-end" mt="md">
  //             <Button variant="outline" onClick={closeEditModal}>
  //               Cancel
  //             </Button>
  //             <Button onClick={() => handleEditQuestion(editingQuestion)}>
  //               Save Changes
  //             </Button>
  //           </Group>
  //         </Stack>
  //       )}
  //     </Modal>
  //   );

  //   // Render delete confirmation modal
  //   const renderDeleteModal = () => (
  //     <Modal
  //       opened={deleteConfirmModalOpened}
  //       onClose={closeDeleteModal}
  //       title="Confirm Delete"
  //       centered
  //     >
  //       <Text>
  //         Are you sure you want to delete this question? This action cannot be
  //         undone.
  //       </Text>
  //       <Group justify="flex-end" mt="md">
  //         <Button variant="outline" onClick={closeDeleteModal}>
  //           Cancel
  //         </Button>
  //         <Button color="red" onClick={handleDeleteQuestion}>
  //           Delete
  //         </Button>
  //       </Group>
  //     </Modal>
  //   );

  return (
    <Stack p="md" style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <Group justify="space-between" align="center">
        <div>
          <Title order={2}>Select Questions</Title>
          <Text c={theme.colors.gray[5]} fz="xs">
            Select the questions you wish to add in the assessment, if you are
            not done anything then the questions will randomly assign to the
            assesment
          </Text>
        </div>

        <Badge size="lg" color="teal" variant="light">
          Total Selected: {totalSelected}
        </Badge>
      </Group>

      {/* Progress Section */}
      <Card withBorder shadow="sm" p="md">
        <Group justify="space-between" mb="xs">
          <Text fw={500}>Question Selection Completion</Text>
          <Text fw={500}>
            {totalSelected} / {targetTotalQuestions} questions
          </Text>
        </Group>
        <Progress
          value={completionPercentage}
          size="lg"
          radius="md"
          color={completionPercentage >= 100 ? "teal" : "blue"}
        />
        <Group justify="space-between" mt="xs">
          <Text size="sm" c="dimmed">
            Target: {targetTotalQuestions} questions
          </Text>
          <Text size="sm" c="dimmed">
            {remainingNeeded} remaining needed
          </Text>
        </Group>
        <Group justify="flex-end" mt="md">
          {/* <Button
            size="xs"
            variant="outline"
            // onClick={handleRandomFillRemaining}
            leftSection={<IconRefresh size={16} />}
          >
            Random Fill Remaining ({remainingNeeded})
          </Button> */}

          <Checkbox label="Random Fill Remaining" />

          <Button size="xs" variant="light" onClick={handleClearAllSelections}>
            Clear All
          </Button>
          <Button
            size="xs"
            onClick={handleSaveAssessment}
            leftSection={<IconDeviceFloppy size={16} />}
          >
            Save Assessment
          </Button>
        </Group>
      </Card>

      <Grid>
        {/* Topic Selector & Metadata */}
        <Grid.Col span={4}>
          <Card withBorder shadow="sm" p="md" h="100%">
            <Stack>
              <Select
                label="Select Topic"
                placeholder="Choose a topic"
                data={
                  topics &&
                  topics.map((t) => ({
                    value: t.topicId,
                    label: t.topicId,
                  }))
                }
                value={currentTopicId}
                onChange={setCurrentTopicId}
                clearable={false}
              />
              <Divider />
              <Title order={4}>Topic Metadata</Title>
              <Text size="sm" fw={500}>
                Selected Count: {selectedCountFromCurrentTopic}
              </Text>
              <Divider />
              <Text fw={500} size="sm">
                Question Types:
              </Text>
              {typeCounts.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No questions in this topic
                </Text>
              ) : (
                typeCounts.map((tc) => (
                  <Group key={tc.type} justify="space-between" wrap="nowrap">
                    <Badge size="sm" variant="light">
                      {tc.type}
                    </Badge>
                    <Text size="sm">
                      {tc.selected} / {tc.total} selected
                    </Text>
                  </Group>
                ))
              )}
            </Stack>
          </Card>
        </Grid.Col>

        {/* Questions Table */}
        <Grid.Col span={8}>
          <Card withBorder shadow="sm" p="md">
            <Stack>
              <Group justify="space-between" align="flex-end">
                <Title order={4}>Questions</Title>
                {/* <Group> 
                  <Button
                    size="xs"
                    variant="default"
                    // onClick={handleRandomSelectFromTopic}
                    leftSection={<IconSelector size={16} />}
                  >
                    Random Select from Topic
                  </Button>
                </Group> */}
              </Group>
              <Box style={{ overflowX: "auto" }}>
                <Table striped highlightOnHover verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ width: 40 }}>Select</Table.Th>
                      <Table.Th>Question</Table.Th>
                      <Table.Th style={{ width: 140 }}>Type</Table.Th>
                      <Table.Th style={{ width: 160 }}>Last Updated</Table.Th>
                      <Table.Th style={{ width: 80 }}>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {questions.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={5} style={{ textAlign: "center" }}>
                          No questions found for this topic
                        </Table.Td>
                      </Table.Tr>
                    ) : (
                      questions.map((question) => (
                        <Table.Tr key={question.questionId}>
                          <Table.Td>
                            <Checkbox
                              checked={selectedQuestionIds.has(
                                question.questionId,
                              )}
                              onChange={() =>
                                toggleQuestionSelection(question.questionId)
                              }
                            />
                          </Table.Td>
                          <Table.Td style={{ maxWidth: 400 }}>
                            {question.questionDetail}
                          </Table.Td>
                          <Table.Td>
                            <Badge variant="light">
                              {question.questionType}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            {new Date(
                              question.lastUpdatedStamp,
                            ).toLocaleDateString()}
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs" wrap="nowrap">
                              <ActionIcon
                                variant="subtle"
                                color="blue"
                                onClick={() => {
                                  setEditingQuestion({ ...question });
                                  //   openEditModal();
                                }}
                              >
                                <IconEdit size={18} />
                              </ActionIcon>
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                onClick={() => {
                                  setQuestionToDelete(question.id);
                                  //   openDeleteModal();
                                }}
                              >
                                <IconTrash size={18} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))
                    )}
                  </Table.Tbody>
                </Table>
              </Box>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Modals
      {renderEditModal()}
      {renderDeleteModal()} */}

      <Group justify="space-between" mt="xl">
        <Button variant="default" onClick={handleBack} disabled={isFirstStep}>
          Back
        </Button>
        <Button
          type="submit"
          onClick={handleNext}
          c={theme.colors.slate[0]}
          variant="filled"
        >
          {"Process to Assign Users"}
        </Button>
      </Group>
    </Stack>
  );
}
