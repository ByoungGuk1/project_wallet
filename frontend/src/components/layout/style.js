import styled from "styled-components";
import { pageContainer } from "../../styles/common";

export const S = {};

S.LayoutWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.PALETTE.background};
`;

S.Main = styled.main`
  ${pageContainer}
  padding: 32px 0 32px;
`;

export default S;
