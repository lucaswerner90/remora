import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Fade } from '@material-ui/core';
import { formatPrice } from '../../../common/utils/Format';

const animationTime = 1 * 1000;

export class OrderAdvancedInfo extends Component {

  static propTypes = {
    order: PropTypes.object.isRequired,
    coinPrice: PropTypes.number.isRequired
  }

  render() {
    const { order = {}} = this.props;
    const { hasBeenExecuted = false, events = { price: {} }, hasDissapeared = false } = order;
    const color = hasDissapeared ? 'textSecondary' : 'primary';
    return (
      <Fade in={order.price > 0} timeout={{ enter: animationTime }}>
        <Grid container spacing={0} justify="space-between">
          <Grid item>
            <Typography align="left" variant="body1">
              WHEN CREATED
              </Typography>
            <Typography align="left" variant="h4" color={color}>
              {events.price.whenCreated > 0 ? formatPrice(events.price.whenCreated): ' - '}
              <span style={{ fontSize: '12px' }}>$</span>
            </Typography>
          </Grid>
          <Grid item style={{ borderRight: '1px solid white' }}></Grid>
          <Grid item>
            <Typography align="left" variant="body1">
              AFTER 5MIN
            </Typography>
            <Typography align="left" variant="h4" color={color}>
              {events.price.afterCreated !== undefined && events.price.afterCreated.five > 0 ? formatPrice(events.price.afterCreated.five) : ' - '}
              <span style={{ fontSize: '12px' }}>$</span>
            </Typography>
          </Grid>
          <Grid item style={{ borderRight: '1px solid white' }}></Grid>
          <Grid item>
            <Typography align="left" variant="body1">
              EXECUTED
            </Typography>
            <Typography align="left" variant="h4" color={color}>
              {hasBeenExecuted === true ? 'Yes':'No'}
            </Typography>
          </Grid>
        </Grid>
      </Fade>
    );
  }
}

export default OrderAdvancedInfo;
