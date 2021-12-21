import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { TextField } from "@material-ui/core";

export default function Share({ postHandler, props, closeDialog }) {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);
  const fileRef = useRef();
  const [id, setId] = useState("file");
  useEffect(() => {
    if (props) {
      setId(props.id);
      setFile(props.file);
      setDesc(props.desc);
      setIsEmpty(false);
    }
  }, [props]);

  const submitHandler = async (e) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    e.preventDefault();
    const newPost = {
      userId: user._id,
      description: desc,
    };
    console.log(file);
    if (file && typeof file === "object") {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      try {
        const res = await axios.post("/upload", data);
        console.log(res.data);
        newPost.image = res.data.url;
      } catch (err) {
        console.log(err);
      }
    } else {
      newPost.image = file ? file.split(PF)[1] : "";
    }

    if (!props) {
      try {
        await axios.post("/posts", newPost);
      } catch (err) {}
    } else {
      // edit
      try {
        await axios.put("/posts/" + props.postId, newPost);
      } catch (error) {}
      closeDialog();
    }
    postHandler();
    setDesc("");
    setFile(null);
  };

  const handleChange = (event, isFile) => {
    let isDescEmpty = true;
    if (event) {
      isDescEmpty = event.target.value.length === 0 && !file ? true : false;
      if (!isFile) setDesc(event.target.value);
    }
    setIsEmpty(isDescEmpty);
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.profilePicture
                ? user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <TextField
            id="standard-multiline-flexible"
            placeholder={"What's in your mind " + user.username + "?"}
            multiline
            maxRows={10}
            variant="standard"
            className="shareInput"
            InputProps={{ disableUnderline: true }}
            value={desc}
            onChange={handleChange}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            {!props?.file && (
              <img
                className="shareImg"
                src={URL.createObjectURL(file)}
                alt=""
              />
            )}
            {props?.file && props?.file === file && (
              <img className="shareImg" src={file} alt="" />
            )}
            {props?.file && props?.file !== file && (
              <img
                className="shareImg"
                src={URL.createObjectURL(file)}
                alt=""
              />
            )}
            <Cancel
              className="shareCancelImg"
              onClick={() => {
                setFile(null);
                fileRef.current.value = null;
              }}
            />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor={id} className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id={id}
                accept=".png,.jpeg,.jpg"
                ref={fileRef}
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  handleChange(e, true);
                }}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          {!isEmpty && (
            <button className="shareButton" type="submit">
              Share
            </button>
          )}
          {isEmpty && (
            <button
              className="shareButton"
              type="submit"
              style={{ opacity: 0.4, cursor: "default" }}
              disabled
            >
              Share
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
