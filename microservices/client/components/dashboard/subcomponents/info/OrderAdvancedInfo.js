import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { formatPrice } from '../../../common/utils/Format';


export class OrderAdvancedInfo extends Component {

  static propTypes = {
    order: PropTypes.object.isRequired,
    coinPrice: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
  }

  render() {
    const { order = {}, message = '' } = this.props;

    const { hasBeenExecuted = false, events = { price: {} } } = order;
    
    return (
      <Grid container spacing={40} alignItems="center">
        <Grid item xs={3} style={{ borderRight: '1px solid white' }}>
          <Typography align="left" variant="h6">
            {message}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography align="center" variant="body2">
            When created
          </Typography>
          <Typography align="center" variant="h5">
            {formatPrice(events.price.whenCreated)}$
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography align="center" variant="body2">
            Executed
          </Typography>
          <Typography align="center" variant="h5">
            {hasBeenExecuted ? 'Yes' : 'No'}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default OrderAdvancedInfo;
