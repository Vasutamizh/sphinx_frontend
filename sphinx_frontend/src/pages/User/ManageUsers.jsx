import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Pencil,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ConfimationModal from "../../components/Modal_Components/ConfimationModal";
import UserAddUpdateModal from "../../components/Modal_Components/UserAddUpdateModal";

import { useDispatch } from "react-redux";
import useAPI from "../../hooks/useAPI";
import {
  CardHeader,
  CardTitle,
  IconButton,
  StyledTable,
  TableCard,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from "../../styles/AssignUsersPage.styles";
import { failureToast, successToast } from "../../utils/toast";

function ManageUsers() {
  const dispatcher = useDispatch();
  const { apiGet, apiDelete, isError } = useAPI();
  const [users, setUsers] = useState([]);
  const [selectParticulars, setSelectParticulars] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const nextPageNumber = useRef(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userForEdit, setUserForEdit] = useState({});

  const getAllUsers = async () => {
    setLoading(true);

    const response = await apiGet("/user/getAllUsers");

    if (isError(response)) {
      failureToast(
        response.errorMessage || response.error || "Failed to load data!",
      );
    } else {
      setUsers(response.users || []);
      setPaginationInfo(response.meta || {});
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    const response = await apiDelete("/user", { partyIds: selectParticulars });
    if (isError(response)) {
      failureToast(
        response.errorMessage || response.error || "Failed to Delete User(s)!",
      );
    } else {
      successToast(response.successMessage || "User Deleted Successfully!");
      setUsers((prev) =>
        prev.filter((u) => !selectParticulars.includes(u.partyId)),
      );
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Handle function for select a single row.
  const handleParticularSelect = (checked, p_partyId) => {
    if (checked) {
      setSelectParticulars((prev) => {
        const newArray = [...prev, p_partyId];
        return newArray;
      });
    } else {
      // we are remove the question from the array, if it is unchecked
      setSelectParticulars((prev) =>
        prev.filter((partyId) => partyId !== p_partyId),
      );
    }
  };

  // select All Function for deletion.
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectParticulars(users.map((q) => q.partyId));
    } else {
      setSelectParticulars([]);
    }
  };

  // pagination functions for next page.
  const nextPage = () => {
    if (
      paginationInfo &&
      paginationInfo.totalRecords &&
      paginationInfo.viewSize
    ) {
      if (
        paginationInfo.totalRecords >
        paginationInfo.viewSize * (paginationInfo.viewIndex + 1)
      ) {
        nextPageNumber.current = nextPageNumber.current + 1;
        getAllUsers();
      }
    }
  };

  // pagination functions for previours page.
  const prevPage = () => {
    if (
      paginationInfo &&
      paginationInfo.totalRecords &&
      paginationInfo.viewSize
    ) {
      if (paginationInfo.viewIndex > 0) {
        nextPageNumber.current = nextPageNumber.current - 1;
        getAllUsers();
      }
    }
  };

  useEffect(() => {
    console.log("User for Edit => ", userForEdit);
  }, [userForEdit]);

  const updateUsers = (user) => {
    if (!user) return false;
    setUsers((prev) => [...prev, user]);
    return true;
  };

  return (
    <>
      <UserAddUpdateModal
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
        }}
        user={userForEdit}
        updateUsers={updateUsers}
      />

      <ConfimationModal
        isOpen={isPopupOpen}
        onOk={handleDelete}
        onClose={() => setIsPopupOpen(false)}
        onCancel={() => setIsPopupOpen(false)}
        message={popupMessage}
      />

      <div className="container">
        <div className="header">
          <div className="title flex justify-between items-center">
            <div className="titleText">
              <span className="text-2xl  block">Manage Users</span>
              <span className="text-gray-500 text-sm">
                Manage multiple Users
              </span>
            </div>
            <div>
              <ButtonGroup>
                <Button
                  onClick={() => {
                    setUserModalOpen(true);
                  }}
                  className="p-5 cursor-pointer"
                >
                  Create User
                </Button>
                {/* <Button onClick={() => {}} className="p-5 cursor-pointer">
                  Upload Users
                </Button> */}
              </ButtonGroup>
            </div>
          </div>
          <div className="my-3">
            <div className="flex justify-end gap-5 items-center">
              <div>
                {/* {debounceLoading && (
                <LoaderCircle className="size-4 animate-spin" />
              )} */}
              </div>

              <Input
                type="text"
                placeholder="Search Users ..."
                className="bg-white p-5 w-100"
                //   value={questionDetailFilter}
                //   onChange={(e) => setQuestionDetailFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="questionsBody mt-5">
          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm">
            <>
              <TableCard>
                <CardHeader>
                  <div>
                    <CardTitle>
                      <ShieldCheck size={18} strokeWidth={2} />
                      Spinx Users
                    </CardTitle>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        setIsPopupOpen(true);
                        setPopupMessage(
                          "Are you sure to delete the selected Users?",
                        );
                      }}
                      className="cursor-pointer flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 disabled:bg-red-200 disabled:cursor-not-allowed"
                      disabled={selectParticulars.length === 0}
                    >
                      <Trash2 size={18} />
                      <span className="font-semibolf text-xs">
                        Delete Selected
                      </span>
                    </button>
                  </div>
                </CardHeader>
                <StyledTable role="table" aria-label="Assigned users table">
                  <THead className="p-4">
                    <tr role="row">
                      <Th>
                        <Checkbox
                          checked={users.length === selectParticulars.length}
                          onCheckedChange={(checked) =>
                            handleSelectAll(checked)
                          }
                        />
                      </Th>
                      <Th>S.No</Th>
                      <Th>FirstName</Th>
                      <Th>LastName</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </tr>
                  </THead>
                  {loading ? (
                    <div className="p-6 text-center text-gray-500">
                      Loading questions...
                    </div>
                  ) : users.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No questions found.
                    </div>
                  ) : (
                    <TBody>
                      {users.map((u, idx) => (
                        <Tr key={u.partyId}>
                          <Td>
                            <Checkbox
                              checked={selectParticulars.includes(u.partyId)}
                              onCheckedChange={(checked) => {
                                handleParticularSelect(checked, u.partyId);
                              }}
                            />
                          </Td>
                          <Td>{idx + 1}</Td>
                          <Td> {u.firstName} </Td>
                          <Td> {u.lastName}</Td>
                          <Td>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              {u.statusId === "PARTY_ENABLED"
                                ? "Active"
                                : "In-Active"}
                            </span>
                          </Td>
                          <Td className="text-center flex gap-2">
                            <IconButton
                              $variant="edit"
                              title="Edit"
                              onClick={() => {
                                setUserForEdit(u);
                                setUserModalOpen(true);
                              }}
                            >
                              <Pencil size={14} strokeWidth={2} />
                            </IconButton>
                            <IconButton
                              $variant="delete"
                              onClick={() => {
                                setSelectParticulars([u.partyId]);
                                setPopupMessage(
                                  "Are you sure to delete this User?",
                                );
                                setIsPopupOpen(true);
                              }}
                              title="Remove"
                            >
                              <Trash2 size={14} strokeWidth={2} />
                            </IconButton>
                          </Td>
                        </Tr>
                      ))}
                    </TBody>
                  )}
                </StyledTable>
              </TableCard>
              {paginationInfo && (
                <div className="bg-white rounded-2xl mt-2 p-5 shadow-md flex items-center justify-between">
                  <div className="paginateFilter">
                    <div className="flex gap-5 items-center">
                      <div className="w-30">
                        <Input
                          type="text"
                          placeholder=""
                          className="bg-white"
                          value={rowsPerPage}
                          onChange={(e) => setRowsPerPage(e.target.value)}
                        />
                      </div>
                      <span className="text-xs font-semibold">
                        Items Per Page
                      </span>
                      {/* {debounceLoading && (
                      <LoaderCircle className="size-4 animate-spin" />
                    )} */}
                    </div>
                  </div>
                  <ButtonGroup
                    orientation="horizontal"
                    aria-label="Media controls"
                    className="h-fit"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => prevPage()}
                    >
                      <ChevronsLeftIcon size={16} />
                    </Button>

                    <Button variant="outline" size="icon">
                      {nextPageNumber.current + 1}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => nextPage()}
                    >
                      <ChevronsRightIcon size={16} />
                    </Button>
                  </ButtonGroup>
                </div>
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageUsers;
