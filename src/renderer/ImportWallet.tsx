import { 
    Container,
    Button,
    Avatar,
    CssBaseline,
    Typography,
    TextField,
    Autocomplete,
    Chip,
    Link as MaterialLink
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import routes from '../routing/routes.json';
import { ArrowBack } from '@mui/icons-material';
import { Mnemonic } from "../../release/app/node_modules/@elrondnetwork/erdjs-walletcore";
import { useState } from "react";
import mnemonicWords from "../../assets/mnemonic_dictionary_english.json";

export default function CreateWallet(props: any): JSX.Element {
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const navigate = useNavigate();

  const validateMnemonic = () => {
      try {
        const words = selectedOptions.join(" ");
        console.log(words);
        const result = Mnemonic.fromString(words);
        if (result) {
          props.setWalletMnemonic(result);
          navigate(routes.CREATE_CREDENTIALS);
        }
      } catch (error: any) {
        alert(error);
      }
  };

  const pasteClicked = async () => {
    const clipboardText = await navigator.clipboard.readText();

    if (clipboardText) {
      // If copying from the original format, which has the numbers prefixed and a newline char we can handle that here
      // i.e.
      // 1 apple
      // 2 dog
      // 3 cat
      // etc

      const newlineSplit = clipboardText.split('\n');
      if (newlineSplit && newlineSplit.length === 24) {
        // need to get rid of the number in front of each word
        const newArr = newlineSplit.map(value => {
          return value.substring(value.indexOf(' ') + 1);
        });

        setSelectedOptions(newArr);
        setDisableButton(false);
      } else {
        // assume just a simple string of words
        const arr = clipboardText.split(' ');
        if (arr.length === 24) {
          setSelectedOptions(arr);
          setDisableButton(false);
        }
      }
    }
  };

  return (
  <Container component="main" maxWidth="md">

    <CssBaseline />
    <Link to={routes.LOGIN}>
      <Avatar className="backButton">
        <ArrowBack />
      </Avatar>
    </Link>

    <div className="center">
      <Container component="div" maxWidth="md">
          <Typography component="h1" variant="h3">
              Import Wallet
          </Typography>

          <Typography paddingBottom={1} paddingTop={1} textAlign='center' variant="h6">
              Enter your 24 word secret phrase in the correct order. 
          </Typography>

          <Autocomplete 
              value={selectedOptions}
              className="importWordTextField"
              multiple
              autoComplete
              filterSelectedOptions
              clearIcon={false}
              id="mnemonic-text-entry"
              options={mnemonicWords}
              renderTags={(val: readonly string[], getTagProps) => 
                val.map((opt: string, index: number) => (
                  <Chip color="primary" label={`${index + 1} - ${opt}`} {...getTagProps({index})} />
                ))
              }
              fullWidth
              onChange={(evt, value) => {
                setSelectedOptions(value);
                setDisableButton(value.length !== 24);
              }}
              renderInput={(params) => <TextField { ...params} label="Type words here..." />}
          />
          <MaterialLink className="pointer" paddingTop={2} onClick={pasteClicked}>
            Paste from clipboard
          </MaterialLink>

        <Container className="primaryButtonContainer">
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className="buttonPrimary"
            disabled={disableButton}
            onClick={validateMnemonic}>
            Continue
          </Button>
        </Container>
      </Container>
    </div>
  </Container>
  );
}
