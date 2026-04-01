import { Provider, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import AddQuestionPage from "./pages/AddQuestionPage";
import AddUser from "./pages/AddUser";
import ExamCreationPage from "./pages/ExamCreationPage";
import ExamMasterPage from "./pages/ExamMasterPage";
import LoginPage from "./pages/LoginPage";
import QuestionUploadPage from "./pages/QuestionUploadPage";
import SignupPage from "./pages/SignupPage";
import store from "./store/Store";

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
              <Route path="/uploadQuestions" Component={QuestionUploadPage} />
              <Route path="/createExam" Component={ExamCreationPage} />
              <Route path="/userMaster" Component={AddUser} />
              <Route path="/exammaster" Component={ExamMasterPage} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
