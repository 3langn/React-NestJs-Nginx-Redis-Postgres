import "./message.css";
import { format } from "timeago.js";

export default function Message({ own, message }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://static.lag.vn/upload/news/20/10/12/12-dang-bien-hinh-cua-goku-trong-dragon-ball-12_CDOU.png?w=800&encoder=wic&subsampling=444"
          alt=""
        />
        <p className="messageText">{message.content}</p>
      </div>
      <div className="messageBottom">{format(message.created_at)}</div>
    </div>
  );
}
