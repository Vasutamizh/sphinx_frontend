import { Provider, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import LoginPage from "./pages/Auth/LoginPage";
import Logout from "./pages/Auth/Logout";
import SignupPage from "./pages/Auth/SignupPage";
import AssignUsers from "./pages/Exam/AssignUsersPage";
import ExamCreationPage from "./pages/Exam/ExamCreationPage";
import ExamDetailsPage from "./pages/Exam/ExamDetailsPage";
import ExamMasterPage from "./pages/Exam/ExamMasterPage";
import ExamResult from "./pages/Exam/ExamResult";
import ExamWiseUserViewer from "./pages/Exam/ExamWiseUserViewerPage";
import AddQuestionPage from "./pages/Question/AddQuestionPage";
import ManageQuestions from "./pages/Question/ManageQuestions";
import QuestionAttendPage from "./pages/Question/QuestionAttendPage";
import QuestionUploadPage from "./pages/Question/QuestionUploadPage";
import ManageUsers from "./pages/User/ManageUsers";
import UserDashboardPage from "./pages/User/UserDashboardPage";
import UserExamDashboard from "./pages/User/UserWiseExamPage";
import store from "./store/Store";

function App() {
  const ProtectedComp = ({ children }) => {
    const isAuthenticated = useSelector((state) => state?.auth.isAuthenticated);
    if (isAuthenticated) {
      return children;
    } else {
      return <LoginPage />;
    }
  };
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/login" Component={LoginPage} />
              <Route path="/signup" Component={SignupPage} />
              <Route path="/addQuestion" Component={AddQuestionPage} />
              <Route path="/uploadQuestions" Component={QuestionUploadPage} />
              <Route path="/createExam" Component={ExamCreationPage} />
              <Route
                path="/"
                element={
                  <ProtectedComp>
                    <ExamMasterPage />
                  </ProtectedComp>
                }
              />
              <Route path="/assignUsers" Component={AssignUsers} />
              <Route path="/examWiseUsers" Component={ExamWiseUserViewer} />
              <Route path="/userWiseExams" Component={UserExamDashboard} />
              <Route path="/logout" Component={Logout} />
              <Route path="/manageQuestions" Component={ManageQuestions} />
              <Route path="/manageUsers" Component={ManageUsers} />
              <Route path="/userDashboard" Component={UserDashboardPage} />
              <Route path="/assesmentDetails" Component={ExamDetailsPage} />
              <Route path="/attend" Component={QuestionAttendPage} />
              <Route path="/assessmentResult" Component={ExamResult} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
