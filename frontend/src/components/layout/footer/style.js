import styled from "styled-components";
import { pageContainer } from "../../../styles/common";

export const S = {};

S.FooterWrapper = styled.footer`
  width: 100%;
  background: ${({ theme }) => theme.PALETTE.background};
`;

S.FooterInner = styled.div`
  ${pageContainer}
  padding: 32px 0;
`;

S.FooterText = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZE.h7};
`;

export default S;
