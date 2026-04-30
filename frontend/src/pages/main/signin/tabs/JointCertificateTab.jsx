import S from "../style";

const JointCertificateTab = () => {
  return (
    <S.CertificateBox>
      <S.CertificateTitle>공동인증서 로그인</S.CertificateTitle>
      <S.CertificateText>
        등록된 공동인증서를 선택하여 로그인합니다.
      </S.CertificateText>
      <S.LoginButton type="button">공동인증서 로그인</S.LoginButton>
    </S.CertificateBox>
  );
};

export default JointCertificateTab;