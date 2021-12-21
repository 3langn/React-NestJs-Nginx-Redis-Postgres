import "./chatOnline.css";
export default function ChatOnline() {
  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img
            className="chatOnlineImg"
            src="https://static.lag.vn/upload/news/20/10/12/12-dang-bien-hinh-cua-goku-trong-dragon-ball-12_CDOU.png?w=800&encoder=wic&subsampling=444"
            alt=""
          />
          <div className="chatOnlineBadge"></div>
        </div>
        <div className="chatOnlineName">MinhNguyen</div>
      </div>
    </div>
  );
}
