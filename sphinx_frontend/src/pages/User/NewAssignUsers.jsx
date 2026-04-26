import { Pencil, ShieldCheck, Trash2, UserPlus, UserPlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import ConfimationModal from "../../components/Modal_Components/ConfimationModal";
import EditAssignedUserModal from "../../components/Modal_Components/EditAssignedUserModal";
import useAPI from "../../hooks/useAPI";
import {
  ActionRow,
  AddButton,
  Avatar,
  CardFooter,
  CardHeader,
  CardTitle,
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

import { useMemo } from "react";
import MultiSelectModal from "../../components/Modal_Components/MultiUserAssignModal";

export default function AssignUsers({ asssessmentInfo }) {
  const { apiGet, apiPost, isError } = useAPI();
  const [currentUserForEdit, setCurrentUserForEdit] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isMultiSelectModalOpen, setIsMultiSelectModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [alreadyAssignedUsers, setAlreadyAssignedUsers] = useState([]);
  const [newlyAssignedUsers, setNewlyAssignedUsers] = useState([]);
  const [selectedUsersConfig, setSelectedUsersConfig] = useState([]);

  // Compute available users (not already assigned and not in newly assigned)
  const availableUsers = useMemo(() => {
    const assignedIds = new Set([
      ...alreadyAssignedUsers.map((u) => u.partyId),
      ...newlyAssignedUsers.map((u) => u.partyId),
    ]);
    return users.filter((user) => !assignedIds.has(user.partyId));
  }, [users, alreadyAssignedUsers, newlyAssignedUsers]);

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await apiGet("/user/getAllUsers");
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
      if (!asssessmentInfo.examId) {
        return;
      }
      const response = await apiPost("/exam/getAssignedUsers", {
        examId: asssessmentInfo.examId,
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
    if (!user) return;
    setCurrentUserForEdit(user);
    setIsConfirmModalOpen(true);
  };

  const onDeleteOk = () => {
    if (
      !currentUserForEdit ||
      !currentUserForEdit.partyId ||
      !asssessmentInfo?.examId
    )
      return;
    const deleteUser = async () => {
      const response = await apiPost("/exam/removeAssignedUserFromExam", {
        partyId: currentUserForEdit.partyId,
        examId: asssessmentInfo.examId,
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

  const handleRemoveFromNewlyAssigned = (userToRemove) => {
    setNewlyAssignedUsers((prev) =>
      prev.filter((u) => u.partyId !== userToRemove.partyId),
    );
  };

  const handleSubmit = async (usersForAssign = []) => {
    if (usersForAssign.length === 0) {
      alert("Please assign at least one user.");
      return;
    }
    // console.log("usersForAssign => ", usersForAssign);
    const payload = {
      users: usersForAssign[0].map((u) => {
        // console.log("USER => ", u);
        return {
          partyId: u.partyId,
          examId: asssessmentInfo.examId,
          allowedAttempts: Number(u.allowedAttempts),
          timeoutDays: Number(u.timeoutDays),
        };
      }),
    };

    // console.log("PAYLOAD => ", payload);
    // return;

    const response = await apiPost("/exam/assignUser", payload);

    if (response.responseMessage && response.responseMessage === "success") {
      successToast(response.successMessage || "User Assigned Successfully!");
      setAlreadyAssignedUsers((prev) => [...prev, ...usersForAssign[0]]);
      setNewlyAssignedUsers([]);
    } else {
      failureToast(response.errorMessage || response.error || "Action Failed!");
    }
  };

  const onSuccessUpdate = (userWithFlag) => {
    const { user, flag } = userWithFlag;
    if (!user || !flag) return;
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

  // Handle checkbox selection and update config
  const handleUserSelection = (user, isChecked) => {
    if (isChecked) {
      setSelectedUsersConfig((prev) => [
        ...prev,
        {
          user,
          allowedAttempts: 1,
          timeoutDays: 3,
        },
      ]);
    } else {
      setSelectedUsersConfig((prev) =>
        prev.filter((item) => item.user.partyId !== user.partyId),
      );
    }
  };

  const handleUserSelectAll = (checked) => {
    if (checked) {
      for (let i = 0; i < availableUsers.length; i++) {
        handleUserSelection(availableUsers[i], true);
      }
    } else {
      setSelectedUsersConfig([]);
    }
  };

  // Update allowed attempts for a selected user
  const updateAllowedAttempts = (userId, value) => {
    setSelectedUsersConfig((prev) =>
      prev.map((item) =>
        item.user.partyId === userId
          ? { ...item, allowedAttempts: parseInt(value) || 3 }
          : item,
      ),
    );
  };

  // Update timeout days for a selected user
  const updateTimeoutDays = (userId, value) => {
    console.log("value => ", value);
    setSelectedUsersConfig((prev) =>
      prev.map((item) =>
        item.user.partyId === userId
          ? { ...item, timeoutDays: parseInt(value) || 0 }
          : item,
      ),
    );
  };

  // Add selected users to newlyAssignedUsers
  const addSelectedUsers = () => {
    if (selectedUsersConfig.length === 0) {
      alert("Please select at least one user to assign.");
      return;
    }

    const newUsers = selectedUsersConfig.map(
      ({ user, allowedAttempts, timeoutDays }) => ({
        ...user,
        allowedAttempts,
        timeoutDays,
      }),
    );

    // const usersForAssign = newlyAssignedUsers;
    // usersForAssign.push();
    handleSubmit(newUsers);
    // setNewlyAssignedUsers((prev) => [...prev, ...newUsers]);
    setNewlyAssignedUsers(newUsers);
    setSelectedUsersConfig([]);
    setIsMultiSelectModalOpen(false);
  };

  //   if (!asssessmentInfo.examId) {
  //     return (
  //       <div className="p-6 text-center text-gray-500">No exam data found</div>
  //     );
  //   }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <EditAssignedUserModal
        open={isEditModalOpen}
        userForEdit={currentUserForEdit}
        examId={asssessmentInfo.examId}
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
        message={"Are you sure you want to remove this user?"}
      />
      <MultiSelectModal
        isMultiSelectModalOpen={isMultiSelectModalOpen}
        setIsMultiSelectModalOpen={setIsMultiSelectModalOpen}
        availableUsers={availableUsers}
        selectedUsersConfig={selectedUsersConfig}
        handleUserSelection={handleUserSelection}
        nameToHue={nameToHue}
        initials={initials}
        updateAllowedAttempts={updateAllowedAttempts}
        updateTimeoutDays={updateTimeoutDays}
        addSelectedUsers={addSelectedUsers}
        handleUserSelectAll={handleUserSelectAll}
      />

      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <UserPlus size={28} className="text-blue-600" />
        Assign Users to Exam
      </h2>

      {/* Main Table Card */}
      <Wrapper>
        <TableCard>
          <TableScrollWrapper>
            {/* Already Assigned Users Section */}
            {alreadyAssignedUsers.length > 0 && (
              <>
                <CardHeader>
                  <div>
                    <CardTitle>
                      <ShieldCheck size={18} strokeWidth={2} />
                      Assigned Users
                    </CardTitle>
                  </div>
                  <AddButton onClick={() => setIsMultiSelectModalOpen(true)}>
                    <UserPlus2 size={20} aria-label="add-users-button" />
                    Add Users
                  </AddButton>
                </CardHeader>

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
                    {alreadyAssignedUsers.map((user, index) => (
                      <Tr key={index} role="row" $index={index}>
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
                              <div className="text-xs text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </NameCell>
                        </Td>
                        <Td>{user.allowedAttempts}</Td>
                        <Td>{user.timeoutDays}</Td>
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
                    ))}
                  </TBody>
                </StyledTable>
              </>
            )}
          </TableScrollWrapper>

          <CardFooter>
            <span>
              {alreadyAssignedUsers.length} user
              {alreadyAssignedUsers.length !== 1 ? "s" : ""} assigned
              {newlyAssignedUsers.length > 0 &&
                ` + ${newlyAssignedUsers.length} pending`}
            </span>
          </CardFooter>
        </TableCard>
      </Wrapper>
    </div>
  );
}
