import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Header from './Header';
import Footer from './Footer';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

class Layout extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Header
         />
        <Grid container className={classes.root} spacing={24}>
          <Grid item xs={12}>
            {this.props.children}
          </Grid>
        </Grid>
        <Footer />
      </div>
    )
  }
}
Layout.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Layout);