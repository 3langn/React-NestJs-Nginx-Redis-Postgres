import { useEffect, useState } from "react";
import "./conversation.css";
export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friend = conversation.members.find((m) => m.id !== currentUser.id);
    setUser(friend);
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <img className="conversationImg" src={user?.profilePicture} alt="" />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}
