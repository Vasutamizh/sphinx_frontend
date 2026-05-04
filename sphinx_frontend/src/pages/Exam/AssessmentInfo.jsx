// steps/AssessmentInfoStep.tsx
import {
  Button,
  Grid,
  Group,
  NumberInput,
  Stack,
  TextInput,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useAPI from "../../hooks/useAPI";
import { loaderActions } from "../../store/LoaderReducer";
import { failureToast, successToast } from "../../utils/toast";

export function AssessmentInfoStep({
  assessment,
  updateAssessment,
  navProps = {},
}) {
  const navigate = useNavigate();
  const location = useLocation();
  assessment = assessment || location.state?.exam;
  const dispatch = useDispatch();
  const { handleBack, handleNext, isLastStep, isFirstStep } = navProps;
  // console.log("ASSESSMENT => ", assessment);
  const { apiPut, apiPost, isError } = useAPI();

  const theme = useMantineTheme();

  const form = useForm({
    mode: "controlled",
    initialValues: {
      examName: assessment.examName || "",
      description: assessment.description || "",
      duration: assessment.duration || 20,
      passPercentage: assessment.passPercentage || 75,
      noOfQuestions: assessment.noOfQuestions || 0,
      answersMust: assessment.answersMust || 0,
    },

    validate: {
      examName: (value) => {
        if (!value) {
          return "This field is required";
        } else if (value.trim().length < 5 || value.trim().length > 100) {
          return "Assessment Name Should be 10 - 100 Character long!";
        }
      },

      description: (value) => {
        if (!value) {
          return "This field is required";
        } else if (value.trim().length < 5 || value.trim().length > 180) {
          return "Assessment description Should be 10 - 200 Character long!";
        }
      },

      duration: (value) => {
        if (!value) {
          return "This field is required";
        } else if (value < 5 || value > 180) {
          return "Duration Should be 5 - 180 Minutes long!";
        }
      },

      passPercentage: (value) => {
        if (!value) {
          return "This field is required";
        } else if (value < 1 || value > 100) {
          return "Pass Percentage Should be in between 1 - 100 !";
        }
      },

      noOfQuestions: (value) => {
        if (!value) {
          return "This field is required";
        } else if (value < 1) {
          return "Total no of questions should be greater than 0 !";
        }
      },
      answersMust: (value, values) => {
        if (!value) {
          return "This field is required";
        } else if (value < 1 || value > values.noOfQuestions) {
          return "Minimum answered Questions should be in between 1 & Total No of Questions !";
        }
      },
    },
  });

  useEffect(() => {
    if (!assessment) form.setInitialValues(assessment);
  }, []);

  const handleForm = async (formValues) => {
    try {
      dispatch(loaderActions.loaderOn());

      let payload = {
        examName: formValues.examName,
        description: formValues.description,
        noOfQuestions: String(formValues.noOfQuestions),
        duration: String(formValues.duration),
        passPercentage: String(formValues.passPercentage),
        questionsRandomized: "0",
        answersMust: String(formValues.answersMust),
        allowNegativeMarks: "1",
        negativeMarkValue: "0",
      };

      let response;
      if (assessment.examId) {
        payload.examId = assessment.examId;
        response = await apiPut("/exam", payload);
      } else {
        response = await apiPost("/exam", payload);
      }

      if (isError(response)) {
        failureToast(response.errorMessage || response.error);
        return;
      }

      formValues.examId = response.examId;
      successToast(response.successMessage);
      if (updateAssessment) {
        updateAssessment(formValues);
      }
      if (location.state?.exam) {
        navigate("/");
        return;
      }
      if (handleNext) {
        handleNext();
      }
    } catch (err) {
      console.error("Error While Creating Assessment => ", err);
    } finally {
      dispatch(loaderActions.loaderOff());
    }
  };
  return (
    <form
      onSubmit={form.onSubmit(
        (values) => handleForm(values),
        (error) => console.error("VALIDATION ERROR => ", error),
      )}
    >
      <Stack>
        {location.state?.exam && (
          <>
            <Title>Update Assessment</Title>
          </>
        )}
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              withAsterisk
              {...form.getInputProps("examName")}
              label="Assessment Name"
              placeholder="e.g., Frontend Developer Test"
              name="examName"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              withAsterisk
              {...form.getInputProps("duration")}
              label="Duration (minutes)"
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              withAsterisk
              {...form.getInputProps("description")}
              label="Description"
              rows={5}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              withAsterisk
              {...form.getInputProps("noOfQuestions")}
              label="Total Questions"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              withAsterisk
              {...form.getInputProps("passPercentage")}
              label="Pass Percentage (%)"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              withAsterisk
              {...form.getInputProps("answersMust")}
              label="Minimum Questions to Attend"
            />
          </Grid.Col>
          {/* <Grid.Col>
            <Button variant="outline" type="submit">
              Create Assement
            </Button>
          </Grid.Col> */}
        </Grid>
        {/* Navigation buttons */}
        <Group justify="space-between" mt="xl">
          {!location.state?.exam && (
            <Button
              variant="default"
              onClick={handleBack}
              disabled={isFirstStep}
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            c={theme.colors.slate[0]}
            color={isLastStep ? "green" : "blue"}
          >
            {location.state?.exam ? "Update" : "Save & Next"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
