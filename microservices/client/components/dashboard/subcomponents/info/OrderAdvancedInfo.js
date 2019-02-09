import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Fade, Divider } from '@material-ui/core';
import { formatPrice } from '../../../common/utils/Format';

const animationTime = 1 * 1000;

export class OrderAdvancedInfo extends Component {

  static propTypes = {
    order: PropTypes.object.isRequired,
    coinPrice: PropTypes.number.isRequired
  }

  render() {
    const { order = {}} = this.props;
    const { hasBeenExecuted = false, events = { price: {} }, currentValues, hasDissapeared = false, type='' } = order;
    const primaryColor = type === 'buy' ? 'primary' : 'secondary';
    const color = hasDissapeared ? 'textSecondary' : primaryColor;
    return (
      <Fade in={!!(order.price > 0 && currentValues.position && events.price.whenCreated)} timeout={{ enter: animationTime }}>
        <React.Fragment>
          <Grid container spacing={16} justify="space-between">
            <Grid item xs={12}>
              <Typography variant="h6">
                Prices variation
              </Typography>
              <Divider />
            </Grid>
            <Grid item>
              <Typography align="left" variant="body1">
                AFTER 5MIN
                </Typography>
              <Typography align="left" variant="h4" color={color}>
                {events.price.afterCreated.five && events.price.afterCreated.five > 0 ? formatPrice(events.price.afterCreated.five) : ' - '}
                <span style={{ fontSize: '12px' }}>$</span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="left" variant="body1">
                AFTER 10MIN
              </Typography>
              <Typography align="left" variant="h4" color={color}>
                {events.price.afterCreated.five && events.price.afterCreated.five > 0 ? formatPrice(events.price.afterCreated.five) : ' - '}
                <span style={{ fontSize: '12px' }}>$</span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="left" variant="body1">
                AFTER 20MIN
              </Typography>
              <Typography align="left" variant="h4" color={color}>
                {events.price.afterCreated.five && events.price.afterCreated.five > 0 ? formatPrice(events.price.afterCreated.five) : ' - '}
                <span style={{ fontSize: '12px' }}>$</span>
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={16} justify="space-between">
            <Grid item xs={12}>
              <Typography variant="h6">
                More data
              </Typography>
              <Divider />
            </Grid>
            <Grid item>
              <Typography align="left" variant="body1">
                CREATED AT
                </Typography>
              <Typography align="left" variant="h4" color={color}>
                {events.price.whenCreated > 0 ? formatPrice(events.price.whenCreated): ' - '}
                <span style={{ fontSize: '12px' }}>$</span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="left" variant="body1">
                AT POSITION
              </Typography>
              <Typography align="left" variant="h4" color={color}>
                {currentValues.position !== undefined && currentValues.position}
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="left" variant="body1">
                EXECUTED
              </Typography>
              <Typography align="left" variant="h4" color={color}>
                {hasBeenExecuted === true ? 'Yes' : 'No'}
              </Typography>
            </Grid>
          </Grid>
        </React.Fragment>
      </Fade>
    );
  }
}

export default OrderAdvancedInfo;
