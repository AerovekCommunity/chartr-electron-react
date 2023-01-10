import { Container, Typography } from "@mui/material";
import AppConstants from '../constants/appConstants.json';


export default function SettingsView(): JSX.Element {
    return (
        <Container component='main'>
            <h1>Settings</h1>
            <div className='center'>
                <Typography color={AppConstants.AERO_BLUE} fontSize={28}>
                    Coming soon...
                </Typography>
            </div>
        </Container>
    )
}