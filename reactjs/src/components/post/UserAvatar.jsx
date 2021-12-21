import { Link } from "react-router-dom";

export default function UserAvatar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
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
  );
}
