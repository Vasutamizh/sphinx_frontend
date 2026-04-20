import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Calendar, ChevronRight, Clock10 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAPI from "../../hooks/useAPI";
import { loaderActions } from "../../store/LoaderReducer";
import {
  AssessmentCard,
  CardBadge,
  CardDescription,
  CardFooter,
  CardIcon,
  CardMeta,
  CardsGrid,
  CardTitle,
  CardTop,
  HeroSection,
  MetaItem,
  StartButton,
  StatusBox,
  Topics,
  TopicTag,
} from "../../styles/UserDashboard.styles";
import { failureToast } from "../../utils/toast";

function UserDashboardPage() {
  const { apiPost, isError } = useAPI();
  const partyId = useSelector((state) => state.auth?.partyId);
  const dispatch = useDispatch();
  const [newExams, setNewExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);

  const getAllAssessments = async () => {
    dispatch(loaderActions.loaderOn());
    try {
      const response = await apiPost("/userExam/getAllExamAssignedForUser", {
        partyId,
      });
      if (isError(response)) {
        failureToast(
          response.errorMessage ||
            response.error ||
            "Failed to load Assessments!",
        );
      } else {
        if (response.data) {
          setCompletedExams(response.data.filter((e) => e.examStatus === 0));
          setNewExams(response.data.filter((e) => e.examStatus === 1));
        }
      }
    } catch (err) {
      console.log("Error while fetching data ... ", err);
      failureToast("Failed to load Assessments!");
    } finally {
      dispatch(loaderActions.loaderOff());
    }
  };

  useEffect(() => {
    getAllAssessments();
  }, []);

  const navigate = useNavigate();
  return (
    <div>
      <div className="container">
        <div className="title flex justify-between items-center">
          <div className="titleText">
            <span className="text-2xl  block">Dashboard</span>
            <span className="text-gray-500 text-sm">
              Manage Your Assessments & Your Perfomance
            </span>
          </div>
        </div>

        <HeroSection>
          <p>👋 Welcome back!</p>
          <h1>Ready to test your skills?</h1>
          <div class="hero-sub">
            Track your progress, earn certifications, and level up your career
            with our assessments.
          </div>
          <div className="flex gap-5 mt-5">
            <StatusBox>
              <div class="num">{newExams?.length}</div>
              <div className="lbl">Available</div>
            </StatusBox>
            <StatusBox>
              <div class="num">{completedExams?.length}</div>
              <div class="lbl">Completed</div>
            </StatusBox>
            <StatusBox>
              <div class="num">82%</div>
              <div class="lbl">Avg. Score</div>
            </StatusBox>
          </div>
        </HeroSection>

        <div>
          <p className="text-2xl mb-2 mt-5">Assessments For You!</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="new_assessment" className="w-full mt-5">
          <TabsList variant="line">
            <TabsTrigger
              style={{ padding: 20, cursor: "pointer" }}
              value="new_assessment"
            >
              <h3>New Assessments</h3>
            </TabsTrigger>
            <TabsTrigger
              style={{ padding: 20, cursor: "pointer" }}
              value="completed"
            >
              <h3>Completed</h3>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="new_assessment">
            <CardsGrid>
              {newExams && newExams.length > 0 ? (
                newExams.map((exam) => (
                  <AssessmentCard variant="purple">
                    <CardTop>
                      <CardIcon>📘</CardIcon>
                      <CardBadge type={exam.isExamActive === 0 ? "new" : ""}>
                        {exam.isExamActive === 0 ? "Completed" : "New"}
                      </CardBadge>
                    </CardTop>

                    <CardTitle>{exam.examName}</CardTitle>
                    <CardDescription>{exam.description}</CardDescription>

                    <CardMeta>
                      <MetaItem>
                        <Clock10 size={16} /> Duration: {exam.duration}
                      </MetaItem>
                      <MetaItem>
                        <Calendar size={16} /> Deadline:{" "}
                        {new Date(exam.thruDate).toLocaleDateString()}
                      </MetaItem>
                    </CardMeta>
                    <CardFooter>
                      <Topics>
                        <TopicTag>React</TopicTag>
                        <TopicTag>JS</TopicTag>
                      </Topics>
                      {exam.examStatus && (
                        <StartButton
                          onClick={() => {
                            navigate("/assesmentDetails", {
                              state: { exam },
                            });
                          }}
                        >
                          Launch <ChevronRight size={20} />
                        </StartButton>
                      )}
                    </CardFooter>
                  </AssessmentCard>
                  // </div>
                ))
              ) : (
                <div className="mt-10 flex justify-start items-center">
                  <h3>No Assessments Available!</h3>
                </div>
              )}
            </CardsGrid>
          </TabsContent>
          <TabsContent value="completed">
            <CardsGrid>
              {completedExams && completedExams.length > 0 ? (
                completedExams.map((exam) => (
                  // <div className="exam-card flex items-center justify-between bg-white rounded shadow-md py-5 px-10">
                  <AssessmentCard variant="purple">
                    <CardTop>
                      <CardIcon>📘</CardIcon>
                      <CardBadge type={exam.examStatus === 0 ? "new" : ""}>
                        {exam.examStatus === 0 ? "Completed" : "New"}
                      </CardBadge>
                    </CardTop>

                    <CardTitle>{exam.examName}</CardTitle>
                    <CardDescription>{exam.description}</CardDescription>

                    <CardMeta>
                      <MetaItem>
                        <Clock10 size={16} /> Duration: {exam.duration}
                      </MetaItem>
                      <MetaItem>
                        <Calendar size={16} /> Deadline:{" "}
                        {new Date(exam.thruDate).toLocaleDateString()}
                      </MetaItem>
                    </CardMeta>

                    <CardFooter>
                      <Topics>
                        <TopicTag>React</TopicTag>
                        <TopicTag>JS</TopicTag>
                      </Topics>
                      {exam.examStatus && (
                        <StartButton
                          onClick={() => {
                            navigate("/assesmentDetails", {
                              state: { exam },
                            });
                          }}
                        >
                          Launch <ChevronRight size={20} />
                        </StartButton>
                      )}
                    </CardFooter>
                  </AssessmentCard>
                  // </div>
                ))
              ) : (
                <div className="mt-10 flex justify-start items-center">
                  <h3>No Assessments Available!</h3>
                </div>
              )}
            </CardsGrid>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserDashboardPage;
