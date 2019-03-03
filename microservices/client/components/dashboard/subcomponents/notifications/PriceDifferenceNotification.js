import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TimelineIcon from '@material-ui/icons/Timeline';

const timeParser = (notificationTime = Date.now()) => {
  const time = new Date(notificationTime);
  const parsedMinutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
  const parsedHours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
  return `${parsedHours}:${parsedMinutes}`;
}

function PriceDifferenceNotification({ notification, selectCoin }) {
  const { data = 0, createdAt = Date.now(), coin = { symbol: '' } } = notification;
  const parsedTime = timeParser(createdAt);
  const good = data > 0;
  return (
    <ListItem key={Math.random()} onClick={() => selectCoin(coin.id)} dense button>
      <ListItemAvatar>
        <Avatar style={{ color: '#fff', background: 'transparent' }}>
          <TimelineIcon color={good ? 'primary':'secondary'} style={{ width: 40, height: 40 }}/>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h5" component="p" color={good ? 'primary' : 'secondary'}>
                Price anomaly
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
              <Typography align="left" component="p" variant="body2">
                {coin.symbol} | <strong>{data > 0 ? '+' : ''}{data}</strong>%
              </Typography>
            </Grid>
          </Grid>
        }
      />
    </ListItem>
  )
}
PriceDifferenceNotification.propTypes = {
  notification: PropTypes.object.isRequired,
  selectCoin: PropTypes.func.isRequired
}
PriceDifferenceNotification.defaultProps = {
  notification: {
    coin: {},
    type: '',
    info: {}
  },
  selectCoin: () => { }
}

export default PriceDifferenceNotification;
