import React, { useEffect, useState } from "react";
import { apiDelete, apiGet } from "../services/ApiService";
import { toast } from "sonner";
import { StyledButton } from "../styles/common.styles";
import { Pencil, Trash2, BookOpen } from "lucide-react";
import {
  Button,
  ExamContainer,
  StyledH2,
  StyledNavLink,
  SubContainer,
} from "../styles/ExamMasterPage.styles";
import { Link } from "react-router-dom";

function ExamMasterPage() {
  const [examList, setExamList] = useState([]);

  useEffect(() => {
    getAllExam();
  }, []);

  const getAllExam = async () => {
    const response = await apiGet("/exam");
    if (response.responseMessage === "success") {
      setExamList(response.examList);
      toast.success("Exams displayed", { position: "top-right" });
    } else {
      toast.error(response.errorMessage, { position: "top-right" });
    }
  };

  // fixed: accept examId as param, update state directly, no undefined variables
  const deleteExam = async (examId) => {
    const response = await apiDelete("/exam", { examId });
    if (response.responseMessage === "success") {
      toast.success("Exam deleted successfully", { position: "top-right" });
      setExamList((prev) => prev.filter((e) => e.examId !== examId));
    } else {
      toast.error(response.errorMessage || "Failed to delete exam", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <ExamContainer>
        Exams
        <SubContainer>
          <StyledNavLink as={Link} to="/createExam">
            <Button>Create Exam</Button>
          </StyledNavLink>
        </SubContainer>
      </ExamContainer>

      <StyledH2>Available exam</StyledH2>

      {examList.map((e) => (
        <ExamContainer key={e.examId}>
          <div>{e.examName}</div>

          <SubContainer>
            {/* Update — navigates to form and fills all exam details */}
            <StyledNavLink
              as={Link}
              to="/createExam"
              state={{ exam: e }}
              className="edit"
              title="Update Exam"
            >
              <Pencil size={18} strokeWidth={2.2} />
            </StyledNavLink>

            <StyledNavLink className="add" title="Add Topics">
              <BookOpen size={18} strokeWidth={2.2} />
            </StyledNavLink>

            {/* fixed: arrow function so it doesn't fire immediately on render */}
            <StyledNavLink
              className="delete"
              title="Delete Exam"
              onClick={() => deleteExam(e.examId)}
            >
              <Trash2 size={18} strokeWidth={2.2} />
            </StyledNavLink>
          </SubContainer>
        </ExamContainer>
      ))}
    </>
  );
}

export default ExamMasterPage;
