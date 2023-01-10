import { 
    Container,
    Tabs,
    Tab,
    Typography,
    CircularProgress
} from "@mui/material";
import { Flight, Description, Person3, AirplaneTicketRounded} from '@mui/icons-material';
import React, { useEffect, useState } from "react";
import { IAccountViewProps, IChartrAccount, IUserSettings } from "interfaces";
import TabPanel from "./TabPanel";
import ProfileView from "./ProfileView";
import ElrondService from "services/elrondService";
import appConstants from "../constants/appConstants.json";
import PilotsView from "./PilotsView";

export default function AccountView(props: IAccountViewProps): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [chartrAccount, setChartrAccount] = useState<IChartrAccount | null>(null);

    useEffect(() => {
        const retrieveAccount = async () => {
            const elrondService = new ElrondService(appConstants.API_BASE_URL_DEVNET);
            const account = await elrondService.getChartrAccount(props.userSettings.walletAddress, props.userSettings.publicKeyHex);
            setChartrAccount(account);
            setLoading(false);
        };
    
        retrieveAccount();
    }, []);


    const onTabChanged = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    if (loading) {
        return (
            <div className="center">
                <CircularProgress />
            </div>
        );
    }

    if (!chartrAccount) {
        return (
            <div className="center">
                <Typography fontSize={24} color='red' textAlign="center">
                    Account pending, come back later...
                </Typography>
            </div>
        );
    }

    // Update the accountPending flag to false now that we made it in
    const setSettings = async () => {
        const userDataPath = await window.electron.fileAccess.getPath("userData");
        const userSettings: IUserSettings = {
            walletAddress: props.userSettings.walletAddress,
            publicKeyHex: props.userSettings.publicKeyHex,
            keyfilePath: props.userSettings.keyfilePath,
            userPin: props.userSettings.userPin,
            accountPending: false
        }
        const settingsFilePath = `${userDataPath}/userSettings.json`;
        await window.electron.fileAccess.writeFile({
            filePath: settingsFilePath,
            contents: `${JSON.stringify(userSettings)}\n`
        });
    };

    setSettings();

    return (
        <Container component="main" maxWidth="lg">
            <Tabs 
                variant="fullWidth"
                onChange={onTabChanged}
                value={selectedTab}
            >
                <Tab label="Profile" icon={<Description />} />
                <Tab label="Pilots" icon={<Person3/>} />
                <Tab label="Aircraft" icon={<Flight />} />
                <Tab label="Flights " icon={<AirplaneTicketRounded />} />
            </Tabs>

            <TabPanel selectedTab={selectedTab} tabIndex={0} >
                <ProfileView account={chartrAccount} />
            </TabPanel>
            <TabPanel selectedTab={selectedTab} tabIndex={1} >
                <PilotsView 
                    userSettings={props.userSettings} 
                    password={props.password} 
                    account={chartrAccount} />
            </TabPanel>
        </Container>
      );
}