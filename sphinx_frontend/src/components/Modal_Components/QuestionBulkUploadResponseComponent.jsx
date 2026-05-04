import {
  Badge,
  Group,
  Pagination,
  ScrollArea,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useState } from "react";
import Modal from "../Modal";

export default function BulkUploadResultModal({
  opened,
  onClose,
  responseData,
  columnLabels = [
    { name: "questionDetail", label: "Question Text" },
    { name: "questionType", label: "Question Type" },
    { name: "topicId", label: "Topic" },
    { name: "optionA", label: "Option A" },
    { name: "optionB", label: "Option B" },
    { name: "optionC", label: "Option C" },
    { name: "optionD", label: "Option D" },
    { name: "answer", label: "Answer" },
    { name: "numAnswers", label: "Num Of Answers" },
    { name: "difficultyLevel", label: "Difficulty Level" },
    { name: "answerValue", label: "Answer Value" },
  ], // if empty, we derive from first row's questionData keys
}) {
  if (!opened) {
    return;
  }
  // Pagination state (frontend only)
  const [activePage, setActivePage] = useState(1);
  const rowsPerPage = 10;

  if (!responseData) return;

  // Combine success and error rows into a single list with a status flag
  const allRows = [
    ...responseData.successRows.map((row) => ({ ...row, status: "success" })),
    ...responseData.errorRows.map((row) => ({ ...row, status: "error" })),
  ].sort((a, b) => a.rowNumber - b.rowNumber); // sort by original row number

  // Pagination logic
  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  const paginatedRows = allRows.slice(
    (activePage - 1) * rowsPerPage,
    activePage * rowsPerPage,
  );

  // Determine table headers: if columnLabels provided use them, else extract from first row's questionData
  let headers = columnLabels;
  if (headers.length === 0 && allRows.length > 0) {
    const firstRowData = allRows[0].questionData;
    headers = Object.keys(firstRowData).map((field) => ({
      field,
      label: field,
    }));
  }

  // Helper to render cell value (handle different types)
  const renderCellValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  return (
    <Modal
      isOpen={opened}
      onClose={onClose}
      title="Bulk Upload Results"
      subtitle="Review you Uploaded Questions!"
      type="success"
      size="90%"
    >
      <Stack gap="md">
        {/* Summary badges */}
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {responseData.successMessage}
          </Text>
          <Group gap="xs">
            <Badge color="green" variant="light">
              Success: {responseData.successCount}
            </Badge>
            <Badge color="red" variant="light">
              Errors: {responseData.errorCount}
            </Badge>
            <Badge color="gray" variant="outline">
              Total: {responseData.totalRowsProcessed}
            </Badge>
          </Group>
        </Group>

        {/* Table with scroll for large content */}
        <ScrollArea h="60vh">
          {/* style={{ maxHeight: "60vh" }}  */}
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 80 }}>Row #</Table.Th>
                {headers.map((header) => (
                  <Table.Th key={header.name}>{header.label}</Table.Th>
                ))}
                <Table.Th style={{ width: 120 }}>Status</Table.Th>
                <Table.Th style={{ minWidth: 200 }}>Details</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedRows.map((row) => {
                const isSuccess = row.status === "success";
                return (
                  <Table.Tr
                    key={`${row.rowNumber}-${row.status}`}
                    style={{
                      backgroundColor: isSuccess
                        ? "var(--mantine-color-green-0)"
                        : "var(--mantine-color-red-0)",
                    }}
                  >
                    <Table.Td>{row.rowNumber}</Table.Td>
                    {headers.map((header) => (
                      <Table.Td key={header.name}>
                        {renderCellValue(row.questionData[header.name])}
                      </Table.Td>
                    ))}
                    <Table.Td>
                      <Badge
                        color={isSuccess ? "green" : "red"}
                        variant="filled"
                      >
                        {isSuccess ? "Success" : "Error"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {isSuccess ? (
                        <Text size="xs" c="dimmed">
                          Question ID: {row.questionId}
                        </Text>
                      ) : (
                        <Text size="xs" c="red">
                          {row.errorMessage}
                        </Text>
                      )}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <Group justify="center" mt="md">
            <Pagination
              total={totalPages}
              value={activePage}
              onChange={setActivePage}
              withEdges
            />
          </Group>
        )}

        {/* Footer with close button (optional, Mantine Modal already has close icon) */}
        <Group justify="flex-end">
          {/* You can add a custom "Close" button if needed */}
        </Group>
      </Stack>
    </Modal>
  );
}
