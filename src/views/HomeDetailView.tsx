
import { IHomeDetailViewProps, IUserSettings } from "interfaces";
import { Suspense, lazy, useState, useEffect} from "react";

export default function HomeDetailView(props: IHomeDetailViewProps): JSX.Element {
    const [userSettings, setUserSettings] = useState<IUserSettings>({walletAddress: "", publicKeyHex: ""});

    useEffect(() => {
        const readSettings = async () => {
            const userDataPath = await window.electron.fileAccess.getPath("userData");
            const settingsFilePath = `${userDataPath}/userSettings.json`;
            const settingsFile = await window.electron.fileAccess.readFile(settingsFilePath); 
            const settingsObject: IUserSettings = JSON.parse(settingsFile.toString());
            setUserSettings(settingsObject);
        };
        readSettings();
    }, []);

    switch (props.currentView) {
        case 'home': {
            const HomeView = lazy(() => import("./HomeView"));
            return (
                <Suspense>
                    <HomeView />
                </Suspense>
            )
        }
        case 'wallet': {
            const WalletView = lazy(() => import("./WalletView"));
            return (
                <Suspense>
                    <WalletView userSettings={userSettings} password={props.password} />
                </Suspense>
            )
        }
        case 'account': {
            const AccountView = lazy(() => import("./AccountView"));
            return (
                <Suspense>
                    <AccountView password={props.password} userSettings={userSettings} />
                </Suspense>
            )
        }
        case 'createAccount': {
            const CreateAccountView = lazy(() => import("./CreateAccountView"));
            return (
                <Suspense>
                    <CreateAccountView password={props.password} userSettings={userSettings} accountCreated={props.accountCreated} />
                </Suspense>
            )
        }
        case 'settings': {
            const SettingsView = lazy(() => import("./SettingsView"));
            return (
                <Suspense>
                    <SettingsView />
                </Suspense>
            )
        }
        default: {
            throw `${props.currentView} not supported`;
        }
    }
}