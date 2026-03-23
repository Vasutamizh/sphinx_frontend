import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EyeClosedIcon from "../components/EyeCloseIcon";
import EyeOpenIcon from "../components/EyeOpen";
import { apiPost } from "../services/ApiService";
import { signupFormValidator } from "../services/ValidationService";
import {
  ErrorBox,
  FormDiv,
  FormErrorMessage,
  MandatoryInp,
  TextInput,
} from "../styles/common.styles";

export default function SignupPage() {
  const [userName, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //   role
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseError, setResponseError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [responseError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let formData = {
      userName,
      firstName,
      lastName,
      mobileNo,
      email,
      password,
      confirmPassword,
      role: "user",
    };

    let errors = signupFormValidator(formData);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await apiPost("/auth/signup", formData);
        if (response.error) {
          setResponseError(response.error);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setFormErrors(errors);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <FormDiv>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
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
          <span className="font-semibold text-lg tracking-wide">Sphinx</span>
        </div>

        <h1 className="text-2xl font-bold mb-1 tracking-tight">
          Create new account
        </h1>

        {responseError && <ErrorBox>{responseError}</ErrorBox>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="userId"
              className="text-xs font-semibold uppercase tracking-widest text-slate-400"
            >
              User Name (used in app) <MandatoryInp>*</MandatoryInp>
            </label>
            <TextInput
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your user name"
            />
            {formErrors.userName && (
              <FormErrorMessage>{formErrors.userName}</FormErrorMessage>
            )}
          </div>

          <div className="flex flex-row gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="firstName"
                className="text-xs font-semibold uppercase tracking-widest text-slate-400"
              >
                First Name <MandatoryInp>*</MandatoryInp>
              </label>
              <TextInput
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
              {formErrors.firstName && (
                <FormErrorMessage>{formErrors.firstName}</FormErrorMessage>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="lastName"
                className="text-xs font-semibold uppercase tracking-widest text-slate-400"
              >
                Last Name <MandatoryInp>*</MandatoryInp>
              </label>
              <TextInput
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
              {formErrors.lastName && (
                <FormErrorMessage>{formErrors.lastName}</FormErrorMessage>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="mobileNo"
              className="text-xs font-semibold uppercase tracking-widest text-slate-400"
            >
              Mobile Number <MandatoryInp>*</MandatoryInp>
            </label>
            <TextInput
              id="mobileNo"
              type="text"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              placeholder="Enter your mobile number"
            />
            {formErrors.mobileNo && (
              <FormErrorMessage>{formErrors.mobileNo}</FormErrorMessage>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-widest text-slate-400"
            >
              Email <MandatoryInp>*</MandatoryInp>
            </label>
            <TextInput
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
            {formErrors.email && (
              <FormErrorMessage>{formErrors.email}</FormErrorMessage>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-widest text-slate-400"
            >
              Password <MandatoryInp>*</MandatoryInp>
            </label>
            <div className="relative">
              <TextInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
                           hover:text-indigo-400 transition-colors duration-200
                           p-1 rounded-lg hover:bg-indigo-500/10 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            </div>
            {formErrors.password && (
              <FormErrorMessage>{formErrors.password}</FormErrorMessage>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-semibold uppercase tracking-widest text-slate-400"
            >
              Confirm Password <MandatoryInp>*</MandatoryInp>
            </label>
            <div>
              <TextInput
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your confirm password"
              />
            </div>
            {formErrors.confirmPassword && (
              <FormErrorMessage>{formErrors.confirmPassword}</FormErrorMessage>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white
                       bg-gradient-to-r from-indigo-600 to-violet-600
                       hover:from-indigo-500 hover:to-violet-500
                       active:scale-[0.98] transition-all duration-200
                       shadow-lg shadow-indigo-500/25
                       disabled:opacity-60 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
                creating account ....
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-xs text-slate-500 uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <p className="text-center text-sm text-slate-400">
          Already have an account? <Link to="/login">Login here</Link>
          {/* <StyledLink to="#">Login here.</StyledLink> */}
        </p>
      </FormDiv>
    </div>
  );
}
