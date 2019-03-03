import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { connect } from 'react-redux';
import { updateUserSelectedCoin, updateUserNotifications} from '../../../redux/actions/userPreferencesActions';
import OrderNotification from './notifications/OrderNotification';
import coinSocket from '../../common/socket/CoinSocket';
import { getLastNotifications } from '../../common/utils/FetchCoinData';
import VolumeNotification from './notifications/VolumeNotification';
import MANotification from './notifications/MANotification';
import PriceDifferenceNotification from './notifications/PriceDifferenceNotification';

const mapReduxStateToComponentProps = state => ({
  selected: state.user.userPreferences.selectedCoin,
  favorites: state.user.userPreferences.favorites,
  notifications: state.user.userPreferences.notifications
});
const sortNotifications = (a,b) => {
  if(a.createdAt > b.createdAt){
    return -1;
  }
  if (a.createdAt < b.createdAt) {
    return 1;
  }
  return 0;
}
const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: '100%',
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
    notifications: [],
    onlySelected: true,
  };
  handleShowOnlySelected = (e, onlySelected) => {
    this.setState({ ...this.state, onlySelected });
  }
  componentWillUnmount() {
    const currentCoins = this.props.favorites;
    for (let i = 0; i < currentCoins.length; i++) {
      coinSocket.closeSpecificConnection(currentCoins[i], 'notifications');
    }
  }
  componentDidMount() {
    const currentCoins = this.props.favorites;
    for (let i = 0; i < currentCoins.length; i++) {
      coinSocket.openSpecificConnection(currentCoins[i], 'notifications', this.onSocketData);
    }
    this.loadInitialNotifications(currentCoins);
  }
  loadInitialNotifications = async(coins = []) => {
    const notifArray = []
    for (let i = 0; i < coins.length; i++) {
      notifArray.push(getLastNotifications(coins[i]));
    }
    const notifications = await Promise.all(notifArray);

    let finalNotifications = [];
    for (let i = 0; i < notifications.length; i++) {
      const coinNotifications = notifications[i];
      for (let j = 0; j < coinNotifications.length; j++) {
        finalNotifications.push(JSON.parse(coinNotifications[j]));
      }
    }
    finalNotifications = finalNotifications.sort(sortNotifications);
    this.setState({ ...this.state, notifications: finalNotifications.sort(sortNotifications) });
  }
  componentWillReceiveProps({ favorites = []}) {
    const currentCoins = this.props.favorites;
    const newCoins = favorites;
    if (currentCoins.length !== newCoins.length) {
      this.loadInitialNotifications(newCoins);
      for (let i = 0; i < currentCoins.length; i++) {
        coinSocket.closeSpecificConnection(currentCoins[i], 'notifications');
      }
      for (let i = 0; i < newCoins.length; i++) {
        coinSocket.openSpecificConnection(currentCoins[i],'notifications', this.onSocketData);
      }
    }
    return true;
  }
  onSocketData = ({ info = {} }) => {
    const { notifications } = this.state;
    notifications.pop();
    this.setState({ ...this.state, notifications: [info, ...notifications] });
  }
  selectCoin = (coinID = '') => {
    const { selected } = this.props;
    if (selected !== coinID) {
      this.props.updateUserSelectedCoin(coinID);
    } 
  }
  generateItems = (notifications = []) => {
    return notifications.map((notification,i) => {
      const { type } = notification;
      if (type === 'order') {
        return <OrderNotification key={i} notification={notification} selectCoin={this.selectCoin}/>
      } else if (type === 'volume') {
        return <VolumeNotification key={i} notification={notification} selectCoin={this.selectCoin}/>
      } else if (type === 'macd') {
        return <MANotification key={i} notification={notification} selectCoin={this.selectCoin}/>
      } else if (type === 'price_difference') {
        return <PriceDifferenceNotification key={i} notification={notification} selectCoin={this.selectCoin}/>
      }
      return null;
    });

  }
  render() {
    const { classes, filter = '', selected } = this.props;
    const { notifications = [], onlySelected = false } = this.state;
    let filteredNotifications = notifications;
    if (onlySelected) {
      filteredNotifications = filteredNotifications.filter(notification => notification.coin.id === selected);
    }
    if (filter.length) {
      filteredNotifications = filteredNotifications.filter(notif =>
        notif.type.toLowerCase().includes(filter.toLowerCase()) ||
        notif.coin.symbol.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return (
      <Grid container spacing={16} style={{ height: '40vh' }} alignItems="center" justify="space-between">
        <Grid item>
          <Typography className={classes.padding} variant="h6">
            NOTIFICATIONS
          </Typography>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={onlySelected}
                onChange={this.handleShowOnlySelected}
              />
            }
            labelPlacement="start"
            label={onlySelected ? 'Selected' : 'Favorites'}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} md={12}>
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