import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Navbar() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);

  const [open, setOpen] = useState(false);

  let menuItems;

  if (isAuthenticated && userRole.roleTypeId === "SphinxAdmin") {
    menuItems = [
      { name: "Dashboard", path: "/" },
      { name: "Manage Questions", path: "/manageQuestions" },
      { name: "Manage Users", path: "/manageUsers" },
      { name: "Create Assessments", path: "/createExam" },
      { name: "Logout", path: "/logout" },
    ];
  } else if (isAuthenticated && userRole.roleTypeId === "SphinxUser") {
    menuItems = [
      { name: "Dashboard", path: "/userDashboard" },
      { name: "Logout", path: "/logout" },
    ];
  } else {
    menuItems = [];
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#FAFAF8] border-b border-[#E8E6DF] px-6 md:px-8 h-16 flex items-center justify-between">
        <Link to="#" className="flex items-center gap-3 no-underline">
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
          <span className="text-[18px] font-bold tracking-tight text-[#2C2C2A] font-serif">
            Sphinx<span className="text-[#0F6E56]">Exam</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {menuItems.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm px-3.5 py-1.5 rounded-lg transition-colors duration-150 no-underline
                ${
                  link.active
                    ? "text-[#0F6E56] font-medium"
                    : "text-[#5F5E5A] hover:text-[#1D9E75] hover:bg-emerald-50"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden flex flex-col gap-[5px] p-1.5 rounded-lg bg-transparent border-none cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-[22px] h-[2px] bg-[#2C2C2A] rounded transition-transform duration-250
              ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-[#2C2C2A] rounded transition-opacity duration-200
              ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-[#2C2C2A] rounded transition-transform duration-250
              ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {setOpen && (
        <div className="md:hidden bg-[#FAFAF8] border-b border-[#E8E6DF] px-5 pt-3 pb-5 flex flex-col gap-1 shadow-md">
          {menuItems.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`text-[15px] px-3 py-2.5 rounded-lg no-underline transition-colors duration-150
                ${
                  link.active
                    ? "text-[#0F6E56] font-medium"
                    : "text-[#5F5E5A] hover:text-[#1D9E75] hover:bg-emerald-50"
                }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="#"
            onClick={() => setOpen(false)}
            className="mt-2 text-center text-[15px] font-medium bg-[#1D9E75] text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity no-underline"
          >
            Get Tickets
          </Link>
        </div>
      )}
      {/* <Nav>
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
      {/* {menuItems.map((item, idx) => (
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
      </Nav> */}

      {/* // <Overlay open={open} onClick={() => setOpen(false)} />

      // <MobileMenu open={open}>
      //   {menuItems.map((item, idx) => (
      //     <MenuItem key={idx} to={item.path}>
      //       {item.name}
      //     </MenuItem>
      //   ))}
      // </MobileMenu> */}
    </>
  );
}

export default Navbar;
