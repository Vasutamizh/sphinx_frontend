import React, { useEffect, useState } from "react";
import { apiFilePost, apiGet } from "../services/ApiService";
import {
  BlackInputLabel,
  StyledSelect,
  TextInput,
} from "../styles/common.styles";

function ExamTopic() {
  const [topics, setTopics] = useState([]);
  const [topicName, setTopicName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [topicError, setTopicError] = useState({});
  const [topicId, setTopicId] = useState("");

  const data = {
    topicId: topicId,
    topicName: topicName,
  };
  useEffect(() => {
    const getAllTopics = async () => {
      const response = await apiGet("/topic");
      if (response.responseMessage && response.responseMessage === "success") {
        setTopics(response.topicList);
        toast.success(response.successMessage, { position: "top-right" });
      } else {
        toast.success(response.errorMessage, { position: "top-right" });
      }
    };
    getAllTopics();
  }, []);

  const addExamTopics=async()=>{
    const response=await apiFilePost("/topics,")
  }
  return (
    <div>
      <BlackInputLabel>Topic Name</BlackInputLabel>
      <StyledSelect
        id="topicName"
        value={topicId}
        onChange={(e) => {
          const selected = topics.find((t) => t.topicId === e.target.value);
          setTopicId(e.target.value);
          setTopicName(selected?.topicName || "");
        }}
      >
        <option value="" disabled>
          Select a topic
        </option>
        {topics.map((topic) => (
          <option key={topic.topicId} value={topic.topicId}>
            {topic.topicName}
          </option>
        ))}
      </StyledSelect>
      <BlackInputLabel>Question %</BlackInputLabel>
      <TextInput
        id="topicPercentage"
        type="number"
        min="1"
        max="100"
        value={percentage}
        onChange={(e) => setPercentage(e.target.value)}
        placeholder="Enter Question Percentage"
      ></TextInput>
    </div>
  );
}

export default ExamTopic;
