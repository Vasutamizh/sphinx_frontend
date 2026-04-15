import {
  AlignLeft,
  Clock,
  FileText,
  HelpCircle,
  Pencil,
  Percent,
  ShieldCheck,
  Trash2,
  UserPlus,
  UserPlus2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AssignUserToExamModal from "../../components/Modal_Components/AssignUserToExamModal";
import ConfimationModal from "../../components/Modal_Components/ConfimationModal";
import EditAssignedUserModal from "../../components/Modal_Components/EditAssignedUserModal";
import { apiGet, apiPost, isError } from "../../services/ApiService";
import {
  ActionRow,
  AddButton,
  Avatar,
  CardFooter,
  CardHeader,
  CardTitle,
  EmptyState,
  FullName,
  IconButton,
  NameCell,
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
import { failureToast, successToast } from "../../utils/toast";

export default function AssignUsers() {
  const [currentUserForEdit, setCurrentUserForEdit] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAssignUserFormModalOpen, setIsAssignUserFormModalOpen] =
    useState(false);
  const [users, setUsers] = useState([]);
  const [alreadyAssignedUsers, setAlreadyAssignedUsers] = useState([]);
  const [newlyAssignedUsers, setNewlyAssignedUsers] = useState([]);

  // getting exam from state location.
  const location = useLocation();
  const exam = location.state?.exam || {};

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await apiGet("/auth/getAllUsers");
      if (response.responseMessage && response.responseMessage === "success") {
        setUsers(response.users);
      } else {
        failureToast(response.errorMessage || response.error);
      }
    };

    getAllUsers();
  }, []);

  useEffect(() => {
    const getUsersForExam = async () => {
      if (!exam.examId) {
        return;
      }
      const response = await apiPost("/exam/getAssignedUsers", {
        examId: exam.examId,
      });

      if (response.responseMessage && response.responseMessage === "success") {
        setAlreadyAssignedUsers(response.data);
      } else {
        failureToast(
          response.errorMessage || response.error || "Failed to Load data!",
        );
        setAlreadyAssignedUsers([]);
      }
    };
    getUsersForExam();
  }, []);

  /** Derive avatar initials from a full name string */
  function initials(name) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join("");
  }

  /** Map a string to a stable hue 0-360 for avatar coloring */
  function nameToHue(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
  }

  const handleRemove = (user) => {
    // setAlreadyAssignedUsers(assignedUsers.filter((u) => u.id !== id));
    if (!user) return;
    setCurrentUserForEdit(user);
    setIsConfirmModalOpen(true);
  };

  const onDeleteOk = () => {
    if (!currentUserForEdit || !currentUserForEdit.partyId || !exam?.examId)
      return;
    const deleteUser = async () => {
      const response = await apiPost("/exam/removeAssignedUserFromExam", {
        partyId: currentUserForEdit.partyId,
        examId: exam.examId,
      });
      if (isError(response)) {
        failureToast(
          response.errorMessage || response.error || "Failed to delete User!",
        );
      } else {
        successToast(
          response.successMessage || "User removed from Exam Successfully!",
        );
        setAlreadyAssignedUsers((prev) =>
          prev.filter((u) => currentUserForEdit.partyId !== u.partyId),
        );
      }
    };

    deleteUser();
    setIsConfirmModalOpen(false);
  };

  const handleEdit = (user, flag) => {
    if (!flag) return;

    setCurrentUserForEdit({ user, flag });
    setIsEditModalOpen(true);
  };
  const handleSubmit = async () => {
    if (newlyAssignedUsers.length === 0) {
      alert("Please assign at least one user.");
      return;
    }

    // Prepare payload
    const payload = {
      users: newlyAssignedUsers.map((user) => ({
        partyId: user.partyId,
        examId: exam.examId,
        allowedAttempts: parseInt(user.allowedAttempts),
        timeoutDays: Number(user.timeoutDays),
      })),
    };

    // console.log("Final Payload:", payload);

    const response = await apiPost("/exam/assignUser", payload);

    if (response.responseMessage && response.responseMessage === "success") {
      successToast(response.successMessage || "User Assigned Successfully!");
    } else {
      failureToast(response.errorMessage || response.error || "Action Failed!");
    }

    setAlreadyAssignedUsers((prev) => [...prev, ...newlyAssignedUsers]);
    setNewlyAssignedUsers([]);
  };

  const onSuccessUpdate = (userWithFLag) => {
    const { user, flag } = userWithFLag;
    // console.log(userWithFLag);
    if (!user || !flag) return;
    // on success API call.
    if (flag === "AU") {
      const filteredUsers = alreadyAssignedUsers.filter(
        (u) => u.partyId !== user.partyId,
      );
      filteredUsers.push(user);
      setAlreadyAssignedUsers(filteredUsers);
    } else {
      const filteredUsers = newlyAssignedUsers.filter(
        (u) => u.partyId !== user.partyId,
      );
      filteredUsers.push(user);
      setNewlyAssignedUsers(filteredUsers);
    }
  };

  if (exam) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <EditAssignedUserModal
          open={isEditModalOpen}
          userForEdit={currentUserForEdit}
          examId={exam.examId}
          setUser={setCurrentUserForEdit}
          onClose={() => {
            setIsEditModalOpen(false);
          }}
          onSuccessUpdate={onSuccessUpdate}
        />
        <ConfimationModal
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
          }}
          onOk={onDeleteOk}
          onCancel={() => {
            setIsConfirmModalOpen(false);
          }}
          message={"Are you sure want to delete? "}
        />
        {/* Header */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Assign Users to Exam
        </h2>

        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            Exam Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <FileText className="text-blue-500 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500">Exam Name</p>
                <p className="font-bold text-gray-800">{exam.examName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlignLeft className="text-purple-500 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-bold text-gray-800">{exam.description}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HelpCircle className="text-green-500 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500">Questions</p>
                <p className="font-bold text-gray-800">{exam.noOfQuestions}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="text-orange-500 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-bold text-gray-800">{exam.duration} mins</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Percent className="text-red-500 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-500">Pass Percentage</p>
                <p className="font-bold text-gray-800">
                  {exam.passPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <AssignUserToExamModal
          exam={exam}
          alreadyAssignedUsers={alreadyAssignedUsers}
          newlyAssignedUsers={newlyAssignedUsers}
          users={users}
          setNewlyAssignedUsers={setNewlyAssignedUsers}
          isOpen={isAssignUserFormModalOpen}
          onClose={() => setIsAssignUserFormModalOpen(false)}
        />

        {/* Assigned Users
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Assigned Users
          </h3>
        </div> */}

        {/* ========================= TABLE ================================== */}

        {/* <GlobalStyle /> */}
        <Wrapper>
          <TableCard>
            <TableScrollWrapper>
              {alreadyAssignedUsers.length > 0 && (
                <React.Fragment>
                  <CardHeader>
                    <div>
                      <CardTitle>
                        <ShieldCheck size={18} strokeWidth={2} />
                        Already Assigned Users
                      </CardTitle>
                    </div>
                  </CardHeader>

                  {/* ── Table ── */}

                  <StyledTable role="table" aria-label="Assigned users table">
                    <THead>
                      <tr role="row">
                        <Th>Name</Th>
                        <Th>Allowed Attempts</Th>
                        <Th>Timeout Days</Th>
                        <Th $align="center">Action</Th>
                      </tr>
                    </THead>

                    <TBody>
                      {alreadyAssignedUsers.length === 0
                        ? ""
                        : alreadyAssignedUsers.map((user, index) => {
                            return (
                              <Tr key={index} role="row" $index={index}>
                                {/* ── Name ── */}
                                <Td>
                                  <NameCell>
                                    <Avatar
                                      $hue={nameToHue(user.firstName)}
                                      aria-hidden="true"
                                    >
                                      {initials(
                                        user.firstName + " " + user.lastName,
                                      )}
                                    </Avatar>
                                    <div>
                                      <FullName>
                                        {user.firstName + " " + user.lastName}
                                      </FullName>
                                    </div>
                                  </NameCell>
                                </Td>

                                {/* ── Allowed Attempts ── */}
                                <Td>{user.allowedAttempts}</Td>

                                {/* ── Exam Timeout ── */}
                                <Td>{user.timeoutDays}</Td>

                                {/* ── Action ── */}
                                <Td $align="center">
                                  <ActionRow>
                                    <IconButton
                                      $variant="edit"
                                      onClick={() => handleEdit(user, "AU")}
                                      aria-label={`Edit ${user.name}`}
                                      title="Edit"
                                    >
                                      <Pencil size={14} strokeWidth={2} />
                                    </IconButton>
                                    <IconButton
                                      $variant="delete"
                                      onClick={() => handleRemove(user)}
                                      aria-label={`Remove ${user.name}`}
                                      title="Remove"
                                    >
                                      <Trash2 size={14} strokeWidth={2} />
                                    </IconButton>
                                  </ActionRow>
                                </Td>
                              </Tr>
                            );
                          })}
                    </TBody>
                  </StyledTable>
                </React.Fragment>
              )}
              <CardHeader>
                <div>
                  <CardTitle>
                    <ShieldCheck size={18} strokeWidth={2} />
                    Newly Assigned Users
                  </CardTitle>
                </div>
                <AddButton onClick={() => setIsAssignUserFormModalOpen(true)}>
                  <UserPlus2 size={20} aria-label="add-users-button" /> Add
                  Users
                </AddButton>
              </CardHeader>

              <StyledTable>
                <THead>
                  <tr role="row">
                    <Th>Name</Th>
                    <Th>Allowed Attempts</Th>
                    <Th>Timeout Days</Th>
                    <Th $align="center">Action</Th>
                  </tr>
                </THead>
                <TBody>
                  {newlyAssignedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <EmptyState>
                          <UserPlus size={36} strokeWidth={1.5} />
                          No users assigned yet. Click "Add user" to get
                          started.
                        </EmptyState>
                      </td>
                    </tr>
                  ) : (
                    newlyAssignedUsers.map((user, index) => {
                      return (
                        <Tr key={index} role="row" $index={index}>
                          {/* ── Name ── */}
                          <Td>
                            <NameCell>
                              <Avatar
                                $hue={nameToHue(user.firstName)}
                                aria-hidden="true"
                              >
                                {initials(user.firstName + " " + user.lastName)}
                              </Avatar>
                              <div>
                                <FullName>
                                  {user.firstName + " " + user.lastName}
                                </FullName>
                              </div>
                            </NameCell>
                          </Td>

                          {/* ── Allowed Attempts ── */}
                          <Td>{user.allowedAttempts}</Td>

                          {/* ── Exam Timeout ── */}
                          <Td>{user.timeoutDays}</Td>

                          {/* ── Action ── */}
                          <Td $align="center">
                            <ActionRow>
                              <IconButton
                                $variant="edit"
                                onClick={() => handleEdit(user, "NU")}
                                aria-label={`Edit ${user.name}`}
                                title="Edit"
                              >
                                <Pencil size={14} strokeWidth={2} />
                              </IconButton>
                              <IconButton
                                $variant="delete"
                                onClick={() => handleEdit(user)}
                                aria-label={`Remove ${user.name}`}
                                title="Remove"
                              >
                                <Trash2 size={14} strokeWidth={2} />
                              </IconButton>
                            </ActionRow>
                          </Td>
                        </Tr>
                      );
                    })
                  )}
                </TBody>
              </StyledTable>
            </TableScrollWrapper>

            {/* ── Footer ── */}
            <CardFooter>
              <span>
                {alreadyAssignedUsers.length} user
                {alreadyAssignedUsers.length !== 1 ? "s" : ""} assigned
              </span>
            </CardFooter>
          </TableCard>
        </Wrapper>

        {/* ================================================================================ */}
        <div className="mt-6 flex justify-end">
          <button
            disabled={newlyAssignedUsers.length === 0}
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg 
               hover:bg-green-700 shadow-md hover:shadow-lg 
               transition-all duration-200 flex items-center gap-2 disabled:bg-green-200"
          >
            {/* Check Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Submit All
          </button>
        </div>
      </div>
    );
  } else {
    return <>Not Found</>;
  }
}
