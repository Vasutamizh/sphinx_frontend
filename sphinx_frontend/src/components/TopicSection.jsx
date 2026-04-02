import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiDelete, apiGet, apiPost, apiPut } from "../services/ApiService";
import {
  BlackInputLabel,
  FormErrorMessage,
  MandatoryInp,
  StyledButton,
  StyledSelect,
  TextInput,
} from "../styles/common.styles";
import { Button, StyledSpan } from "../styles/ExamMasterPage.styles";
import { validateTopicForm } from "../utils/ValidationService";

function TopicSection({ examId, noOfQuestions }) {
  const [topicOptions, setTopicOptions] = useState([]);
  const [examTopics, setExamTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [selectedTopicName, setSelectedTopicName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [topicError, setTopicError] = useState({});
  const [passPercentage, setPassPercentage] = useState("");
  const [isTopicLoading, setIsTopicLoading] = useState(false);
  const [editTopicId, setEditTopicId] = useState(null);

  
  useEffect(() => {
    const getAllTopics = async () => {
      const response = await apiGet("/topics");
      if (response.responseMessage === "success") {
        setTopicOptions(response.topicList);
      } else {
        toast.error(response.errorMessage, { position: "top-right" });
      }
    };
    getAllTopics();
  }, []);

  useEffect(() => {
    if (!examId) return;
    const getExamTopics = async () => {
      const response = await apiGet(`/exam/topics/${examId}`);
      if (response.responseMessage === "success") {
        const data =response.examTopicList;

        setExamTopics(response.examTopicList);
      } else {
        toast.error(response.errorMessage, { position: "top-right" });
      }
    };
    getExamTopics();
  }, [examId]);

  const resetTopicForm = () => {
    setSelectedTopicId("");
    setSelectedTopicName("");
    setPercentage("");
    setPassPercentage("");
    setEditTopicId(null);
    setTopicError({});
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    const errors = validateTopicForm(
      selectedTopicId,
      percentage,
      examTopics,
      editTopicId,
    );
    if (Object.keys(errors).length > 0) {
      setTopicError(errors);
      return;
    }
    setTopicError({});
    setIsTopicLoading(true);

    const payload = {
      examId,
      topicId: selectedTopicId,
      topicName: selectedTopicName,
      percentage,
      passPercentage,
    };
    const response = await apiPost("/exam/topics", payload);
    if (response.responseMessage === "success") {
      toast.success(response.successMessage || "Topic added.", {
        position: "top-right",
      });
      setExamTopics((prev) => [...prev, payload]);
      resetTopicForm();
    } else {
      toast.error(response.errorMessage, { position: "top-right" });
    }
    setIsTopicLoading(false);
  };

  const handleUpdateTopic = async (e) => {
    e.preventDefault();
    const errors = validateTopicForm(
      selectedTopicId,
      percentage,
      examTopics,
      editTopicId,
    );
    if (Object.keys(errors).length > 0) {
      setTopicError(errors);
      return;
    }
    setTopicError({});
    setIsTopicLoading(true);

    const payload = {
      examId,
      topicId: selectedTopicId,
      topicName: selectedTopicName,
      percentage,
      passPercentage,
    };
    const response = await apiPut("/exam/topics", payload);
    if (response.responseMessage === "success") {
      toast.success(response.successMessage || "Topic updated.", {
        position: "top-right",
      });
      setExamTopics((prev) =>
        prev.map((t) => (t.topicId === selectedTopicId ? payload : t)),
      );
      resetTopicForm();
    } else {
      toast.error(response.errorMessage, { position: "top-right" });
    }
    setIsTopicLoading(false);
  };

  const handleEditTopic = (topic) => {
    setEditTopicId(topic.topicId);
    setSelectedTopicId(topic.topicId);
    setSelectedTopicName(topic.topicName);
    setPercentage(topic.percentage);
    setPassPercentage(topic.passPercentage);
    setTopicError({});
  };

  const handleDeleteTopic = async (topicId) => {
    const response = await apiDelete("/exam/topics", { examId, topicId });
    if (response.responseMessage === "success") {
      toast.success("Topic removed.", { position: "top-right" });
      setExamTopics((prev) => prev.filter((t) => t.topicId !== topicId));
      if (editTopicId === topicId) resetTopicForm();
    } else {
      toast.error(response.errorMessage, { position: "top-right" });
    }
  };

  const generateQuestions = async () => {
    const response = await apiPost("/exam/generate", { examId });
    if (response.responseMessage === "success") {
      toast.success(response.successMessage, { position: "top-right" });
    } else {
      toast.error(response.errorMessage, { position: "top-right" });
    }
  };

  const totalPct = examTopics.reduce((sum, t) => sum + Number(t.percentage), 0);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Exam Topics</h2>

      <form onSubmit={editTopicId ? handleUpdateTopic : handleAddTopic}>
        <div
          className="flex flex-colum gap-3"
          style={{ alignItems: "flex-end" }}
        >
          <div style={{ flex: 1 }}>
            <BlackInputLabel htmlFor="topicName">
              Topic Name <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <StyledSelect
              id="topicName"
              value={selectedTopicId}
              onChange={(e) => {
                const selected = topicOptions.find(
                  (t) => t.topicId === e.target.value,
                );
                setSelectedTopicId(e.target.value);
                setSelectedTopicName(selected?.topicName || "");
              }}
            >
              <option value="" disabled>
                Select a topic
              </option>
              {topicOptions.map((topic) => (
                <option key={topic.topicId} value={topic.topicId}>
                  {topic.topicName}
                </option>
              ))}
            </StyledSelect>
            {topicError.selectedTopicId && (
              <FormErrorMessage>{topicError.selectedTopicId}</FormErrorMessage>
            )}
          </div>

          <div style={{ width: "140px" }}>
            <BlackInputLabel htmlFor="percentage">
              Question % <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <TextInput
              id="percentage"
              type="number"
              min="1"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="e.g. 40"
            />
            {topicError.percentage && (
              <FormErrorMessage>{topicError.percentage}</FormErrorMessage>
            )}
          </div>

          <div style={{ width: "140px" }}>
            <BlackInputLabel htmlFor="passpercentage">
              Pass % <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <TextInput
              id="passpercentage"
              type="number"
              min="1"
              max="100"
              value={passPercentage}
              onChange={(e) => setPassPercentage(e.target.value)}
              placeholder="e.g. 40"
            />
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="submit"
              disabled={isTopicLoading}
              className="mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white
                         bg-gradient-to-r from-indigo-600 to-violet-600
                         hover:from-indigo-500 hover:to-violet-500
                         active:scale-[0.98] transition-all duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {editTopicId ? "Save Changes" : "+ Add Topic"}
            </button>
            {editTopicId && (
              <button
                type="button"
                onClick={resetTopicForm}
                className="mt-2 py-3 px-4 rounded-xl text-sm font-semibold
                           border border-gray-300 hover:bg-gray-100
                           active:scale-[0.98] transition-all duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {examTopics.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1.5rem",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr
              style={{ borderBottom: "1px solid #ced6e0", textAlign: "left" }}
            >
              {["No", "Topic Name", "Question %", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 12px",
                    color: "#888",
                    fontWeight: 500,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {examTopics.map((topic, index) => (
              <tr
                key={topic.topicId}
                style={{
                  borderBottom: "0.5px solid #ced6e0",
                  background:
                    editTopicId === topic.topicId ? "#f5f3ff" : "transparent",
                }}
              >
                <td style={{ padding: "10px 12px", color: "#aaa" }}>
                  {index + 1}
                </td>
                <td style={{ padding: "10px 12px", fontWeight: 500 }}>
                  {topic.topicName}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <StyledSpan>{topic.percentage}%</StyledSpan>
                </td>
                <td
                  style={{ padding: "10px 12px", display: "flex", gap: "8px" }}
                >
                  <Button type="button" onClick={() => handleEditTopic(topic)}>
                    Edit
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleDeleteTopic(topic.topicId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: "1px solid #ced6e0" }}>
              <td
                colSpan={6}
                style={{ padding: "8px 12px", fontSize: "13px", color: "#888" }}
              >
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
              </td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p
          style={{
            color: "#aaa",
            fontSize: "14px",
            marginTop: "1rem",
            textAlign: "center",
          }}
        >
          No topics added yet.
        </p>
      )}

      <StyledButton onClick={generateQuestions}>
        Generate Questions
      </StyledButton>
    </div>
  );
}

export default TopicSection;
