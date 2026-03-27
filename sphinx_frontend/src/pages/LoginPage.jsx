import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EyeClosedIcon from "../components/EyeCloseIcon";
import EyeOpenIcon from "../components/EyeOpen";
import { apiPost } from "../services/ApiService";
import { loginFormValidator } from "../services/ValidationService";
import {
  ErrorBox,
  FormDiv,
  FormErrorMessage,
  InputLabel,
  TextInput,
} from "../styles/common.styles";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
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
    setUserId("");
    setPassword("");
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setResponseError("");
    setIsLoading(true);

    let formData = {
      userName: userId,
      password: password,
    };

    let errors = loginFormValidator(formData);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await apiPost("/auth/login", formData);

        if (response.error) {
          setResponseError(response.error);
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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
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
          Sign in to your account
        </h1>

        {responseError && <ErrorBox>{responseError}</ErrorBox>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <InputLabel htmlFor="userId">User Login ID</InputLabel>
            <TextInput
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              autoComplete="username"
            />
            {formErrors.userName && (
              <FormErrorMessage>{formErrors.userName}</FormErrorMessage>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <InputLabel htmlFor="password">Password</InputLabel>
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

          <div className="flex items-center justify-between pt-1">
            {/* <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 cursor-pointer rounded"
              />
              <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                Remember me
              </span>
            </label> */}
            <a
              href="#"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Forgot password?
            </a>
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
                Signing in...
              </span>
            ) : (
              "Sign In"
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
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </FormDiv>
    </div>
  );
}
