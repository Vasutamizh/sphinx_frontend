import { User2Icon } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Navbar() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let menuItems;

  if (isAuthenticated && userRole.roleTypeId === "SphinxAdmin") {
    menuItems = [
      { name: "Dashboard", path: "/" },
      { name: "Manage Questions", path: "/manageQuestions" },
      { name: "Manage Users", path: "/manageUsers" },
      { name: "Create Assessments", path: "/create-assessment" },
    ];
  } else if (isAuthenticated && userRole.roleTypeId === "SphinxUser") {
    menuItems = [{ name: "Dashboard", path: "/userDashboard" }];
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

        <div className="flex gap-5 items-center">
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
          {isAuthenticated && (
            <div>
              <div className="relative">
                {/* Profile Button */}
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className="cursor-pointer">
                    <User2Icon size={18} />
                  </div>
                  <svg
                    className={`cursor-pointer w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-5 w-72 rounded-2xl shadow-2xl bg-white z-50 transition-all duration-200">
                    <div className="p-3" onClick={() => setDropdownOpen(false)}>
                      <Link to="/logout">
                        <button className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors duration-200">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign out
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {open && (
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
        </div>
      )}
    </>
  );
}

export default Navbar;
