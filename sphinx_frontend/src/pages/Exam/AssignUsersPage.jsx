import { useEffect, useState } from "react";

import useAPI from "../../hooks/useAPI";

import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Pagination,
  Stack,
  Table,
  Text,
} from "@mantine/core";

import { IconTrash } from "@tabler/icons-react";
import { ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
import ConfimationModal from "../../components/Modal_Components/ConfimationModal";
import { failureToast, successToast } from "../../utils/toast";

export default function AssignUsers({
  assessmentId,
  prevUsers = [],
  onSubmit,
}) {
  const { apiGet, apiPost, isError, apiDelete } = useAPI();

  const location = useLocation();

  const exam = location.state?.exam;

  const [users, setUsers] = useState(prevUsers || []);
  const [alreadyAssignedUsers, setAlreadyAssignedUsers] = useState([]);

  // Bulk assignment state
  const [selectedUnassignedIds, setSelectedUnassignedIds] = useState([]);
  const [bulkAssignValues, setBulkAssignValues] = useState({});

  // Individual edit/remove state
  const [currentUserForEdit, setCurrentUserForEdit] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);

  const PAGE_SIZE = 10;

  const [activePage, setActivePage] = useState(1);

  // Selected users with values
  const [selectedUsers, setSelectedUsers] = useState({});
  const [selectedAssignedUsers, setSelectedAssignedUsers] = useState([]);

  // Pagination logic
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const start = (activePage - 1) * PAGE_SIZE;
  const paginatedUsers = users.slice(start, start + PAGE_SIZE);

  const isSelected = (id) => selectedUsers[id] !== undefined;

  useEffect(() => {
    console.log("Users Changed => ", users);
  }, [users]);

  // Derived data
  // const assignedIds = useMemo(
  //   () => new Set(alreadyAssignedUsers.map((u) => u.partyId)),
  //   [alreadyAssignedUsers],
  // );

  // const unassignedUsers = useMemo(
  //   () => users.filter((user) => !assignedIds.has(user.partyId)),
  //   [users, assignedIds],
  // );

  // const isAllUnassignedSelected = useMemo(() => {
  //   if (unassignedUsers.length === 0) return false;
  //   return unassignedUsers.every((user) =>
  //     selectedUnassignedIds.includes(user.partyId),
  //   );
  // }, [unassignedUsers, selectedUnassignedIds]);

  // const isIndeterminate = useMemo(() => {
  //   const selectedCount = selectedUnassignedIds.length;
  //   return selectedCount > 0 && selectedCount < unassignedUsers.length;
  // }, [selectedUnassignedIds, unassignedUsers]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await apiGet("/user/getAllUsers");
      if (!isError(res)) {
        setUsers(res.users || []);
        console.log("User Setted", res.users);
      }
    } catch (error) {
      console.error("Error while fetching users => ", error);
      failureToast("Failed to fetch Users!");
    }
  };

  // Fetch assigned users

  const fetchAssigned = async () => {
    if (!assessmentId && !exam.examId) return;
    try {
      const res = await apiPost("/exam/getAssignedUsers", {
        examId: assessmentId || exam.examId,
      });
      if (!isError(res)) {
        setAlreadyAssignedUsers(res.data || []);
      }
    } catch (error) {
      console.error("Error While fetch Assigned Users => ", error);
      failureToast("Failed to fetch Assigned Users!");
    }
  };

  const filterAssignedUsers = () => {
    // console.log("Filtering Starting....");
    // console.log("Users  => ", users, alreadyAssignedUsers);
    if (users !== null && alreadyAssignedUsers !== null) {
      const filteredUsers = users.filter((u) => {
        const isPresent = alreadyAssignedUsers.find(
          (user) => user.partyId === u.partyId,
        );
        console.log(" Users present ", u.partyId, "=> ", isPresent);
        return !isPresent;
      });
      console.log("Filtered Users  => ", filteredUsers);
      setUsers(filteredUsers);
    }
  };

  useEffect(() => {
    const loadInitialdata = async () => {
      await fetchAssigned();
      await fetchUsers();
      // filterAssignedUsers();
    };

    loadInitialdata();
  }, []);

  // Reset selection when unassigned list changes
  // useEffect(() => {
  //   setSelectedUnassignedIds([]);
  // }, [unassignedUsers.length]);

  // Toggle single user selection
  const toggleSelectUser = (partyId, checked) => {
    if (checked) {
      setSelectedUnassignedIds((prev) => [...prev, partyId]);
    } else {
      setSelectedUnassignedIds((prev) => prev.filter((id) => id !== partyId));
    }
  };

  // Update allowed attempts for a selected user
  const updateAllowedAttempts = (partyId, value) => {
    setBulkAssignValues((prev) => ({
      ...prev,
      [partyId]: { ...prev[partyId], allowedAttempts: value ?? 1 },
    }));
  };

  // Update timeout days for a selected user
  const updateTimeoutDays = (partyId, value) => {
    setBulkAssignValues((prev) => ({
      ...prev,
      [partyId]: { ...prev[partyId], timeoutDays: value ?? 3 },
    }));
  };

  // Apply same values to all selected users
  const applyToAll = (allowedAttempts, timeoutDays) => {
    const newValues = {};
    selectedUnassignedIds.forEach((id) => {
      newValues[id] = { allowedAttempts, timeoutDays };
    });
    setBulkAssignValues(newValues);
  };

  // Bulk assign users
  const handleBulkAssign = async () => {
    const usersToAssign = Object.keys(selectedUsers).map((id) => {
      const user = selectedUsers[id];

      return {
        partyId: id,
        examId: assessmentId || exam.examId,
        allowedAttempts: user.allowedAttempts,
        timeoutDays: user.timeoutDays,
      };
    });

    try {
      const res = await apiPost("/exam/assignUser", { users: usersToAssign });
      if (!isError(res)) {
        successToast(
          res.successMessage || `${usersToAssign.length} user(s) assigned`,
        );

        // Update assigned users state
        const newlyAssigned = usersToAssign.map((u) => {
          const user = users.find((usr) => usr.partyId === u.partyId);
          return {
            ...user,
            allowedAttempts: u.allowedAttempts,
            timeoutDays: u.timeoutDays,
          };
        });
        // // remove the users from un assigned list.
        // setUsers((prev) => {
        //   prev.filter((u) => {
        //     return !newlyAssigned.find(
        //       (assigned) => assigned.partyId === u.party,
        //     );
        //   });
        // });
        setAlreadyAssignedUsers((prev) => [...prev, ...newlyAssigned]);
        setSelectedUnassignedIds([]);
        setBulkAssignValues({});
      } else {
        failureToast(res.errorMessage || "Assignment failed");
      }
    } catch (error) {
      failureToast("Assignment failed");
    }
  };

  const handleRemove = async () => {
    if (!selectedAssignedUsers || selectedAssignedUsers.length === 0) return;

    try {
      const res = await apiPost("/exam/removeAssignedUserFromExam", {
        partyIds: selectedAssignedUsers,
        examId: assessmentId || exam?.examId,
      });

      if (!isError(res)) {
        successToast(res.successMessage || "Users removed");
        setAlreadyAssignedUsers((prev) => {
          const newArr = prev.filter(
            (u) => !selectedAssignedUsers.includes(u.partyId),
          );
          return newArr;
        });
      } else {
        failureToast(res.errorMessage || "Remove failed");
      }
    } catch (error) {
      console.error(
        "Error While Removing the Users from Assessment => ",
        error,
      );
      failureToast("Remove failed");
    } finally {
      setRemoveConfirmOpen(false);
    }
  };

  // Edit assigned user
  const handleEdit = (user) => {
    setCurrentUserForEdit({ ...user });
    setEditModalOpen(true);
  };

  const handleEditSave = async (allowedAttempts, timeoutDays) => {
    if (!currentUserForEdit) return;

    try {
      const res = await apiPost("/exam/updateAssignedUser", {
        partyId: currentUserForEdit.partyId,
        examId: assessmentId,
        allowedAttempts,
        timeoutDays,
      });

      if (res?.responseMessage === "success") {
        failureToast("User updated");
        setAlreadyAssignedUsers((prev) =>
          prev.map((u) =>
            u.partyId === currentUserForEdit.partyId
              ? { ...u, allowedAttempts, timeoutDays }
              : u,
          ),
        );
        setEditModalOpen(false);
        setCurrentUserForEdit(null);
      } else {
        failureToast("Update failed");
      }
    } catch (error) {
      failureToast("Update failed");
    }
  };

  const toggleUser = (id, checked) => {
    setSelectedUsers((prev) => {
      if (checked) {
        return {
          ...prev,
          [id]: { allowedAttempts: 1, timeoutDays: 3 },
        };
      } else {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
    });
  };

  const toggleAssignedUser = (id, checked) => {
    if (checked) {
      setSelectedAssignedUsers((prev) => [...prev, id]);
    } else {
      const newArr = selectedAssignedUsers.filter((uId) => uId !== id);
      setSelectedAssignedUsers(newArr);
    }
  };

  const updateValue = (id, field, value) => {
    setSelectedUsers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const isAllSelected = paginatedUsers.every((u) => isSelected(u.partyId));

  const isIndeterminate =
    paginatedUsers.some((u) => isSelected(u.partyId)) && !isAllSelected;

  const handleSelectAll = (checked) => {
    setSelectedUsers((prev) => {
      const updated = { ...prev };
      paginatedUsers.forEach((user) => {
        if (checked) {
          updated[user.partyId] = updated[user.partyId] || {
            allowedAttempts: 1,
            timeoutDays: 3,
          };
        } else {
          delete updated[user.partyId];
        }
      });
      return updated;
    });
  };

  const handleAssignedSelectAll = (checked) => {
    if (checked) {
      const ids = alreadyAssignedUsers.map((u) => u.partyId);
      setSelectedAssignedUsers(ids);
    } else {
      setSelectedAssignedUsers([]);
    }
  };

  return (
    <div>
      <ConfimationModal
        isOpen={removeConfirmOpen}
        message={
          <>
            <p>Are You Sure want to Remove these Users from the Assessment!</p>
            <br /> Total Users for Deletion :{" "}
            {selectedAssignedUsers.length}{" "}
          </>
        }
        onCancel={() => setRemoveConfirmOpen(false)}
        onClose={() => setRemoveConfirmOpen(false)}
        onOk={handleRemove}
        type="warning"
      />
      <Stack>
        {/* Already Assigned Users */}

        <Group justify="space-between">
          <Group>
            <ShieldCheck color="blue" size={18} />
            <Text fw={600}>
              Already Assigned Users ({alreadyAssignedUsers.length})
            </Text>
          </Group>

          <Button
            disabled={selectedAssignedUsers.length === 0}
            // onClick={() => onSubmit(selectedUsers)}
            onClick={() => setRemoveConfirmOpen(true)}
          >
            Delete Selected ({selectedAssignedUsers.length})
          </Button>
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  checked={
                    selectedAssignedUsers.length > 0 &&
                    selectedAssignedUsers.length === alreadyAssignedUsers.length
                  }
                  indeterminate={isIndeterminate}
                  onChange={(e) =>
                    handleAssignedSelectAll(e.currentTarget.checked)
                  }
                />
              </Table.Th>
              <Table.Th>S.No</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Allowed Attempts</Table.Th>
              <Table.Th>Timeout (Days)</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {alreadyAssignedUsers.length === 0 && (
              <Table.Tr>
                <Table.Td align="center" colSpan={6}>
                  No users assigned for this Assessment Yet!
                </Table.Td>
              </Table.Tr>
            )}
            {alreadyAssignedUsers.map((user, index) => {
              const selected = selectedAssignedUsers.includes(user.partyId);
              return (
                <Table.Tr key={user.partyId}>
                  <Table.Td>
                    <Checkbox
                      checked={selected}
                      onChange={(e) =>
                        toggleAssignedUser(
                          user.partyId,
                          e.currentTarget.checked,
                        )
                      }
                    />
                  </Table.Td>

                  <Table.Td>{start + index + 1}</Table.Td>

                  <Table.Td>
                    <Group gap="sm">
                      {/* <Avatar name={`${user.firstName} ${user.lastName}`} /> */}
                      <Text size="sm">
                        {user.firstName} {user.lastName}
                      </Text>
                    </Group>
                  </Table.Td>

                  <Table.Td>{user.allowedAttempts}</Table.Td>

                  <Table.Td>{user.timeoutDays}</Table.Td>
                  <Table.Td>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      // onClick={() => {
                      //   setQuestionToDelete(question.id);
                      //   //   openDeleteModal();
                      // }}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>

        {/* Newly Assign Users */}

        <Group justify="space-between">
          <Group>
            <ShieldCheck color="blue" size={18} />
            <Text fw={600}>Un Assigned Users ({users.length})</Text>
          </Group>

          <Button
            disabled={Object.keys(selectedUsers).length === 0}
            // onClick={() => onSubmit(selectedUsers)}
            onClick={handleBulkAssign}
          >
            Assign Users ({Object.keys(selectedUsers).length})
          </Button>
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => handleSelectAll(e.currentTarget.checked)}
                />
              </Table.Th>
              <Table.Th>S.No</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Allowed Attempts</Table.Th>
              <Table.Th>Timeout (Days)</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {paginatedUsers.map((user, index) => {
              const selected = isSelected(user.partyId);
              const values = selectedUsers[user.partyId] || {
                allowedAttempts: 1,
                timeoutDays: 3,
              };

              return (
                <Table.Tr key={user.partyId}>
                  <Table.Td>
                    <Checkbox
                      checked={selected}
                      onChange={(e) =>
                        toggleUser(user.partyId, e.currentTarget.checked)
                      }
                    />
                  </Table.Td>

                  <Table.Td>{start + index + 1}</Table.Td>

                  <Table.Td>
                    <Group gap="sm">
                      {/* <Avatar name={`${user.firstName} ${user.lastName}`} /> */}
                      <Text size="sm">
                        {user.firstName} {user.lastName}
                      </Text>
                    </Group>
                  </Table.Td>

                  <Table.Td>
                    <NumberInput
                      value={values.allowedAttempts}
                      min={1}
                      max={10}
                      disabled={!selected}
                      onChange={(val) =>
                        updateValue(user.partyId, "allowedAttempts", val)
                      }
                      size="xs"
                      style={{ width: 120 }}
                    />
                  </Table.Td>

                  <Table.Td>
                    <NumberInput
                      value={values.timeoutDays}
                      min={1}
                      max={365}
                      disabled={!selected}
                      onChange={(val) =>
                        updateValue(user.partyId, "timeoutDays", val)
                      }
                      size="xs"
                      style={{ width: 120 }}
                    />
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>

        <Group justify="center">
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={setActivePage}
          />
        </Group>
      </Stack>
    </div>
    // </Card>
  );
}
