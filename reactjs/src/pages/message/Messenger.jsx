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
  const [friend, setFriend] = useState();

  const socket = useRef();
  const { user, token } = useContext(AuthContext);
  const scrollRef = useRef();
  const history = useHistory();
  useEffect(() => {
    socket.current = io("localhost:8080", {
      path: "/api/socket.io",
      query: `token=${token.access_token}`,
      transports: ["websocket"],
    });

    socket.current.on("message", (data) => {
      setArrivalMessage({
        sender: data.sender,
        content: data.content,
        createdAt: Date.now(),
      });
    });

    socket.current.on("users", (users) => {
      const onlineUsers = user.following.filter((f) => {
        return users.some((u) => {
          return u === f;
        });
      });
      console.log("Online Users: " + JSON.stringify(onlineUsers));
      setOnlineUsers(onlineUsers);
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
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/");
        setConversations(res.data);
        if (curr) {
          const currChat = res.data.find((c) => {
            return c.members.some((m) => {
              return m.id === curr;
            });
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
        setMessages(
          res.data.sort((p1, p2) => {
            return new Date(p1.created_at) - new Date(p2.created_at);
          })
        );
      } catch (err) {
        console.log(err);
      }
    };
    setFriend(currentConversation?.members.find((m) => m.id !== user.id));

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
                  history.push("/messenger/" + friend.id);
                  setCurrentChat(c);
                }}
              >
                <Conversation
                  conversation={c}
                  currentUser={user}
                  online={onlineUsers}
                />
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
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  friend?.coverPicture
                    ? friend?.coverPicture
                    : "https://media.istockphoto.com/vectors/pastel-abstract-shapes-background-vector-id1287148666?b=1&k=20&m=1287148666&s=612x612&w=0&h=4kZsYi1GlYlQlxtkdnd3pZtGajZe1MSq6tAkdGlE8RQ="
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  friend?.profilePicture
                    ? friend.profilePicture
                    : "person/noAvatar.png"
                }
                alt=""
              />
            </div>
            <span className="profileName">{friend?.username}</span>
          </div>
        </div>
      </div>
    </>
  );
}
