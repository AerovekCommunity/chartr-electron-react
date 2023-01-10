import { 
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from "@mui/material";
import QRCode from "react-qr-code";
import { CopyAllRounded } from '@mui/icons-material';
import { IWalletAddressViewProps } from "interfaces";


export default function WalletAddressView(props: IWalletAddressViewProps): JSX.Element {
    const { onClose, open, address } = props;

    const handleClose = () => {
      onClose();
    };

    const handleCopy = () => {
      navigator.clipboard.writeText(props.address);
    }

    return (
        <Container component="main" maxWidth="sm">
            <Dialog
              fullWidth
              open={open}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle textAlign='center'>{"My Wallet Address"}</DialogTitle>
              <DialogContent style={{"textAlign": "center", "padding": "18px"}}>
                <DialogContentText id="alert-dialog-slide-description">
                  Share with someone to receive funds into your wallet.  
                </DialogContentText>
                <Typography color='red' fontSize={12} padding={1}>
                  Only send AERO or EGLD to this wallet address. Sending any other tokens may result in the loss of funds.
                </Typography>
                <QRCode style={{"marginTop": "16px"}} value={address} />
                <Typography paddingTop={2} fontSize={14}>
                  Address: {address}
                </Typography>
                <Button onClick={handleCopy}>
                  <CopyAllRounded />
                </Button>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>
        </Container>
      );
}