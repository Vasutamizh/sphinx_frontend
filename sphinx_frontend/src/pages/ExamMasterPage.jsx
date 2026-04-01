import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "../services/ApiService";
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

// ICONS
import { FiEdit, FiTrash2, FiPlusCircle } from "react-icons/fi";
import { MdOutlineTopic } from "react-icons/md";

function ExamMasterPage() {
  const [examList, setExamList] = useState([]);

  useEffect(() => {
    const getAllExam = async () => {
      const response = await apiGet("/exam");
      if (response.responseMessage === "success") {
        setExamList(response.examList);
        toast.success("Exams displayed", { position: "top-right" });
      } else {
        toast.error(response.errorMessage, { position: "top-right" });
      }
    };
    getAllExam();
  }, []);

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
            <StyledNavLink
              as={Link}
              to="/createExam"
              state={{ exam: e.examId }}
              className="edit"
              title="Update Exam"
            >
              <Pencil size={18} strokeWidth={2.2} />
            </StyledNavLink>

            <StyledNavLink className="add" title="Add Topics">
              <BookOpen size={18} strokeWidth={2.2} />
            </StyledNavLink>

            <StyledNavLink className="delete" title="Delete Exam">
              <Trash2 size={18} strokeWidth={2.2} />
            </StyledNavLink>
          </SubContainer>
        </ExamContainer>
      ))}

      <StyledButton>
        <FiEdit size={18} style={{ marginRight: "6px" }} />
        Update
      </StyledButton>
    </>
  );
}

export default ExamMasterPage;
