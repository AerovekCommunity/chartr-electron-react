import icon from '../../assets/icon.svg';
import { 
  Button, 
  Container, 
  Grid, 
  Typography, 
  TextField
} from '@mui/material';

import Dropzone from 'react-dropzone';

import { useNavigate, Link } from 'react-router-dom';
import routes from '../routing/routes.json';
import {
  UserWallet,
  UserSecretKey
} from "../../release/app/node_modules/@elrondnetwork/erdjs-walletcore";
import React, { useState } from 'react';
import { IUserSettings } from 'interfaces';
import ElrondService from 'services/elrondService';
import appConstants from '../constants/appConstants.json';

export default function Login(props: any): JSX.Element {
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [keyFileName, setKeyFileName] = useState<string>("");
  const [keyFilePath, setKeyFilePath] = useState<string>("");
  const passwordField: React.RefObject<any> = React.createRef();
  const [keyfileObject, setKeyfileObject] = useState<any>(null);
  const navigate = useNavigate();

  const showErrorMessage = (text: string) => {
    setShowError(true);
    setErrorMessage(text);

    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  const loginClicked = async () => {
    const password = passwordField.current.value.trim();
    
    if (!password || !keyFileName || !keyfileObject) {
      showErrorMessage('Wallet keyfile and password required!');
      return;
    }

    try {
      const userSecretKey: UserSecretKey = UserWallet.decryptSecretKey(keyfileObject, password);
      const pubKey = userSecretKey.generatePublicKey();
      if (pubKey.toAddress().bech32().length > 0) {
        // See if a settings file already exists
        const userDataPath = await window.electron.fileAccess.getPath("userData");
        const settingsFilePath = `${userDataPath}/userSettings.json`;
        const settingsFile = await window.electron.fileAccess.readFile(settingsFilePath); 

        let accountPending = false;
        if (settingsFile !== null) {
          // We can't wipe out existing settings so just set the wallet stuff here
          const settingsObject: IUserSettings = JSON.parse(settingsFile.toString());
          settingsObject.keyfilePath = keyFilePath;
          settingsObject.publicKeyHex = pubKey.hex();
          settingsObject.walletAddress = pubKey.toAddress().bech32();
          accountPending = settingsObject.accountPending ?? false;
          await window.electron.fileAccess.writeFile({
            filePath: settingsFilePath,
            contents: `${JSON.stringify(settingsObject)}\n`
          });

        } else {
          // Create a new settings file
          const newSettings: IUserSettings = {
            walletAddress: pubKey.toAddress().bech32(),
            publicKeyHex: pubKey.hex(),
            keyfilePath: keyFilePath
          }

          await window.electron.fileAccess.writeFile({
            filePath: settingsFilePath,
            contents: `${JSON.stringify(newSettings)}\n`
          });
        }
        

        // Store the password in our top level state object because we'll 
        // need it later to sign transactions. We don't want to store the
        // password in userSettings for obvious reasons.
        props.setUserPassword(password);
        
        try {
          const elrondService = new ElrondService(appConstants.API_BASE_URL_DEVNET);
          const account = await elrondService.getChartrAccount(pubKey.toAddress().bech32(), pubKey.hex());
          props.setHasAccount(account !== null || accountPending);
          navigate(routes.HOME);
        } catch (error: any) {
          showErrorMessage("A network error occurred, please try again later.");
        }
      }
    } catch (error: any) {
      showErrorMessage("Login failed. Invalid keyfile and password combination.")
    }
  }

  const onDrop = (acceptedFiles: any) => {
    if (!acceptedFiles || acceptedFiles.length != 1 || acceptedFiles[0].type !== "application/json") {
      showErrorMessage("Invalid file");
      return;
    }

    const file = acceptedFiles[0];

    const reader = new FileReader();
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = async () => {
      const contents: any = reader.result;
      const keyFileObject: any = JSON.parse(contents);
      setKeyFileName(file.name);
      setKeyfileObject(keyFileObject);
      setKeyFilePath(file.path);
    }

    reader.readAsText(file)
  };

  return (
    <Container component='main' maxWidth="sm">
      <div className="center">
          <Grid container spacing={2}>
            <Grid textAlign='center' item xs={12}>
              <img width="200" alt="icon" src={icon} />
            </Grid>
            <Grid item xs={12}>
              <h1>Chartr Business</h1>
            </Grid>
            <Grid item xs={12}>
              <Dropzone onDrop={onDrop}>
                {({getRootProps, getInputProps }) => (
                  <section>
                    <div id='drop-zone' {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Typography color={"blue"} fontSize={14} textAlign='center'>
                        Drag your wallet keyfile or click to browse
                      </Typography>
                    </div>
                  </section>
                )}
              </Dropzone>
              
              <Typography paddingLeft={2} color={"gray"} fontSize={12}>
                {keyFileName}
              </Typography>

            </Grid>
            <Grid item xs={12}>
              <TextField
                inputRef={passwordField}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="button" 
                variant="contained" 
                color="primary" 
                className="buttonPrimary"
                fullWidth
                onClick={loginClicked}
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="button" 
                variant="outlined" 
                color="primary" 
                className="buttonPrimary"
                fullWidth
                onClick={() => {
                  props.setWalletMnemonic(null);
                  navigate(routes.CREATE_WALLET);
                }}
              >
                Create Wallet
              </Button>
            </Grid>
            <Grid className='centerLink' item xs={12}>
              <Link to={routes.IMPORT_WALLET} >
                Import Wallet
              </Link>
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