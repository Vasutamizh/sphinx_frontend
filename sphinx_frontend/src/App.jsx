import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import AddQuestionPage from "./pages/AddQuestionPage";
import LoginPage from "./pages/LoginPage";
import QuestionUploadPage from "./pages/QuestionUploadPage";
import SignupPage from "./pages/SignupPage";
import ExamCreationPage from "./pages/ExamCreationPage";

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
            <Route path="/exam" Component={ExamCreationPage}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
