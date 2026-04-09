import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Hamburger,
  Logo,
  Menu,
  MenuItem,
  MobileMenu,
  Nav,
  NavContainer,
  Overlay,
} from "../styles/Navbar.styles";

function Navbar() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/" },
    // { name: "Questions", path: "/questions" },
    { name: "Add Questions", path: "/addQuestion" },
    { name: "Manage Questions", path: "/uploadQuestions" },
    { name: "Manage Assignments", path: "/createExam" },
    // { name: "Exam Master", path: "/exammaster" },
    { name: "Manage Users", path: "/userMaster" },
    { name: "Exam Wise Users", path: "/examWiseUsers" },
    { name: "User Wise Exams", path: "/userWiseExams" },
    { name: "Logout", path: "/logout" },
  ];

  return (
    <>
      <Nav>
        <NavContainer>
          <Logo>Sphinx Exam Management</Logo>

          <Menu>
            {isAuthenticated &&
              menuItems.map((item, idx) => (
                <MenuItem key={idx} to={item.path}>
                  {item.name}
                </MenuItem>
              ))}
          </Menu>

          <Hamburger onClick={() => setOpen(true)}>
            <span />
            <span />
            <span />
          </Hamburger>
        </NavContainer>
      </Nav>

      <Overlay open={open} onClick={() => setOpen(false)} />

      <MobileMenu open={open}>
        {menuItems.map((item, idx) => (
          <MenuItem key={idx} to={item.path}>
            {item.name}
          </MenuItem>
        ))}
      </MobileMenu>
    </>
  );
}

export default Navbar;
