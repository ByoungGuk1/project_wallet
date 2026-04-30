import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";
import { pageContainer } from "../../../styles/common";

export const S = {};

S.HeaderWrapper = styled.header`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ theme }) => theme.PALETTE.background};
`;

S.HeaderTop = styled.div`
  ${pageContainer}
  display: flex;
  justify-content: flex-end;
  color: ${({ theme }) => theme.PALETTE.text.secondary};
  font-size: ${({ theme }) => theme.FONT_SIZE.h7};
  padding-top: 18px;
  gap: 10px;
`;

S.NavSignin = styled(Link)``;

S.NavSignup = styled(Link)``;

S.HeaderInner = styled.div`
  ${pageContainer}
  height: 98px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

S.HeaderLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  gap: 60px;
`;

S.Logo = styled(Link)`
  color: ${({ theme }) => theme.PALETTE.primary.main};
  font-size: ${({ theme }) => theme.FONT_SIZE.h2};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
`;

S.Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 43px;
`;

S.NavItem = styled(NavLink)`
  color: ${({ theme }) => theme.PALETTE.text.secondary};
  font-size: ${({ theme }) => theme.FONT_SIZE.h6};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.medium};

  &:hover,
  &.active {
    color: ${({ theme }) => theme.PALETTE.primary.main};
    font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
  }
`;

S.HeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

S.IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

export default S;
