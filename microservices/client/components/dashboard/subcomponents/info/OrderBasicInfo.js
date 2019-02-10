import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Fade, Paper } from '@material-ui/core';
import { formatPriceToFixed, formatPriceToFixed0 } from '../../../common/utils/Format';


import { connect } from 'react-redux';
const mapReduxStateToComponentProps = state => ({
  coinPrice: state.live.price,
  loadingData: state.live.loading,
});

const animationTime = 2 * 1000;

const fakeDivsStyle = {
  backgroundColor: '#3ca5c4',
  background: 'linear-gradient(to right, #757f9a, #d7dde8);',
  height: '4px',
  margin: '8px',
  // Selects every two elements among any group of siblings.
  '&:nthChild(2n)': {
    marginRight: '16px',
  },
};
const fakeDivs = <div style={fakeDivsStyle} />;

export class OrderBasicInfo extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
    coinPrice: PropTypes.number.isRequired,
  }

  render() {
    const { order = {}, coinPrice = 0, loadingData } = this.props;
    console.log(loadingData);
    const { price = 0, currentValues = { position: ' - ', quantity: ' - ' }, hasDissapeared = false, type = 'buy'} = order;
    let margin = ' - ';

    if (parseFloat(price) > 0 && coinPrice > 0) {
      margin = Math.round((Math.abs(parseFloat(price) - coinPrice) / coinPrice) * 10000) / 100;
    }
    const primaryColor = type === 'buy' ? 'primary' : 'secondary';
    const color = hasDissapeared ? 'textSecondary' : primaryColor;
    if (!isNaN(margin)) {
      return (
          <Fade in={!isNaN(margin)} timeout={{ enter: animationTime}}>  
            <Grid container spacing={0} justify="space-around">
              <Grid item>
                <Typography align="left" variant="body1">
                  AT PRICE
                </Typography>
                <Fade in={price > 0} timeout={{ enter: animationTime }}>
                  <Typography align="left" variant="h4" color={color}>
                    {price > 0 ? formatPriceToFixed(parseFloat(price)) : ' - '}
                    <span style={{ fontSize: '12px' }}>$</span>
                  </Typography>
                </Fade>
              </Grid>
              <Grid item style={{ width: '1px', borderRight: '1px solid white' }}></Grid>
              <Grid item>
                <Typography align="left" variant="body1">
                  VALUE
                </Typography>
                <Fade in={!isNaN(currentValues.quantity)} timeout={{ enter: animationTime }}>
                  <Typography align="left" variant="h4" color={color}>
                    {!isNaN(currentValues.quantity) ? formatPriceToFixed0(parseFloat(currentValues.quantity)) : currentValues.quantity}
                    <span style={{ fontSize: '12px' }}>$</span>
                  </Typography>
                </Fade>
              </Grid>
              <Grid item style={{width:'1px',borderRight:'1px solid white'}}></Grid>
              <Grid item>
                <Typography align="left" variant="body1">
                  MARGIN
                </Typography>
                <Fade in={margin !== ' - '} timeout={{ enter: animationTime }}>
                  <Typography align="left" variant="h4" color={color}>
                    {margin}
                    <span style={{ fontSize: '12px' }}>%</span>
                  </Typography>
                </Fade>
              </Grid>
            </Grid>
          </Fade>
      );
    }else{
      return null;
    }
  }
}

export default connect(mapReduxStateToComponentProps)(OrderBasicInfo);
