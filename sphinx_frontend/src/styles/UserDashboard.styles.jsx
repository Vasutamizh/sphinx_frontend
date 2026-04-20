import styled from "styled-components";

export const HeroSection = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%);
  color: #fff;
  padding: 48px 40px 40px;
`;

export const StatusBox = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 14px 24px;
  text-align: center;

  &.num {
    font-size: 1.6rem;
    font-weight: 800;
  }

  &.lbl {
    font-size: 0.78rem;
    opacity: 0.8;
    margin-top: 2px;
  }
`;

import { css } from "styled-components";

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 20px;
  margin-top: 10px;
`;

export const AssessmentCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1.5px solid transparent;
  transition: all 0.25s;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #4f46e5;
    box-shadow: 0 6px 24px rgba(79, 70, 229, 0.12);
    transform: translateY(-2px);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${({ variant }) => {
      switch (variant) {
        case "green":
          return "#059669";
        case "orange":
          return "#d97706";
        case "red":
          return "#dc2626";
        case "pink":
          return "#db2777";
        case "blue":
          return "#0284c7";
        default:
          return "#4f46e5";
      }
    }};
  }
`;

export const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
`;

export const CardIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 1.4rem;
  background: #ecfdf5;
`;

export const CardBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;

  ${({ type }) => {
    switch (type) {
      case "popular":
        return css`
          background: #fef3c7;
          color: #d97706;
        `;
      case "due":
        return css`
          background: #fef2f2;
          color: #dc2626;
        `;
      case "completed":
        return css`
          background: #f0f0ff;
          color: #4f46e5;
        `;
      default:
        return css`
          background: #ecfdf5;
          color: #059669;
        `;
    }
  }}
`;

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 6px;
  line-height: 1.3;
`;

export const CardDescription = styled.p`
  font-size: 0.83rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 14px;
`;

export const CardMeta = styled.div`
  display: flex;
  gap: 14px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: #6b7280;

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const ProgressWrap = styled.div`
  margin-bottom: 16px;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 5px;
`;

export const ProgressBar = styled.div`
  background: #e9ecef;
  border-radius: 99px;
  height: 6px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  border-radius: 99px;
  background: ${({ color = "#4f46e5" }) => color};
  width: ${({ progress }) => progress}%;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Topics = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const TopicTag = styled.span`
  font-size: 0.7rem;
  padding: 3px 9px;
  border-radius: 6px;
  background: #f4f6fb;
  color: #555;
  font-weight: 500;
`;

export const StartButton = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;

  background: ${({ variant }) => {
    switch (variant) {
      case "resume":
        return "#059669";
      case "review":
        return "#7c3aed";
      default:
        return "#4f46e5";
    }
  }};

  &:hover {
    background: ${({ variant }) => {
      switch (variant) {
        case "resume":
          return "#047857";
        case "review":
          return "#6d28d9";
        default:
          return "#3730a3";
      }
    }};
  }
`;
