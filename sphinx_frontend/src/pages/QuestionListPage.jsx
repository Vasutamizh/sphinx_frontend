import { FilterIcon, Pencil, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { apiGet, isError } from "../services/ApiService";
import {
  CardHeader,
  CardTitle,
  IconButton,
  StyledTable,
  TableCard,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from "../styles/AssignUsersPage.styles";
import { failureToast } from "../utils/toast";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    topic: "",
    questionType: "",
  });

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const response = await apiGet("/questions/getAllQuestions");
        if (isError(response)) {
          failureToast(
            response.errorMessage || response.error || "Failed to load Data!",
          );
        } else {
          setQuestions(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FilterIcon size={20} />
        <h1 className="text-xl font-semibold text-gray-800">Question Bank</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <select
          name="topic"
          value={filters.topic}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Topics</option>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
        </select>

        <select
          name="questionType"
          value={filters.questionType}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="SINGLE_CHOICE">Single Choice</option>
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading questions...
          </div>
        ) : questions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No questions found.
          </div>
        ) : (
          <TableCard>
            <CardHeader>
              <div>
                <CardTitle>
                  <ShieldCheck size={18} strokeWidth={2} />
                  Question Bank
                </CardTitle>
              </div>
            </CardHeader>
            <StyledTable role="table" aria-label="Assigned users table">
              <THead className="p-4">
                <tr role="row">
                  <Th>Question</Th>
                  <Th>Topic</Th>
                  <Th>Difficulty</Th>
                  <Th>Answers</Th>
                  <Th>Updated</Th>
                  <Th>Action</Th>
                </tr>
              </THead>
              <TBody>
                {questions.map((q) => (
                  <Tr key={q.questionId}>
                    <Td> {q.questionDetail} </Td>
                    <Td> {q.topicId} </Td>
                    <Td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          q.difficultyLevel === "EASY"
                            ? "bg-green-100 text-green-700"
                            : q.difficultyLevel === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {q.difficultyLevel}
                      </span>
                    </Td>
                    <Td> {q.numAnswers}</Td>
                    <Td>{new Date(q.lastUpdatedStamp).toLocaleDateString()}</Td>
                    <Td className="text-center">
                      <IconButton $variant="edit" title="Edit">
                        <Pencil size={14} strokeWidth={2} />
                      </IconButton>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </StyledTable>
          </TableCard>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
