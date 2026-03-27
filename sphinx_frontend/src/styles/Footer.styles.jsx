import styled from "styled-components";

export const FooterContainer = styled.footer`
  background: #0f172a;
  color: #cbd5f5;
  margin-top: 3rem;
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

export const FooterSection = styled.div``;

export const FooterTitle = styled.h4`
  color: white;
  margin-bottom: 0.75rem;
`;

export const FooterLink = styled.div`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #60a5fa;
  }
`;

export const BottomBar = styled.div`
  border-top: 1px solid #1e293b;
  text-align: center;
  padding: 1rem;
  font-size: 0.8rem;
  color: #94a3b8;
`;
