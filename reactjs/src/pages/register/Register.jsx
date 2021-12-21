import axios from "axios";
import { useRef } from "react";
import "./register.css";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { useStyles } from "../login/Login";
import DividerWithText from "../../components/utils/DividerWithText";
export default function Register() {
  const classes = useStyles();
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <div className="loginContainer">
            <span className="loginTitle">Get's started.</span>
            <div className="suggestionRegister">
              <span className="suggestionText">Already have an account?</span>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <span className="loginCreateNewAccount">Login</span>
              </Link>
            </div>
            <Button className={classes.googleButton}>
              <img
                className="googleLogo"
                src="https://www.dtl.coventry.domains/wp-content/uploads/2020/07/Google-Logo.png"
              />
              Sign in with Google
            </Button>
            <DividerWithText>Or register a new account</DividerWithText>
            <form className="loginBox" onSubmit={handleClick}>
              <span className="loginLabel">Usermame</span>

              <input
                placeholder="Username"
                required
                ref={username}
                className="loginInput"
              />
              <span className="loginLabel">Email</span>

              <input
                placeholder="Email"
                required
                ref={email}
                className="loginInput"
                type="email"
              />
              <span className="loginLabel">Password</span>

              <input
                placeholder="Password"
                required
                ref={password}
                className="loginInput"
                type="password"
                minLength="6"
              />
              <span className="loginLabel">Repeat password</span>
              <input
                placeholder="Password Again"
                required
                ref={passwordAgain}
                className="loginInput"
                type="password"
              />
              <Button className={classes.normalButton} type="submit">
                Sign Up
              </Button>
            </form>
          </div>
        </div>
        <div className="loginRight">
          <img
            src="../assets/wallpaper.jpg"
            alt=""
            className="loginRightWallpaper"
          />
        </div>
      </div>
    </div>
  );
}
