import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";
import { pageContainer } from "../../../styles/common";

export const HeaderWrapper = styled.header`
  background: ${({ theme }) => theme.PALETTE.white};
  border-bottom: 1px solid ${({ theme }) => theme.PALETTE.gray[200]};
`;

export const HeaderInner = styled.div`
  ${pageContainer}
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.FONT_SIZE.h4};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
`;

export const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

export const NavItem = styled(NavLink)`
  color: ${({ theme }) => theme.PALETTE.gray[700]};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.medium};

  &.active {
    color: ${({ theme }) => theme.PALETTE.primary.main};
  }
`;
