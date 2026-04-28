const Notification = ({ notifications }) => {
  return (
    <div>
      <p>{notifications.title}</p>
      <p>{notifications.date}</p>
    </div>
  );
};

export default Notification;