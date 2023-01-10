import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import { IProfileViewProps } from "interfaces";
import { Person } from '@mui/icons-material';
import AppConstants from '../constants/appConstants.json';
import CountryList from '../../assets/countries.json';


export default function ProfileView(props: IProfileViewProps): JSX.Element {
    const country = CountryList.find(countryObj => {
        return countryObj.code === props.account?.businessProfile?.country
    })?.name;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <div className='cardViewDark'>
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={8}>
                        <div style={{'float': 'left', 'padding': '12px'}}>
                            <Typography fontSize={28} color='white' fontFamily='verdana'>
                                Welcome,
                            </Typography>
                            <Typography fontSize={24} color='white' fontFamily='verdana'>
                                {props.account?.businessProfile?.businessName}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={8}>
                        <div style={{'float': 'right', 'padding': '12px'}}>
                            <div style={{'justifyContent': 'center', 'display': 'flex'}}>
                                <Avatar sx={{width: 96, height: 96}}>
                                    <Person sx={{width: 48, height: 48}} />
                                </Avatar>
                            </div>
                            <Typography paddingTop={1} textAlign='center' fontSize={18} color={AppConstants.AERO_BLUE} fontFamily='verdana'>
                                {props.account?.username}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={8}>
                        <div style={{'padding': '12px'}}>
                            <Typography fontSize={18} color='white' fontFamily='verdana'>
                                {`Country: ${country}`}
                            </Typography>
                            <Typography paddingTop={1} fontSize={18} color='white' fontFamily='verdana'>
                                {`Category: ${props.account?.businessProfile?.businessCategory}`}
                            </Typography>
                            <Typography paddingTop={1} fontSize={18} color='white' fontFamily='verdana'>
                                {`Email: ${props.account?.email}`}
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
                <Container style={{'marginTop': '24px'}} maxWidth='xs'>
                    <Button 
                        type="button" 
                        variant="contained" 
                        color="primary" 
                        className="buttonPrimary"
                        fullWidth
                        onClick={() => {
                            alert("Coming soon...");
                        }}
                    >
                        Edit Profile
                    </Button>
                </Container>
            </div>
        </Box>
    );
}