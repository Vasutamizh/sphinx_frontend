import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1000;
`;

export const Content = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  z-index: 1100;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: black;
`;

export const Description = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0.5rem 0 1rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  margin-bottom: 1rem;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px #dbeafe;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export const Button = styled.button`
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: ${({ primary }) => (primary ? "#2563eb" : "#e5e7eb")};
  color: ${({ primary }) => (primary ? "white" : "#111")};

  &:hover {
    opacity: 0.9;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 1rem;
  cursor: pointer;
`;
