import { Pencil, Trash2, UserPlus2, Users } from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";

import AssignUserModal from "../../components/Modal_Components/AssignUserModal";
import ConfimationModal from "../../components/Modal_Components/ConfimationModal";
import EditAssignedUserModal from "../../components/Modal_Components/EditAssignedUserModal";

import useAPI from "../../hooks/useAPI";
import { failureToast, successToast } from "../../utils/toast";

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

export default function AssignUsers({ assessmentId }) {
  const { apiGet, apiPost, isError } = useAPI();

  const [users, setUsers] = useState([]);
  const [alreadyAssignedUsers, setAlreadyAssignedUsers] = useState([]);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [currentUserForEdit, setCurrentUserForEdit] = useState(null);
  const currentUserRef = useRef(null);

  const assignedIds = useMemo(
    () => new Set(alreadyAssignedUsers.map((u) => u.partyId)),
    [alreadyAssignedUsers],
  );

  // fetch user
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await apiGet("/user/getAllUsers");
      if (res?.responseMessage === "success") {
        setUsers(res.users || []);
      }
    };
    fetchUsers();
  }, []);

  //fetch assigned ser

  useEffect(() => {
    if (!assessmentId) return;

    const fetchAssigned = async () => {
      const res = await apiPost("/exam/getAssignedUsers", {
        examId: assessmentId,
      });

      if (res?.responseMessage === "success") {
        setAlreadyAssignedUsers(res.users || []);
      }
    };

    fetchAssigned();
  }, [assessmentId]);

  // assign user
  const openAssignModal = (user) => {
    currentUserRef.current = user;
    setIsAssignModalOpen(true);
  };

  const handleAssignUser = async ({ allowedAttempts, timeoutDays }) => {
    const user = currentUserRef.current;

    if (!user || !assessmentId) {
      failureToast("Exam not available");
      return;
    }

    const payload = {
      users: [
        {
          partyId: user.partyId,
          examId: assessmentId,
          allowedAttempts,
          timeoutDays,
        },
      ],
    };

    const res = await apiPost("/exam/assignUser", payload);

    if (res?.responseMessage === "success") {
      successToast("User assigned");

      setAlreadyAssignedUsers((prev) => [
        ...prev,
        { ...user, allowedAttempts, timeoutDays },
      ]);
    } else {
      failureToast("Assign failed");
    }

    setIsAssignModalOpen(false);
  };

  // remove user
  const openRemoveConfirm = (user) => {
    currentUserRef.current = user;
    setIsConfirmModalOpen(true);
  };

  const handleRemove = async () => {
    const user = currentUserRef.current;

    const res = await apiPost("/exam/removeAssignedUserFromExam", {
      partyId: user.partyId,
      examId: assessmentId,
    });

    if (!isError(res)) {
      successToast("Removed");

      setAlreadyAssignedUsers((prev) =>
        prev.filter((u) => u.partyId !== user.partyId),
      );
    } else {
      failureToast("Remove failed");
    }

    setIsConfirmModalOpen(false);
  };

  // edit user
  const handleEdit = (user) => {
    setCurrentUserForEdit({
      user: {
        ...user,
        allowedAttempts: user.allowedAttempts || 1,
        timeoutDays: user.timeoutDays || 3,
      },
      flag: "AU",
    });

    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Wrapper>
        <TableCard>
          <CardHeader>
            <CardTitle>
              <Users size={18} />
              All Users ({users.length})
            </CardTitle>
          </CardHeader>

          <TableScrollWrapper>
            <StyledTable>
              <THead>
                <Tr>
                  <Th>S.No</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </THead>

              <TBody>
                {users.length === 0 ? (
                  <Tr>
                    <Td colSpan="5">
                      <EmptyState>No users found</EmptyState>
                    </Td>
                  </Tr>
                ) : (
                  users.map((user, index) => {
                    const isAssigned = assignedIds.has(user.partyId);
                    const assignedUser = alreadyAssignedUsers.find(
                      (u) => u.partyId === user.partyId,
                    );

                    return (
                      <Tr key={user.partyId}>
                        <Td>{index + 1}</Td>

                        <Td>
                          <NameCell>
                            <Avatar $hue={120}>{user.firstName[0]}</Avatar>
                            <FullName>
                              {user.firstName} {user.lastName}
                            </FullName>
                          </NameCell>
                        </Td>

                        <Td>{user.email}</Td>

                        <Td>{isAssigned ? "Assigned" : "Not Assigned"}</Td>

                        <Td>
                          <ActionRow>
                            {isAssigned ? (
                              <>
                                <IconButton
                                  onClick={() => handleEdit(assignedUser)}
                                >
                                  <Pencil size={14} />
                                </IconButton>

                                <IconButton
                                  onClick={() =>
                                    openRemoveConfirm(assignedUser)
                                  }
                                >
                                  <Trash2 size={14} />
                                </IconButton>
                              </>
                            ) : (
                              <AddButton onClick={() => openAssignModal(user)}>
                                <UserPlus2 size={14} />
                                Assign
                              </AddButton>
                            )}
                          </ActionRow>
                        </Td>
                      </Tr>
                    );
                  })
                )}
              </TBody>
            </StyledTable>
          </TableScrollWrapper>

          <CardFooter>
            {users.length} users — {assignedIds.size} assigned
          </CardFooter>
        </TableCard>
      </Wrapper>

      <AssignUserModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignUser}
        user={currentUserRef.current}
      />

      <ConfimationModal
        isOpen={isConfirmModalOpen}
        onOk={handleRemove}
        onClose={() => setIsConfirmModalOpen(false)}
        message="Remove this user?"
        type="warning"
      />

      <EditAssignedUserModal
        open={isEditModalOpen}
        userForEdit={currentUserForEdit}
        examId={assessmentId}
        setUser={setCurrentUserForEdit}
        onClose={() => setIsEditModalOpen(false)}
        onSuccessUpdate={(data) => {
          const updatedUser = data.user;

          setAlreadyAssignedUsers((prev) =>
            prev.map((u) =>
              u.partyId === updatedUser.partyId ? updatedUser : u,
            ),
          );
        }}
      />
    </div>
  );
}
