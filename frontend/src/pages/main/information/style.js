import styled from "styled-components";
import { Link } from "react-router-dom";

export const S = {};

S.InformationWrapper = styled.div`
  position: relative;
`;

S.InformationCard = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
`;

S.InformationTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

S.InformationTitle = styled(Link)`
  font-size: ${({ theme }) => theme.FONT_SIZE.h6};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
  color: ${({ theme }) => theme.PALETTE.text.main};
  height: fit-content;
  margin-top: 2px;
`;

S.InformationDescription = styled.div`
  font-size: ${({ theme }) => theme.FONT_SIZE.h7};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.light};
  color: ${({ theme }) => theme.PALETTE.text.secondary};
`;

S.InformationImgWrapper = styled.div`
  height: 75px;
  width: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;
`;

export default S;
