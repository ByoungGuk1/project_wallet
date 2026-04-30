import S from "../style";

const FinancialCertificateTab = () => {
  return (
    <S.CertificateBox>
      <S.CertificateTitle>금융인증서 로그인</S.CertificateTitle>
      <S.CertificateText>
        금융인증서를 통해 안전하게 로그인할 수 있습니다.
      </S.CertificateText>
      <S.LoginButton type="button">금융인증서 로그인</S.LoginButton>
    </S.CertificateBox>
  );
};

export default FinancialCertificateTab;