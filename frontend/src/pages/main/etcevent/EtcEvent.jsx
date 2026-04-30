import S from "./style";

const EtcEvent = ({ events = [] }) => {
  function renderEtcEvents() {
    return events.map((event, index) => (
      <S.EventBox key={event.id} to={`/events/${event.id}`}>
        <S.EventType>{event.type}</S.EventType>
        <S.ContentWrapper>
          <S.EventText>
            <S.EventTitle>{event.title}</S.EventTitle>
            <S.EventDescription>{event.description}</S.EventDescription>
          </S.EventText>
          <S.EventImgWrapper>{event.img}</S.EventImgWrapper>
        </S.ContentWrapper>
      </S.EventBox>
    ));
  }

  return <S.EventWrapper>{renderEtcEvents()}</S.EventWrapper>;
};

export default EtcEvent;
