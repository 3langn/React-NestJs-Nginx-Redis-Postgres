import "./post.css";
import { DeleteOutline, Edit, MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";
import Share from "../share/Share";
import { ErrorAlertDialog } from "../../components/errordialog/ErrorDialog";
import {
  Dialog,
  Menu,
  MenuItem,
  Button,
  Divider,
  TextField,
} from "@material-ui/core";
import PostTopLeft from "./PostTopLeft";
import UserAvatar from "./UserAvatar";

const style = { marginRight: 10 };
const options = [
  {
    text: "Delete",
    icon: <DeleteOutline fontSize="small" style={style} />,
  },
  {
    text: "Edit",
    icon: <Edit fontSize="small" style={style} />,
  },
];
const comments = ["comment", "Hello Milona"];

export default function Post({ post, postHandler }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);

  const file = post.image;

  // Error
  const [errorMessage, setErrorMessage] = useState(null);

  // Dialog Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickMoreVert = (event) => setAnchorEl(event.currentTarget);
  const [openDialog, setDialogOpen] = useState(false);
  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  //Comment
  const [openComment, setOpenComment] = useState(false);

  // Alert Dialog
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
  };

  const handleMenuItemClick = async (event, index) => {
    try {
      switch (index) {
        case 0:
          await axios.delete(`/posts/${post.id}`);
          postHandler();
          break;
        case 1:
          handleDialogOpen();
        default:
          break;
      }
    } catch (error) {
      setErrorMessage(error.message);
      setOpenErrorDialog(true);
    }
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    console.log(post.likes);
    setIsLiked(post.likes.some((l) => l.id));
  }, [currentUser.id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.user.id}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.id]);

  const likeHandler = async () => {
    try {
      await axios.put("/posts/" + post.id + "/like", {
        userId: currentUser.id,
      });
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="post">
      <ErrorAlertDialog
        message={errorMessage}
        open={openErrorDialog}
        onClose={handleCloseErrorDialog}
      />
      <div className="postWrapper">
        <div className="postTop">
          <PostTopLeft user={user} date={post.created_at} />
          <div className="postTopRight">
            {post.user.id === currentUser.id && (
              <MoreVert
                onClick={handleClickMoreVert}
                className="postTopMoreVert"
              />
            )}
            <Menu
              id="lock-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              autoFocus={false}
            >
              {options.map((option, index) => (
                <MenuItem
                  key={index}
                  onClick={(event) => handleMenuItemClick(event, index)}
                >
                  {option.icon}
                  {option.text}
                </MenuItem>
              ))}
            </Menu>
            <Dialog
              open={openDialog}
              onClose={handleDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              {file && (
                <Share
                  key={post.id}
                  postHandler={postHandler}
                  closeDialog={handleDialogClose}
                  props={{
                    file: post.image,
                    description: post.description,
                    id: post.id,
                  }}
                />
              )}
              {!file && (
                <Share
                  key={post.id}
                  postHandler={postHandler}
                  props={{
                    file: null,
                    description: post?.description,
                    id: post.id,
                  }}
                  closeDialog={handleDialogClose}
                />
              )}
            </Dialog>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.description}</span>
          <img className="postImg" src={post.image} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            {like === 1 && (
              <span className="postLikeCounter">{like} like </span>
            )}
            {like > 1 && <span className="postLikeCounter">{like} likes </span>}
          </div>
          <div className="postBottomRight">
            <Button
              style={{ textTransform: "capitalize" }}
              onClick={() => setOpenComment(!openComment)}
            >
              {post.comment} comments
            </Button>
          </div>
        </div>
        {openComment && <Divider style={{ margin: "10px 0" }} />}
        {openComment && (
          <div className="postComment">
            <Comments postId={post.id} user={currentUser} comments={comments} />
          </div>
        )}
      </div>
    </div>
  );
}

const Comments = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  useEffect(async () => {
    try {
      const res = await axios.get(`/posts/${postId}/comments`);
      setComments(
        res.data.sort((p1, p2) => {
          return new Date(p2.created_at) - new Date(p1.created_at);
        })
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  const keyPress = async (e) => {
    if (e.keyCode === 13) {
      const data = { comment: commentInput };
      try {
        await axios.post(`posts/${postId}/comments`, data);
      } catch (error) {
        console.log(error);
      }
      const commentPayload = comments;
      comments.unshift({
        user,
        content: commentInput,
      });
      setComments(commentPayload);
      e.target.value = "";
      setCommentInput("");
    }
  };
  return (
    <div className="commentBox">
      <div className="commentTextField">
        <div className="postTopLeft">
          <UserAvatar user={user} />
          <TextField
            value={commentInput}
            onKeyDown={keyPress}
            placeholder="Add a comment..."
            fullWidth
            InputProps={{ disableUnderline: true }}
            onChange={(e) => setCommentInput(e.target.value)}
            style={{
              backgroundColor: "#e7e7e7",
              padding: "5px",
              borderRadius: "10px",
            }}
          />
        </div>
      </div>
      {comments.map((comment) => (
        <Comment comment={comment} />
      ))}
    </div>
  );
};

const Comment = ({ comment }) => {
  return (
    <div className="commentWrapper" key={comment.id}>
      <div className="postTopLeft">
        <UserAvatar user={comment.user} />
        <div className="commentContainer">
          <div>
            <span className="postUsername">{comment.user.username}</span>
            <span className="postDate">{format(comment.created_at)}</span>
          </div>
          <span className="postCommentText">{comment.content}</span>
        </div>
      </div>
    </div>
  );
};
