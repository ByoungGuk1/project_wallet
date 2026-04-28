import { HeaderWrapper, HeaderInner, Logo, Nav, NavItem } from "./style";

function Header() {
  return (
    <HeaderWrapper>
      <HeaderInner>
        <Logo to="/">개인 자산 관리</Logo>

        <Nav>
          <NavItem to="/">홈</NavItem>
          <NavItem to="/accounts">계좌</NavItem>
          <NavItem to="/transactions">거래 내역</NavItem>
          <NavItem to="/statistics">통계</NavItem>
        </Nav>
      </HeaderInner>
    </HeaderWrapper>
  );
}

export default Header;
