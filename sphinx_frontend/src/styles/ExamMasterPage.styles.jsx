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

export const StyledNavLink=styled(NavLink)`
background-color: #111827;
  color: #ffffff;
  border-radius: 5px;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-right: 0.7rem;
  padding-left: 0.7rem;
  margin: 0.1rem;
`
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
  margin: 2rem;
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
