import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import routes from '../routing/routes.json';
import { ArrowBack } from '@mui/icons-material';

import { 
  CssBaseline,
  Avatar,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  LinearProgress
} from '@mui/material';
import {
  UserWallet,
  Mnemonic
} from "../../release/app/node_modules/@elrondnetwork/erdjs-walletcore";
import { IUserSettings } from 'interfaces';

export default function CreateCredentials(props: any): JSX.Element {
  const passwordField: React.RefObject<any> = React.createRef();
  const password2Field: React.RefObject<any> = React.createRef();

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const mnemonic: Mnemonic = props.currentMnemonic;
  const navigate = useNavigate();

  function showErrorMessage(text: string) {
    setShowError(true);
    setErrorMessage(text);

    setTimeout(() => {
      setShowError(false);
    }, 3000);
  }

  async function continueClicked() {
    setLoading(true);
    const password1 = passwordField.current.value.trim();
    const password2 = password2Field.current.value.trim();

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
    console.log(`-------- ${password1}`);
    console.log(`-------- ${password1.match(passwordRegex)}`);

    if (!password1 || !password2) {
      showErrorMessage("You left a field blank!");
      setLoading(false);
    } else if (!password1.match(passwordRegex)) {
      showErrorMessage("Password does not meet requirements!");
      setLoading(false);
    } else if (password2 !== password1) {
      showErrorMessage("Passwords do not match!");
      setLoading(false);
    } else {

      try {

        // Generate a private key from the password
        const privateKey = mnemonic.deriveKey(0);
        const publicKey = privateKey.generatePublicKey();
        const walletAddress = publicKey.toAddress();
        const bech32 = walletAddress.bech32();
        const userWallet = new UserWallet(privateKey, password1);
        const walletJson = JSON.stringify(userWallet.toJSON());

        const documentsPath = await window.electron.fileAccess.getPath("documents");

        let jsonFilePath = `${documentsPath}/${bech32}.json`;

        // Write the wallet keyfile to disk
        await window.electron.fileAccess.writeFile({
          filePath: jsonFilePath,
          contents: `${walletJson}\n`
        });

        // Create a userSettings file now and initialize it with the user's wallet address
        const userDataPath = await window.electron.fileAccess.getPath("userData");
        const userSettings: IUserSettings = {
          walletAddress: bech32,
          publicKeyHex: publicKey.hex()
        };
        const settingsFilePath = `${userDataPath}/userSettings.json`;
        await window.electron.fileAccess.writeFile({
          filePath: settingsFilePath,
          contents: `${JSON.stringify(userSettings)}\n`
        });

        setLoading(false);
        alert(`Your keyfile was saved at ${jsonFilePath}`)
        navigate(routes.LOGIN);

      } catch (error: any) {
        alert(error);
        setLoading(false);
      }
    }
  }

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Link to={routes.LOGIN}>
        <Avatar className='backButton'>
          <ArrowBack />
        </Avatar>
      </Link>

      <div className='center'>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography component="h1" variant="h3">
              Create Wallet
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography paddingBottom={1} paddingTop={1} textAlign='center' variant="h6">
              Your wallet has been created, now protect it with a password. 
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={passwordField}
            />
            <Typography paddingLeft={4} paddingBottom={2} className='hintLabel'>
              Password must be at least 8 characters and contain an uppercase letter and a number
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="password2"
              autoComplete="current-password"
              inputRef={password2Field}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography hidden={!loading} className="centerLink">
              <LinearProgress />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className="buttonPrimary"
              onClick={continueClicked}
            >
              Continue
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