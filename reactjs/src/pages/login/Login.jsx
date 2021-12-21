import { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  makeStyles,
} from "@material-ui/core";
import DividerWithText from "../../components/utils/DividerWithText";
import { Link } from "react-router-dom";

export const useStyles = makeStyles((theme) => ({
  googleButton: {
    backgroundColor: "rgba(255, 255, 255)",
    border: "1px solid rgba(220, 220, 220)",
    textTransform: "none",
    height: "45px",
    borderRadius: "10px",
  },
  normalButton: {
    backgroundColor: "#1775EE",
    color: "#fff",
    border: "1px solid rgba(220, 220, 220)",
    textTransform: "none",
    height: "45px",
    borderRadius: "10px",
    marginTop: "20px",
    "&:hover": {
      backgroundColor: "#1369d3",
      color: "#fff",
    },
  },
}));

export default function Login() {
  const classes = useStyles();

  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <div className="loginContainer">
            <h3 className="loginLogo">Social Network</h3>
            <span className="loginTitle">Login</span>
            <span className="loginDesc">
              The best social network on the world
            </span>
            <Button className={classes.googleButton}>
              <img
                className="googleLogo"
                src="https://www.dtl.coventry.domains/wp-content/uploads/2020/07/Google-Logo.png"
              />
              Sign in with Google
            </Button>
            <DividerWithText>Or login with email</DividerWithText>
            <form className="loginBox" onSubmit={handleClick}>
              <span className="loginLabel">Email</span>
              <input
                placeholder="Email"
                type="email"
                required
                className="loginInput"
                ref={email}
              />
              <span className="loginLabel">Password</span>
              <input
                placeholder="Password"
                type="password"
                required
                minLength="6"
                className="loginInput"
                ref={password}
              />
              <div className="loginCheckaForgot">
                <FormControlLabel
                  control={
                    <Checkbox
                      style={{
                        color: "#4291f8",
                      }}
                    />
                  }
                  label="Remember me"
                />
                <Link to="/login/identify" style={{ textDecoration: "none" }}>
                  <span className="loginCreateNewAccount">
                    Forgot Password?
                  </span>
                </Link>
              </div>
              <Button
                className={classes.normalButton}
                type="submit"
                disabled={isFetching}
              >
                {isFetching ? (
                  <CircularProgress color="white" size="20px" />
                ) : (
                  "Log In"
                )}
              </Button>
              <div className="suggestionRegister">
                <span className="suggestionText">Not register yet?</span>
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <span className="loginCreateNewAccount">
                    Create a new account
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
        <div className="loginRight">
          <img
            src="./assets/wallpaper.jpg"
            alt=""
            className="loginRightWallpaper"
          />
        </div>
      </div>
    </div>
  );
}
