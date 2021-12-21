import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifySelf: "center",
    margin: "5px 0",
  },
  border: {
    flex: 1,
    borderBottom: "1px solid lightgray",
  },
  content: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    fontWeight: 500,
    fontSize: 14,
    color: "lightgray",
  },
  box: {
    display: "flex",
    justifyContent: "center",
  },
}));

const DividerWithText = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.border} />
      <div className={classes.box}>
        <span className={classes.content}>{children}</span>
      </div>
      <div className={classes.border} />
    </div>
  );
};
export default DividerWithText;
