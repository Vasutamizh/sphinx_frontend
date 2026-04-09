import { Provider, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import AddQuestionPage from "./pages/AddQuestionPage";
import AddUser from "./pages/AddUser";
import AssignUsers from "./pages/AssignUsersPage";
import ExamCreationPage from "./pages/ExamCreationPage";
import ExamMasterPage from "./pages/ExamMasterPage";
import ExamQuestionsPage from "./pages/ExamQuestionsPage";
import ExamWiseUserViewer from "./pages/ExamWiseUserViewerPage";
import LoginPage from "./pages/LoginPage";
import Logout from "./pages/Logout";
import QuestionList from "./pages/QuestionListPage";
import QuestionUploadPage from "./pages/QuestionUploadPage";
import SignupPage from "./pages/SignupPage";
import UserExamDashboard from "./pages/UserWiseExamPage";
import store from "./store/Store";

function App() {
  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (isAuthenticated) {
      return children;
    } else {
      return <LoginPage />;
    }
  };

  const AuthenticateProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (isAuthenticated) {
      return <ExamMasterPage />;
    } else {
      return children;
    }
  };

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <AuthenticateProtectedRoute>
                    <LoginPage />
                  </AuthenticateProtectedRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <AuthenticateProtectedRoute>
                    <SignupPage />
                  </AuthenticateProtectedRoute>
                }
              />
              <Route
                path="/addQuestion"
                element={
                  <ProtectedRoute>
                    <AddQuestionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/uploadQuestions"
                element={
                  <ProtectedRoute>
                    <QuestionUploadPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/createExam"
                element={
                  <ProtectedRoute>
                    <ExamCreationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/userMaster"
                element={
                  <ProtectedRoute>
                    <AddUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <ExamMasterPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assignUsers"
                element={
                  <ProtectedRoute>
                    <AssignUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/examWiseUsers"
                element={
                  <ProtectedRoute>
                    <ExamWiseUserViewer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/userWiseExams"
                element={
                  <ProtectedRoute>
                    <UserExamDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/logout"
                element={
                  <ProtectedRoute>
                    <Logout />{" "}
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ExamQuestions"
                element={
                  <ProtectedRoute>
                    <ExamQuestionsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/allQuestions" Component={QuestionList} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
