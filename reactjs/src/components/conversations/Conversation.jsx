import { useEffect, useState } from "react";
import ChatOnline from "../chatOnline/ChatOnline";
import "./conversation.css";
export default function Conversation({ conversation, currentUser, online }) {
  const [user, setUser] = useState(null);
  const [isOnline, setOnline] = useState(false);
  useEffect(() => {
    const friend = conversation.members.find((m) => m.id !== currentUser.id);
    const isOnline = online.some((m) => m === friend.id);
    setOnline(isOnline);
    setUser(friend);
  }, [currentUser, conversation, online]);

  return (
    <div className="conversation">
      <ChatOnline user={user} online={isOnline} />
    </div>
  );
}
