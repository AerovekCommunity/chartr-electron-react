import { 
  Button, 
  Container, 
  Grid, 
  Typography, 
  TextField,
  Autocomplete,
  LinearProgress,
} from '@mui/material';
import { IBusinessProfile, IChartrAccount, ICreateAccountViewProps } from 'interfaces';

import React, { useEffect, useState } from 'react';
import ElrondService from 'services/elrondService';
import businessCategories from "../../assets/businessCategories.json";
import countries from "../../assets/countries.json";
import appConstants from "../constants/appConstants.json";

export default function CreateAccountView(props: ICreateAccountViewProps): JSX.Element {
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [usernameClass, setUsernameClass] = useState<string>("textField");
  const [companyNameClass, setCompanyNameClass] = useState<string>("textField");
  const [businessTypeClass, setBusinessTypeClass] = useState<string>("textField");
  const [countryClass, setCountryClass] = useState<string>("textField");
  const [emailClass, setEmailClass] = useState<string>("textField");

  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countryNames, setCountryNames] = useState<string[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("");

  const usernameField: React.RefObject<any> = React.createRef();
  const companyNameField: React.RefObject<any> = React.createRef();
  const emailField: React.RefObject<any> = React.createRef();

  useEffect(() => {
      setCountryNames(countries.map((value, idx) => {
          return value.name;
      }));
  }, []);

  const showErrorMessage = (text: string) => {
    setShowError(true);
    setErrorMessage(text);

    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  const continueClicked = async () => {
    const username = usernameField.current.value.trim();
    const companyName = companyNameField.current.value.trim();
    const email = emailField.current.value.trim();

    if (username && companyName && selectedBusinessType && selectedCountryCode && email) {
      try {
        setShowProgress(true);
        const elrondService = new ElrondService(appConstants.API_BASE_URL_DEVNET);
        const usernameExists = await elrondService.checkUserNameExists(username);
        if (usernameExists) {
          showErrorMessage("This username is already in use");
          setShowProgress(false);
          return;
        } else {
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
            recordVersion: 0,
            timestamp: new Date().toISOString(),
            username: username,
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
            props.accountCreated(result);
          }
        }
      } catch (error: any) {
        showErrorMessage(`Account creation failed:  ${error}`);
      }

    } else {
      if (!username) {
        setUsernameClass("requiredField");
      }
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

  return (
    <Container component='main' maxWidth="md">
      <div className="center">
          <Grid container spacing={2}>
            <Grid item xs={12}>
                <h1>
                    Create Account
                </h1>
            </Grid>
            <Grid item xs={12}>
              <TextField
                onFocus={() => {
                  setUsernameClass("");
                }}
                className={usernameClass}
                inputRef={usernameField}
                variant="outlined"
                fullWidth
                id="username"
                label="Enter a username for this account, it cannot be changed later"
                name="username"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onFocus={() => {
                  setCompanyNameClass("");
                }}
                className={companyNameClass}
                inputRef={companyNameField}
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
                className={emailClass}
                inputRef={emailField}
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
                  className={countryClass}
                  autoComplete
                  filterSelectedOptions
                  id="countries"
                  options={countryNames}
                  fullWidth
                  renderInput={(params) => <TextField onFocus={() => {setCountryClass("")}} { ...params} label="Select the country you operate in" />}
                />
            </Grid>
            <Grid hidden={!showProgress} item xs={12}>
              <LinearProgress />
            </Grid>
            <Grid item xs={12}>
                <Button 
                    type="button" 
                    variant="contained" 
                    color="primary" 
                    className="buttonPrimary"
                    fullWidth
                    onClick={continueClicked}
                >
                  Submit
                </Button>
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
    </Container>
  );
}