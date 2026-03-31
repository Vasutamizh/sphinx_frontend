import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiPost, apiGet, apiPut, apiDelete } from "../services/ApiService";
import {
  ExamFormValidation,
  validateTopicForm,
} from "../services/ValidationService";
import {
  BlackInputLabel,
  ErrorBox,
  FormErrorMessage,
  MandatoryInp,
  StyledSelect,
  TextArea,
  TextInput,
} from "../styles/common.styles";

function ExamCreationPage() {
  // exam states
  const [examName, setExamName] = useState("");
  const [description, setDescription] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState("");
  const [duration, setDuration] = useState("");
  const [passPercentage, setPassPercentage] = useState("");
  const [questionsRandomized, setQuestionsRandomized] = useState("0");
  const [answersMust, setAnswersMust] = useState("");
  const [allowNegativeMarks, setAllowNegativeMarks] = useState("0");
  const [negativeMarkValue, setNegativeMarkValue] = useState("");
  const [responseError, setResponseError] = useState("");
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [examId, setExamId] = useState("");

  // topic states
  const [topicOptions, setTopicOptions] = useState([]);

  // added exam topics
  const [examTopics, setExamTopics] = useState([]);

  // topic form states
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [selectedTopicName, setSelectedTopicName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [topicError, setTopicError] = useState({});
  const [isTopicLoading, setIsTopicLoading] = useState(false);

  const [editTopicId, setEditTopicId] = useState(null);

  // fetch topics list to dropdown
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

  // fetch exam topics
  useEffect(() => {
    if (!examId) return;
    const getExamTopics = async () => {
      const response = await apiGet("/exam/topics");
      if (response.responseMessage === "success") {
        setExamTopics(response.examTopicList);
      }
    };
    getExamTopics();
  }, [examId]);

  //exam submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError({});
    setResponseError("");
    setIsLoading(true);

    const examFormData = {
      examName,
      description,
      noOfQuestions,
      duration,
      passPercentage,
      questionsRandomized,
      answersMust,
      allowNegativeMarks,
      negativeMarkValue,
    };

    const errors = ExamFormValidation(examFormData);

    if (Object.keys(errors).length === 0) {
      const response = await apiPost("/exam", examFormData);
      if (response.responseMessage === "success") {
        console.log(response);
        toast.success(response.successMessage, { position: "top-right" });
        setExamId(response.examId);
      } else {
        setResponseError(response.errorMessage);
        toast.error(response.errorMessage, { position: "top-right" });
      }
    } else {
      setFormError(errors);
    }

    setIsLoading(false);
  };

  // add topic
  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!examId) {
      toast.error("Please create the exam first before adding topics.", {
        position: "top-right",
      });
      return;
    }

    const errors = validateTopicForm();
    if (Object.keys(errors).length > 0) {
      setTopicError(errors);
      return;
    }
    setTopicError({});
    setIsTopicLoading(true);

    const questionsPerExam = Math.round(
      (Number(noOfQuestions) * Number(percentage)) / 100,
    );

    const payload = {
      examId: examId,
      topicId: selectedTopicId,
      topicName: selectedTopicName,
      percentage: percentage,
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

  //edit topic
  const handleEditTopic = (topic) => {
    setEditTopicId(topic.topicId);
    setSelectedTopicId(topic.topicId);
    setSelectedTopicName(topic.topicName);
    setPercentage(topic.percentage);
    setTopicError({});
  };

  //update topic
  const handleUpdateTopic = async (e) => {
    e.preventDefault();
    const errors = validateTopicForm();
    if (Object.keys(errors).length > 0) {
      setTopicError(errors);
      return;
    }
    setTopicError({});
    setIsTopicLoading(true);

    const questionsPerExam = Math.round(
      (Number(noOfQuestions) * Number(percentage)) / 100,
    );

    const payload = {
      examId,
      topicId: selectedTopicId,
      topicName: selectedTopicName,
      percentage: Number(percentage),
      questionsPerExam,
      topicPassPercentage: parseFloat(topicPassPercentage),
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

  //delete topic
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

  const resetTopicForm = () => {
    setSelectedTopicId("");
    setSelectedTopicName("");
    setPercentage("");
    setTopicPassPercentage("");
    setEditTopicId(null);
    setTopicError({});
  };

  const totalPct = examTopics.reduce((sum, t) => sum + Number(t.percentage), 0);

  return (
    <>
      <h1>Exam Creation Screen</h1>
      {responseError && <ErrorBox>{responseError}</ErrorBox>}

      {/* examform */}
      <form onSubmit={handleSubmit}>
        <BlackInputLabel htmlFor="examName">
          Exam name <MandatoryInp>*</MandatoryInp>
        </BlackInputLabel>
        <TextInput
          id="examName"
          type="text"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          placeholder="Enter exam name"
        />
        {formError.examName && (
          <FormErrorMessage>{formError.examName}</FormErrorMessage>
        )}

        <BlackInputLabel htmlFor="description">
          Exam Description
        </BlackInputLabel>
        <TextArea
          id="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="Enter Exam Description"
        />
        {formError.description && (
          <FormErrorMessage>{formError.description}</FormErrorMessage>
        )}
        <br />
        <br />

        <div className="flex flex-colum gap-3">
          <div>
            <BlackInputLabel htmlFor="noOfQuestions">
              Total Number Of Questions <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <TextInput
              id="noOfQuestions"
              type="number"
              onChange={(e) => setNoOfQuestions(e.target.value)}
              value={noOfQuestions}
              placeholder="Enter No Of Questions"
            />
            {formError.noOfQuestions && (
              <FormErrorMessage>{formError.noOfQuestions}</FormErrorMessage>
            )}
          </div>
          <div>
            <BlackInputLabel htmlFor="duration">
              Exam Duration (In Minutes) <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <TextInput
              id="duration"
              type="number"
              onChange={(e) => setDuration(e.target.value)}
              value={duration}
              placeholder="Enter Exam Duration"
            />
            {formError.duration && (
              <FormErrorMessage>{formError.duration}</FormErrorMessage>
            )}
          </div>
          <div>
            <BlackInputLabel htmlFor="passPercentage">
              Exam Pass Percentage (%) <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <TextInput
              id="passPercentage"
              type="number"
              onChange={(e) => setPassPercentage(e.target.value)}
              value={passPercentage}
              placeholder="Enter Exam Pass Percentage"
            />
            {formError.passPercentage && (
              <FormErrorMessage>{formError.passPercentage}</FormErrorMessage>
            )}
          </div>
        </div>
        <br />

        <div className="flex flex-colum gap-25">
          <div>
            <BlackInputLabel htmlFor="randomQuestion">
              Select Question Visibility <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <StyledSelect
              onChange={(e) => setQuestionsRandomized(e.target.value)}
            >
              <option value="0">Random Order</option>
              <option value="1">Same Order</option>
            </StyledSelect>
            {formError.questionsRandomized && (
              <FormErrorMessage>
                {formError.questionsRandomized}
              </FormErrorMessage>
            )}
          </div>
          <div>
            <BlackInputLabel htmlFor="mustAnswer">
              Minimum Questions To Attend <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <TextInput
              id="mustAnswer"
              type="number"
              onChange={(e) => setAnswersMust(e.target.value)}
              value={answersMust}
              placeholder="Enter the Minimum questions to attend"
            />
            {formError.answersMust && (
              <FormErrorMessage>{formError.answersMust}</FormErrorMessage>
            )}
          </div>
        </div>
        <br />

        <div className="flex flex-colum gap-70">
          <div>
            <BlackInputLabel htmlFor="negativeMarks">
              Allow Negative Marks <MandatoryInp>*</MandatoryInp>
            </BlackInputLabel>
            <StyledSelect
              onChange={(e) => setAllowNegativeMarks(e.target.value)}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </StyledSelect>
            {formError.allowNegativeMarks && (
              <FormErrorMessage>
                {formError.allowNegativeMarks}
              </FormErrorMessage>
            )}
          </div>
          <div>
            {allowNegativeMarks === "1" && (
              <>
                <BlackInputLabel htmlFor="negativeMarkValue">
                  Negative Marks Value <MandatoryInp>*</MandatoryInp>
                </BlackInputLabel>
                <TextInput
                  id="negativeMarkValue"
                  type="number"
                  onChange={(e) => setNegativeMarkValue(e.target.value)}
                  value={negativeMarkValue}
                  placeholder="Enter Negative Marks"
                />
                {formError.negativeMarkValue && (
                  <FormErrorMessage>
                    {formError.negativeMarkValue}
                  </FormErrorMessage>
                )}
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !!examId}
          className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white
                     bg-gradient-to-r from-indigo-600 to-violet-600
                     hover:from-indigo-500 hover:to-violet-500
                     active:scale-[0.98] transition-all duration-200
                     shadow-lg shadow-indigo-500/25
                     disabled:opacity-60 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Creating Exam...
            </span>
          ) : examId ? (
            "Exam Created ✓"
          ) : (
            "Create Exam"
          )}
        </button>
      </form>

      {/*topics Section */}
      {examId && (
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
                  <FormErrorMessage>
                    {topicError.selectedTopicId}
                  </FormErrorMessage>
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

          {/* topics table*/}
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
                  style={{
                    borderBottom: "1px solid #ced6e0",
                    textAlign: "left",
                  }}
                >
                  <th
                    style={{
                      padding: "10px 12px",
                      color: "#888",
                      fontWeight: 500,
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      padding: "10px 12px",
                      color: "#888",
                      fontWeight: 500,
                    }}
                  >
                    Topic Name
                  </th>
                  <th
                    style={{
                      padding: "10px 12px",
                      color: "#888",
                      fontWeight: 500,
                    }}
                  >
                    Question %
                  </th>

                  <th
                    style={{
                      padding: "10px 12px",
                      color: "#888",
                      fontWeight: 500,
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {examTopics.map((topic, index) => (
                  <tr
                    key={topic.topicId}
                    style={{
                      borderBottom: "0.5px solid #ced6e0",
                      background:
                        editTopicId === topic.topicId
                          ? "#f5f3ff"
                          : "transparent",
                    }}
                  >
                    <td style={{ padding: "10px 12px", color: "#aaa" }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: "10px 12px", fontWeight: 500 }}>
                      {topic.topicName}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        style={{
                          background: "#EEEDFE",
                          color: "#3C3489",
                          padding: "2px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {topic.percentage}%
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleEditTopic(topic)}
                        style={{
                          background: "#E6F1FB",
                          color: "#185FA5",
                          border: "none",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTopic(topic.topicId)}
                        style={{
                          background: "#FCEBEB",
                          color: "#A32D2D",
                          border: "none",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "1px solid #ced6e0" }}>
                  <td
                    colSpan={6}
                    style={{
                      padding: "8px 12px",
                      fontSize: "13px",
                      color: "#888",
                    }}
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
        </div>
      )}
    </>
  );
}

export default ExamCreationPage;
