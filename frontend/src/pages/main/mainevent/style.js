import styled from "styled-components";
import { Link } from "react-router-dom";
import { boxShadow } from "../../../styles/common";

export const S = {};

S.EventWrapper = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: start;
`;

S.EventBox = styled(Link)`
  width: 50%;
  height: 200px;
  padding: 25px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ $backgroundColor }) => $backgroundColor || "#DCF2FE"};
  ${boxShadow}
`;

S.EventText = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
`;

S.EventType = styled.h2`
  font-size: ${(props) => props.theme.FONT_SIZE.h5};
  color: ${(props) => props.theme.PALETTE.text.main};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.medium};
  margin-bottom: 7px;
`;

S.EventTitle = styled.h1`
  font-size: ${(props) => props.theme.FONT_SIZE.h4};
  color: ${(props) => props.theme.PALETTE.text.main};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.bold};
`;

S.EventDescription = styled.h3`
  font-size: ${(props) => props.theme.FONT_SIZE.h6};
  color: ${(props) => props.theme.PALETTE.text.main};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.light};
  white-space: pre-line;
  line-height: 1.5;
`;

S.EventImage = styled.div`
  width: 100px;
  height: 100px;
  font-size: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default S;
