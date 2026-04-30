import styled from "styled-components";
import { Link } from "react-router-dom";

export const S = {};

S.EventWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 27%;
  gap: 36px;
`;

S.EventBox = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 10px;
`;

S.EventType = styled.span`
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
  color: ${({ theme }) => theme.PALETTE.white};
  background-color: ${({ theme }) => theme.PALETTE.black};
  border-radius: 999px;
  width: fit-content;
  padding: 4px 6px;
  text-align: center;
`;

S.ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

S.EventText = styled.div`
  display: flex;
  flex-direction: column;
  width: 68%;
  gap: 12px;
`;

S.EventTitle = styled.h3`
  font-size: ${({ theme }) => theme.FONT_SIZE.h5};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
  color: ${({ theme }) => theme.PALETTE.text.main};
`;

S.EventDescription = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZE.h7};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.regular};
  color: ${({ theme }) => theme.PALETTE.text.secondary};
  white-space: pre-line;
  line-height: 1.5;
`;

S.EventImgWrapper = styled.div`
  height: 130px;
  width: 130px;
  font-size: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default S;
