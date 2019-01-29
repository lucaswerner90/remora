import React, { Component } from 'react'
import { Grid, Typography } from '@material-ui/core';
import { getTimeAgo } from '../../../common/utils/Time';
export class OrderInfo extends Component {
  render() {
    const { order = {}, coinPrice = 0 } = this.props;
    const { price = '-', createdAt = Date.now(), currentValues = { position: '-', quantity: '-' } } = order;
    let margin = '-';
    const timeAgo = getTimeAgo(new Date(createdAt).getTime());
    if (!isNaN(price) && coinPrice > 0) {
      margin = Math.round((Math.abs(price - coinPrice) / coinPrice) * 10000) / 100;
      return (
        <React.Fragment>
          <Grid item xs={2}>
            <Typography color="primary" align="center" variant="body2">
              PRICE
            </Typography>
            <Typography color="primary" align="center" variant="h5">
              {price}$
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography color="primary" align="center" variant="body2">
              QUANTITY
            </Typography>
            <Typography color="primary" align="center" variant="h5">
              {currentValues.quantity}$
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography color="primary" align="center" variant="body2">
              MARGIN TO PRICE
            </Typography>
            <Typography color="primary" align="center" variant="h5">
              {margin}%
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography color="primary" align="center" variant="body2">
              CREATED
            </Typography>
            <Typography color="primary" align="center" variant="h5">
              {timeAgo} ago
            </Typography>
          </Grid>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

export default OrderInfo;
