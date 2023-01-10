import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import routes from '../routing/routes.json';
import HomeContainer from './HomeContainer';
import Login from './Login';
import CreateCredentials from './CreateCredentials';
import CreateWallet from './CreateWallet';
import VerifyWords from './VerifyWords';
import ImportWallet from './ImportWallet';
import { useState } from 'react';
import {
  Mnemonic
} from "../../release/app/node_modules/@elrondnetwork/erdjs-walletcore";


export default function App() {
  const [mnemonic, setMnemonic] = useState<Mnemonic | undefined>(undefined);
  const [password, setPassword] = useState<string>("");
  const [hasAccount, setHasAccount] = useState<boolean>(false);

  // Need to have this here so other modules have access to the wallet words
  const setWalletMnemonic = (walletMnemonic: Mnemonic) => {
    setMnemonic(walletMnemonic);
  };

  const setUserPassword = (password: string) => {
    setPassword(password);
  };

  const setHasChartrAccount = (hasAct: boolean) => {
    setHasAccount(hasAct);
  };

  return (
    <Router>
      <Routes>
        <Route path={routes.LOGIN} element={<Login setUserPassword={setUserPassword} setWalletMnemonic={setWalletMnemonic} setHasAccount={setHasChartrAccount} />} />
        <Route path={routes.HOME} element={<HomeContainer password={password} hasAccount={hasAccount} />} />
        <Route path={routes.CREATE_CREDENTIALS} element={<CreateCredentials currentMnemonic={mnemonic} />} />
        <Route path={routes.CREATE_WALLET} element={<CreateWallet setWalletMnemonic={setWalletMnemonic} currentMnemonic={mnemonic} />} />
        <Route path={routes.IMPORT_WALLET} element={<ImportWallet setWalletMnemonic={setWalletMnemonic} />} />
        <Route path={routes.VERIFY_WORDS} element={<VerifyWords mnemonic={mnemonic} />} />
      </Routes>
    </Router>
  );
}
