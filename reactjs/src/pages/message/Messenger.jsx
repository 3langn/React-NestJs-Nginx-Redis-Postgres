import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

import { useHistory } from "react-router";
export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const curr = useParams().id;
  const [currentConversation, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user, token } = useContext(AuthContext);
  const scrollRef = useRef();
  const history = useHistory();
  useEffect(() => {
    socket.current = io("ws://localhost:8080", {
      path: "/api/socket.io",
      query: `token=${token.access_token}`,
      transports: ["websocket"],
    });

    console.log("CURRCHAT: " + currentConversation?.id);
    socket.current.on("message", (data) => {
      console.log("Socket: " + JSON.stringify(data));
      setArrivalMessage({
        sender: data.sender,
        content: data.content,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentConversation?.members.some(
        (m) => m.id === arrivalMessage.sender.id
      ) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    socket.current.on("users", (users) => {
      setOnlineUsers(
        user.following.filter((f) => users.some((u) => u.id === f))
      );
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/");
        setConversations(res.data);
        if (curr) {
          const currChat = conversations.find((c) => {
            return c.members.some((m) => m.id === curr);
          });
          setCurrentChat(currChat);
        } else {
          setCurrentChat(res.data[0]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user.id]);

  useEffect(() => {
    const getMessages = async () => {
      socket.current.emit("join", { conversationId: currentConversation?.id });
      console.log("Room: " + currentConversation?.id);
      try {
        const res = await axios.get("/conversations/" + currentConversation.id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [currentConversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      content: newMessage,
      sender: user,
      conversation: currentConversation,
    };

    socket.current.emit("message", {
      senderId: user.id,
      conversationId: currentConversation.id,
      content: newMessage,
    });

    try {
      // const res = await axios.post(
      //   "/conversations/" + currentConversation.id,
      //   message
      // );
      setMessages([...messages, message]);
      // console.log(res.data);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations?.map((c) => (
              <div
                onClick={() => {
                  const friendId = c.members.find((f) => f.id !== user.id);
                  history.push("/messenger/" + friendId.id);
                  setCurrentChat(c);
                }}
              >
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentConversation ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender.id === user.id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}
