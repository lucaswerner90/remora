import React, { Component } from 'react';
import { Grid, Typography, Fade } from '@material-ui/core';
import { formatPrice } from '../../../common/utils/Format';

const animationTime = 2 * 1000;


import { connect } from 'react-redux';

const mapReduxStateToComponentProps = state => ({
  volumeDifference: state.live.volumeDifference,
  price: state.live.price,
  priceChange: state.live.priceChange,
});

export class BasicInfo extends Component {
  render() {
    const { volumeDifference, price, priceChange } = this.props;
    return (
      <Grid container spacing={16} alignItems="center" alignContent="space-around">
        <Grid item xs={12} sm={12} md={4}>
          <Typography align="center" variant="body1">
            VOLUME COMPARISON
            </Typography>
          <Fade in={volumeDifference !== undefined} timeout={{enter:animationTime}}>
            <Typography align="center" color={volumeDifference >= 0 ? 'primary' : 'secondary'} variant="h3">
              {volumeDifference}
              <span style={{ fontSize: '20px' }}>%</span>
              </Typography>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Typography align="center" variant="body1">
            PRICE
            </Typography>
          <Fade in={price !== undefined} timeout={{ enter: animationTime }}>
            <Typography align="center" variant="h3">
              {formatPrice(price)}
              <span style={{ fontSize: '20px' }}>$</span>
            </Typography>
          </Fade>
          
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Typography align="center" variant="body1">
            PRICE 24HR
          </Typography>
          <Fade in={priceChange !== undefined} timeout={{ enter: animationTime }}>
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

export default connect(mapReduxStateToComponentProps)(BasicInfo);
