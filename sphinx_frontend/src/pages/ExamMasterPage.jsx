import {
  BookOpen,
  MoreVertical,
  Pencil,
  Trash2,
  UserPlus,
  View,
} from "lucide-react";
import { useEffect, useState } from "react";
import { IoCreate } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { apiDelete, apiGet, apiPost } from "../services/ApiService";
import {
  ActionButton,
  ActionItem,
  Actions,
  BlueActionLabel,
  ExamCard,
  ExamContainer,
  ExamHeader,
  ExamTitle,
  Header,
  StyledH2,
  StyledNavLink,
  SubContainer,
  Tile,
} from "../styles/ExamMasterPage.styles";
import { failureToast, successToast } from "../utils/toast";
import DeleteExamModal from "../components/Modal_Components/DeleteExamModal";
import { TbTooltip } from "react-icons/tb";

function ExamMasterPage() {
  const partyId = useSelector((state) => state.auth.partyId);

  const [examList, setExamList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [examCount, setExamCount] = useState(0);
  const [topicCount, setTopicCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [toolTip, setToolTip] = useState(false);

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
  const totalExamCount = examList.length;

  const deleteExam = async (examId) => {
    const response = await apiDelete("/exam", { examId });
    if (response.responseMessage && response.responseMessage === "success") {
      successToast(response.successMessage);
      setExamList((prev) => prev.filter((e) => e.examId !== examId));
    } else {
      failureToast(response.errorMessage || "Failed to delete exam");
    }
  };
  useEffect(() => {
    const adminExamListCount = async () => {
      const response = await apiPost("/exam/examCount", { partyId });
      if (response.responseMessage && response.responseMessage === "success") {
        successToast(response.successMessage);
        setExamCount(response.count);
      } else {
        failureToast(response.errorMessage);
      }
    };
    adminExamListCount();
  }, []);

  useEffect(() => {
    const topicListCount = async () => {
      const response = await apiGet("/topics/getTopicCount");
      if (response.responseMessage && response.responseMessage === "success") {
        successToast(response.successMessage);
        setTopicCount(response.count);
      } else {
        failureToast(response.errorMessage);
      }
    };
    topicListCount();
  }, []);

  useEffect(() => {
    const getAllUserCount = async () => {
      const response = await apiGet("/auth/getAllUsersCount");
      if (response.responseMessage && response.responseMessage === "succcess") {
        successToast(response.successMessage);
        setUsersCount(response.count);
      } else {
        failureToast(response.errorMessage);
      }
    };
    getAllUserCount();
  }, []);
  let count = 0;
  return (
    <>
      <div className="flex gap-5">
        <Tile>
          <b>Total Assessments</b>
          <h1>{examCount}</h1>
        </Tile>
        <Tile>
          <b>Total Users</b>
          <h1>{usersCount}</h1>
          <h1></h1>
        </Tile>
        <Tile>
          <b>Total Topics</b>
          <h1>{topicCount}</h1>
        </Tile>
        <Tile>
          <b>Launched Assessments</b>
        </Tile>
      </div>
      <ExamContainer>
        Available Assessments
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
      <Header>
        <p>S.No</p>
        <p>Name</p>
        <p>Duration(min)</p>
        <p>Total Questions</p>
        <p>Pass %</p>
        <p>Actions</p>
      </Header>
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
            <p>{++count}</p>
            {/* <ExamTitle>{e.examName}</ExamTitle> */}
          </ExamHeader>
          <ExamHeader>
            <p>{e.examName}</p>
            {/* <ExamTitle>{e.examName}</ExamTitle> */}
          </ExamHeader>
          <ExamHeader>
            <ExamTitle>{e.duration}</ExamTitle>
          </ExamHeader>
          <ExamHeader>
            <ExamTitle>{e.noOfQuestions}</ExamTitle>
          </ExamHeader>
          <ExamHeader>
            <ExamTitle>{e.passPercentage}</ExamTitle>
          </ExamHeader>

          <ExamHeader>
            <button
              onClick={() => setToolTip(!toolTip)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title="Actions"
            >
              <MoreVertical size={20} />
            </button>
          </ExamHeader>
          {toolTip && (
            <div className="absolute right-0 bottom-full mb-2 w-30 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
              <Actions>
                <ActionItem>
                  <ActionButton
                    as={Link}
                    to="/assignUsers"
                    className="edit"
                    state={{ exam: e }}
                  >
                    <UserPlus size={13} />
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
                    <Pencil size={13} />
                  </ActionButton>
                  <span>Edit</span>
                </ActionItem>

                <ActionItem>
                  <ActionButton
                    className="edit"
                    as={Link}
                    to="/ExamQuestions"
                    state={{ exam: e }}
                  >
                    <BookOpen size={13} />
                  </ActionButton>
                  <span>Questions</span>
                </ActionItem>

                <ActionItem>
                  <ActionButton
                    className="delete"
                    onClick={() => openDeleteModal(e.examId)}
                  >
                    <Trash2 size={13} />
                  </ActionButton>
                  <span>Delete</span>
                </ActionItem>
              </Actions>
            </div>
          )}
        </ExamCard>
      ))}
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
