import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IAlertDialogProps } from 'interfaces';

export default function AlertDialog(props: IAlertDialogProps) {

  const handleClose = () => {
      props.negativeFunc();
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.positiveFunc}>{props.positiveButtonText}</Button>
          <Button onClick={props.negativeFunc} autoFocus>{props.negativeButtonText}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
