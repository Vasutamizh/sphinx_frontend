import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" Component={LoginPage} />
          <Route path="/signup" Component={SignupPage} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
