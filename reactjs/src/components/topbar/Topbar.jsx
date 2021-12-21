import "./topbar.css";
import {
  Search,
  Chat,
  Notifications,
  PersonPinOutlined,
  KeyboardArrowDown,
  InputOutlined,
  VpnKey,
} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { IconButton, Menu, MenuItem } from "@material-ui/core";

export default function Topbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    localStorage.clear();
    window.location.reload();
    /**
     * TODO
     * API REMOVE TOKEN
     */
    setAnchorEl(null);
  };
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="appLogo">
            <img className="imageLogo" src={"../assets/logo.png"} alt=""></img>
            <span className="logo">Social Network</span>
          </div>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <PersonPinOutlined fontSize="medium" />
            <span className="topbarIconBadge">1</span>
          </div>
          <Link to={"/messenger"} className="topbarIconItem">
            <Chat fontSize="medium" />
            <span className="topbarIconBadge">2</span>
          </Link>
          <div className="topbarIconItem">
            <Notifications fontSize="medium" />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Button
          component={Link}
          to={`/profile/${user.id}`}
          endIcon={
            <img
              src={
                user.profilePicture
                  ? user.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
              className="topbarImg"
            />
          }
          variant="contained"
          disableRipple
          style={{
            borderRadius: 10,
            fontSize: "13px",
            backgroundColor: "#1877F2",
            textTransform: "none",
            color: "#FFF",
            boxShadow: "none",
          }}
        >
          {user.username}
        </Button>
        <IconButton style={{ marginRight: "20px" }} onClick={handleClick}>
          <KeyboardArrowDown />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          style={{ marginTop: "50px" }}
        >
          <MenuItem onClick={handleClose} disableRipple>
            <InputOutlined className="topBarRightIconMenu" />
            Logout
          </MenuItem>
          <MenuItem onClick={handleClose} disableRipple>
            <VpnKey className="topBarRightIconMenu" />
            Change Password
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
