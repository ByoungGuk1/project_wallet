import { S } from "./style";

function Header() {
  return (
    <S.HeaderWrapper>
      <S.HeaderTop>
        <S.NavSignin to="/login">로그인</S.NavSignin>
        <p>|</p>
        <S.NavSignup to="/signup">회원가입</S.NavSignup>
      </S.HeaderTop>

      <S.HeaderInner>
        <S.HeaderLeft>
          <S.Logo to="/">WalletPay</S.Logo>
          <S.Nav>
            <S.NavItem to="/my-wallet">개인 지갑</S.NavItem>
            <S.NavItem to="/group-wallet">그룹 지갑</S.NavItem>
            <S.NavItem to="/community">커뮤니티</S.NavItem>
            <S.NavItem to="/statistics">통계 분석</S.NavItem>
          </S.Nav>
        </S.HeaderLeft>

        <S.HeaderActions>
          <S.IconButton type="button">🔍</S.IconButton>
          <S.IconButton type="button">🔔</S.IconButton>
          <S.IconButton type="button">☰</S.IconButton>
        </S.HeaderActions>
      </S.HeaderInner>
    </S.HeaderWrapper>
  );
}

export default Header;
