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
  const userRole = useSelector((state) => state.auth.userRole);

  const [open, setOpen] = useState(false);

  let menuItems;

  console.log("userRole =>", userRole);
  console.log("isAuthenticated =>", isAuthenticated);
  if (isAuthenticated && userRole.roleTypeId === "SphinxAdmin") {
    menuItems = [
      { name: "Dashboard", path: "/" },
      { name: "Manage Questions", path: "/manageQuestions" },
      { name: "Manage Users", path: "/manageUsers" },
      { name: "Create Assessments", path: "/createExam" },
      // { name: "Exam Wise Users", path: "/examWiseUsers" },
      // { name: "User Wise Exams", path: "/userWiseExams" },
      { name: "Logout", path: "/logout" },
    ];
  } else {
    menuItems = [
      { name: "Dashboard", path: "/userDashboard" },
      { name: "Logout", path: "/logout" },
    ];
  }

  return (
    <>
      <Nav>
        <NavContainer>
          <Logo>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            Sphinx Exam Management
          </Logo>

          <Menu>
            {/* {isAuthenticated && */}
            {menuItems.map((item, idx) => (
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
