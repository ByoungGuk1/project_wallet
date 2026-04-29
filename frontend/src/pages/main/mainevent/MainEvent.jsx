import S from "./style";

const MainEvent = ({ events = [] }) => {
  const CARD_COLORS = ["#DCF2FE", "#E7E2FD"];
  function renderEvent(event, index) {
    return (
      <S.EventBox
        to={`/events/${event.id}`}
        key={event.id}
        $backgroundColor={CARD_COLORS[index % CARD_COLORS.length]}
      >
        <S.EventText>
          <S.EventType>{event.type} &gt;</S.EventType>
          <S.EventTitle>{event.title}</S.EventTitle>
          <S.EventDescription>{event.description}</S.EventDescription>
        </S.EventText>
        <S.EventImage>
          {event.img}
        </S.EventImage>
      </S.EventBox>
    );
  }

  return <S.EventWrapper>{events.map(renderEvent)}</S.EventWrapper>;
};

export default MainEvent;
