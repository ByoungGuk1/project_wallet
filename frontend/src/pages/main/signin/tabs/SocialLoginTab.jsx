import S from "../style";

const SocialLoginTab = () => {
  return (
    <S.LoginForm>
      <S.SocialButton type="button">카카오로 시작하기</S.SocialButton>
      <S.SocialButton type="button">네이버로 시작하기</S.SocialButton>
      <S.SocialButton type="button">구글로 시작하기</S.SocialButton>
    </S.LoginForm>
  );
};

export default SocialLoginTab;