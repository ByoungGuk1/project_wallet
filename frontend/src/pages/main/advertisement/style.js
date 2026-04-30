import styled from "styled-components";
import { Link } from "react-router-dom";

export const S = {};

S.AdWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
`;

S.ImageWrapper = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
`;

S.AdImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

S.PrevButton = styled.button`
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);

  width: 34px;
  height: 34px;
  border-radius: 50%;

  background-color: rgba(0, 0, 0, 0.35);
  color: ${({ theme }) => theme.PALETTE.background};
  font-size: 28px;
  line-height: 1;
`;

S.NextButton = styled.button`
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);

  width: 34px;
  height: 34px;
  border-radius: 50%;

  background-color: rgba(0, 0, 0, 0.35);
  color: ${({ theme }) => theme.PALETTE.background};
  font-size: 28px;
  line-height: 1;
`;

S.IndicatorWrapper = styled.div`
  position: absolute;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);

  display: flex;
  gap: 8px;
`;

S.IndicatorButton = styled.button`
  width: ${({ $active }) => ($active ? "22px" : "8px")};
  height: 8px;
  border-radius: 999px;

  background-color: ${({ $active, theme }) =>
    $active ? theme.PALETTE.background : "rgba(255, 255, 255, 0.45)"};

  transition:
    width 0.2s ease,
    background-color 0.2s ease;
`;

export default S;
