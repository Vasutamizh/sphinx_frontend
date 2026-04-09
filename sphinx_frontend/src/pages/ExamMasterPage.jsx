import { BookOpen, Pencil, Trash2, UserPlus, View } from "lucide-react";
import { useEffect, useState } from "react";
import { IoCreate } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { apiDelete, apiPost } from "../services/ApiService";
import {
  ActionButton,
  ActionItem,
  Actions,
  BlueActionLabel,
  ExamCard,
  ExamContainer,
  ExamHeader,
  ExamTitle,
  StyledH2,
  StyledNavLink,
  SubContainer,
} from "../styles/ExamMasterPage.styles";
import { failureToast, successToast } from "../utils/toast";

function ExamMasterPage() {
  // getting the partyId from the store.
  const partyId = useSelector((state) => state.auth.partyId);

  const [examList, setExamList] = useState([]);

  useEffect(() => {
    getAllExam();
  }, []);

  const getAllExam = async () => {
    if (!partyId) {
      failureToast(
        "Seems to be Issue in your Sign In! Please make Sign Out and Sign In again!",
      );
    }

    const response = await apiPost("/exam/getAllExamsByAdmin", { partyId });
    if (response.responseMessage === "success") {
      setExamList(response.data);
    } else {
      failureToast(response.errorMessage || response.error || response.message);
    }
  };

  const deleteExam = async (examId) => {
    const response = await apiDelete("/exam", { examId });
    if (response.responseMessage && response.responseMessage === "success") {
      successToast(response.successMessage);
      setExamList((prev) => prev.filter((e) => e.examId !== examId));
    } else {
      failureToast(response.errorMessage || "Failed to delete exam");
    }
  };

  return (
    <>
      <ExamContainer>
        Exams
        <SubContainer>
          <div>
            <StyledNavLink
              as={Link}
              to="/createExam"
              className="edit"
              title="Update Exam"
            >
              <IoCreate size={18} strokeWidth={2.2} />
              <BlueActionLabel>Create Exam</BlueActionLabel>
            </StyledNavLink>
          </div>
          <div>
            <StyledNavLink as={Link} to="/allQuestions" className="edit">
              <View size={18} strokeWidth={2.2} />
              <BlueActionLabel>View All Questions</BlueActionLabel>
            </StyledNavLink>
          </div>
        </SubContainer>
      </ExamContainer>

      <StyledH2>Available exam</StyledH2>
      {examList.length === 0 && (
        <div className="text-center">
          <h3>
            No Exams are available! Please Create One using Create Exam Button!
          </h3>
        </div>
      )}
      {examList.map((e) => (
        <ExamCard key={e.examId}>
          <ExamHeader>
            <ExamTitle>{e.examName}</ExamTitle>
          </ExamHeader>

          <Actions>
            <ActionItem>
              <ActionButton
                as={Link}
                to="/assignUsers"
                className="edit"
                state={{ exam: e }}
              >
                <UserPlus size={18} />
              </ActionButton>
              <span>Assign</span>
            </ActionItem>

            <ActionItem>
              <ActionButton
                as={Link}
                to="/createExam"
                state={{ exam: e }}
                className="edit"
              >
                <Pencil size={18} />
              </ActionButton>
              <span>Edit</span>
            </ActionItem>

            <ActionItem>
              <ActionButton
                className="topics"
                as={Link}
                to="/ExamQuestions"
                state={{ exam: e }}
              >
                <BookOpen size={18} />
              </ActionButton>
              <span>Questions</span>
            </ActionItem>

            <ActionItem>
              <ActionButton
                className="delete"
                onClick={() => deleteExam(e.examId)}
              >
                <Trash2 size={18} />
              </ActionButton>
              <span>Delete</span>
            </ActionItem>
          </Actions>
        </ExamCard>
      ))}
    </>
  );
}

export default ExamMasterPage;
