import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Fade } from '@material-ui/core';
import { formatPriceToFixed, formatPriceToFixed0 } from '../../../common/utils/Format';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  warningColor: {
    color: theme.palette.sell,
  }
});
const animationTime = 1 * 1000;

export class OrderBasicInfo extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
    coinPrice: PropTypes.number.isRequired,
  }

  render() {
    const { order = {}, coinPrice = 0 } = this.props;
    
    const { price = 0, currentValues = { position: ' - ', quantity: ' - ' }, hasDissapeared = false} = order;
    
    let margin = ' - ';

    if (price !== Infinity && price > 0) {
      margin = Math.round((Math.abs(price - coinPrice) / coinPrice) * 10000) / 100;
    }
    
    // const color = 'primary';
    const color = hasDissapeared ? 'textSecondary' : 'primary';
    
    return (
        <Fade in={margin !== ' - ' && margin !== Infinity} timeout={{ enter: animationTime}}>  
          <Grid container spacing={0} justify="space-around">
            <Grid item>
              <Typography align="left" variant="body1">
                PRICE
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
                QUANTITY
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
  }
}

export default withStyles(styles)(OrderBasicInfo);
