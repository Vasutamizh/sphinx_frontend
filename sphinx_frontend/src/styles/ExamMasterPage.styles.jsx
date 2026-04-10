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
  border-radius: 1rem;
  text-align: center;
  align-items: center;
  padding-left: 2rem;
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
  border-radius: 14px;
  padding: 18px 22px;
  margin-bottom: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease;

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
  gap: 24px;
`;

export const ActionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  span {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
  }
`;

export const ActionButton = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &.edit {
    background: #e0f2fe;
    color: #0284c7;

    &:hover {
      background: #0284c7;
      color: white;
    }
  }

  &.topics {
    background: #dcfce7;
    color: #16a34a;

    &:hover {
      background: #16a34a;
      color: white;
    }
  }

  &.delete {
    background: #fee2e2;
    color: #dc2626;

    &:hover {
      background: #dc2626;
      color: white;
    }
  }
`;
