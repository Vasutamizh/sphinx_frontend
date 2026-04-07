import styled, { keyframes } from "styled-components";

const overlayIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const overlayOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const panelIn = keyframes`
  from { opacity: 0; transform: scale(0.93) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

const panelOut = keyframes`
  from { opacity: 1; transform: scale(1) translateY(0); }
  to   { opacity: 0; transform: scale(0.95) translateY(6px); }
`;
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  background: rgba(10, 10, 14, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  /* entrance animation */
  animation: ${overlayIn} 180ms ease-out both;

  .modal-panel {
    animation: ${panelOut} 180ms ease-in both;
  }
`;

export const ModalPanel = styled.div`
  position: relative;
  width: ${($size) => $size || "50%"};
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06) inset,
    0 24px 80px rgba(0, 0, 0, 0.28),
    0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  animation: ${panelIn} 220ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
`;

// .modal-size-sm   { max-width: 380px; }
//   .modal-size-md   { max-width: 520px; }
//   .modal-size-lg   { max-width: 720px; }
//   .modal-size-xl   { max-width: 960px; }
//   .modal-size-full {
//     max-width: calc(100vw - 2rem);
//     max-height: calc(100vh - 2rem);
//   }

export const ModalHeader = styled.div`
  display: flex;
  padding: 20px;
  gap: 20px;
  align-items: center;
  flex-shrink: 0;
  gap: 14px;
  padding: 22px 24px 18px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
`;

export const ModalIconWrap = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalHeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ModalTitle = styled.div`
  margin: 0 0 3px;
  font-family: "Fraunces", Georgia, serif;
  font-size: 19px;
  font-weight: 600;
  color: #0f0f13;
  line-height: 1.3;
  letter-spacing: -0.01em;
`;

export const ModalSubtitle = styled.div`
  margin: 0;
  font-size: 13.5px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 1.5;
`;

export const ModalCloseButton = styled.button`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.35);
  transition:
    background 120ms,
    color 120ms;
  margin-top: -2px;
  padding: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.75);
  }

  &:focus-visible {
    outline: 2.5px solid #3883e8;
    outline-offset: 1px;
  }
`;

export const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  font-size: 14.5px;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.7);
  overscroll-behavior: contain;
`;

export const ModalFooter = styled.div`
  flex-shrink: 0;
  padding: 14px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  background: rgba(0, 0, 0, 0.015);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ModalSpinner = styled.div`
  animation: ${spin} 800ms linear infinite;
`;
