import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';

import { formatPrice } from '../../../common/utils/Format';

const timeParser = (notificationTime = Date.now()) => {
  const time = new Date(notificationTime);
  const parsedMinutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
  const parsedHours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
  return `${parsedHours}:${parsedMinutes}`;
}

function OrderNotification({notification,selectCoin}){
  const { coin, info } = notification;

  const parsedTime = timeParser(info.createdAt);
  const goodNews = info.type === 'buy';
  return (
    <ListItem key={Math.random()} onClick={() => selectCoin(coin.id)} dense button>
      <ListItemAvatar>
        <Avatar style={{ color: '#fff', background: 'transparent' }}>
          {info.type === 'buy' && <TrendingUpIcon color="primary" />}
          {info.type === 'sell' && <TrendingDownIcon color="secondary" />}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h5" color={goodNews ? 'primary' : 'secondary'}>
                {info.type === 'buy' && `Buy order`}
                {info.type === 'sell' && `Sell order`}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {parsedTime}
              </Typography>
            </Grid>
          </Grid>
        }
        secondary={
          <Grid container justify="flex-start" alignItems="center" spacing={24}>
            <Grid item>
              <Typography align="left" variant="body2">
                {coin.symbol} | <strong>{formatPrice(info.currentValues.quantity)}$</strong> at <strong>{formatPrice(info.price)}$</strong>
              </Typography>
            </Grid>
          </Grid>
        }
      />
    </ListItem>
  )
}
OrderNotification.propTypes = {
  notification: PropTypes.object.isRequired,
  selectCoin: PropTypes.func.isRequired
}
OrderNotification.defaultProps = {
  notification: {
    coin: {},
    type: '',
    info: {}
  },
  selectCoin: () => { }
}

export default OrderNotification;
