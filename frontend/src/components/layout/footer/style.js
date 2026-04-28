import styled from "styled-components";
import { pageContainer } from "../../../styles/common";

export const FooterWrapper = styled.footer`
  margin-top: 40px;
  background: ${({ theme }) => theme.PALETTE.white};
  border-top: 1px solid ${({ theme }) => theme.PALETTE.gray[200]};
`;

export const FooterInner = styled.div`
  ${pageContainer}
  padding: 24px 0;
`;

export const FooterText = styled.p`
  color: ${({ theme }) => theme.PALETTE.gray[500]};
  font-size: ${({ theme }) => theme.FONT_SIZE.small};
`;
