import { 
    Container,
    Grid,
    Typography,
    Avatar,
    CircularProgress,
} from '@mui/material';

import { useEffect, useState } from 'react';
import ElrondService from 'services/elrondService';
import appConstants from '../constants/appConstants.json';


export default function HomeView(): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true);
    const [egldPrice, setEgldPrice] = useState<string>("");
    const [aeroPrice, setAeroPrice] = useState<string>("");

    useEffect(() => {
        const getTokenPrices = async () => {
            const elrondService = new ElrondService(appConstants.API_BASE_URL_MAINNET);
            const egldPrice = await elrondService.getEgldPrice();
            const aeroPrice = await elrondService.getAeroPrice();

            setEgldPrice(egldPrice);
            setAeroPrice(aeroPrice);

            setLoading(false);
        };

        getTokenPrices();
    }, []);

    if (loading) {
        return (
            <div className="center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <Container component='main' maxWidth='md'>
            <div className='center'>
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={8}>
                        <div className='cardViewDark'>
                            <div>
                                <Avatar alt="AERO Logo" src="https://media.elrond.com/tokens/asset/AERO-458bbf/logo.png" />
                                <Typography paddingTop={2} variant="body1">
                                    AERO Price
                                </Typography>
                                <Typography variant="caption">
                                    {`$${aeroPrice}`}
                                </Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={8}>
                        <div className='cardViewDark'>
                            <div>
                                <Avatar alt="EGLD Logo" src="https://elrond.com/assets/images/favicon/android-icon-192x192.png" />
                                <Typography paddingTop={2} variant="body1">
                                    EGLD Price
                                </Typography>
                                <Typography variant="caption">
                                    {`$${egldPrice}`}
                                </Typography>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </Container>
    )
}