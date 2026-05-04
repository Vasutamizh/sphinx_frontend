import { Button, Group, Paper, useMantineTheme } from "@mantine/core";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAPI from "../../hooks/useAPI";
import { loaderActions } from "../../store/LoaderReducer";
import { failureToast, successToast } from "../../utils/toast";
import AssignUsers from "../Exam/AssignUsersPage";

function AssignUsersToAssessmentWrapper({ navProps, assessmentId }) {
  const theme = useMantineTheme();
  const { apiPost, isError } = useAPI();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleBack, handleNext, isLastStep, isFirstStep } = navProps;

  const setupExam = async () => {
    if (!assessmentId) return;
    dispatch(loaderActions.loaderOn());
    const response = await apiPost("/exam/setupExam", {
      examId: assessmentId,
    });
    if (isError(response)) {
      failureToast(
        response.errorMessage || response.error || "Failed to setup exam!",
      );
    } else {
      successToast(
        response.successMessage || "Exam Setup Successfully Completed!",
      );
    }
    dispatch(loaderActions.loaderOff());
    navigate("/");
  };

  return (
    <div>
      <Paper shadow="md" radius="md" withBorder>
        <AssignUsers assessmentId={assessmentId} />
      </Paper>
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
          {"Finish & Setup Later"}
        </Button>
        {isLastStep && (
          <Button
            type="submit"
            onClick={setupExam}
            c={theme.colors.slate[0]}
            variant="filled"
          >
            {"Finish & Setup"}
          </Button>
        )}
      </Group>
    </div>
  );
}

export default AssignUsersToAssessmentWrapper;
