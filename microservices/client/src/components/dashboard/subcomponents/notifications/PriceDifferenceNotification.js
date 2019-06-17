import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TimelineIcon from '@material-ui/icons/Timeline';

import { connect } from 'react-redux';
import { hoverNotification } from '../../../../redux/actions/dashboardActions';
import { timeParser, intervalTime } from '../../../common/utils/Time';

const mapReduxStateToComponentProps = state => ({
  selected: state.user.userPreferences.selectedCoin
});

class PriceDifferenceNotification extends React.Component {
  state = {
    time: Date.now()
  }
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
      hoverNotification({ ...notification, good: notification.data > 0, message: 'Price' });
    }
  }
  render() {
    const { notification, selectCoin } = this.props;
    const { data = 0, createdAt = Date.now(), coin = { symbol: '' } } = notification;
    const parsedTime = timeParser(createdAt);
    const good = data > 0;
    const time = timeParser(createdAt);
    return (
      <ListItem key={Math.random()} onClick={() => selectCoin(coin.id)} dense button onMouseLeave={this.handleMouseLeave} onMouseEnter={this.handleMouseEnter}>
        <ListItemAvatar>
          <Avatar style={{ color: '#fff', background: 'transparent' }}>
            <TimelineIcon color={good ? 'primary' : 'secondary'} style={{ width: 40, height: 40 }} />
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
                  {time}
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
}

export default connect(mapReduxStateToComponentProps, { hoverNotification })(PriceDifferenceNotification);