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
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import { getTimeAgo } from '../../common/utils/Time';


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

const POSITIVE_COLOR = 'rgba(76, 175, 80, 0.5)';
const NEGATIVE_COLOR = 'rgba(244, 67, 54, 0.5)';


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
  list: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    height: '30vh',
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
          }
          this.props.updateUserNotifications(notifications);
        }
        break;
      default:
        break;
    }
  }
  selectCoin = (coinID = '') => {
    this.props.updateUserSelectedCoin(coinID);
  }
  generateItems = (notifications = []) => {
    return notifications.map(notification => {
      const { coin, type, info } = notification;
      const time = new Date(info.createdAt);
      const parsedMinutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
      const parsedHours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
      const parsedTime = `${parsedHours}:${parsedMinutes}`;
      const goodNews = notificationTypes.COIN.WHALE_ORDER && info.type === 'buy';
      return (
        <ListItem key={Math.random()} onClick={() => this.selectCoin(coin.id)} dense button>
          <ListItemAvatar>
            <Avatar style={{ color:'#fff', background: goodNews ? POSITIVE_COLOR : NEGATIVE_COLOR}}>
              {type === notificationTypes.COIN.WHALE_ORDER && info.type === 'buy' && <ThumbUpAltIcon />}
              {type === notificationTypes.COIN.WHALE_ORDER && info.type === 'sell' && <ThumbDownAltIcon/>}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <React.Fragment>
                <Grid container alignItems="flex-end">
                  <Grid item xs={8}>
                    <Typography component="span" variant="body1" style={{fontWeight:500}}>
                      {type === notificationTypes.COIN.WHALE_ORDER && info.type === 'buy' && 'New buy order'}
                      {type === notificationTypes.COIN.WHALE_ORDER && info.type === 'sell' && 'New sell order'}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography component="span" align="right" style={{ fontSize: '0.625rem' }} variant="body2">
                      {parsedTime}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography component="span" variant="body2">
                      {`${coin.symbol}`}
                    </Typography>
                  </Grid>
                </Grid>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <Typography component="span" color="textPrimary">
                  {coin.exchange.toUpperCase()}
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
    if (filteredNotifications.length) {
      return (
        <Grid container spacing={32}>
          <Grid item xs={12}>
          <Typography className={classes.padding} variant="h6">
            NOTIFICATIONS
          </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper elevation={0}>
              <List dense className={classes.list}>
                {this.generateItems(notifications)}
              </List>
            </Paper>
            </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={32}>
          <Grid item xs={12}>
            <Typography className={classes.padding} variant="h6">
              NOTIFICATIONS
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper elevation={0} style={{height: '30vh'}}>
              <Typography align="center" variant="body2">Nothing in sight for now captain...</Typography>
            </Paper>
          </Grid>
        </Grid>
      );
    }
  }
}

NotificationsList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapReduxStateToComponentProps, { updateUserSelectedCoin, updateUserNotifications })(withStyles(styles)(NotificationsList));