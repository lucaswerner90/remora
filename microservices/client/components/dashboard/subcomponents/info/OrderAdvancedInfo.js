import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { formatPrice } from '../../../common/utils/Format';


export class OrderAdvancedInfo extends Component {

  static propTypes = {
    order: PropTypes.object.isRequired,
    coinPrice: PropTypes.number.isRequired
  }

  render() {
    const { order = {}, disabled = false} = this.props;

    const { hasBeenExecuted = false, events = { price: {} } } = order;
    
    return (
      <Grid container spacing={0} justify="space-between">
        <Grid item>
          <Typography align="left" variant="body1">
            PRICE WHEN CREATED
            </Typography>
          <Typography align="left" variant="h4" color="primary">
            {events.price.whenCreated > 0 ? formatPrice(events.price.whenCreated): '-'}
            <span style={{ fontSize: '12px' }}>$</span>
          </Typography>
        </Grid>
        <Grid item style={{ borderRight: '1px solid white' }}></Grid>
        <Grid item>
          <Typography align="left" variant="body1">
            PRICE AFTER 5MIN
          </Typography>
          <Typography align="left" variant="h4" color="primary">
            {events.price.afterCreated !== undefined && formatPrice(events.price.afterCreated.five)}
            {events.price.afterCreated === undefined && '-'}
            <span style={{ fontSize: '12px' }}>$</span>
          </Typography>
        </Grid>
        <Grid item style={{ borderRight: '1px solid white' }}></Grid>
        <Grid item>
          <Typography align="left" variant="body1">
            EXECUTED
          </Typography>
          <Typography align="left" variant="h4" color="primary">
            {hasBeenExecuted === true ? 'Yes':'No'}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default OrderAdvancedInfo;
