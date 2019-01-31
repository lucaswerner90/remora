import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import OrderBasicInfo from './OrderBasicInfo';
import OrderAdvancedInfo from './OrderAdvancedInfo';
import { Paper } from '@material-ui/core';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
});

class TabsInfo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    sellOrder: PropTypes.object.isRequired,
    buyOrder: PropTypes.object.isRequired,
    coinPrice: PropTypes.number.isRequired
  };

  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };
  renderBasicInfo = () => {
    const { sellOrder, buyOrder, coinPrice } = this.props;
    return (
      <Grid container spacing={40} style={{marginTop:20}}>
        <Grid item xs={12}>
          <OrderBasicInfo message="SELL ORDER" order={sellOrder} coinPrice={coinPrice} />
        </Grid>
        <Grid item xs={12}>
          <OrderBasicInfo message="BUY ORDER" order={buyOrder} coinPrice={coinPrice} />
        </Grid>
      </Grid>
    );
  }
  renderAdvancedInfo = () => {
    const { sellOrder, buyOrder, coinPrice } = this.props;
    return (
      <Grid container spacing={40} style={{marginTop:20}}>
        <Grid item xs={12}>
          <OrderAdvancedInfo message="SELL ORDER" order={sellOrder} coinPrice={coinPrice} />
        </Grid>
        <Grid item xs={12}>
          <OrderAdvancedInfo message="BUY ORDER" order={buyOrder} coinPrice={coinPrice} />
        </Grid>
      </Grid>
    );
  }
  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <Grid container spacing={40} className={classes.root}>
        <Grid item>
          <Tabs
            value={value}
            centered={false}
            indicatorColor="primary"
            onChange={this.handleChange}
            scrollButtons="on"
          >
            <Tab label="Basic" />
            <Tab label="Advanced" />
            <Tab label="Chat" />
          </Tabs>
        {value === 0 && this.renderBasicInfo()}
        {value === 1 && this.renderAdvancedInfo()}
        {value === 2 && <Typography>Chat</Typography>}
        </Grid>
      </Grid>
    );
  }
}



export default withStyles(styles)(TabsInfo);