import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { getTimeAgo } from '../../../common/utils/Time';
import { formatPrice } from '../../../common/utils/Format';


export class OrderBasicInfo extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
    coinPrice: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
  }

  render() {
    const { order = {}, coinPrice = 0, message = '' } = this.props;
    
    const { price = '-', createdAt = 0, currentValues = { position: '-', quantity: '-' }, events = { price: {} } } = order;
    
    let margin = '-';
    let timeAgo = createdAt ? getTimeAgo(new Date(createdAt).getTime()) : '-';

    if (!isNaN(price)) {
      margin = Math.round((Math.abs(price - coinPrice) / coinPrice) * 10000) / 100;
    }

    return (
      <Grid container spacing={40} alignItems="center">
        <Grid item xs={3} style={{ borderRight: '1px solid white' }}>
          <Typography align="left" variant="h6">
            {message}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography align="center" variant="body2">
            Price
          </Typography>
          <Typography align="center" variant="h5">
            {!isNaN(price) ? formatPrice(parseFloat(price)) : price}$
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography align="center" variant="body2">
            Quantity
          </Typography>
          <Typography align="center" variant="h5">
            {!isNaN(currentValues.quantity) ? formatPrice(parseFloat(currentValues.quantity)) : currentValues.quantity}$
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography align="center" variant="body2">
            Margin to price
          </Typography>
          <Typography align="center" variant="h5">
            {margin}%
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography align="center" variant="body2">
            Created
          </Typography>
          <Typography align="center" variant="h5">
            {timeAgo}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default OrderBasicInfo;
