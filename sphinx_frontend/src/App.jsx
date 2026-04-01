import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import AddQuestionPage from "./pages/AddQuestionPage";
import AddUser from "./pages/AddUser";
import ExamCreationPage from "./pages/ExamCreationPage";
import LoginPage from "./pages/LoginPage";
import QuestionUploadPage from "./pages/QuestionUploadPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" Component={LoginPage} />
            <Route path="/signup" Component={SignupPage} />
            <Route path="/addQuestion" Component={AddQuestionPage} />
            <Route path="/uploadQuestions" Component={QuestionUploadPage} />
            <Route path="/createExam" Component={ExamCreationPage} />
            <Route path="/userMaster" Component={AddUser} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
