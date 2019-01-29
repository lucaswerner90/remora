import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import { getTimeAgo } from '../../common/utils/Time';


import { connect } from 'react-redux';
import {getUserFavoriteCoins, updateUserSelectedCoin } from '../../../redux/actions/userPreferencesActions';

const mapReduxStateToComponentProps = state => ({
  favorites: state.user.userPreferences.favorites
});

const POSITIVE_COLOR = 'rgba(76, 175, 80, 0.5)';
const NEGATIVE_COLOR = 'rgba(244, 67, 54, 0.5)';


const notificationTypes = {
  COIN: {
    NEW_ORDER: 'COIN_NEW_ORDER'
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
    height: '40vh',
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
    notifications: [
      {
        coin: {
          id: 'binance_ETHUSDT',
          name: 'Ethereum',
          against: 'USD',
          symbol: 'ETH',
          exchange: 'Binance'
        },
        type: notificationTypes.COIN.NEW_ORDER,
        isGood: true,
        info: {
          type: 'buy',
          price: 110,
          quantity: 150000,
          created: Date.now()
        }
      },
      {
        coin: {
          id: 'binance_BTCUSDT',
          name: 'Bitcoin',
          against: 'USD',
          symbol: 'BTC',
          exchange: 'Binance'
        },
        type: notificationTypes.COIN.NEW_ORDER,
        isGood: true,
        info: {
          type: 'buy',
          price: 4500,
          quantity: 300000,
          created: Date.now()
        }
      },
      {
        coin: {
          id: 'binance_ETHUSDT',
          name: 'Ethereum',
          against: 'USD',
          symbol: 'ETH',
          url: 'www.binance.com/en/trade/pro/ETH_USDT',
          exchange: 'Binance'
        },
        type: notificationTypes.COIN.NEW_ORDER,
        isGood: false,
        info: {
          type: 'sell',
          price: 150,
          quantity: 500000,
          created: Date.now()
        }
      },

    ],
  };
  componentWillMount() {
    this.props.getUserFavoriteCoins();
  }
  selectCoin = (coinID = '') => {
    this.props.updateUserSelectedCoin(coinID);
  }
  generateItems = (notifications = this.state.notifications) => {
    return notifications.map(notification => {
      const { coin, type, info, isGood } = notification;
      return (
        <ListItem key={Math.random()} onClick={() => this.selectCoin(coin.id)} dense button>
          <ListItemAvatar>
            <Avatar style={{backgroundColor: isGood ? POSITIVE_COLOR:NEGATIVE_COLOR}}>
              {type === notificationTypes.COIN.NEW_ORDER && info.type === 'buy' && <ThumbUpAltIcon />}
              {type === notificationTypes.COIN.NEW_ORDER && info.type === 'sell' && <ThumbDownAltIcon/>}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <React.Fragment>
                <Grid container alignItems="flex-end">
                  <Grid item xs={8}>
                    <Typography component="span" variant="body1" style={{fontWeight:500}}>
                      {type === notificationTypes.COIN.NEW_ORDER && info.type === 'buy' && 'New buy order'}
                      {type === notificationTypes.COIN.NEW_ORDER && info.type === 'sell' && 'New sell order'}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography component="span" align="right" style={{ fontSize: '0.625rem' }} variant="body2">
                      {`${getTimeAgo(info.created)}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography component="span" variant="body2">
                      {`${coin.name} (${coin.symbol}) - ${coin.against}`}
                    </Typography>
                  </Grid>
                </Grid>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <Typography component="span" color="textPrimary">
                  {coin.exchange}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>

      );
    });

  }

  render() {
    const { classes } = this.props;
    const { dense, notifications = [], pendingNotifications = this.state.notifications.length } = this.state;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Typography className={classes.padding} variant="h6">
            NOTIFICATIONS
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <List dense={dense} className={classes.list}>
            {this.generateItems(notifications)}
          </List>
        </Grid>
      </Grid>
    );
  }
}

NotificationsList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapReduxStateToComponentProps, { updateUserSelectedCoin, getUserFavoriteCoins })(withStyles(styles)(NotificationsList));