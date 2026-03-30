import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Questions", path: "/questions" },
    { name: "Add Questions", path: "/addQuestion" },
    { name: "Upload File", path: "/uploadQuestions" },
    { name: "Create Exam", path: "/createExam" },
  ];

  return (
    <>
      <Nav>
        <NavContainer>
          <Logo>Sphinx</Logo>

          <Menu>
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
