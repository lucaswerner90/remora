import React, { Component } from 'react';
import { Grid, Typography, Fade } from '@material-ui/core';
import { formatPrice } from '../../../common/utils/Format';

const animationTime = 2 * 1000;


export class BasicInfo extends Component {
  shouldComponentUpdate() {
    const { volumeDifference = 0, price = 0, priceChange = 0 } = this.props;
    return volumeDifference !== 0 && price !== 0 && priceChange !== 0;
  }
  render() {
    const { volumeDifference = 0, price = 0, priceChange = 0 } = this.props;
    return (
      <Grid container spacing={16} alignItems="center" alignContent="space-around">
        <Grid item xs={4}>
          <Typography align="center" variant="body1">
            VOLUME DIFFERENCE
            </Typography>
          <Fade in={volumeDifference!==0} timeout={{enter:animationTime}}>
            <Typography align="center" color={volumeDifference >= 0 ? 'primary' : 'secondary'} variant="h3">
              {volumeDifference}
              <span style={{ fontSize: '20px' }}>%</span>
              </Typography>
          </Fade>
        </Grid>
        <Grid item xs={4}>
          <Typography align="center" variant="body1">
            PRICE
            </Typography>
          <Fade in={price !== 0} timeout={{ enter: animationTime }}>
            <Typography align="center" variant="h3">
              {formatPrice(price)}
              <span style={{ fontSize: '20px' }}>$</span>
            </Typography>
          </Fade>
          
        </Grid>
        <Grid item xs={4}>
          <Typography align="center" variant="body1">
            PRICE 24HR
          </Typography>
          <Fade in={priceChange !== 0} timeout={{ enter: animationTime }}>
            <Typography align="center" variant="h3" color={priceChange >= 0 ? 'primary' : 'secondary'}>
              {priceChange}
              <span style={{ fontSize: '20px' }}>%</span>
            </Typography>
          </Fade>
        </Grid>
      </Grid>
    );
  }
}

export default BasicInfo;
