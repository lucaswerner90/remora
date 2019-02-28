import React, { Component } from 'react';
import { Grid, Typography, Fade } from '@material-ui/core';
import { formatPrice } from '../../../common/utils/Format';

const animationTime = 2 * 1000;


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
  shouldComponentUpdate(nextProps){
    const { price, volumeDifference, priceChange, macdDifference } = this.props;
    return price !== nextProps.price
      || JSON.stringify(volumeDifference) !== JSON.stringify(nextProps.volumeDifference)
      || priceChange !== nextProps.priceChange
      || JSON.stringify(macdDifference) !== JSON.stringify(nextProps.macdDifference);
  }
  render() {
    const { volumeDifference = {difference: 0, mean:0, current: 0}, price, priceChange, macdDifference = { difference: 0, macd12: 0, macd26: 0 } } = this.props;
    return (
      <Grid container spacing={16} alignItems="center" alignContent="space-around">
        <Grid item xs={12} sm={12} md={4}>
          <Typography align="center" variant="body1">
            CURRENT / MEAN VOLUME
            </Typography>
          <Fade in={volumeDifference.mean > 0} timeout={{enter:animationTime}}>
            <React.Fragment>
              <Typography align="center" color={volumeDifference.difference >= 100 ? 'primary' : 'secondary'} variant="h3">
                {roundValue(volumeDifference.difference)}
                <span style={{ fontSize: '20px' }}>%</span>
              </Typography>
              <Typography align="center" variant="body2">
                {formatPrice(roundValue(volumeDifference.current/1000)) || 0}k / {formatPrice(roundValue(volumeDifference.mean/1000)) || 0}k
              </Typography>
            </React.Fragment>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Typography align="center" variant="body1">
            PRICE
          </Typography>
          <Fade in={price !== undefined} timeout={{ enter: animationTime }}>
            <React.Fragment>
              <Typography align="center" variant="h3">
                {formatPrice(price)}
                <span style={{ fontSize: '20px' }}>$</span>
              </Typography>
              <Typography align="center" variant="body1" color={priceChange >= 0 ? 'primary' : 'secondary'}>
                <span style={{ fontSize: '15px' }}>{priceChange > 0 ? '+':''}</span>
                {formatPrice(priceChange) || 0}
                <span style={{ fontSize: '15px' }}>%</span>
              </Typography>
            </React.Fragment>
          </Fade>
          
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Typography align="center" variant="body1">
            MOV. AVERAGE DIFFERENCE
          </Typography>
          <Fade in={macdDifference.difference !== undefined} timeout={{ enter: animationTime }}>
            <React.Fragment>
              <Typography align="center" variant="h3" color={macdDifference.difference >= 0 ? 'primary' : 'secondary'}>
                {roundValue(macdDifference.difference)}
                <span style={{ fontSize: '20px' }}>%</span>
              </Typography>
              <Typography align="center" variant="body2">
                MA 12: {formatPrice(roundValue(macdDifference.macd12)) || 0}$ / MA 26: {formatPrice(roundValue(macdDifference.macd26)) || 0}$
              </Typography>
            </React.Fragment>
          </Fade>
        </Grid>
      </Grid>
    );
  }
}

export default connect(mapReduxStateToComponentProps)(BasicInfo);
