import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

export const ErrorAlertDialog = ({ open, onClose, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"An error occurred"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}. Try again later
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};
