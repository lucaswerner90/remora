import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';

import io from 'socket.io-client';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { api } = publicRuntimeConfig;

import { connect } from 'react-redux';
import { updateUserSelectedCoin, updateUserNotifications} from '../../../redux/actions/userPreferencesActions';

const mapReduxStateToComponentProps = state => ({
  favorites: state.user.userPreferences.favorites,
  notifications: state.user.userPreferences.notifications
});

const notificationTypes = {
  COIN: {
    WHALE_ORDER: 'COIN_WHALE_ORDER'
  }
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: '100%',
  },
  warningColor:{
    color: theme.palette.sell,
  },
  list: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    height: '50vh',
    overflowY:'auto'
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
});


class NotificationsList extends React.Component {
  state = {
    dense: true,
    pendingNotifications: 0,
    secondary: true,
    notifications:[]
  };
  componentWillUnmount() {
    const currentCoins = this.props.favorites;
    for (let i = 0; i < currentCoins.length; i++) {
      this.socket.off(currentCoins[i]);
    }
  }
  componentDidMount() {
    this.socket = io(api, { forceNew: true });
    const currentCoins = this.props.favorites;
    for (let i = 0; i < currentCoins.length; i++) {
      this.socket.on(currentCoins[i], this.onSocketData);
    }
  }
  componentWillReceiveProps({ favorites = []}) {
    const currentCoins = this.props.favorites;
    const newCoins = favorites;
    if (currentCoins.length !== newCoins.length) {
      for (let i = 0; i < currentCoins.length; i++) {
        this.socket.off(currentCoins[i]);
      }
      for (let i = 0; i < newCoins.length; i++) {
        this.socket.on(newCoins[i], this.onSocketData);
      }
    }
    return true;
  }
  onSocketData = ({ info = {}, message = '' }) => {
    const { notifications = {} } = this.props;
    const { notifications: currentNotifications = [] } = this.state;
    switch (message) {
      case 'order':
        const { coin = {}, order = {}, type = '' } = info;
        if (type) {
          const { id: orderID } = order;
          const { id = '' } = coin;
          const notificationInfo = {
            coin,
            info: order,
            type: notificationTypes.COIN.WHALE_ORDER
          }
          if (!notifications[id]) {
            notifications[id] = {
              orders: {
                buy: {},
                sell: {}
              }
            };
          }
          if (orderID && currentNotifications.findIndex(notif => notif.info.id === orderID) === -1) {
            this.setState({
              ...this.state,
              notifications: [notificationInfo, ...currentNotifications].sort((a, b) =>
                new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime())
            });
            notifications[id]['orders'][type] = notificationInfo;
            this.newNotificationPlayAudio();
          }
          this.props.updateUserNotifications(notifications);
        }
        break;
      default:
        break;
    }
  }
  newNotificationPlayAudio = () =>{
    const audio = new Audio('/static/sounds/new_notification.mp3');
    audio.play();
  }

  selectCoin = (coinID = '') => {
    this.props.updateUserSelectedCoin(coinID);
  }
  generateItems = (notifications = []) => {
    return notifications.map(notification => {
      const { classes } = this.props;
      const { coin, type, info } = notification;
      const time = new Date(info.createdAt);
      const parsedMinutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
      const parsedHours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
      const parsedTime = `${parsedHours}:${parsedMinutes}`;
      const goodNews = notificationTypes.COIN.WHALE_ORDER && info.type === 'buy';
      return (
        <ListItem key={Math.random()} onClick={() => this.selectCoin(coin.id)} dense button>
          <ListItemAvatar>
            <Avatar style={{ color:'#fff', background: 'transparent'}}>
              {type === notificationTypes.COIN.WHALE_ORDER && info.type === 'buy' && <TrendingUpIcon color="primary" />}
              {type === notificationTypes.COIN.WHALE_ORDER && info.type === 'sell' && <TrendingDownIcon color="secondary"/>}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <React.Fragment>
                <Grid container alignItems="flex-end">
                  <Grid item xs={12}>
                    <Typography component="span" variant="h5" color={goodNews ? 'primary' : 'secondary'}>
                      {type === notificationTypes.COIN.WHALE_ORDER && info.type === 'buy' && `BUY ORDER`}
                      {type === notificationTypes.COIN.WHALE_ORDER && info.type === 'sell' && `SELL ORDER`}
                      <span style={{ fontSize: '12px', textAlign:'right' }}>  {parsedTime}  </span>
                    </Typography>
                  </Grid>
                </Grid>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <Typography component="span" variant="h6" color="textPrimary">
                  {coin.symbol} - <span style={{fontSize:'10px', textTransform:'uppercase'}}>{coin.exchange}</span>
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>

      );
    });

  }
  render() {
    const { classes, filter = '' } = this.props;
    const { notifications = [] } = this.state;
    const filteredNotifications = filter.length ? notifications.filter(notif => 
      notif.info.type.includes(filter) ||
      notif.coin.symbol.includes(filter)
    ) : notifications;
    return (
      <Grid container spacing={16} style={{ height: '40vh' }}>
        <Grid item xs={12}>
          <Typography className={classes.padding} variant="h6">
            NOTIFICATIONS
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper elevation={0}>
            <List dense className={classes.list}>
              {this.generateItems(filteredNotifications)}
            </List>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

NotificationsList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapReduxStateToComponentProps, { updateUserSelectedCoin, updateUserNotifications })(withStyles(styles)(NotificationsList));