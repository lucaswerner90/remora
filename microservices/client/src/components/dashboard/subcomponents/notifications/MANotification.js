import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SwapVertIcon from '@material-ui/icons/SwapVert';

import { connect } from 'react-redux';
import { hoverNotification } from '../../../../redux/actions/dashboardActions';
import { timeParser, intervalTime } from '../../../common/utils/Time';

const mapReduxStateToComponentProps = state => ({
  selected: state.user.userPreferences.selectedCoin
});
class MANotification extends React.Component {
  static propTypes = {
    notification: PropTypes.object.isRequired,
    selectCoin: PropTypes.func.isRequired
  }
  static defaultProps = {
    notification: {
      coin: {},
      type: '',
      info: {}
    },
    selectCoin: () => { }
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ time: Date.now() });
    }, intervalTime);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  handleMouseLeave = () => {
    const { hoverNotification } = this.props;
    hoverNotification({});
  }
  handleMouseEnter = () => {
    const { notification, hoverNotification, selected } = this.props;
    if (selected === notification.coin.id) {
      hoverNotification({ ...notification, good: notification.data.difference > 0, message: 'MACD' });
    }
  }
  render() {
    const { notification, selectCoin } = this.props;
    const { data = {}, createdAt = Date.now(), coin = { symbol: '' } } = notification;
    const { difference = 0 } = data;
    const time = timeParser(createdAt);
    const good = difference > 0;
    return (
      <ListItem key={Math.random()} onClick={() => selectCoin(coin.id)} dense button onMouseLeave={this.handleMouseLeave} onMouseEnter={this.handleMouseEnter}>
        <ListItemAvatar>
          <Avatar style={{ color: '#fff', background: 'transparent' }}>
            <SwapVertIcon color={good ? 'primary' : 'secondary'} style={{ width: 40, height: 40 }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h5" color={good ? 'primary' : 'secondary'}>
                  MACD direction
              </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  {time}
                </Typography>
              </Grid>
            </Grid>
          }
          secondary={
            <Grid container justify="flex-start" alignItems="center" spacing={24}>
              <Grid item>
                <Typography align="left" variant="body2">
                  {coin.symbol} | <strong>{difference > 0 ? 'POSITIVE' : 'NEGATIVE'}</strong>
              </Typography>
              </Grid>
            </Grid>
          }
        />
      </ListItem>
    );
  }
}

export default connect(mapReduxStateToComponentProps, { hoverNotification })(MANotification);
