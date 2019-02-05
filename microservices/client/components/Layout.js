import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Header from './Header';
import Footer from './Footer';

const styles = () => ({
  root: {
    width: "100%",
    maxWidth:'1080px',
    margin: "0 auto",
  },
});

const background = {
  background: '#005C97',
  background: 'linear-gradient(63deg, rgb(0,153,204), rgb(22,38,99))'
}


class Layout extends Component {
  render() {
    const { classes } = this.props;
    return (
        <Grid container style={{...background}}>
          <Grid container className={classes.root} spacing={24}>
            <Grid item xs={12}>
              <Header />
            </Grid>
            <Grid item xs={12}>
              {this.props.children}
            </Grid>
            <Grid item xs={12}>
              <Footer />
            </Grid>
          </Grid>
        </Grid>
    );
  }
}
Layout.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Layout);