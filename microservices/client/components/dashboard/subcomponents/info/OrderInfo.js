import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { getTimeAgo } from '../../../../components/common/utils/Time';
import OrderBasicInfo from './OrderBasicInfo';
import LensIcon from '@material-ui/icons/LensRounded';
import { Typography, Paper } from '@material-ui/core';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

class OrderInfo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
    message: PropTypes.string.isRequired,
    coinPrice: PropTypes.number.isRequired
  };

  state = {
    open: false,
    order: {
      price: 0,
      createdAt: Date.now(),
      currentValues: {
        quantity: 0,
        position: 0
      },
      initialValues: {
        quantity: 0,
        position: 0
      },

    },
  };

  componentWillReceiveProps(nextProps) {
    const currentOrder = this.props.order;
    const nextOrder = nextProps.order;

    if (currentOrder.price !== nextOrder.price) {
      this.setState({ ...this.state, order: currentOrder });
      this.playAudioNotification();
    }
  }
  playAudioNotification = () => {
    try {
      const audio = new Audio('/static/sounds/activate_order.mp3');
      audio.play();
    } catch (error) {
      console.log(error);
    }
  }

  handleChange = (event, open) => {
    this.setState({ open });
  };
  renderBasicInfo = (order) => {
    const { coinPrice } = this.props;
    return (
      <OrderBasicInfo order={order} coinPrice={parseFloat(coinPrice)} />
    );
  }
  render() {
    const { classes, message = '', order:currentOrder = {}, previous = {}} = this.props;
    const usingSavedOrder = currentOrder.price === undefined;
    const order = usingSavedOrder ? previous : currentOrder;
    let timeAgo = order.createdAt ? `${getTimeAgo(new Date(order.createdAt).getTime())} ago` : ' - ';
    return (
      <Paper elevation={1}>
        <Grid container spacing={16} alignItems="center" className={classes.root}>
          <Grid item xs={12} sm={12} md={12}>
            <Grid container spacing={0} alignItems="center" justify="space-between">
              <Grid item>
                <Typography variant="h5" align="left">
                  {message}
                  {!usingSavedOrder && <LensIcon  style={{fontSize:'8px', marginLeft:'5px', marginTop:'2px'}} color={order.type === 'buy' ? 'primary':'secondary'}/>}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} sm={12} md={12}>
            {this.renderBasicInfo(order)}
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Typography align="right" variant="body2" style={{ marginTop: '5px' }}>
              {timeAgo}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}



export default withStyles(styles)(OrderInfo);