import AdvertisementContainer from "./advertisement/AdvertisementContainer";
import EtcEvent from "./etcevent/EtcEvent";
import Information from "./information/Information";
import MainEvent from "./mainevent/MainEvent";
import Notification from "./notification/Notification";
import Report from "./report/Report";
import S from "./style";
import SubEvent from "./subevent/SubEvent";
import SigninContainer from "./signin/SigninContainer";

import defaultAdImage from "../../assets/images/main-ad.png";

const adList = [
  {
    id: 0,
    title: "기본 광고 이미지",
    imgUrl: defaultAdImage,
    linkUrl: "/",
  },
  {
    id: 1,
    title: "광고 이미지1",
    imgUrl: null,
    linkUrl: "/",
  },
];

const data = [
  { id: 1, name: "기본", history: [] },
  {
    id: 2,
    name: "친구",
    history: [
      {
        id: 1,
        name: "개인 지출 내역",
        calendar: [
          { date: "2026-04-24", income: "0", expenses: "974,000" },
          { date: "2026-04-25", income: "0", expenses: "974,000" },
          { date: "2026-04-26", income: "0", expenses: "974,000" },
          { date: "2026-04-27", income: "0", expenses: "974,000" },
          { date: "2026-04-28", income: "0", expenses: "974,000" },
          { date: "2026-04-29", income: "0", expenses: "974,000" },
          { date: "2026-04-30", income: "974,000", expenses: "974,000" },
          { date: "2026-05-01", income: "972,000", expenses: "0" },
          { date: "2026-05-02", income: "973,000", expenses: "0" },
          { date: "2026-05-03", income: "974,000", expenses: "0" },
          { date: "2026-05-04", income: "974,000", expenses: "0" },
          { date: "2026-05-05", income: "974,000", expenses: "0" },
          { date: "2026-05-06", income: "974,000", expenses: "0" },
          { date: "2026-05-07", income: "974,000", expenses: "0" },
        ],
      },
      { id: 2, name: "병국 님의 그룹", calendar: [] },
      { id: 3, name: "가족 님의 그룹", calendar: [] },
    ],
  },
  { id: 3, name: "가족", history: [] },
];

const events = {
  main: [
    {
      id: 1,
      type: "분석",
      title: "이번 달 자산 흐름 분석 완료",
      description: "지출 패턴 기반\n최적 카드 전략 확인하기",
      img: "📊",
    },
    {
      id: 2,
      type: "마이",
      title: "내 돈 어디에 두면 좋을까?",
      description: "유휴 자금 분석 완료\n추천 저축 플랜 보기",
      img: "💰",
    },
  ],
  sub: [
    {
      id: 1,
      title: "놓치고 있는 카드 혜택 발견",
      description: "이번 달 예상 손실:\n-8,200원",
      img: "💳",
    },
    {
      id: 2,
      title: "이번 달 지출 패턴 분석 완료",
      description: "카테고리별 소비 흐름을\n확인하세요.",
      img: "📈",
    },
    {
      id: 3,
      title: "이번 달 자산 흐름 분석 완료",
      description: "수입과 지출 흐름을\n비교해 보세요.",
      img: "📊",
    },
  ],
  etc: [
    {
      id: 1,
      type: "새로운 기능",
      title: "새로운 기능 출시",
      description: "공유 캘린더로\n그룹 지출 관리",
      img: "✨",
    },
    {
      id: 2,
      type: "정기결제",
      title: "정기결제 관리",
      description: "자동 결제\n설정 및 관리",
      img: "🔄",
    },
    {
      id: 3,
      type: "결제일",
      title: "결제일 알림",
      description: "결제일이 다가오고\n있습니다.",
      img: "📅",
    },
  ],
};

const notifications = [
  {
    id: 1,
    title: "개인 자산 관리 서비스 업데이트 안내",
    date: "2026.04.29",
  },
];
const informations = [
  {
    id: 1,
    title: "데이터 보안&마이데이터 관리",
    description: "소비자 보호정보를 한눈에!",
    date: "2026.04.29",
    img: "📅",
  },
  {
    id: 2,
    title: "새로운 기능 출시",
    description: "공유 캘린더로 그룹 지출 관리",
    date: "2026.04.29",
    img: "😉",
  },
  {
    id: 3,
    title: "정기결제 관리",
    description: "자동 결제 설정 및 관리",
    date: "2026.04.29",
    img: "📊",
  },
];

function MainContainer() {
  return (
    <S.Page>
      <S.FirstSection>
        <S.AdSection>
          <AdvertisementContainer adList={adList}></AdvertisementContainer>
        </S.AdSection>
        <S.SigninSection>
          <SigninContainer></SigninContainer>
        </S.SigninSection>
      </S.FirstSection>

      <S.ReportSection>
        <Report data={data} />
      </S.ReportSection>

      <S.EventsSection>
        <MainEvent events={events.main} />

        <S.SubEventsWrapper>
          <SubEvent events={events.sub} />
          <EtcEvent events={events.etc} />
        </S.SubEventsWrapper>
      </S.EventsSection>

      <S.NotificationsSection>
        <Notification notifications={notifications} />
        <S.CustomerServiceBox>
          <p>고객센터</p>
          <S.CustomerServiceWrapper>
            <S.CustomerService to="/faq">
              <span>❓</span>
              자주하는 질문
            </S.CustomerService>
            <S.CustomerService to="/support">
              <span>✉️</span>
              이메일 상담
            </S.CustomerService>
            <S.CustomerService to="/ars">
              <span>📞</span>
              ARS
            </S.CustomerService>
          </S.CustomerServiceWrapper>
        </S.CustomerServiceBox>
        <Information informations={informations} />
      </S.NotificationsSection>
    </S.Page>
  );
}

export default MainContainer;
