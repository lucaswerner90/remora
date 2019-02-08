import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { getTimeAgo } from '../../../../components/common/utils/Time';
import OrderBasicInfo from './OrderBasicInfo';
import OrderAdvancedInfo from './OrderAdvancedInfo';
import { Typography, Paper, Switch, FormControlLabel } from '@material-ui/core';

const styles = () => ({
  root: {
    flexGrow: 1,
    marginTop:'5%'
  },
});

class OrderInfo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    message: PropTypes.string.isRequired,
    coinPrice: PropTypes.number.isRequired
  };

  state = {
    open: false,
    order: {
      price: 0,
      createdAt: Date.now(),
      currentValues: {
        quantity: 0,
        position: 0
      },
      initialValues: {
        quantity: 0,
        position: 0
      },

    },
  };

  componentWillReceiveProps(nextProps) {
    const currentOrder = this.props.order;
    const nextOrder = nextProps.order;

    if (currentOrder.price !== nextOrder.price) {
      this.setState({ ...this.state, order: currentOrder });
    }
  }

  handleChange = (event, open) => {
    this.setState({ open });
  };
  renderBasicInfo = (disabled) => {
    const { coinPrice, order } = this.props;
    return (
      <OrderBasicInfo order={order} disabled={disabled} coinPrice={coinPrice} />
    );
  }
  renderAdvancedInfo = (disabled) => {
    const { coinPrice, order } = this.props;
    return (
      <OrderAdvancedInfo order={order} disabled={disabled} coinPrice={coinPrice} />
    );
  }
  render() {
    const { classes, message = '', order} = this.props;
    const { open = false } = this.state;
    const usingSavedOrder = this.props.order.price === undefined;

    let timeAgo = order.createdAt ? `${getTimeAgo(new Date(order.createdAt).getTime())} ago` : '-';
    return (
      <Paper elevation={1}>
        <Grid container spacing={16} alignItems="center" className={classes.root}>
          <Grid item xs={12}>
            <Grid container spacing={0} alignItems="center" justify="space-between">
              <Grid item>
                <Typography variant="h5" align="left">
                  {message}
                </Typography>
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.open}
                      onChange={this.handleChange}
                    />
                  }
                  labelPlacement="start"
                  label={this.state.open ? 'Advanced' : 'Basic'}
                />
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12}>
            {open === false && this.renderBasicInfo(usingSavedOrder)}
            {open === true && this.renderAdvancedInfo(usingSavedOrder)}
          </Grid>
          <Grid item xs={12}>
            <Typography align="right" variant="body2" style={{ marginTop: '5px' }}>
              Created <strong>{timeAgo}</strong>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}



export default withStyles(styles)(OrderInfo);