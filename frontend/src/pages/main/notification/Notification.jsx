import S from "./style";

const Notification = ({ notifications = [] }) => {
  return (
    <S.NotificationWrapper>
      <S.NotificationType to="/notifications">공지사항 &gt;</S.NotificationType>
      <S.NotificationTitle to={`/notifications/${notifications[0].id}`}>
        {notifications[0].title}
      </S.NotificationTitle>
      <S.NotificationDate>{notifications[0].date}</S.NotificationDate>
    </S.NotificationWrapper>
  );
};

export default Notification;
