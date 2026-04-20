import { useEffect, useState } from "react";
import { toast } from "sonner";
import { failureToast, successToast } from "../utils/toast";
import useAPI from "./useAPI";

export const useTopics = () => {
  const { apiGet, apiPost } = useAPI();

  const [topics, setTopics] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchAll = async () => {
    try {
      const [topicsRes] = await Promise.all([apiGet("/topics")]);

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
    createTopic,
    openModal,
    setOpenModal,
  };
};
