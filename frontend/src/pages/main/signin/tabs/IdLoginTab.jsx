import S from "../style";

const IdLoginTab = () => {
  return (
    <S.LoginForm>
      <S.InputRow>
        <S.LoginInput placeholder="아이디 6~12자리 입력" />
        <S.SaveIdBox>
          <S.SaveCircle />
          <span>저장</span>
        </S.SaveIdBox>
      </S.InputRow>

      <S.InputRow>
        <S.LoginInput type="password" placeholder="비밀번호 6~20자리 입력" />
        <S.InfoIcon>i</S.InfoIcon>
      </S.InputRow>

      <S.LoginButton type="button">로그인</S.LoginButton>
    </S.LoginForm>
  );
};

export default IdLoginTab;