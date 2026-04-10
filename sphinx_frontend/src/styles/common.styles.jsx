import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

export const InputLabel = styled.label`
  color: #708090;
  font-weight: 600;
`;

export const BlackInputLabel = styled(InputLabel)`
  color: black;
`;

export const TextInput = styled.input`
  width: 100%;
  height: 50px;
  border-radius: 5px;
  box-shadow: none;
  border: 1px solid #ced6e0;
  font-size: 16px;
  padding: 5px 15px;
  background-color: white;
  color: #15314d;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
  outline: none;

  &:hover {
    background: white;
    border-color: #3e3e50;
  }

  &:focus {
    border-color: #7c6af7;
    box-shadow: 0 0 0 3px rgba(124, 106, 247, 0.25);
    background: white;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border-radius: 5px;
  box-shadow: none;
  border: 1px solid #ced6e0;
  font-size: 16px;
  padding: 10px 15px;
  background-color: white;
  color: #15314d;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
  outline: none;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;

  &:hover {
    background: white;
    border-color: #3e3e50;
  }

  &:focus {
    border-color: #7c6af7;
    box-shadow: 0 0 0 3px rgba(124, 106, 247, 0.25);
    background: white;
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  appearance: none;
  background: white;
  border: 1.5px solid #ced6e0;
  border-radius: 5px;
  color: #15314d;
  font-size: 14px;
  font-weight: 400;
  padding: 11px 40px 11px 14px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
  outline: none;

  &:hover {
    background: white;
    border-color: #3e3e50;
  }

  &:focus {
    border-color: #7c6af7;
    box-shadow: 0 0 0 3px rgba(124, 106, 247, 0.25);
    background: white;
  }

  option {
    background: white;
    color: black;
  }
`;

export const StyledButton = styled.button`
  min-width: fit-content;
  background-color: #ffffff;
  border: 0;
  border-radius: 0.5rem;
  box-sizing: border-box;
  color: #111827;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  padding: 0.75rem 1rem;
  text-align: center;
  text-decoration: none #d1d5db solid;
  text-decoration-thickness: auto;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  word-wrap: no-wrap;

  :&hover {
    background-color: rgb(249, 250, 251);
  }

  :&focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  :&focus-visible {
    box-shadow: none;
  }
`;
export const RadioWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  justify-content: center;
`;

export const HiddenRadio = styled.input.attrs({ type: "radio" })`
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
  height: 1px;
  width: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;

  &:focus + span {
    outline: 0;
    border-color: #2260ff;
    box-shadow: 0 0 0 4px #b5c9fc;
  }

  &:checked + span {
    box-shadow: 0 0 0 0.0625em #0043ed;
    background-color: #dee7ff;
    z-index: 1;
    color: #0043ed;
  }
`;

export const RadioLabel = styled.label`
  display: inline-block;

  &:first-child span {
    border-radius: 0.375em 0 0 0.375em;
  }

  &:last-child span {
    border-radius: 0 0.375em 0.375em 0;
  }
`;

export const RadioButton = styled.span`
  display: block;
  cursor: pointer;
  padding: 0.375em 0.75em;
  position: relative;
  margin-left: 0.0625em;
  letter-spacing: 0.05em;
  text-align: center;
  transition: background-color 0.5s ease;
  background-color: ${({ active }) => (active ? "#dee7ff" : "#fff")};
  color: ${({ active }) => (active ? "#0043ed" : "#3e4963")};
  box-shadow: ${({ active }) =>
    active ? "0 0 0 0.0625em #0043ed" : "0 0 0 0.0625em #b5bfd9"};
`;

export const PasswordInput = styled(TextInput)`
  border: none;
  height: 47px;
`;

export const StyledLink = styled(Link)`
  color: var(--primary-color);
  font-weight: 600;
`;

export const ErrorBox = styled.div`
  max-width: 350px;
  background-color: #fdecea;
  color: #b71c1c;

  border: 1px solid #f5c2c7;
  border-left: 5px solid #d32f2f;

  padding: 14px 16px;
  border-radius: 8px;

  font-size: 14px;
  font-weight: 500;

  margin: 12px auto;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

export const MandatoryInp = styled.span`
  content: "*";
  font-size: 18px;
  color: red;
  font-weight: 700;
`;

export const FormErrorMessage = styled.span`
  color: #d93025;
  background-color: #fdecea;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
  margin-top: 4px;
`;

export const FormDiv = styled.div`
  max-width: 890px;
`;

export const FlexDiv = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
`;

export const BorderedFlexDiv = styled(FlexDiv)`
  border-radius: 5px;
  box-shadow: none;
  border: 1px solid #ced6e0;
  background: white;
  padding-right: 5px;
`;

export const Section = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background: #f8faff;
  border: 1px solid #e2e8f0;
`;

export const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.75rem;
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
`;

export const LayoutContainer = styled.div`
  width: 100%;
`;

export const LayoutContentContainer = styled.div`
  max-width: 1000px;
  // margin: 20px auto;
  flex: 3;
`;

export const HelperText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: gray;
  margin-right: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LoaderBackdrop = styled.div`
  width: 100%;
  min-height: 100%;
  position: fixed;
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const StyledPrimaryButton = styled.button`
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;

  font-size: 0.875rem;
  font-weight: 600;
  color: white;

  background: linear-gradient(to right, #4f46e5, #7c3aed);
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.25);

  border: none;
  outline: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: space-between;

  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(to right, #6366f1, #8b5cf6);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
  }
`;

export const Spinner = styled.svg`
  width: 16px;
  height: 16px;
  animation: ${spin} 1s linear infinite;
`;

export const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;
