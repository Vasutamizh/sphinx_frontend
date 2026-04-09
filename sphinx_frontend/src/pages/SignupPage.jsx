import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EyeClosedIcon from "../components/EyeCloseIcon";
import EyeOpenIcon from "../components/EyeOpen";
import { apiPost, isError } from "../services/ApiService";
import {
  BorderedFlexDiv,
  ErrorBox,
  FlexDiv,
  FormDiv,
  FormErrorMessage,
  InputLabel,
  MandatoryInp,
  PasswordInput,
  TextInput,
} from "../styles/common.styles";
import { signupFormValidator } from "../utils/ValidationService";
import { failureToast, successToast } from "../utils/toast";

export default function SignupPage() {
  const [state, setState] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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

  const clearForm = () => {
    setState({
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const updateState = (field, value) => {
    setState((prev) => {
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    setFormErrors({});
    setResponseError("");
    setIsLoading(true);

    errors = signupFormValidator(state);

    console.log("Erros => ", errors);

    if (Object.keys(errors).length === 0) {
      const payload = {
        userName: state.userName,
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        password: state.password,
        confirmPassword: state.confirmPassword,
        role: "admin",
      };
      try {
        const response = await apiPost("/auth/signup", payload);
        if (!isError(response)) {
          successToast(
            response.successMessage || "Account Created Successfully!",
          );
        } else {
          failureToast(
            response.errorMessage ||
              response.error ||
              "Failed to Create Account!",
          );
        }
      } finally {
        setIsLoading(false);
        clearForm();
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
          Create new Account
        </h1>

        {responseError && <ErrorBox>{responseError}</ErrorBox>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <InputLabel htmlFor="userName">
              User Name (unique name for you) <MandatoryInp>*</MandatoryInp>
            </InputLabel>
            <TextInput
              id="userName"
              type="text"
              value={state.userName}
              onChange={(e) => updateState("userName", e.target.value)}
              placeholder="Enter your user name"
            />
            {formErrors.userName && (
              <FormErrorMessage>{formErrors.userName}</FormErrorMessage>
            )}
          </div>

          <FlexDiv>
            <div className="flex flex-col gap-1.5">
              <InputLabel htmlFor="firstName">
                First Name <MandatoryInp>*</MandatoryInp>
              </InputLabel>
              <TextInput
                id="firstName"
                type="text"
                value={state.firstName}
                onChange={(e) => updateState("firstName", e.target.value)}
                placeholder="Enter your first name"
              />
              {formErrors.firstName && (
                <FormErrorMessage>{formErrors.firstName}</FormErrorMessage>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <InputLabel htmlFor="lastName">
                Last Name <MandatoryInp>*</MandatoryInp>
              </InputLabel>
              <TextInput
                id="lastName"
                type="text"
                value={state.lastName}
                onChange={(e) => updateState("lastName", e.target.value)}
                placeholder="Enter your last name"
              />
              {formErrors.lastName && (
                <FormErrorMessage>{formErrors.lastName}</FormErrorMessage>
              )}
            </div>
          </FlexDiv>

          <div className="flex flex-col gap-1.5">
            <InputLabel htmlFor="email">
              Email <MandatoryInp>*</MandatoryInp>
            </InputLabel>
            <TextInput
              id="email"
              type="text"
              value={state.email}
              onChange={(e) => updateState("email", e.target.value)}
              placeholder="Enter your email address"
            />
            {formErrors.email && (
              <FormErrorMessage>{formErrors.email}</FormErrorMessage>
            )}
          </div>

          <FlexDiv>
            <div className="flex flex-col gap-1.5">
              <InputLabel htmlFor="password">
                Password <MandatoryInp>*</MandatoryInp>
              </InputLabel>
              <BorderedFlexDiv>
                <PasswordInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={state.password}
                  onChange={(e) => updateState("password", e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                {/* absolute right-3 top-1/2 -translate-y-1/2 */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className=" text-slate-400
                           hover:text-indigo-400 transition-colors duration-200
                           p-1 rounded-lg hover:bg-indigo-500/10 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              </BorderedFlexDiv>
              {formErrors.password && (
                <FormErrorMessage>{formErrors.password}</FormErrorMessage>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <InputLabel htmlFor="confirmPassword">
                Confirm Password <MandatoryInp>*</MandatoryInp>
              </InputLabel>
              <div>
                <TextInput
                  id="confirmPassword"
                  type="password"
                  value={state.confirmPassword}
                  onChange={(e) =>
                    updateState("confirmPassword", e.target.value)
                  }
                  placeholder="Enter your confirm password"
                />
              </div>
              {formErrors.confirmPassword && (
                <FormErrorMessage>
                  {formErrors.confirmPassword}
                </FormErrorMessage>
              )}
            </div>
          </FlexDiv>

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
          Already have an account? <Link to="/">Login here</Link>
          {/* <StyledLink to="#">Login here.</StyledLink> */}
        </p>
      </FormDiv>
    </div>
  );
}
