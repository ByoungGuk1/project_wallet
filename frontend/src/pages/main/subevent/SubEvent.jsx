import S from "./style";

const SubEvent = ({ events = [] }) => {
  const CARD_COLORS = ["#FEE9FF", "#FAEDCD", "#FFF1F0"];
  function renderSubEvents() {
    return events.map((event, index) => (
      <S.EventBox key={event.id} to={`/events/${event.id}`}>
        <S.EventImgWrapper $color={CARD_COLORS[index % CARD_COLORS.length]}>
          {event.img}
        </S.EventImgWrapper>
        <S.EventText>
          <S.EventTitle>{event.title}</S.EventTitle>
          <S.EventDescription>{event.description}</S.EventDescription>
        </S.EventText>
      </S.EventBox>
    ));
  }

  return (
    <S.EventWrapper>
      <S.SubEventWrapper>{renderSubEvents()}</S.SubEventWrapper>
      <S.MoreEvents to="/events">진행중인 이벤트 더보기</S.MoreEvents>
    </S.EventWrapper>
  );
};

export default SubEvent;
