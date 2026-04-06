import styled, { css, keyframes } from "styled-components";

export const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const rowEnter = keyframes`
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const tokens = {
  // Palette — slate-ink on warm-white canvas
  bg: "#F7F6F3",
  surface: "#FFFFFF",
  surfaceHover: "#FAFAF8",
  border: "rgba(0,0,0,0.08)",
  borderStrong: "rgba(0,0,0,0.14)",

  textPrimary: "#1A1917",
  textSecondary: "#6B6966",
  textMuted: "#A8A5A2",

  accent: "#2D6BE4", // action blue
  accentLight: "#EEF3FD",
  accentHover: "#1F5ACC",

  danger: "#DC3545",
  dangerLight: "#FFF0F1",
  dangerHover: "#B71C2B",

  success: "#1A9E6A",
  successLight: "#EBF8F3",

  // Radius
  radiusSm: "8px",
  radiusMd: "12px",
  radiusLg: "16px",
  radiusFull: "999px",

  // Shadow
  shadowSm: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)",

  // Transition
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
};

/** Outer wrapper — sets font context and background */
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/** Card that houses the table */
export const TableCard = styled.div`
  width: 100%;
  max-width: 900px;
  background: ${tokens.surface};
  border-radius: ${tokens.radiusLg};
  border: 1px solid ${tokens.border};
  box-shadow: ${tokens.shadowMd};
  overflow: hidden;
  animation: ${fadeSlideIn} 300ms ${tokens.ease} both;
`;

/** Card header row — title + action button */
export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: ${tokens.radiusFull};
  background: ${tokens.accent};
  color: #fff;
  border: none;
  font-family: ${tokens.fontSans};
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 140ms ${tokens.ease},
    transform 100ms ${tokens.ease};

  &:hover {
    background: ${tokens.accentHover};
  }
  &:active {
    transform: scale(0.97);
  }
  &:focus-visible {
    outline: 2.5px solid ${tokens.accent};
    outline-offset: 2px;
  }
`;
export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid ${tokens.border};
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: ${tokens.textPrimary};
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: ${tokens.accent};
  }
`;

/** Scrollable table wrapper for narrow viewports */
export const TableScrollWrapper = styled.div`
  overflow-x: auto;
`;

/** The <table> itself — full semantic HTML with styled-components */
export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

/** <thead> row */
export const THead = styled.thead`
  background: ${tokens.bg};
  border-bottom: 1px solid ${tokens.border};
`;

/** <th> header cell — supports sort state */
export const Th = styled.th`
  padding: 11px 16px;
  text-align: left;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${tokens.textMuted};
  white-space: nowrap;
  user-select: none;

  ${({ $sortable }) =>
    $sortable &&
    css`
      cursor: pointer;

      &:hover {
        color: ${tokens.textPrimary};
      }
    `}

  ${({ $align }) =>
    $align === "center" &&
    css`
      text-align: center;
    `}
`;

/** Sort icon container inside <th> */
export const SortIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 5px;
  vertical-align: middle;
  color: ${({ $active }) => ($active ? tokens.accent : tokens.textMuted)};
  transition: color 140ms;
`;

/** <tbody> */
export const TBody = styled.tbody``;

/** <tr> body row — subtle hover + entry animation */
export const Tr = styled.tr`
  border-bottom: 1px solid ${tokens.border};
  transition: background 120ms ${tokens.ease};
  animation: ${rowEnter} 220ms ${tokens.ease} both;
  animation-delay: ${({ $index }) => `${$index * 40}ms`};

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${tokens.surfaceHover};
  }

  ${({ $confirming }) =>
    $confirming &&
    css`
      background: ${tokens.dangerLight} !important;
    `}
`;

/** <td> body cell */
export const Td = styled.td`
  padding: 13px 16px;
  color: ${tokens.textPrimary};
  vertical-align: middle;

  ${({ $align }) =>
    $align === "center" &&
    css`
      text-align: center;
    `}
`;

/** User name + avatar cell layout */
export const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
`;

/**
 * Avatar circle — background hue derived from the user's name for
 * visual differentiation without relying on a real avatar image.
 */
export const Avatar = styled.div`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ $hue }) => `hsl(${$hue}, 60%, 88%)`};
  color: ${({ $hue }) => `hsl(${$hue}, 55%, 30%)`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
`;

export const FullName = styled.span`
  font-weight: 500;
  color: ${tokens.textPrimary};
`;

export const UserEmail = styled.span`
  display: block;
  font-size: 12px;
  color: ${tokens.textMuted};
  margin-top: 1px;
`;

/** Inline numeric display — monospaced for alignment */
export const NumericValue = styled.span`
  font-size: 13.5px;
  font-weight: 500;
  color: ${tokens.textPrimary};
`;

/** Pill badge for timeout display */
export const TimeoutBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px 3px 7px;
  border-radius: ${tokens.radiusFull};
  background: ${tokens.accentLight};
  color: ${tokens.accent};
  font-size: 12.5px;
  font-weight: 500;

  svg {
    flex-shrink: 0;
  }
`;

/** Inline edit input — appears when a cell is being edited */
export const InlineInput = styled.input`
  width: 80px;
  padding: 5px 9px;
  border-radius: ${tokens.radiusSm};
  border: 1.5px solid ${tokens.accent};
  background: ${tokens.accentLight};
  font-size: 13.5px;
  font-weight: 500;
  color: ${tokens.textPrimary};
  outline: none;
  box-shadow: 0 0 0 3px rgba(45, 107, 228, 0.12);
  transition: border-color 140ms;
`;

/** Row of action buttons in the Action column */
export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

/** Base for icon button — variants applied via $variant prop */
export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${tokens.radiusSm};
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background 130ms ${tokens.ease},
    border-color 130ms ${tokens.ease},
    transform 100ms;
  font-size: 12px;
  font-weight: 500;

  &:active {
    transform: scale(0.94);
  }
  &:focus-visible {
    outline: 2px solid ${tokens.accent};
    outline-offset: 1px;
  }

  ${({ $variant }) =>
    $variant === "edit" &&
    css`
      background: transparent;
      color: ${tokens.textSecondary};
      &:hover {
        background: ${tokens.accentLight};
        color: ${tokens.accent};
        border-color: rgba(45, 107, 228, 0.2);
      }
    `}

  ${({ $variant }) =>
    $variant === "confirm-save" &&
    css`
      background: ${tokens.successLight};
      color: ${tokens.success};
      border-color: rgba(26, 158, 106, 0.25);
      &:hover {
        background: #d3f5e8;
      }
    `}

  ${({ $variant }) =>
    $variant === "confirm-cancel" &&
    css`
      background: transparent;
      color: ${tokens.textMuted};
      &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: ${tokens.textPrimary};
      }
    `}

  ${({ $variant }) =>
    $variant === "delete" &&
    css`
      background: transparent;
      color: ${tokens.textSecondary};
      &:hover {
        background: ${tokens.dangerLight};
        color: ${tokens.danger};
        border-color: rgba(220, 53, 69, 0.2);
      }
    `}

  ${({ $variant }) =>
    $variant === "delete-confirm" &&
    css`
      background: ${tokens.danger};
      color: #fff;
      border-color: transparent;
      width: auto;
      padding: 0 12px;
      gap: 5px;
      border-radius: ${tokens.radiusFull};
      font-size: 12px;
      &:hover {
        background: ${tokens.dangerHover};
      }
    `}
`;

/** Empty state shown when all users are removed */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 10px;
  color: ${tokens.textMuted};
  font-size: 14px;

  svg {
    opacity: 0.35;
  }
`;

/** Footer row — row count */
export const CardFooter = styled.div`
  padding: 12px 24px;
  border-top: 1px solid ${tokens.border};
  font-size: 12.5px;
  color: ${tokens.textMuted};
  background: ${tokens.bg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
