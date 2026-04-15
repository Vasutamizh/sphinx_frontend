import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ListFilter,
  LoaderCircle,
  Pencil,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfimationModal from "../../components/Modal_Components/ConfimationModal";
import { useTopics } from "../../hooks/useTopics";
import { questionTypes } from "../../lib/data";
import { apiDelete, apiPost, isError } from "../../services/ApiService";
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

function ManageQuestions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const nextPageNumber = useRef(0);
  const [questionDetailFilter, setQuestionDetailFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectAll, setSelectAll] = useState(false);
  const [selectParticulars, setSelectParticulars] = useState([]);
  const [popupMessage, setPopupMessage] = useState([]);
  const [debounceLoading, setDebounceLoading] = useState(false);
  const [topicfilterOpen, setTopicfilterOpen] = useState(false);
  const [typefilterOpen, setTypefilterOpen] = useState(false);

  const { topics } = useTopics();

  // ==========================================================================================================
  // ================================================= Api Calls ==============================================
  // ==========================================================================================================

  const loadQuestions = async () => {
    setLoading(true);
    try {
      let viewSize = 10;

      if (/^[0-9]*$/.test(rowsPerPage)) {
        viewSize = rowsPerPage;
      }

      const response = await apiPost("/questions/getAllQuestions", {
        viewIndex: nextPageNumber.current,
        viewSize,
        topicIds: topicFilter,
        questionTypes: typeFilter,
        questionDetailFilter,
      });
      if (isError(response)) {
        failureToast(
          response.errorMessage || response.error || "Failed to load Data!",
        );
      } else {
        setQuestions(response.data || []);
        setPaginationInfo(response.meta || {});
        // setRowsPerPage(response.meta?.viewSize || 10);
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
      setDebounceLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectParticulars || selectParticulars.length === 0) return;

    const response = await apiDelete("/questions", {
      questionIds: selectParticulars,
    });
    if (isError(response)) {
      failureToast(response.errorMessage || "Failed to delete the Question!");
    } else {
      successToast(response.successMessage || "Question deleted Successfully!");
      loadQuestions();
    }

    setIsOpen(false);
    setSelectParticulars([]);
    setSelectAll(false);
  };

  // useEffect(() => {
  //   loadQuestions();
  // }, []);

  // Debouncing function for filter function.
  useEffect(() => {
    let debouncesLoadData;
    let timeout = 2000;
    if (
      !questionDetailFilter &&
      rowsPerPage === 10 &&
      !topicFilter &&
      !typeFilter
    ) {
      timeout = 0;
    }
    setDebounceLoading(true);
    debouncesLoadData = setTimeout(() => {
      loadQuestions();
    }, timeout);

    return () => clearTimeout(debouncesLoadData);
  }, [questionDetailFilter, rowsPerPage, topicFilter, typeFilter]);

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
        loadQuestions();
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
        loadQuestions();
      }
    }
  };

  // Handle function for select a single row.
  const handleParticularSelect = (checked, questionId) => {
    if (checked) {
      setSelectParticulars((prev) => {
        const newArray = [...prev, questionId];
        if (newArray.length === questions.length) {
          setSelectAll(true);
        }
        return newArray;
      });
    } else {
      // we are remove the question from the array, if it is unchecked
      setSelectParticulars((prev) => prev.filter((qId) => qId !== questionId));
      setSelectAll(false);
    }
  };

  // select All Function for deletion.
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectParticulars(questions.map((q) => q.questionId));
      // setSelectAll(true);
    } else {
      setSelectParticulars([]);
      // setSelectAll(false);
    }
  };

  // Handle functions for filters Topic filter & Type Filter.
  const handleSelect = (type, value) => {
    // console.log("type => ", type, "value => ", value);
    if (type === "topic") {
      if (topicFilter.includes(value)) {
        setTopicFilter((prev) => prev.filter((t) => t !== value));
      } else {
        setTopicFilter((prev) => [...prev, value]);
      }
    } else {
      setTypeFilter((prev) => {
        if (prev.includes(value)) {
          return prev.filter((t) => t !== value);
        } else {
          return [...prev, value];
        }
      });
    }
  };

  return (
    <div>
      <ConfimationModal
        isOpen={isOpen}
        onOk={handleDelete}
        onClose={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        message={popupMessage}
      />
      <div className="container">
        <div className="header">
          <div className="title flex justify-between items-center">
            <div className="titleText">
              <span className="text-2xl  block">Manage Questions</span>
              <span className="text-gray-500 text-sm">
                Manage multiple types of questions
              </span>
            </div>
            <div>
              <ButtonGroup>
                <Button
                  onClick={() => navigate("/addQuestion")}
                  className="p-5 cursor-pointer"
                >
                  Create Question
                </Button>
                <Button
                  onClick={() => navigate("/uploadQuestions")}
                  className="p-5 cursor-pointer"
                >
                  Upload Question
                </Button>
              </ButtonGroup>
            </div>
          </div>
          <div className="my-3">
            <div className="flex justify-end gap-5 items-center">
              <div>
                {debounceLoading && (
                  <LoaderCircle className="size-4 animate-spin" />
                )}
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => setTopicfilterOpen(true)}
                  variant="outline"
                  size="lg"
                  className="w-fit"
                >
                  <ListFilter size={14} />
                  <span className="font-semibold text-xs">Select Topic</span>
                </Button>
                <CommandDialog
                  open={topicfilterOpen}
                  onOpenChange={setTopicfilterOpen}
                >
                  <Command>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Topics">
                        {topics &&
                          topics.map((topic) => {
                            return (
                              <CommandItem
                                key={topic.topicId}
                                value={topic.topicName}
                                onSelect={(changedValue) => {
                                  handleSelect("topic", topic.topicId);
                                }}
                              >
                                <Checkbox
                                  checked={topicFilter.includes(topic.topicId)}
                                  // onCheckedChange={(checkedValue) =>
                                  //   handleSelect("topic", topic.topicId)
                                  // }
                                />
                                {topic.topicName}
                              </CommandItem>
                            );
                          })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  <Button
                    onClick={() => {
                      setTopicFilter([]);
                    }}
                    className="m-5"
                  >
                    Clear all Filters
                  </Button>
                </CommandDialog>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => setTypefilterOpen(true)}
                  variant="outline"
                  size="lg"
                  className="w-fit p-3"
                >
                  <ListFilter size={14} />
                  <span className="font-semibold text-xs">
                    Select Question Type
                  </span>
                </Button>
                <CommandDialog
                  open={typefilterOpen}
                  onOpenChange={setTypefilterOpen}
                >
                  <Command>
                    <CommandInput placeholder="Seearch filter..." />

                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Question Types">
                        {questionTypes.map((type) => {
                          return (
                            <CommandItem
                              key={type.id}
                              value={type.name}
                              onSelect={(changedValue) => {
                                handleSelect("type", type.id);
                              }}
                            >
                              <Checkbox
                                checked={typeFilter.includes(type.id)}
                                // onCheckedChange={(checkedValue) =>
                                //   handleSelect("type", type.id)
                                // }
                              />
                              {type.name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  <Button
                    onClick={() => {
                      setTypeFilter([]);
                    }}
                    className="m-5"
                  >
                    Clear all Filters
                  </Button>
                </CommandDialog>
              </div>

              <Input
                type="text"
                placeholder="Search Questions ..."
                className="bg-white p-5 w-100"
                value={questionDetailFilter}
                onChange={(e) => setQuestionDetailFilter(e.target.value)}
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
                      Question Bank
                    </CardTitle>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        setIsOpen(true);
                        setPopupMessage(
                          "Are you sure to delete the selected Questions?",
                        );
                      }}
                      className="cursor-pointer flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 disabled:bg-red-200 disabled:cursor-not-allowed"
                      disabled={!selectAll && selectParticulars.length === 0}
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
                          checked={
                            questions.length === selectParticulars.length
                          }
                          onCheckedChange={(checked) =>
                            handleSelectAll(checked)
                          }
                        />
                      </Th>
                      <Th>S.No</Th>
                      <Th>Question</Th>
                      <Th>Type</Th>
                      <Th>Topic</Th>
                      <Th>Difficulty</Th>
                      <Th>Updated</Th>
                      <Th>Action</Th>
                    </tr>
                  </THead>
                  {loading ? (
                    <div className="p-6 text-center text-gray-500">
                      Loading questions...
                    </div>
                  ) : questions.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No questions found.
                    </div>
                  ) : (
                    <TBody>
                      {questions.map((q, idx) => (
                        <Tr key={q.questionId}>
                          <Td>
                            <Checkbox
                              checked={
                                selectAll ||
                                selectParticulars.includes(q.questionId)
                              }
                              onCheckedChange={(checked) => {
                                handleParticularSelect(checked, q.questionId);
                              }}
                            />
                          </Td>
                          <Td>{idx + 1}</Td>
                          <Td> {q.questionDetail} </Td>
                          <Td> {q.questionType}</Td>
                          <Td> {q.topicId} </Td>
                          <Td>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                q.difficultyLevel === "EASY" ||
                                q.difficultyLevel === "Easy" ||
                                q.difficultyLevel === "easy"
                                  ? "bg-green-100 text-green-700"
                                  : q.difficultyLevel === "MEDIUM" ||
                                      q.difficultyLevel === "Medium" ||
                                      q.difficultyLevel === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {q.difficultyLevel}
                            </span>
                          </Td>
                          <Td>
                            {new Date(q.lastUpdatedStamp).toLocaleDateString()}
                          </Td>
                          <Td className="text-center flex gap-2">
                            <IconButton
                              $variant="edit"
                              title="Edit"
                              onClick={() =>
                                navigate("/addQuestion", { state: q })
                              }
                            >
                              <Pencil size={14} strokeWidth={2} />
                            </IconButton>
                            <IconButton
                              $variant="delete"
                              onClick={() => {
                                setSelectParticulars([q.questionId]);
                                setPopupMessage(
                                  "Are you sure to delete this Question?",
                                );
                                setIsOpen(true);
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
                      {debounceLoading && (
                        <LoaderCircle className="size-4 animate-spin" />
                      )}
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
    </div>
  );
}

export default ManageQuestions;
