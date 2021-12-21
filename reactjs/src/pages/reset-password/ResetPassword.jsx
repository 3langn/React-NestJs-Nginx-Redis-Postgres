import {
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useRef } from "react";
import "./resetPassword.css";

export default function BasicCard() {
  const email = useRef();
  const handleClick = (e) => {
    e.preventDefault();
    // TODO:
  };
  return (
    <div className="resetPassword">
      <div className="resetContainer">
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography
              variant="h5"
              style={{ fontWeight: 600, width: 500 }}
              color="text.secondary"
            >
              Find your account
            </Typography>
          </CardContent>
          <Divider></Divider>
          <form className="resetContentContainer" onSubmit={handleClick}>
            <Typography style={{ marginBottom: 20 }}>
              Please enter your email address to search for your account.
            </Typography>
            <input
              ref={email}
              placeholder="Email"
              type="email"
              required
              className="loginInput"
            />
            <div className="resetButtonContainer">
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button
                  style={{
                    backgroundColor: "#E4E6EB",
                    textTransform: "none",
                    marginRight: "20px",
                  }}
                >
                  Cancle
                </Button>
              </Link>
              <Button
                style={{
                  backgroundColor: "#216FDB",
                  textTransform: "none",
                  color: "#fff",
                }}
                type="submit"
              >
                Search
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
