import { 
    Container,
    Grid,
    Button,
    TextField,
    CssBaseline,
    Avatar,
    Typography
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import routes from "../routing/routes.json";
import React, { useState, useEffect } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { Mnemonic } from "../../release/app/node_modules/@elrondnetwork/erdjs-walletcore";

export default function VerifyWords(props: any): JSX.Element {
    const word1Field: React.RefObject<any> = React.createRef();
    const word2Field: React.RefObject<any> = React.createRef();
    const word3Field: React.RefObject<any> = React.createRef();
    const [word1, setWord1] = useState<string>("");
    const [word2, setWord2] = useState<string>("");
    const [word3, setWord3] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);
    const [word1Label, setWord1Label] = useState<string>("");
    const [word2Label, setWord2Label] = useState<string>("");
    const [word3Label, setWord3Label] = useState<string>("");
    const navigate = useNavigate();

    function shuffled(keys: number[]): number[] {
        let curValue = keys.length;
        while(curValue !== 0) {
            let randomValue = Math.floor(Math.random() * curValue);
            curValue--;
            // assign to temp var 
            let temp = keys[curValue];
            keys[curValue] = keys[randomValue];
            keys[randomValue] = temp;
        }

        return keys;
    }

    useEffect(() => {
        const mnemonic: Mnemonic = props.mnemonic;
        const wordsArray = mnemonic.getWords();
        const shuffledKeys = shuffled(wordsArray.map((_, idx) => { return idx }));

        setWord1Label(`Enter word #${shuffledKeys[0] + 1}`);
        setWord2Label(`Enter word #${shuffledKeys[1] + 1}`);
        setWord3Label(`Enter word #${shuffledKeys[2] + 1}`);
        setWord1(wordsArray[shuffledKeys[0]]);
        setWord2(wordsArray[shuffledKeys[1]]);
        setWord3(wordsArray[shuffledKeys[2]]);
    }, [])

    function showErrorMessage(text: string) {
        setShowError(true);
        setErrorMessage(text);

        setTimeout(() => {
            setShowError(false);
        }, 3000);
    }

    async function continueClicked() {
        const word1Value = word1Field.current.value;
        const word2Value = word2Field.current.value;
        const word3Value = word3Field.current.value;

        if (!word1Value || !word2Value || !word3Value) {
            showErrorMessage("You left some fields blank!");
            return;
        }
        if (word1Value !== word1 || word2Value !== word2 || word3Value !== word3) {
            showErrorMessage("One or more words you entered did not match, please try again.");
            return;
        }

        navigate(routes.CREATE_CREDENTIALS);
    }
    
    return (
    <Container component="main" maxWidth="md">
        <CssBaseline />
        <Link to={routes.CREATE_WALLET}>
            <Avatar className="backButton">
                <ArrowBack />
            </Avatar>
        </Link>

        <div className="center">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography component="h1" variant="h3">
                        Create Wallet
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography textAlign='center' paddingTop={1} paddingBottom={1} variant="h6">
                        Enter these three words from your Secret Phrase that match the order they were displayed.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="word1"
                        variant="outlined"
                        required
                        fullWidth
                        id="word1"
                        autoFocus
                        label={word1Label}
                        inputRef={word1Field} />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="word2"
                        id="word2"
                        label={word2Label}
                        inputRef={word2Field}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="word3"
                        id="word3"
                        label={word3Label}
                        inputRef={word3Field}
                    />
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
                        Continue
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
                            navigate(routes.CREATE_WALLET)
                        }}
                    >
                        Back To Words
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Typography
                        variant="h6"
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