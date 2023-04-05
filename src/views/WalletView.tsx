import { 
    Avatar,
    Container,
    Typography,
    CircularProgress,
    Grid,
    Button,
    Snackbar,
    Alert,
    IconButton,
} from "@mui/material";

import ElrondService from 'services/elrondService';
import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import BigNumber from 'bignumber.js';
import WalletAddressView from './WalletAddressView';
import SendTokensView from './SendTokensView';
import { ITransactionHistoryItem, IWalletViewProps, TokenType } from 'interfaces';
import CloseIcon from '@mui/icons-material/Close';
import appConstants from '../constants/appConstants.json';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-grid.css';


export default function WalletView(props: IWalletViewProps): JSX.Element {
    const [token, setToken] = useState('');
    const [openAddressDialog, setOpenAddressDialog] = useState<boolean>(false);
    const [openSendDialog, setOpenSendDialog] = useState<boolean>(false);
    const [aeroBalance, setAeroBalance] = useState<string>('');
    const [egldBalance, setEgldBalance] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const divisor = new BigNumber('1000000000000000000');
    const [egldPrice, setEgldPrice] = useState<BigNumber>(new BigNumber("0"));
    const [aeroPrice, setAeroPrice] = useState<BigNumber>(new BigNumber("0"));
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarActionLink, setSnackbarActionLink] = useState('');

    const gridRef = useRef(null);
    const [txData, setTxData] = useState<ITransactionHistoryItem[]>([]);

    const SenderCellRenderer = (params: any) => {
        let sender: string = params.value;
        if (sender === props.userSettings.walletAddress) {
            sender = 'Me';
        } else {
            sender = `${sender.substring(0, 10)}...${sender.substring(sender.length - 6)}`;
        }
        return (
            <span>
                {sender}
            </span>
        );
    };
    const ReceiverCellRenderer = (params: any) => {
        let receiver: string = params.value
        if (receiver === props.userSettings.walletAddress) {
            receiver = 'Me';
        } else {
            receiver = `${receiver.substring(0, 10)}...${receiver.substring(receiver.length - 6)}`;
        }
        return (
            <span>
                {receiver}
            </span>
        );
    };
    const DateCellRenderer = (params: any) => {
        // Convert the unix timestamp to a local date
        const date = new Date(params.value * 1000);
        return (
            <div>
                <div>
                    {date.toLocaleDateString()}
                </div>
                <div>
                    {date.toLocaleTimeString()}
                </div>
            </div>
        );
    };

    const TxHashCellRenderer = (params: any) => {
        const explorerLink = `https://devnet-explorer.multiversx.com/transactions/${params.value}`;
        return (
            <Button 
                style={{'fontSize': '12px'}}
                type="button" 
                color="primary" 
                onClick={() => {
                    window.electron.browserAccess.openLink(explorerLink);
                }}
              >
                  View in Explorer
              </Button>
        );
    };

    const [columnDefs, setColumnDefs] = useState([
        { field: 'receiver', headerName: 'To', cellRenderer: memo(ReceiverCellRenderer) },
        { field: 'sender', headerName: 'From', cellRenderer: memo(SenderCellRenderer) },
        { field: 'status' },
        { field: 'timestamp', headerName: 'Date', cellRenderer: memo(DateCellRenderer) },
        //{ field: 'value' },
        { field: 'txHash', headerName:'' , cellRenderer: memo(TxHashCellRenderer) },
    ]);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true
    }), []);

    useEffect(() => {
        const getAeroTokenDetails = async () => {
            const elrondService = new ElrondService(appConstants.API_BASE_URL_DEVNET);
            const tokenDetails = await elrondService.getAeroTokenDetails(props.userSettings.walletAddress);
            setAeroBalance(tokenDetails.balance.dividedBy(divisor).toNumber().toString());

            const transactions = await elrondService.getTransactionHistory(props.userSettings.walletAddress);
            setTxData(transactions);

            try {
                const account = await elrondService.getAccount(props.userSettings.walletAddress);
                setEgldBalance(account.balance.dividedBy(divisor).toNumber().toString());
            } catch (error: any) {
                alert(error);
                setEgldBalance("Unavailable, try again later");
            }

            setLoading(false);
        }

        const getTokenPrices = async () => {
            // Use mainnet for getting aero price because aero doesn't exist on devnet
            const elrondService = new ElrondService(appConstants.API_BASE_URL_MAINNET);
            const priceEgld = await elrondService.getEgldPrice();
            const priceAero = await elrondService.getAeroPrice();

            setEgldPrice(new BigNumber(priceEgld));
            setAeroPrice(new BigNumber(priceAero));

            setLoading(false);
        };

        getAeroTokenDetails();
        getTokenPrices();
    }, []);

    const sendAeroClicked = () => {
        setToken('AERO');
        setOpenSendDialog(true);
    };

    const sendEgldClicked = () => {
        setToken('EGLD');
        setOpenSendDialog(true);
    };

    const receiveClicked = () => {
        setOpenAddressDialog(true);
    };

    const handleDialogClose = () => {
        setOpenAddressDialog(false);
        setOpenSendDialog(false);
    };

    const handleTransactionSent = (hash: string) => {
        setOpenSendDialog(false);
        setSnackbarMessage("Transaction sent");
        setSnackbarActionLink(`https://devnet-explorer.multiversx.com/transactions/${hash}`);
        setShowSnackbar(true);
    };

    const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowSnackbar(false);
    };

    const snackbarAction = (
        <React.Fragment>
            <Button 
                style={{'fontSize': '12px'}}
                type="button" 
                color="primary" 
                onClick={() => {
                    window.electron.browserAccess.openLink(snackbarActionLink);
                }}
              >
                View in Explorer
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackbarClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    if (loading) {
        return (
            <div className="center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <Container component='main' maxWidth='lg'>
            <h1>
                Wallet
            </h1>
            <Container className="cardViewDark" component='div'>
                <Snackbar
                    open={showSnackbar}
                    autoHideDuration={30000}
                    onClose={handleSnackbarClose}
                    action={snackbarAction}
                    message={snackbarMessage} />
                <SendTokensView 
                    currentBalance={token === 'AERO' ? aeroBalance : egldBalance} 
                    token={token}
                    open={openSendDialog}
                    onClose={handleDialogClose} 
                    aeroPrice={aeroPrice}
                    egldPrice={egldPrice}
                    transactionSent={handleTransactionSent}
                    userSettings={props.userSettings}
                    password={props.password}
                />

                <WalletAddressView address={props.userSettings.walletAddress} open={openAddressDialog} onClose={handleDialogClose} />
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <div>
                            <Avatar alt="AERO Logo" src="https://media.elrond.com/tokens/asset/AERO-458bbf/logo.png" />
                            <Typography paddingTop={2} variant="body1">
                                AERO Balance
                            </Typography>
                            <Typography variant="caption">
                                {aeroBalance}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <Container maxWidth='xs' component='div'>
                            <div style={{"textAlign": "right"}}>
                                <div>
                                    <Button 
                                        id="sendAeroButton"
                                        style={{"width": "148px"}}
                                        type="button" 
                                        variant="contained" 
                                        color="primary" 
                                        className="buttonPrimary"
                                        onClick={sendAeroClicked}
                                    >
                                        Send
                                    </Button>
                                </div>
                                <div style={{"marginTop": "12px"}}>
                                    <Button 
                                        id="receiveAeroButton"
                                        style={{"width": "148px"}}
                                        type="button" 
                                        variant="contained" 
                                        color="primary" 
                                        className="buttonPrimary"
                                        onClick={receiveClicked}
                                    >
                                        Receive
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </Grid>
                </Grid>
            </Container>

            <Container className="cardViewDark" component='div'>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <div>
                            <Avatar alt="EGLD Logo" src="https://elrond.com/assets/images/favicon/android-icon-192x192.png" />
                            <Typography paddingTop={2} variant="body1">
                                EGLD Balance
                            </Typography>
                            <Typography variant="caption">
                                {egldBalance}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <Container maxWidth='xs' component='div'>
                            <div style={{"textAlign": "right"}}>
                                <div>
                                    <Button 
                                        id="sendEgldButton"
                                        style={{"width": "148px"}}
                                        type="button" 
                                        variant="contained" 
                                        color="primary" 
                                        className="buttonPrimary"
                                        onClick={sendEgldClicked}
                                    >
                                        Send
                                    </Button>
                                </div>
                                <div style={{"marginTop": "12px"}}>
                                    <Button 
                                        id="receiveEgldButton"
                                        style={{"width": "148px"}}
                                        type="button" 
                                        variant="contained" 
                                        color="primary" 
                                        className="buttonPrimary"
                                        onClick={receiveClicked}
                                    >
                                        Receive
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </Grid>
                </Grid>
            </Container>
            <div style={{'padding': '8px', 'marginTop': '24px'}} >
                <Typography textAlign='center' paddingTop={2} paddingBottom={2} color={appConstants.AERO_BLUE} fontSize={24}>
                    Transactions
                </Typography>
                <div className='ag-theme-alpine' style={{ 'height': '50vh', 'width': '100%' }}>
                    <AgGridReact 
                        ref={gridRef}
                        rowData={txData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                    />
                </div>

            </div>
        </Container>
      );
}