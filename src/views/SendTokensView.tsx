import { 
    Container,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Typography,
    TextField,
    LinearProgress
} from "@mui/material";
import { ISendTokensViewProps } from "interfaces";
import React, { useState } from "react";
import ElrondService from "services/elrondService";
import AppConstants from "../constants/appConstants.json";
import BigNumber from 'bignumber.js';
  
export default function SendTokensView(props: ISendTokensViewProps): JSX.Element {
    const { onClose, egldPrice, aeroPrice, open, token, currentBalance, password, userSettings, transactionSent } = props;
    const [usdLabelText, setUsdLabelText] = useState(''); 
    const [showProgress, setShowProgress] = useState(false);
    const [amountValue, setAmountValue] = useState('');
    const [recipientValue, setRecipientValue] = useState('');
    const [sendButtonText, setSendButtonText] = useState('Next');
    const [cancelButtonText, setCancelButtonText] = useState('Cancel');
    const [showConfirm, setShowConfirm] = useState(false);
    const elrondService = new ElrondService(AppConstants.API_BASE_URL_DEVNET);

    /**
     * Handles either the Back or Cancel button click
     */
    const handleCancel = () => {
        if (showConfirm) {
            setShowProgress(false);
            setShowConfirm(false);
            setSendButtonText('Next');
            setCancelButtonText('Cancel');
        } else {
            setUsdLabelText('');
            setRecipientValue('');
            setAmountValue('');
            onClose();
        }
    };

    /**
     * Handles either the Next or Send button click
     */
    const handleNextClicked = async () => {
        if (!showConfirm) {
            if (recipientValue && amountValue) {
                if (!elrondService.isValidAddress(recipientValue)) {
                    alert('That is not a valid address!');
                    return;
                }

                const curBalance = new BigNumber(currentBalance);
                const amount = new BigNumber(amountValue);
                if (amount.isGreaterThan(curBalance)) {
                    alert('Amount exceeds your current balance!');
                    return;
                }

                setShowConfirm(true);
                setSendButtonText('Send');
                setCancelButtonText('Back');
            }
        } else {
            setShowProgress(true);
            const hash = await elrondService.transfer(
                recipientValue, 
                amountValue,
                userSettings, 
                password, 
                token === 'AERO');

            setRecipientValue('');
            setAmountValue('');
            setShowConfirm(false);
            setUsdLabelText('');
            setSendButtonText('Next');
            setCancelButtonText('Cancel');
            setShowProgress(false);
            transactionSent(hash);
        }
    }

    const recipientTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecipientValue(event.target.value);
    }

    const amountTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmountValue(event.target.value);
        const value = parseFloat(event.target.value);
        if (!value || value <= 0) {
            setUsdLabelText('');
            return;
        }

        const amt = new BigNumber(value);
        setUsdLabelText(amt.multipliedBy(token === 'AERO' ? aeroPrice : egldPrice)
            .toNumber()
            .toFixed(2));
    };

    return (
        <Container component="main" maxWidth="sm">
            <Dialog
                fullWidth
                open={open}
                keepMounted
                onClose={handleCancel}
                aria-describedby="alert-dialog-slide-description"
            >
            <DialogTitle fontSize={28} textAlign='center'>{`Sending ${token}`}</DialogTitle>
            <DialogContent style={{"textAlign": "center", "padding": "12px"}}>
                <div id='sendContainer' hidden={showConfirm}>
                    <DialogContentText id="alert-dialog-slide-description">
                        Enter recipient address and the amount to send.
                    </DialogContentText>
                    <Typography textAlign='center'>
                        Balance: {currentBalance}
                    </Typography>

                    <TextField
                        style={{"marginTop": "24px"}}
                        variant="outlined"
                        required
                        fullWidth
                        onChange={recipientTextChanged}
                        value={recipientValue}
                        label="Enter Recipient"
                        id="recipient"
                    />

                    <TextField
                        style={{"marginTop": "12px"}}
                        variant="outlined"
                        required
                        fullWidth
                        value={amountValue}
                        onChange={amountTextChanged}
                        label="Enter Amount"
                        id="amount"
                        type='number'
                    />

                    <div hidden={usdLabelText.length === 0}>
                        <Typography paddingTop={1} paddingLeft={1} textAlign='start' >
                            {`~ $${usdLabelText} USD`}
                        </Typography>
                    </div>
                </div>
                <div id='confirmContainer' hidden={!showConfirm}>
                    <DialogContentText paddingBottom={3} id="alert-dialog-slide-description">
                        Please review transaction details before sending
                    </DialogContentText>
                    <Typography fontWeight='bold' fontStyle='oblique'> To </Typography>
                    <Typography>{recipientValue}</Typography>
                    <Typography fontWeight='bold' paddingTop={2} fontStyle='oblique'>Amount</Typography>
                    <Typography>{`${amountValue} ${token}`}</Typography>
                    <Typography>{`~ $${usdLabelText} USD`}</Typography>
                </div>

                <div style={{'marginTop': '8px'}} hidden={!showProgress}>
                    <LinearProgress />
                </div>

            </DialogContent>
            <div hidden={showConfirm}>
                <DialogActions>
                    <Button onClick={handleNextClicked}>{sendButtonText}</Button>
                    <Button onClick={handleCancel}>{cancelButtonText}</Button>
                </DialogActions>
            </div>
            <div hidden={!showConfirm}>
                <DialogActions>
                    <Button onClick={handleCancel}>{cancelButtonText}</Button>
                    <Button onClick={handleNextClicked}>{sendButtonText}</Button>
                </DialogActions>
            </div>
            </Dialog>
        </Container>
    );
}