import {
  BarChart3,
  BookOpen,
  Cog,
  Ellipsis,
  Layers,
  NotepadText,
  Pencil,
  ShieldCheck,
  Trash2,
  UserPlus2,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  AddButton,
  CardFooter,
  CardHeader,
  CardTitle,
  EmptyState,
  StyledTable,
  TableCard,
  TableScrollWrapper,
  TBody,
  Td,
  Th,
  THead,
  Tr,
  Wrapper,
} from "../../styles/AssignUsersPage.styles";
import {
  StatsCard,
  StatsHeader,
  StatsIcon,
  StatsTitle,
  StatsValue,
  StatsWrapper,
  SubContainer,
} from "../../styles/ExamMasterPage.styles";

import ConfimationModal from "../../components/Modal_Components/ConfimationModal";
import useAPI from "../../hooks/useAPI";
import { loaderActions } from "../../store/LoaderReducer";
import { failureToast, successToast } from "../../utils/toast";

function ExamMasterPage() {
  const { apiGet, apiPost, isError, apiDelete } = useAPI();
  const dispatch = useDispatch();
  const partyId = useSelector((state) => state.auth.partyId);

  const [examList, setExamList] = useState([]);
  const [examSearchList, setExamSearchList] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [examCount, setExamCount] = useState(0);
  const [topicCount, setTopicCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [dropdownMenu, setDropdownMenu] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const currentIdRef = useRef();
  const currentFuncRef = useRef();

  const getAllExam = async () => {
    dispatch(loaderActions.loaderOn());
    const response = await apiPost("/exam/getAllExamsByAdmin", { partyId });
    if (response.responseMessage === "success") {
      setExamList(response.data);
    } else {
      failureToast(response.errorMessage || response.error);
    }
    dispatch(loaderActions.loaderOff());
  };

  const setupExam = async () => {
    if (!currentIdRef.current) return;
    dispatch(loaderActions.loaderOn());
    const response = await apiPost("/exam/setupExam", {
      examId: currentIdRef.current,
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
  };

  const getCounts = async () => {
    dispatch(loaderActions.loaderOn());
    const examRes = await apiPost("/exam/examCount", {});
    if (examRes.responseMessage === "success") {
      setExamCount(examRes.count);
    }

    const topicRes = await apiGet("/topics/getTopicCount");
    if (topicRes.responseMessage === "success") {
      setTopicCount(topicRes.count);
    }

    const userRes = await apiGet("/user/getAllUsersCount");
    if (userRes.responseMessage === "success") {
      setUsersCount(userRes.count);
    }
    dispatch(loaderActions.loaderOff());
  };

  useEffect(() => {
    getAllExam();
    getCounts();
  }, []);

  const searchExam = async (e) => {
    const response = await apiGet(
      `/exam/search-exam?examName=${e.target.value}`,
    );
    if (response.responseMessage === "success") {
      setExamList(response.examList);
    } else {
      failureToast(response.errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!currentIdRef) return;
    dispatch(loaderActions.loaderOn());
    try {
      const response = await apiDelete("/exam", {
        examId: currentIdRef.current,
      });

      if (response?.responseMessage && response.responseMessage === "success") {
        successToast(response.successMessage || "Exam deleted successfully!");
        setExamList((prev) =>
          prev.filter((e) => e.examId !== currentIdRef.current),
        );
      } else {
        failureToast(response?.errorMessage || "Failed to delete exam");
      }
    } catch (error) {
      failureToast("An unexpected error occurred while deleting the exam.");
    } finally {
      dispatch(loaderActions.loaderOff());
    }
  };

  const navigate = useNavigate();

  return (
    <div>
      <div className="titleText">
        <span className="text-2xl  block">Admin Dashboard</span>
        <span className="text-gray-500 text-sm">Welcome Back!</span>
      </div>
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

      <Input
        type="text"
        placeholder="Search Users ..."
        className="bg-white p-5 w-100"
        onChange={searchExam}
      />

      <Wrapper>
        <TableCard>
          <CardHeader>
            <CardTitle>
              <ShieldCheck size={18} />
              Available Assessments
            </CardTitle>
            <SubContainer>
              <AddButton onClick={() => navigate("/create-assessment")}>
                <NotepadText size={20} aria-label="add-users-button" /> Create
                Assessment
              </AddButton>
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
                      <Td>{exam.duration} Mins</Td>
                      <Td>{exam.noOfQuestions}</Td>
                      <Td>{exam.passPercentage}%</Td>
                      {/* <Td $align="center">
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
                      </Td> */}
                      <Td
                        onClick={() => {
                          if (dropdownMenu === exam.examId) {
                            setDropdownMenu("");
                          } else {
                            setDropdownMenu(exam.examId);
                          }
                        }}
                        className="cursor-pointer"
                        $align="center"
                      >
                        {dropdownMenu === exam.examId && (
                          <ul
                            role="menu"
                            data-popover="menu"
                            data-popover-placement="bottom"
                            className="absolute z-[999] overflow-visible bottom-full right-3 mb-1  min-w-[130px] rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg shadow-sm focus:outline-none"
                          >
                            <li
                              onClick={() => {
                                navigate("/assignUsers", { state: { exam } });
                              }}
                              role="menuitem"
                              class="cursor-pointer gap-3 text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                            >
                              <UserPlus2 size={18} />
                              <span>Assign Users</span>
                            </li>
                            <li
                              onClick={() => {
                                navigate("/createExam", { state: { exam } });
                              }}
                              role="menuitem"
                              class="cursor-pointer gap-3 text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                            >
                              <Pencil size={18} />
                              <span>Edit</span>
                            </li>
                            <li
                              onClick={() => {
                                currentIdRef.current = exam.examId;
                                currentFuncRef.current = "handleDelete";
                                setIsPopupOpen(true);
                                setPopupMessage(
                                  "Are You sure want to delete this Assessment!",
                                );
                              }}
                              role="menuitem"
                              class="cursor-pointer gap-3 text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                            >
                              <Trash2 size={18} color="#ED1C24" />
                              <span>Delete Exam</span>
                            </li>
                            <li
                              onClick={() => {
                                currentIdRef.current = exam.examId;
                                currentFuncRef.current = "setupExam";
                                setIsPopupOpen(true);
                                setPopupMessage(
                                  "Are You sure want to setup this Assessment, All the assigned will recieve notification and cannot be revoked!",
                                );
                              }}
                              role="menuitem"
                              class="cursor-pointer gap-3 text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                            >
                              <Cog size={18} color="#228B22" />
                              <span>Setup Exam</span>
                            </li>
                          </ul>
                        )}
                        {/* <Ellipsis size={18} /> */}
                        <button
                          data-popover-target="menu"
                          // className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                          type="button"
                          className="cursor-pointer"
                        >
                          <Ellipsis size={18} />
                        </button>
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
      {/* <DeleteExamModal
        open={isPopupOpen}
        onClose={closeDeleteModal}
        examId={selectedExamId}
        onDeleteSuccess={handleDeleteSuccess}
      /> */}
      <ConfimationModal
        isOpen={isPopupOpen}
        onOk={currentFuncRef.current === "setupExam" ? setupExam : handleDelete}
        onClose={() => setIsPopupOpen(false)}
        onCancel={() => setIsPopupOpen(false)}
        message={popupMessage}
        type={currentFuncRef.current === "setupExam" ? "success" : "warning"}
      />
    </div>
  );
}

export default ExamMasterPage;
