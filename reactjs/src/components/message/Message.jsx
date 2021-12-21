import "./message.css";
import { format } from "timeago.js";

export default function Message({ own, message }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={message.sender.profilePicture}
          alt=""
        />
        <p className="messageText">{message.content}</p>
      </div>
      <div className="messageBottom">{format(message.created_at)}</div>
    </div>
  );
}
