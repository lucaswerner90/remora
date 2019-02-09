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
  renderBasicInfo = (order) => {
    const { coinPrice } = this.props;
    return (
      <OrderBasicInfo order={order} coinPrice={coinPrice} />
    );
  }
  renderAdvancedInfo = (order) => {
    const { coinPrice } = this.props;
    return (
      <OrderAdvancedInfo order={order} coinPrice={coinPrice} />
    );
  }
  render() {
    const { classes, message = '', order:currentOrder = {}, previous = {}} = this.props;
    const { open = false } = this.state;
    const usingSavedOrder = currentOrder.price === undefined;
    const order = usingSavedOrder ? previous : currentOrder;
    let timeAgo = order.createdAt ? `${getTimeAgo(new Date(order.createdAt).getTime())} ago` : ' - ';
    return (
      <Paper elevation={1}>
        <Grid container spacing={16} alignItems="center" className={classes.root}>
          <Grid item xs={12}>
            <Grid container spacing={0} alignItems="center" justify="space-between">
              <Grid item>
                <Typography variant="h5" align="left">
                  {message}
                  <span style={{ fontSize: '10px', color: usingSavedOrder ? 'darkgray' : 'greenyellow' }}>{`    ${usingSavedOrder ? 'INACTIVE' : 'ACTIVE'}`}</span>
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
            {open === false && this.renderBasicInfo(order)}
            {open === true && this.renderAdvancedInfo(order)}
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