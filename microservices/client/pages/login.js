import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


import Document from 'next/document';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

class Login extends Document {
  
  render() {
    return (
      <Grid container style={{ flexGrow: 1, height: '100vh' }} spacing={40}>
        <Grid item xs={12}>
          <Typography variant="h3" align="center">
            Login page
          </Typography>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(Login);
