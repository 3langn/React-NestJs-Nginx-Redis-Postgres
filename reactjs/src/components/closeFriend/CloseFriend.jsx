import { Link } from "react-router-dom";
import "./closeFriend.css";

export default function CloseFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <Link
      to={`/profile/${user.id}`}
      style={{ textDecoration: "none", color: "black" }}
    >
      <li className="sidebarFriend">
        <img
          className="sidebarFriendImg"
          src={user.profilePicture || `${PF}person/noAvatar.png`}
          alt=""
        />
        <span className="sidebarFriendName">{user.username}</span>
      </li>
    </Link>
  );
}
