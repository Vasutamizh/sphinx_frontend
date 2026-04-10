import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiGet, apiPost } from "../services/ApiService";
import { failureToast, successToast } from "../utils/toast";

export const useTopics = () => {
  const [topics, setTopics] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchAll = async () => {
    try {
      const [typesRes, topicsRes] = await Promise.all([
        apiGet("/questions/questionTypes"),
        apiGet("/topics"),
      ]);

      if (typesRes.responseMessage === "success") {
        setQuestionTypes(typesRes.data);
      }

      if (topicsRes.responseMessage === "success") {
        setTopics(topicsRes.topicList);
      }
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  const createTopic = async (topicName) => {
    const res = await apiPost("/topics", { topicName });
    if (res.responseMessage === "success") {
      setTopics((prev) => [
        ...prev,
        { topicId: res.topicId, topicName: res.topicName },
      ]);
      successToast(res.successMessage);
    } else {
      failureToast(res.errorMessage);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    topics,
    questionTypes,

    createTopic,
    openModal,
    setOpenModal,
  };
};
