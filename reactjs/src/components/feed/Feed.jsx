import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ userId }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [isPost, setIsPost] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = userId
          ? await axios.get("/posts/profile/" + userId)
          : await axios.get("/posts/timeline");
        console.log(res.data);
        setPosts(
          res.data.sort((p1, p2) => {
            return new Date(p2.created_at) - new Date(p1.created_at);
          })
        );
      } catch (e) {
        console.log(e);
      }
    };
    fetchPosts();
  }, [userId, user.id, isPost]);
  const postHandler = () => {
    setIsPost(!isPost);
  };
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!userId || userId === user.username) && (
          <Share key={999} postHandler={postHandler} />
        )}
        {posts.map((p) => (
          <Post key={p.id} post={p} postHandler={postHandler} />
        ))}
      </div>
    </div>
  );
}
