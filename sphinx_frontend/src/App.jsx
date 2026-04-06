import { Provider, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import AddQuestionPage from "./pages/AddQuestionPage";
import AddUser from "./pages/AddUser";
import AssignUsers from "./pages/AssignUsersPage";
import ExamCreationPage from "./pages/ExamCreationPage";
import ExamMasterPage from "./pages/ExamMasterPage";
import ExamWiseUserViewer from "./pages/ExamWiseUserViewerPage";
import LoginPage from "./pages/LoginPage";
import QuestionUploadPage from "./pages/QuestionUploadPage";
import SignupPage from "./pages/SignupPage";
import store from "./store/Store";
import ExamQuestionsPage from "./pages/ExamQuestionsPage";

function App() {
  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    console.log("State =>", isAuthenticated);

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
              <Route path="/" Component={LoginPage} />
              <Route path="/signup" Component={SignupPage} />
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
                path="/exammaster"
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
                path="/ExamQuestions"
                element={
                  <ProtectedRoute>
                    <ExamQuestionsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
