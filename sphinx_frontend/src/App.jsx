import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import AddQuestionPage from "./pages/AddQuestionPage";
import LoginPage from "./pages/LoginPage";
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
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
