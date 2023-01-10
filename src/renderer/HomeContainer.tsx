import { 
  Container, 
  Avatar,
  CircularProgress
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import routes from '../routing/routes.json';
import { Wallet, Home as HomeImage, Logout, Person, Settings, PersonAdd } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import HomeDetailView from '../views/HomeDetailView';
import { IHomeContainerProps, IUserSettings } from 'interfaces';
import AlertDialog from './AlertDialog';

  export default function HomeContainer(props: IHomeContainerProps): JSX.Element {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [homeAvatarStyle, setHomeAvatarStyle] = useState<any>({bgcolor: 'black', color: 'white'});
    const [homeButtonStyle, setHomeButtonStyle] = useState<string>('sidebarButtonSelected');
    const [walletAvatarStyle, setWalletAvatarStyle] = useState<any>({bgcolor: '#d0d4d6', color: 'black'});
    const [walletButtonStyle, setWalletButtonStyle] = useState<string>('sidebarButtonUnselected');
    const [accountAvatarStyle, setAccountAvatarStyle] = useState<any>({bgcolor: '#d0d4d6', color: 'black'});
    const [accountButtonStyle, setAccountButtonStyle] = useState<string>('sidebarButtonUnselected');
    const [settingsAvatarStyle, setSettingsAvatarStyle] = useState<any>({bgcolor: '#d0d4d6', color: 'black'});
    const [settingsButtonStyle, setSettingsButtonStyle] = useState<string>('sidebarButtonUnselected');
    const [currentView, setCurrentView] = useState<string>('home');
    const [accountVisible, setAccountVisible] = useState<boolean>(props.hasAccount);
    const [userSettings, setUserSettings] = useState<IUserSettings>({publicKeyHex: "", walletAddress: ""});
    const navigate = useNavigate();

    useEffect(() => {
      const retrieveAccount = async () => {
        const userDataPath = await window.electron.fileAccess.getPath("userData");
        const settingsFilePath = `${userDataPath}/userSettings.json`;
        const settingsFile = await window.electron.fileAccess.readFile(settingsFilePath); 
        const settingsObject: IUserSettings = JSON.parse(settingsFile.toString());
        setAccountVisible(props.hasAccount);
        setUserSettings(settingsObject);
        setLoading(false);
      };

      retrieveAccount();
    }, []);

  const homeClicked = () => {
    setCurrentView('home');
    setHomeButtonStyle('sidebarButtonSelected');
    setHomeAvatarStyle({bgcolor: 'black', color: 'white'});

    setWalletButtonStyle('sidebarButtonUnselected');
    setWalletAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
    setAccountButtonStyle('sidebarButtonUnselected');
    setAccountAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
    setSettingsButtonStyle('sidebarButtonUnselected');
    setSettingsAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
  };
  const walletClicked = () => {
    setCurrentView('wallet');
    setWalletButtonStyle('sidebarButtonSelected');
    setWalletAvatarStyle({bgcolor: 'black', color: 'white'});

    setHomeButtonStyle('sidebarButtonUnselected');
    setHomeAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
    setAccountButtonStyle('sidebarButtonUnselected');
    setAccountAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
    setSettingsButtonStyle('sidebarButtonUnselected');
    setSettingsAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
  };

  const createAccountClicked = () => {
    setCurrentView('createAccount');
    setAccountButtonStyle('sidebarButtonSelected');
    setAccountAvatarStyle({bgcolor: 'black', color: 'white'});

    setHomeButtonStyle('sidebarButtonUnselected');
    setHomeAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
    setWalletButtonStyle('sidebarButtonUnselected');
    setWalletAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
    setSettingsButtonStyle('sidebarButtonUnselected');
    setSettingsAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
  };

  const accountClicked = () => {
    setCurrentView('account');
    setAccountButtonStyle('sidebarButtonSelected');
    setAccountAvatarStyle({bgcolor: 'black', color: 'white'});

    setHomeButtonStyle('sidebarButtonUnselected');
    setHomeAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
    setWalletButtonStyle('sidebarButtonUnselected');
    setWalletAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
    setSettingsButtonStyle('sidebarButtonUnselected');
    setSettingsAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
  };
  const settingsClicked = () => {
    setCurrentView('settings');
    setSettingsButtonStyle('sidebarButtonSelected');
    setSettingsAvatarStyle({bgcolor: 'black', color: 'white'});

    setHomeButtonStyle('sidebarButtonUnselected');
    setHomeAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
    setWalletButtonStyle('sidebarButtonUnselected');
    setWalletAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
    setAccountButtonStyle('sidebarButtonUnselected');
    setAccountAvatarStyle({bgcolor: '#d0d4d6', color: 'black'});
  };
  const logoutClicked = () => {
    setOpenDialog(true);
  };

  const handleAccountCreated = async () => {
    // store a flag so we know that there is an account it just can't be retrieved until the tx completes 
    const userDataPath = await window.electron.fileAccess.getPath("userData");
    const settingsFilePath = `${userDataPath}/userSettings.json`;
    const settings: IUserSettings = {
      walletAddress: userSettings.walletAddress,
      publicKeyHex: userSettings.publicKeyHex,
      keyfilePath: userSettings.keyfilePath,
      userPin: userSettings.userPin,
      accountPending: true
    }

    setUserSettings(settings);

    await window.electron.fileAccess.writeFile({
      filePath: settingsFilePath,
      contents: `${JSON.stringify(settings)}\n`
    });

    setAccountVisible(true);
    homeClicked();
  };

  const handleCancelLogout = () => {
    setOpenDialog(false);
  }

  const handleConfirmLogout = () => {
    navigate(routes.LOGIN);
  }

  if (loading) {
    return (
        <div className="center">
            <CircularProgress />
        </div>
    );
  }

  return (
    <div className='masterDetailContainer'>
      <div className='sidebar'>
        <div role='button' onClick={homeClicked} title="Home" tabIndex={0} className={homeButtonStyle}>
          <Avatar sx={homeAvatarStyle}>
            <HomeImage />
          </Avatar>
        </div>
        <div role='button' title="Wallet" onClick={walletClicked} tabIndex={1} className={walletButtonStyle}>
          <Avatar sx={walletAvatarStyle}>
            <Wallet />
          </Avatar>
        </div>
        <div role='button' hidden={!accountVisible} title="Account" onClick={accountClicked} tabIndex={2} className={accountButtonStyle}>
          <Avatar sx={accountAvatarStyle}>
            <Person />
          </Avatar>
        </div>
        <div role='button' hidden={accountVisible} title="Create Account" onClick={createAccountClicked} tabIndex={2} className={accountButtonStyle}>
          <Avatar sx={accountAvatarStyle}>
            <PersonAdd />
          </Avatar>
        </div>
        <div role='button' title="Settings" onClick={settingsClicked} tabIndex={3} className={settingsButtonStyle}>
          <Avatar sx={settingsAvatarStyle}>
            <Settings />
          </Avatar>
        </div>
        <div role='button' title="Logout" tabIndex={4} onClick={logoutClicked} className='sidebarButtonUnselected'>
          <Avatar sx={{bgcolor: '#d0d4d6', color: 'black'}}>
            <Logout />
          </Avatar>
        </div>
      </div>

      <Container className='detail'>
        <AlertDialog 
          open={openDialog}
          message='Are you sure you want to logout?' 
          negativeButtonText='Cancel' 
          positiveButtonText='Logout'
          negativeFunc={handleCancelLogout}
          positiveFunc={handleConfirmLogout}
          title='Confirm'
        />
        <HomeDetailView 
          password={props.password} 
          currentView={currentView} 
          accountCreated={handleAccountCreated} 
          userSettings={userSettings} 
        />
      </Container>

    </div>
  );

}