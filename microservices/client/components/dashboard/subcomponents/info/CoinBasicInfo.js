import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { red, lightGreen } from '@material-ui/core/colors';
import { formatPrice } from '../../../common/utils/Format';


export class BasicInfo extends Component {
  render() {
    const { volumeDifference = 0, price = 0, priceChange = 0 } = this.props;
    return (
      <Grid container spacing={40} alignItems="center" alignContent="space-around">
        <Grid item xs={4}>
          <Typography align="center" variant="body1">
            VOLUME DIFFERENCE
            </Typography>
          <Typography align="center" color="primary" variant="h3">
            {volumeDifference}
            <span style={{ fontSize: '20px' }}>%</span>
            </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography align="center" variant="body1">
            PRICE
            </Typography>
          <Typography align="center" variant="h3">
            {formatPrice(price)}
            <span style={{fontSize:'20px'}}>$</span>
            </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography align="center" variant="body1">
            PRICE 24HR
          </Typography>
          <Typography align="center" variant="h3" color="primary">
            {priceChange}
            <span style={{fontSize:'20px'}}>%</span>
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default BasicInfo;
