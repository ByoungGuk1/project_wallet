import styled from "styled-components";
import { pageContainer } from "../../styles/common";

export const LayoutWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.PALETTE.background};
`;

export const Main = styled.main`
  ${pageContainer}
  padding: 32px 0;
`;
