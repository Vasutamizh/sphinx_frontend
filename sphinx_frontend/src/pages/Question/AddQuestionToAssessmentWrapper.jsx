import { Button, Group, Tabs, useMantineTheme } from "@mantine/core";
import AddQuestionPage from "./AddQuestionPage";
import QuestionUploadPage from "./QuestionUploadPage";

function AddQuestionToAssessmentWrapper({ navProps, assessmentId }) {
  const theme = useMantineTheme();
  const { handleBack, handleNext, isLastStep, isFirstStep } = navProps;
  return (
    <div>
      <Tabs defaultValue="single">
        <Tabs.List>
          <Tabs.Tab value="single">Add Single Question</Tabs.Tab>
          <Tabs.Tab value="bulk">Upload via Excel</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="single">
          <AddQuestionPage assessmentId={assessmentId} />
        </Tabs.Panel>
        <Tabs.Panel value="bulk">
          <QuestionUploadPage />
        </Tabs.Panel>
      </Tabs>
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
          {isLastStep ? "Submit" : "Proceed to Assign Users"}
        </Button>
      </Group>
    </div>
  );
}

export default AddQuestionToAssessmentWrapper;
