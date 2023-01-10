import { 
    Container,
    Button,
    Avatar,
    CssBaseline,
    Typography,
    Snackbar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import routes from '../routing/routes.json';
import { ArrowBack, CopyAll } from '@mui/icons-material';
import { Mnemonic } from "../../release/app/node_modules/@elrondnetwork/erdjs-walletcore";
import { useState, useEffect } from "react";
import WalletWord from "./WalletWord";

export default function CreateWallet(props: any): JSX.Element {
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [mnemonic, setMnemonic] = useState<Mnemonic | null>(null);
  const [wordsNumbered, setWordsNumbered] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (props.currentMnemonic) {
      const curMnemonic: Mnemonic = props.currentMnemonic;
      setMnemonic(curMnemonic);
      setWordsNumbered(curMnemonic.getWords().map((word, idx) => {
        return `${idx + 1} ${word}`;
      }).join('\n'));
    } else {
      try {
        const mn = Mnemonic.generate();
        setMnemonic(mn);
        setWordsNumbered(mn.getWords().map((word, idx) => {
          return `${idx + 1} ${word}`;
        }).join('\n'));
      } catch (e: any) {
        debugger;
      }
    }
  }, [])

  function copyClicked() {
    navigator.clipboard.writeText(wordsNumbered);
    setShowSnackBar(true);
  }

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSnackBar(false);
  };

  return (
  <Container component="main" maxWidth="md">
    <Snackbar 
      open={showSnackBar}
      autoHideDuration={5000}
      onClose={handleClose}
      message="Words were copied to your clipboard"
    />

    <CssBaseline />
    <Link to={routes.LOGIN}>
      <Avatar className="backButton">
        <ArrowBack />
      </Avatar>
    </Link>

    <div className="center">
      <Container component="div" maxWidth="md">
        <Typography component="h1" variant="h3">
            Create Wallet
        </Typography>

        <Typography paddingBottom={4} paddingLeft={4} paddingTop={4} variant="h6">
            Let's create a wallet first, a wallet is required to store your account data on the blockchain. This is your Secret Phrase.
            Write down these words in the exact order displayed and keep them safe! 
            They can be used to access your wallet.
        </Typography>

        <div id="mnemonicContainer" className="mnemonic-container">
          {mnemonic &&
            <div>
              {mnemonic.getWords().map((w, i) => (
                <WalletWord wordNumber={i + 1} word={w} />
              ))}
            </div>
          }

          <div>
            {mnemonic && 
                <Button onClick={copyClicked} hidden={mnemonic?.getWords().length === 0}>
                  <Avatar>
                    <CopyAll />
                  </Avatar>
                </Button>
              }
          </div>
        </div>

        <Container className="primaryButtonContainer" maxWidth="md">
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className="buttonPrimary"
            onClick={() => {
              props.setWalletMnemonic(mnemonic);
              navigate(routes.VERIFY_WORDS);
            }}>
            Continue
          </Button>
        </Container>
      </Container>
    </div>
  </Container>
  );
}
