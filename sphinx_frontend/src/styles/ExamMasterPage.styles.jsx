import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #ffffff;
  text-align: left;
`;

export const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

export const Button = styled.button`
  background-color: #111827;
  color: #ffffff;
  border-radius: 5px;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-right: 0.7rem;
  padding-left: 0.7rem;
  margin: 0.1rem;
`;

// export const StyledNavLink = styled(NavLink)`
//   background-color: #111827;
//   color: #ffffff;
//   border-radius: 5px;
//   padding-top: 0.3rem;
//   padding-bottom: 0.3rem;
//   padding-right: 0.7rem;
//   padding-left: 0.7rem;
//   margin: 0.1rem;
// `;

export const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;

  svg {
    transition: all 0.25s ease;
  }

  &.edit {
    background: #eef2ff;
    color: #4f46e5;
  }

  &.add {
    background: #ecfdf5;
    color: #059669;
  }

  &.delete {
    background: #fef2f2;
    color: #dc2626;
  }

  &:hover {
    transform: translateY(-2px) scale(1.08);

    svg {
      transform: scale(1.15);
    }
  }
`;
export const StyledSpan = styled.span`
  padding: 2px 10px;
  font-size: 1rem;
`;
export const ExamContainer = styled.div`
  display: flex;
  font-size: 1.1rem;
  font-weight: 600;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 0.7rem;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  margin-top: 2rem;
  text-align: center;
  align-items: center;
  padding-left: 2rem;
  width: 100%;
`;
export const Header = styled.div`
  background: #f7f6f3;
  padding: 0.9rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  justify-content: space-between;
`;
export const SubContainer = styled.div`
  display: flex;
  font-size: 1rem;
  gap: 1rem;
  font-weight: 300;
`;
export const StyledH2 = styled.h2`
  margin: 1rem;
  font-weight: 700;
`;

export const BlueActionLabel = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: royalblue;
`;

export const GreenActionLabel = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: #059669;
`;

export const RedActionLabel = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: #dc2525;
`;

export const ExamCard = styled.div`
  background: #ffffff;
  padding: 0.8rem;
  padding-left: 2rem;
  padding-right: 2rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease;
  border-bottom: 1px black solid;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
  }
`;

export const ExamHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ExamTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const ActionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  span {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
  }
`;

export const ActionButton = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &.edit {
    color: black;

    &:hover {
      background: black;
      color: white;
    }
  }

  &.delete {
    background: #dc2626;
    color: #dc2626;

    &:hover {
      background: #dc2626;
      color: white;
    }
  }
`;

export const StatsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 22px;
  margin: 24px 0;
`;

export const StatsCard = styled.div`
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 14px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  transition: all 0.25s ease-in-out;
  position: relative;
  overflow: hidden;

  /* Top Accent Line */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${({ color }) => color || "#4f46e5"};
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
  }
`;

export const StatsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatsIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ bg }) => bg || "#eef2ff"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color || "#4f46e5"};
`;

export const StatsTitle = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  margin: 12px 0 4px 0;
`;

export const StatsValue = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  letter-spacing: -0.5px;
`;
