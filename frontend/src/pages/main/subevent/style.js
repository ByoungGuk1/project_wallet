import styled from "styled-components";
import { Link } from "react-router-dom";

export const S = {};

S.EventWrapper = styled.div`
  width: 68%;
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

S.SubEventWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 10px;
`;

S.EventBox = styled(Link)`
  width: calc(100% / 3 - 12px);
  height: 350px;
  background-color: ${({ theme }) => theme.PALETTE.gray[100]};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  gap: 12px;
`;

S.EventImgWrapper = styled.div`
  font-size: 100px;
  height: 220px;
  width: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => $color};
`;

S.EventText = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 20px;
`;

S.EventTitle = styled.h3`
  font-size: ${({ theme }) => theme.FONT_SIZE.h7};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
  color: ${({ theme }) => theme.PALETTE.text.main};
`;

S.EventDescription = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.regular};
  color: ${({ theme }) => theme.PALETTE.text.main};
  white-space: pre-line;
  line-height: 1.5;
  text-align: center;
`;

S.MoreEvents = styled(Link)`
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
  color: ${({ theme }) => theme.PALETTE.text.main};
  background-color: ${({ theme }) => theme.PALETTE.gray[100]};
  text-decoration: none;
  height: 32px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

export default S;
