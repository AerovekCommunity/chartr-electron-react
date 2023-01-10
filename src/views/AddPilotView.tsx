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
    LinearProgress,
    TextareaAutosize
} from '@mui/material';
import { IAddPilotViewProps, IPilotDetails } from 'interfaces';
import React, { useState, useRef } from 'react';
import ElrondService from 'services/elrondService';
import AppConstants from '../constants/appConstants.json';
import BigNumber from 'bignumber.js';
import { Label } from '@mui/icons-material';
import { height } from '@mui/system';
import { v4 as uuidv4 } from 'uuid';
  
export default function AddPilotView(props: IAddPilotViewProps): JSX.Element {
    const { onClose, open, password, userSettings, pilotAdded, account } = props;
    const [showProgress, setShowProgress] = useState(false);
    const elrondService = new ElrondService(AppConstants.API_BASE_URL_DEVNET);
    const firstNameRef: React.RefObject<any> = React.createRef();
    const lastNameRef: React.RefObject<any> = React.createRef();
    const emailRef: React.RefObject<any> = React.createRef();
    const flightTimeHoursRef: React.RefObject<any> = React.createRef();
    const bioRef: React.RefObject<any> = React.createRef();
    const certificatesRef: React.RefObject<any> = React.createRef();
    const qualificationsRef: React.RefObject<any> = React.createRef();
    const ratingsRef: React.RefObject<any> = React.createRef();

    /**
     * Handles either the Back or Cancel button click
     */
    const handleCancel = () => {
        setShowProgress(false);
        onClose();
    };

    const handleSubmitClicked = async () => {
        const firstName = firstNameRef.current.value;
        const lastName = lastNameRef.current.value;
        const email = emailRef.current.value;
        const flightTimeHours = flightTimeHoursRef.current.value;
        const bio = bioRef.current.value;
        const certificates = certificatesRef.current.value;
        const qualifications = qualificationsRef.current.value;
        const ratings = ratingsRef.current.value;

        if (!firstName || !lastName) {
            alert('First Name and Last Name are required!');
            return;
        }

        setShowProgress(true);

        try {

            const egldAccount = await elrondService.getAccount(props.userSettings.walletAddress);
            if (egldAccount.balance.toNumber() === 0) {
                setShowProgress(false);
                alert("Verify you have enough EGLD to cover the small network fee (~$0.01 USD, cost varies) for saving your account data on the blockchain.")
                return;
            }

            const newPilot: IPilotDetails = {
                id: uuidv4(),
                firstName: firstName,
                lastName: lastName,
                email: email,
                flightTimeHours: flightTimeHours,
                bio: bio,
                certificates: certificates,
                qualifications: qualifications,
                ratings: ratings
            };

            const pilotDetails = account.businessProfile.pilotDetails ?? [];
            pilotDetails.push(newPilot);
            account.businessProfile.pilotDetails = pilotDetails;

            // Need to increment record version and update timestamp on each save
            account.recordVersion += 1;
            account.timestamp = new Date().toISOString();

            const result = await elrondService.saveAccount(
                account, 
                egldAccount.nonce, 
                props.userSettings,
                props.password
            );
    
            if (result) {
                pilotAdded();
            } else {
                alert('Failed to add pilot, please try again.');
            }
            setShowProgress(false);
        } catch (e: any) {
            setShowProgress(false);
            alert(`An error occurred while trying to add a pilot: ${e}`);
        }
    }

    return (
        <Container component="main" maxWidth="sm">
            <Dialog
                fullWidth
                open={open}
                keepMounted
                onClose={handleCancel}
                aria-describedby="alert-dialog-slide-description"
            >
            <DialogTitle fontSize={28} textAlign='center'>Add Pilot</DialogTitle>
            <DialogContent style={{"textAlign": "center", "padding": "12px"}}>
                <div>
                    <DialogContentText id="alert-dialog-slide-description">
                    </DialogContentText>

                    <TextField
                        style={{"marginTop": "24px"}}
                        variant="outlined"
                        required
                        fullWidth
                        label="First Name"
                        id="firstName"
                        inputRef={firstNameRef}
                    />

                    <TextField
                        style={{"marginTop": "24px"}}
                        variant="outlined"
                        required
                        fullWidth
                        label="Last Name"
                        id="lastName"
                        inputRef={lastNameRef}
                    />

                    <TextField
                        style={{"marginTop": "24px"}}
                        variant="outlined"
                        fullWidth
                        label="Email"
                        id="email"
                        inputRef={emailRef}
                    />

                    <TextField
                        style={{"marginTop": "24px"}}
                        variant="outlined"
                        fullWidth
                        label="Flight Time Hours"
                        id="flightTimeHours"
                        inputRef={flightTimeHoursRef}
                    />

                    <TextField
                        id="bio"
                        placeholder="Bio/Resume"
                        multiline
                        variant="outlined"
                        fullWidth
                        label="Bio/Resume"
                        style={{ 
                            marginTop: '24px'
                        }}
                        inputRef={bioRef}
                    />

                    <TextField
                        style={{"marginTop": "24px"}}
                        multiline
                        variant="outlined"
                        fullWidth
                        label="Certificates"
                        id="certificates"
                        inputRef={certificatesRef}
                    />

                    <TextField
                        style={{"marginTop": "24px"}}
                        variant="outlined"
                        multiline
                        fullWidth
                        label="Qualifications"
                        id="qualifications"
                        inputRef={qualificationsRef}
                    />

                    <TextField
                        style={{"marginTop": "24px"}}
                        variant="outlined"
                        multiline
                        fullWidth
                        label="Ratings"
                        id="ratings"
                        inputRef={ratingsRef}
                    />

                </div>

                <div style={{'marginTop': '8px'}} hidden={!showProgress}>
                    <LinearProgress />
                </div>

            </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSubmitClicked}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}