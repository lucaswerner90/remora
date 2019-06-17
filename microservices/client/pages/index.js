import React from 'react';
import Button from '@material-ui/core/Button';
import { Grid, Typography, Hidden } from '@material-ui/core';
import FloatingHeader from '../src/components/index/FloatingHeader';


const lightBlueText = {
    color: '#67FFFF'
};

const FirstRow = () => {
    const firstScreen = {
        height: '100vh',
        // backgroundSize: 'cover',
        // background: 'url("static/images/background_first_row.jpg") no-repeat center center',
        background: 'linear-gradient(to right, rgb(0, 4, 40), rgba(0, 78, 146, 0.5))',
        position: "fixed",
        bottom: 0,
        width: '100%',
        padding: '20px'
    };
    const accessButton = {
        borderRadius: '25px',
        border: '2px solid white',
        padding: '7px 40px',
        marginTop: '-60px'
    };
    return (
        <React.Fragment >
            <video autoPlay muted loop style={{ position: 'fixed', right: 0, bottom: 0, minWidth: '100%', minHeight: '100%' }}>
                <source src="static/homepage_background.mp4" type="video/mp4"></source>
            </video>
            <Grid item xs={12} style={firstScreen}>
                <FloatingHeader />
                <Grid container alignItems="center" alignContent="center" justify="center" style={{ height: '80vh' }}>
                    <Grid item xs={12} sm={12} md={12} style={{ maxWidth: '600px' }}>
                        <Typography align="center">
                            <img src='static/images/logo_texto.png' width="100%" />
                        </Typography>
                        <Button href="/dashboard" color="default" style={accessButton}>
                            Access
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

const index = () => {
    const rootStyles = {
        width: "100%",
        maxWidth: '100%',
        margin: "0 auto",
    };

    return (
        <Grid container style={rootStyles}>
            <FirstRow />
        </Grid>
    );
}

export default index;