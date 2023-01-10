import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import { IPilotsViewProps, IProfileViewProps } from "interfaces";
import { Person } from '@mui/icons-material';
import appConstants from '../constants/appConstants.json';
import { useState } from "react";


export default function PilotDetailView(): JSX.Element {
    const [bio, setBio] = useState<string>("");

    return (
        <Box sx={{ flexGrow: 1 }}>
            <div>
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={8}>
                        <div style={{'padding': '12px'}}>
                            <Typography component='h2' paddingBottom={2} fontFamily='verdana'>
                                Bio 
                            </Typography>
                            <Typography component='body' fontFamily='verdana'>
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </Box>
    );
}