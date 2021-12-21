import "./chatOnline.css";
export default function ChatOnline({ user, online }) {
  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img className="chatOnlineImg" src={user?.profilePicture} alt="" />
          {online && <div className="chatOnlineBadge"></div>}
        </div>
        <div className="chatOnlineName">{user?.username}</div>
      </div>
    </div>
  );
}
