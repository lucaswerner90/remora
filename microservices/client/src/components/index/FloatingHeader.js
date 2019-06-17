import React from 'react';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const FloatingHeader = () => {
    const headerStyles = {
        width: '100%',
        maxWidth: '96%',
        margin: "1% auto",
        height: '50px'
    };
    return (
        <Grid container justify="space-around" alignItems="center" style={headerStyles}>
            <Grid item xs={2} sm={2} md={2}>
                <img src='static/images/logo_header.png' />
            </Grid>
            <Grid item xs={10} sm={10} md={10}>
                <Grid container justify="flex-end" spacing={16}>
                    <Grid item>
                        <Button href="" color="default">
                            WHO WE ARE
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button href="#" color="default">
                            EASY TO USE
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default FloatingHeader;
