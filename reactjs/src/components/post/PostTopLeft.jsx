import { Link } from "react-router-dom";
import { format } from "timeago.js";

export default function PostTopLeft({ user, date }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="postTopLeft">
      <Link to={`/profile/${user.id}`}>
        <img
          className="postProfileImg"
          src={
            user.profilePicture
              ? PF + user.profilePicture
              : PF + "person/noAvatar.png"
          }
          alt=""
        />
      </Link>
      <span className="postUsername">{user.username}</span>
      <span className="postDate">{format(date)}</span>
    </div>
  );
}
