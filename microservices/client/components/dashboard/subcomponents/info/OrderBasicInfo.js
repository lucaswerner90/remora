import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { formatPriceToFixed } from '../../../common/utils/Format';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

export class OrderBasicInfo extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
    coinPrice: PropTypes.number.isRequired,
  }

  render() {
    const { order = {}, coinPrice = 0, disabled = false } = this.props;
    
    const { price = 0, currentValues = { position: '-', quantity: '-' }, initialValues = {quantity: '-', position:'-'} } = order;
    
    let margin = '-';

    if (price > 0) {
      margin = Math.round((Math.abs(price - coinPrice) / coinPrice) * 10000) / 100;
    }
    
    const color = 'primary';
    // const color = disabled ? 'textSecondary' : 'primary';

    return (
      <React.Fragment>
        <Grid container spacing={0} justify="space-between">
          <Grid item>
            <Typography align="left" variant="body1">
              PRICE
            </Typography>
            <Typography align="left" variant="h4" color={color}>
              {price > 0 ? formatPriceToFixed(parseFloat(price)) : '-'}
              <span style={{ fontSize: '12px' }}>$</span>
            </Typography>
          </Grid>
          <Grid item style={{ borderRight: '1px solid white' }}></Grid>
          <Grid item>
            <Typography align="left" variant="body1">
              QUANTITY
            </Typography>
            <Typography align="left" variant="h4" color={color}>
              {initialValues.quantity <= currentValues.quantity && <ArrowDropUpIcon color={color}/>}
              {initialValues.quantity > currentValues.quantity && <ArrowDropDownIcon color={color}/>}
              {!isNaN(currentValues.quantity) ? formatPriceToFixed(parseFloat(currentValues.quantity)) : currentValues.quantity}
              <span style={{ fontSize: '12px' }}>$</span>
              </Typography>
          </Grid>
          <Grid item style={{borderRight:'1px solid white'}}></Grid>
          <Grid item>
            <Typography align="left" variant="body1">
              MARGIN TO PRICE
            </Typography>
            <Typography align="left" variant="h4" color={color}>
              {margin}
              <span style={{ fontSize: '12px' }}>%</span>
            </Typography>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default OrderBasicInfo;
