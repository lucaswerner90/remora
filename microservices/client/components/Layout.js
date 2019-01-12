import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { Provider } from 'react-redux';
import store from '../redux/store';

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

class Layout extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div style={{ background: 'white' }}>
        <Provider store={store}>
          <Grid container className={classes.root} spacing={24}>
            <Grid item xs={12}>
              <Header/>
            </Grid>
            <Grid item xs={12}>
              {this.props.children}
            </Grid>
            <Grid item xs={12}>
              <Footer />
            </Grid>
          </Grid>
        </Provider>
      </div>
    )
  }
}
Layout.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Layout);