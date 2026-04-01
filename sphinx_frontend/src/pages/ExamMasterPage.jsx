import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "../services/ApiService";
import { toast } from "sonner";
import { StyledButton } from "../styles/common.styles";
import {
  ExamContainer,
  StyledH2,
  StyledNavLink,
  SubContainer,
  Table,
  Td,
  Th,
} from "../styles/ExamMasterPage.styles";
import { Button } from "../styles/ExamMasterPage.styles";
import { Link } from "react-router-dom";

function ExamMasterPage() {
  const [getExam, setGetExam] = useState(false);
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

  const updateExam = async () => {
    const response = await apiPut("/exam");
    if (response.responseMessage === "success") {
      toast.success(response.successMessage, { position: "top-right" });
    } else {
      toast.error(response.errorMessage, { position: "top-right" });
    }
  };

  let index = 0;

  return (
    <>
      <ExamContainer>
        Exams
        <SubContainer>
          <Button>Create exam</Button>
        </SubContainer>
      </ExamContainer>

      <StyledH2>Available exam</StyledH2>

      {examList.map((e, index) => (
        <ExamContainer key={e.examId}>
          <div>{e.examName}</div>
          <SubContainer>
            <StyledNavLink Link to="/createExam">
              {" "}
              Update exam
            </StyledNavLink>
            <StyledNavLink>Add topics</StyledNavLink>
            <StyledNavLink>Delete Exam</StyledNavLink>
          </SubContainer>
        </ExamContainer>
      ))}

      <StyledButton>Update exam</StyledButton>
    </>
  );
}

export default ExamMasterPage;
