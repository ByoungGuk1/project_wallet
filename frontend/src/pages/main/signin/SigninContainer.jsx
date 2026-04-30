import { useState } from "react";
import S from "./style";

import SocialLoginTab from "./tabs/SocialLoginTab";
import IdLoginTab from "./tabs/IdLoginTab";
import FinancialCertificateTab from "./tabs/FinancialCertificateTab";
import JointCertificateTab from "./tabs/JointCertificateTab";

const LOGIN_TABS = [
  { key: "social", label: "소셜로그인" },
  { key: "id", label: "아이디" },
  { key: "financial", label: "금융인증서" },
  { key: "joint", label: "공동인증서" },
];

const SigninContainer = () => {
  const [activeTab, setActiveTab] = useState("id");

  const renderTabContent = () => {
    switch (activeTab) {
      case "social":
        return <SocialLoginTab />;
      case "id":
        return <IdLoginTab />;
      case "financial":
        return <FinancialCertificateTab />;
      case "joint":
        return <JointCertificateTab />;
      default:
        return <IdLoginTab />;
    }
  };

  return (
    <S.LoginWrapper>
      <S.TabList>
        {LOGIN_TABS.map((tab) => (
          <S.TabButton
            key={tab.key}
            type="button"
            $active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </S.TabButton>
        ))}
      </S.TabList>

      <S.TabContent>{renderTabContent()}</S.TabContent>

      <S.AuthLinkRow>
        <S.AuthLink to="/find-account">아이디/비밀번호찾기</S.AuthLink>
        <S.AuthLink to="/signup">회원가입</S.AuthLink>
      </S.AuthLinkRow>

      <S.QuickMenu>
        <S.QuickMenuItem to="/statements">
          <S.QuickIcon>📄</S.QuickIcon>
          명세서
        </S.QuickMenuItem>

        <S.QuickDivider />

        <S.QuickMenuItem to="/usage">
          <S.QuickIcon>💳</S.QuickIcon>
          이용 내역
        </S.QuickMenuItem>

        <S.QuickDivider />

        <S.QuickMenuItem to="/expense">
          <S.QuickIcon>💵</S.QuickIcon>
          지출 내역
        </S.QuickMenuItem>

        <S.QuickDivider />

        <S.QuickMenuItem to="/my-wallet">
          <S.QuickIcon>📈</S.QuickIcon>내 자산
        </S.QuickMenuItem>
      </S.QuickMenu>
    </S.LoginWrapper>
  );
};

export default SigninContainer;
