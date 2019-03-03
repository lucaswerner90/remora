import React, { Component } from 'react';
import { Grid, Typography, Fade } from '@material-ui/core';
import { formatPrice } from '../../../common/utils/Format';

const animationTime = 2 * 1000;
const INITIAL_VALUE = '...';

import { connect } from 'react-redux';

const mapReduxStateToComponentProps = state => ({
  volumeDifference: state.live.volumeDifference,
  price: state.live.price,
  priceChange: state.live.priceChange,
  macdDifference: state.live.macdDifference,
});
const roundValue = (value) => {
  return Math.round(value * 100) / 100;
}
export class BasicInfo extends Component {
  render() {
    const { volumeDifference = { difference: INITIAL_VALUE, mean: INITIAL_VALUE, current: INITIAL_VALUE }, price = INITIAL_VALUE, priceChange = INITIAL_VALUE, macdDifference = { difference: INITIAL_VALUE, ma12: INITIAL_VALUE, ma26: INITIAL_VALUE } } = this.props;
    return (
      <Grid container spacing={16} alignItems="center" alignContent="space-around">
        <Grid item xs={12} sm={12} md={4}>
          <Typography align="center" variant="body1">
            CURRENT / MEAN VOLUME
            </Typography>
          <Fade in={volumeDifference.mean !== INITIAL_VALUE} timeout={{enter:animationTime}}>
            <React.Fragment>
              <Typography align="center" color={volumeDifference.difference >= 0 ? 'primary' : 'secondary'} variant="h3">
                {!isNaN(volumeDifference.difference) ? roundValue(volumeDifference.difference) : INITIAL_VALUE}
                <span style={{ fontSize: '20px' }}>%</span>
              </Typography>
              <Typography align="center" variant="body2">
                {volumeDifference.current !== INITIAL_VALUE ? formatPrice(roundValue(volumeDifference.current / 1000)) : INITIAL_VALUE} / {volumeDifference.mean !== INITIAL_VALUE ? formatPrice(roundValue(volumeDifference.mean / 1000)) : INITIAL_VALUE} (K)
              </Typography>
            </React.Fragment>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Typography align="center" variant="body1">
            PRICE
          </Typography>
          <Fade in={price !== INITIAL_VALUE} timeout={{ enter: animationTime, exit: animationTime }}>
            <React.Fragment>
              <Typography align="center" variant="h3">
                {price !== INITIAL_VALUE ? formatPrice(price): '...'}
                <span style={{ fontSize: '20px' }}>$</span>
              </Typography>
              <Typography align="center" variant="body1" color={priceChange >= 0 ? 'primary' : 'secondary'}>
                <span style={{ fontSize: '15px' }}>{priceChange > 0 ? '+':''}</span>
                {priceChange !== INITIAL_VALUE ? formatPrice(priceChange) : INITIAL_VALUE}
                <span style={{ fontSize: '15px' }}>%</span>
              </Typography>
            </React.Fragment>
          </Fade>
          
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Typography align="center" variant="body1">
            MACD
          </Typography>
          <Fade in={macdDifference.difference !== INITIAL_VALUE} timeout={{ enter: animationTime }}>
            <React.Fragment>
              <Typography align="center" variant="h3" color={macdDifference.difference >= 0 ? 'primary' : 'secondary'}>
                {!isNaN(macdDifference.difference) ? roundValue(macdDifference.difference) : macdDifference.difference}
                <span style={{ fontSize: '20px' }}>%</span>
              </Typography>
              <Typography align="center" variant="body2">
                MA 12: {!isNaN(macdDifference.ma12) ? roundValue(macdDifference.ma12) : 0}$ / MA 26: {!isNaN(macdDifference.ma26) ? roundValue(macdDifference.ma26) : 0}$
              </Typography>
            </React.Fragment>
          </Fade>
        </Grid>
      </Grid>
    );
  }
}

export default connect(mapReduxStateToComponentProps)(BasicInfo);
