// steps/TopicsManagerStep.tsx
import {
  Button,
  Checkbox,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useAPI from "../../hooks/useAPI";
import { loaderActions } from "../../store/LoaderReducer";
import { failureToast, successToast } from "../../utils/toast";

export function AssessmentTopicManager({
  assessmentId,
  topics,
  setTopics,
  navProps,
  totalPct,
  topicForEdit,
  setTopicForEdit,
}) {
  //   const [selectedTopic, setSelectedTopic] = useState();

  const theme = useMantineTheme();
  const { apiGet, apiPost, apiPut, isError } = useAPI();
  const [savedTopics, setSavedTopics] = useState([]);

  const dispatch = useDispatch();

  const { handleBack, handleNext, isLastStep, isFirstStep } = navProps;

  const form = useForm({
    mode: "controlled",
    initialValues: {
      topicId: "",
      percentage: 0,
      passPercentage: 75,
      savePermanently: false,
    },
    validate: {
      topicId: (value) =>
        (value === null || value === undefined) && "This field is required",
      percentage: (value) => {
        if (value === null || value === undefined) {
          return "This field is required";
        } else if (value < 1 || value > 100) {
          return "Percentage should be 1 - 100";
        }
      },
      passPercentage: (value) => {
        if (value === null || value === undefined) {
          return "This field is required";
        } else if (value < 1 || value > 100) {
          return "Pass Percentage should be 1 - 100";
        }
      },
    },
  });

  const addTopic = async (topicData) => {
    if (totalPct + topicData.percentage > 100) {
      failureToast(
        "Overall Percentage Exceeded! Reduce the Question weightage!",
      );
      return;
    }
    const existingTopic = topics.find((t) => t.topicId === topicData.topicId);
    let modifiedTopics = [];
    if (existingTopic) {
      existingTopic.percentage =
        existingTopic.percentage + topicData.percentage;

      if (existingTopic.passPercentage + topicData.passPercentage > 100) {
        failureToast("Pass Percentage, Reduce to 100%");
        return;
      }
      existingTopic.passPercentage =
        existingTopic.passPercentage + topicData.passPercentage;
      modifiedTopics = [...topics];
      modifiedTopics.filter((t) => t.topicId !== topicData.topicId);
      modifiedTopics.push(existingTopic);
    } else {
      modifiedTopics = [
        ...topics,
        { id: topicData.topicId, ...topicData, questions: [] },
      ];
    }

    // api call to add topic in db.
    try {
      dispatch(loaderActions.loaderOn());
      const payload = {
        examId: assessmentId,
        topicId: topicData.topicId,
        topicName: topicData.topicId,
        percentage: String(topicData.percentage),
        topicPassPercentage: String(topicData.passPercentage),
      };
      // console.log("TOPIC PAYLOAD => ", payload);
      // return;
      const response = await apiPost("/exam/topics", payload);
      if (isError(response)) {
        failureToast(response.errorMessage || response.error);
        return;
      } else {
        successToast(response.successMessage);
        if (topicData.savePermanently) {
          const response = await apiPost("/topics", {
            topicName: topicData.topicId,
          });
          if (isError(response)) {
            failureToast(response.errorMessage || response.error);
            return;
          }
        }

        setTopics(modifiedTopics); // set local changes
      }
    } catch (err) {
      console.error("Error while add topic => ", err);
    } finally {
      dispatch(loaderActions.loaderOff());
    }

    setTopicForEdit(null);
    form.reset();
  };

  useEffect(() => {
    if (topicForEdit) {
      form.setInitialValues(topicForEdit);
    }

    const getAllTopicIds = async () => {
      const response = await apiGet("/topics");
      if (isError(response)) {
        failureToast(response.errorMessage || response.error);
      } else {
        if (response.topicList) {
          const newArr = response.topicList.map((t) => {
            return { label: t.topicId, value: t.topicId };
          });
          // console.log("NEW ARR => ", newArr);
          setSavedTopics(newArr || []);
        }
      }
    };

    getAllTopicIds();
  }, []);

  // Render your topic list + form here (similar to earlier design)
  return (
    <Stack>
      {/* Topic Form (simplified) */}
      <form
        onSubmit={form.onSubmit(
          (values) => {
            // console.log("SUBMITTED", values);
            addTopic(values);
          },
          (errors) => {
            // console.log("VALIDATION ERRORS", errors);
          },
        )}
      >
        <Select
          // {...form.getInputProps("topicId")}
          label="Available Topic (Template)"
          data={savedTopics}
          placeholder="Select Saved Topic"
          onChange={(event) => {
            // console.log("EVENT => ", event);
            // console.log("CHANGED VALUE => ", event);
            form.setFieldValue("topicId", event || "");
          }}
        />
        <Text>(or)</Text>
        <TextInput
          {...form.getInputProps("topicId")}
          label="Topic Name"
          placeholder="e.g., React Hooks"
        />
        <NumberInput
          {...form.getInputProps("percentage")}
          label="Weightage (%)"
        />
        <NumberInput
          {...form.getInputProps("passPercentage")}
          label="Pass Percentage (%)"
        />
        <Checkbox
          {...form.getInputProps("savePermanently", { type: "checkbox" })}
          label="Save Topic for future use"
          mt={10}
        />
        <Button
          type="submit"
          variant="filled"
          mt={10}
          disabled={totalPct >= 100}
        >
          Add Topic <PlusIcon size={18} />
        </Button>
      </form>
      <Group justify="space-between" mt="xl">
        <Button variant="default" onClick={handleBack} disabled={isFirstStep}>
          Back
        </Button>
        <Button
          type="submit"
          onClick={handleNext}
          c={theme.colors.slate[0]}
          variant="filled"
          disabled={totalPct !== 100}
        >
          {isLastStep ? "Submit" : "Proceed to Add Question"}
        </Button>
      </Group>
    </Stack>
  );
}
