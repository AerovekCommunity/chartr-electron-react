import { 
    Button, 
    Container, 
    Grid, 
    Typography, 
    TextField,
    Autocomplete,
    LinearProgress,
    DialogContentText,
    DialogTitle,
    DialogContent,
    Dialog,
    DialogActions,
} from '@mui/material';
import { IBusinessProfile, IChartrAccount, IEditProfileViewProps } from 'interfaces';
  
import React, { useEffect, useState } from 'react';
import ElrondService from 'services/elrondService';
import businessCategories from "../../assets/businessCategories.json";
import countries from "../../assets/countries.json";
import appConstants from "../constants/appConstants.json";
  
export default function EditProfileView(props: IEditProfileViewProps): JSX.Element {
const { account } = props;
const [showProgress, setShowProgress] = useState<boolean>(false);
const [companyNameClass, setCompanyNameClass] = useState<string>("textField");
const [businessTypeClass, setBusinessTypeClass] = useState<string>("textField");
const [countryClass, setCountryClass] = useState<string>("textField");
const [emailClass, setEmailClass] = useState<string>("textField");

const [showError, setShowError] = useState<boolean>(false);
const [errorMessage, setErrorMessage] = useState<string>("");
const [countryNames, setCountryNames] = useState<string[]>([]);
const [selectedCountryCode, setSelectedCountryCode] = useState<string>(account.businessProfile.country);
const [selectedBusinessType, setSelectedBusinessType] = useState<string>(account.businessProfile.businessCategory);
const [companyName, setCompanyName] = useState<string>(account.businessProfile.country);
const [email, setEmail] = useState<string>(account.email);


useEffect(() => {
    setCountryNames(countries.map((value, idx) => {
        return value.name;
    }));

    //setSelectedBusinessType(account.businessProfile.businessCategory);
    //setSelectedCountryCode(account.businessProfile.country);
    //setEmail(account.email);
    //setCompanyName(account.businessProfile.businessName);
}, []);

const showErrorMessage = (text: string) => {
    setShowError(true);
    setErrorMessage(text);

    setTimeout(() => {
    setShowError(false);
    }, 3000);
};

const submitClicked = async () => {
    if (companyName && selectedBusinessType && selectedCountryCode && email) {
        try {
            setShowProgress(true);
            const elrondService = new ElrondService(appConstants.API_BASE_URL_DEVNET);
            const egldAccount = await elrondService.getAccount(props.userSettings.walletAddress);

            if (egldAccount.balance.toNumber() === 0) {
                setShowProgress(false);
                alert("Verify you have enough EGLD to cover the small network fee (~$0.01 USD, cost varies) for saving your account data on the blockchain.")
                return;
            }

            const busProfile: IBusinessProfile = {
                businessCategory: selectedBusinessType,
                businessName: companyName,
                country: selectedCountryCode
            };

            const chartrAccount: IChartrAccount = {
                id: props.userSettings.walletAddress,
                accountType: "business",
                recordVersion: account?.recordVersion + 1,
                timestamp: new Date().toISOString(),
                username: account.username,
                email: email,
                businessProfile: busProfile,
                profileImageUrl: ""
            };

            const result = await elrondService.saveAccount(
                chartrAccount, 
                egldAccount.nonce, 
                props.userSettings,
                props.password
            );

            if (result) {
                props.profileUpdated(chartrAccount);
            }
        } catch (error: any) {
            showErrorMessage(`Profile update failed:  ${error}`);
        }

    } else {
        if (!companyName) {
            setCompanyNameClass("requiredField");
        }
        if (!email) {
            setEmailClass("requiredField");
        }
        if (!selectedBusinessType) {
            setBusinessTypeClass("requiredField");
        }
        if (!selectedCountryCode) {
            setCountryClass("requiredField");
        }
    }
}

const resetView = () => {
    setSelectedBusinessType(account.businessProfile.businessCategory);
    setSelectedCountryCode(account.businessProfile.country);
    setEmail(account.email);
    setCompanyName(account.businessProfile.businessName);
    setCompanyNameClass("textField");
    setEmailClass("textField");
    setBusinessTypeClass("textField");
    setCountryClass("textField");
}

const handleCancel = () => {
    resetView();
    setShowProgress(false);
    props.onClose();
};

return (
    <Container component="main" maxWidth="sm">
        <Dialog
            fullWidth
            open={props.open}
            keepMounted
            onClose={handleCancel}
            aria-describedby="alert-dialog-slide-description"
        >
        <DialogTitle fontSize={28} textAlign='center'>Edit Profile</DialogTitle>
        <DialogContent style={{"textAlign": "center", "padding": "12px"}}>
        <div>
            <DialogContentText id="alert-dialog-slide-description">
            </DialogContentText>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        onFocus={() => {
                            setCompanyNameClass("");
                        }}
                        onChange={v => {
                            setCompanyName(v.target.value);
                        }}
                        className={companyNameClass}
                        value={companyName}
                        variant="outlined"
                        fullWidth
                        label="Company Name"
                        id="companyName"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        onFocus={() => {
                            setEmailClass("");
                        }}
                        onChange={v => {
                            setEmail(v.target.value);
                        }}
                        value={email}
                        className={emailClass}
                        variant="outlined"
                        fullWidth
                        label="Email"
                        id="email"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete 
                        onChange={(_evt, val) => {
                            setSelectedBusinessType(val || "");
                        }}
                        className={businessTypeClass}
                        value={selectedBusinessType}
                        autoComplete
                        filterSelectedOptions
                        id="business-category"
                        options={businessCategories}
                        fullWidth
                        renderInput={(params) => <TextField onFocus={() => {setBusinessTypeClass("")}} { ...params} label="Select your business type" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete 
                        onChange={(_evt, value) => {
                            setSelectedCountryCode(countries.find((val, _idx) => {
                                return val.name == (value || "");
                            })?.code || "");
                        }}
                        value={selectedCountryCode}
                        className={countryClass}
                        autoComplete
                        filterSelectedOptions
                        id="countries"
                        options={countryNames}
                        fullWidth
                        renderInput={(params) => <TextField onFocus={() => {setCountryClass("")}} { ...params} label="Select the country you operate in" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography 
                        component="h6"
                        className="errorLabel"
                        hidden={!showError}
                    >
                        {errorMessage}
                    </Typography>
                </Grid>
                </Grid>

            </div>

            <div style={{'marginTop': '8px'}} hidden={!showProgress}>
                <LinearProgress />
            </div>

        </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={submitClicked}>Submit</Button>
            </DialogActions>
        </Dialog>
    </Container>
);}