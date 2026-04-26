import { Button, Group, Paper, useMantineTheme } from "@mantine/core";
import AssignUsers from "../Exam/AssignUsersPage";

function AssignUsersToAssessmentWrapper({ navProps }) {
  const theme = useMantineTheme();
  const { handleBack, handleNext, isLastStep, isFirstStep } = navProps;
  return (
    <div>
      <Paper shadow="md" radius="md" withBorder>
        <AssignUsers />
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
          {isLastStep ? "Submit" : "Proceed to Add Question"}
        </Button>
      </Group>
    </div>
  );
}

export default AssignUsersToAssessmentWrapper;
