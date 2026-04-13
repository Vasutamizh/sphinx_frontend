import {
  BarChart3,
  BookOpen,
  Cog,
  Layers,
  Pencil,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  View,
} from "lucide-react";
import { useEffect, useState } from "react";
import { IoCreate } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { apiGet, apiPost, isError } from "../services/ApiService";
import {
  ActionRow,
  CardFooter,
  CardHeader,
  CardTitle,
  EmptyState,
  IconButton,
  StyledTable,
  TableCard,
  TableScrollWrapper,
  TBody,
  Td,
  Th,
  THead,
  Tr,
  Wrapper,
} from "../styles/AssignUsersPage.styles";
import {
  BlueActionLabel,
  StatsCard,
  StatsHeader,
  StatsIcon,
  StatsTitle,
  StatsValue,
  StatsWrapper,
  StyledNavLink,
  SubContainer,
} from "../styles/ExamMasterPage.styles";

import DeleteExamModal from "../components/Modal_Components/DeleteExamModal";
import { failureToast, successToast } from "../utils/toast";

function ExamMasterPage() {
  const partyId = useSelector((state) => state.auth.partyId);

  const [examList, setExamList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [examCount, setExamCount] = useState(0);
  const [topicCount, setTopicCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    getAllExam();
    getCounts();
  }, []);

  const getAllExam = async () => {
    const response = await apiPost("/exam/getAllExamsByAdmin", { partyId });
    if (response.responseMessage === "success") {
      setExamList(response.data);
    } else {
      failureToast(response.errorMessage || response.error);
    }
  };

  const setupExam = async (examId) => {
    const response = await apiPost("/exam/setupExam", { examId });
    if (isError(response)) {
      failureToast(
        response.errorMessage || response.error || "Failed to setup exam!",
      );
    } else {
      successToast(
        response.successMessage || "Exam Setup Successfully Completed!",
      );
    }
  };

  const getCounts = async () => {
    const examRes = await apiPost("/exam/examCount", { partyId });
    if (examRes.responseMessage === "success") {
      setExamCount(examRes.count);
    }

    const topicRes = await apiGet("/topics/getTopicCount");
    if (topicRes.responseMessage === "success") {
      setTopicCount(topicRes.count);
    }

    const userRes = await apiGet("/auth/getAllUsersCount");
    if (userRes.responseMessage === "success") {
      setUsersCount(userRes.count);
    }
  };

  const openDeleteModal = (examId) => {
    setSelectedExamId(examId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedExamId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteSuccess = (examId) => {
    setExamList((prev) => prev.filter((e) => e.examId !== examId));
  };

  return (
    <>
      <StatsWrapper>
        <StatsCard color="#4F46E5">
          <StatsHeader>
            <StatsIcon color="#4F46E5" bg="#EEF2FF">
              <BarChart3 size={20} />
            </StatsIcon>
          </StatsHeader>
          <StatsTitle>Total Assessments</StatsTitle>
          <StatsValue>{examCount}</StatsValue>
        </StatsCard>

        <StatsCard color="#059669">
          <StatsHeader>
            <StatsIcon color="#059669" bg="#ECFDF5">
              <Users size={20} />
            </StatsIcon>
          </StatsHeader>
          <StatsTitle>Total Users</StatsTitle>
          <StatsValue>{usersCount}</StatsValue>
        </StatsCard>

        <StatsCard color="#D97706">
          <StatsHeader>
            <StatsIcon color="#D97706" bg="#FFFBEB">
              <Layers size={20} />
            </StatsIcon>
          </StatsHeader>
          <StatsTitle>Total Topics</StatsTitle>
          <StatsValue>{topicCount}</StatsValue>
        </StatsCard>

        <StatsCard color="#DC2626">
          <StatsHeader>
            <StatsIcon color="#DC2626" bg="#FEF2F2">
              <BookOpen size={20} />
            </StatsIcon>
          </StatsHeader>
          <StatsTitle>Launched Assessments</StatsTitle>
          <StatsValue>{examList.length}</StatsValue>
        </StatsCard>
      </StatsWrapper>

      <Wrapper>
        <TableCard>
          <CardHeader>
            <CardTitle>
              <ShieldCheck size={18} />
              Available Assessments
            </CardTitle>
            <SubContainer>
              <StyledNavLink as={Link} to="/createExam" className="edit">
                <IoCreate size={18} />
                <BlueActionLabel>Create Exam</BlueActionLabel>
              </StyledNavLink>

              <StyledNavLink as={Link} to="/allQuestions" className="edit">
                <View size={18} />
                <BlueActionLabel>View All Questions</BlueActionLabel>
              </StyledNavLink>
            </SubContainer>
          </CardHeader>

          <TableScrollWrapper>
            <StyledTable>
              <THead>
                <Tr>
                  <Th>S.No</Th>
                  <Th>Exam Name</Th>
                  <Th>Duration (min)</Th>
                  <Th>Total Questions</Th>
                  <Th>Pass %</Th>
                  <Th $align="center">Actions</Th>
                </Tr>
              </THead>

              <TBody>
                {examList.length === 0 ? (
                  <Tr>
                    <Td colSpan="6">
                      <EmptyState>
                        No Exams Available. Click "Create Exam" to add one.
                      </EmptyState>
                    </Td>
                  </Tr>
                ) : (
                  examList.map((exam, index) => (
                    <Tr key={exam.examId} $index={index}>
                      <Td>{index + 1}</Td>
                      <Td>{exam.examName}</Td>
                      <Td>{exam.duration}</Td>
                      <Td>{exam.noOfQuestions}</Td>
                      <Td>{exam.passPercentage}%</Td>
                      <Td $align="center">
                        <ActionRow>
                          <IconButton
                            as={Link}
                            to="/assignUsers"
                            state={{ exam }}
                            $variant="edit"
                            title="Assign Users"
                          >
                            <UserPlus size={16} />
                          </IconButton>

                          <IconButton
                            as={Link}
                            to="/createExam"
                            state={{ exam }}
                            $variant="edit"
                            title="Edit Exam"
                          >
                            <Pencil size={16} />
                          </IconButton>

                          <IconButton
                            as={Link}
                            to="/ExamQuestions"
                            state={{ exam }}
                            $variant="edit"
                            title="View Questions"
                          >
                            <BookOpen size={16} />
                          </IconButton>

                          <IconButton
                            onClick={() => openDeleteModal(exam.examId)}
                            $variant="delete"
                            title="Delete Exam"
                          >
                            <Trash2 size={16} />
                          </IconButton>
                          <IconButton
                            onClick={() => setupExam(exam.examId)}
                            $variant="edit"
                            title="Setup Exam"
                          >
                            <Cog size={16} />
                          </IconButton>
                        </ActionRow>
                      </Td>
                    </Tr>
                  ))
                )}
              </TBody>
            </StyledTable>
          </TableScrollWrapper>

          <CardFooter>
            <span>
              {examList.length} exam
              {examList.length !== 1 ? "s" : ""} available
            </span>
          </CardFooter>
        </TableCard>
      </Wrapper>

      {/* Delete Modal */}
      <DeleteExamModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        examId={selectedExamId}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </>
  );
}

export default ExamMasterPage;
