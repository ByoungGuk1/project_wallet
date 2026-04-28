import styled from "styled-components";
import { Link } from "react-router-dom";

export const NotFoundWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export const HomeLink = styled(Link)`
  color: ${({ theme }) => theme.PALETTE.primary.main};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.semiBold};
`;
