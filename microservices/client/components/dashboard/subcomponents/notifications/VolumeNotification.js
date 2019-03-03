import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SignalCellularConnectedNoInternet3BarIcon from '@material-ui/icons/SignalCellularConnectedNoInternet3Bar';


const timeParser = (notificationTime = Date.now()) => {
  const time = new Date(notificationTime);
  const parsedMinutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
  const parsedHours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
  return `${parsedHours}:${parsedMinutes}`;
}

function VolumeNotification({ notification, selectCoin }) {
  const { data = {}, createdAt = Date.now(), coin = {symbol:''} } = notification;
  const { difference = 0 } = data;
  const parsedTime = timeParser(createdAt);
  return (
    <ListItem key={Math.random()} onClick={() => selectCoin(coin.id)} dense button>
      <ListItemAvatar>
        <Avatar style={{ color: '#fff',background: 'transparent' }}>
          <SignalCellularConnectedNoInternet3BarIcon color="primary" style={{ width: 30, height: 30}}/>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h5" color='primary'>
                Volume anomaly
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
                {coin.symbol} | <strong>+{Math.round(difference)}</strong>%
              </Typography>
            </Grid>
          </Grid>
        }
      />
    </ListItem>
  )
}
VolumeNotification.propTypes = {
  notification: PropTypes.object.isRequired,
  selectCoin: PropTypes.func.isRequired
}
VolumeNotification.defaultProps = {
  notification: {
    coin: {},
    type: '',
    info: {}
  },
  selectCoin: () => { }
}

export default VolumeNotification;
