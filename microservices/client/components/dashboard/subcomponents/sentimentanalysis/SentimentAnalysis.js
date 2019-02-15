import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import coinSocket from '../../../common/socket/CoinSocket';
import { getTweets } from '../../../common/utils/FetchCoinData';


import { Typography, Paper, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@material-ui/core';
import {connect} from 'react-redux';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  inline:{
    display:'inline'
  },
  list: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    height: '30vh',
    overflowY: 'auto'
  },
});

const mapReduxStateToComponentProps = state => ({
  selected: state.user.userPreferences.selectedCoin,
  name: state.coins.all[state.user.userPreferences.selectedCoin].name
});

const calculateSentimentAnalysis = (tweets = []) => {
  if (!tweets.length) {
    return null;
  }
  let sentiment = 0;
  for (let i = 0; i < tweets.length; i++) {
    sentiment+=tweets[i].sentiment;    
  }
  sentiment = Math.round((sentiment / tweets.length) * 100) ;
  return (
    <Typography style={{display:'inline'}} component="span" color={sentiment >= 0 ? 'primary' : 'secondary'} variant="h4">
      {sentiment}
      <span style={{fontSize:'12px'}}>%</span>
    </Typography>
  );
};

const renderTweets = (tweets = []) => {
  const orderTweets = tweets.sort((a, b) => a.created < b.created);
  return orderTweets.map((tweet,i) => {
    const { user = {}, text = '', created = new Date(), id } = tweet;
    const { screen_name, location, url, profile_image_url, followers_count } = user;
    const time = new Date(created);
    const parsedMinutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
    const parsedHours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
    const parsedTime = `${parsedHours}:${parsedMinutes}`;
    return (
      <ListItem key={i} alignItems="flex-start" dense button onClick={() => window.open(`https://twitter.com/${screen_name}`,'_blank')}>
        <ListItemAvatar>
          <Avatar alt={screen_name} src={profile_image_url} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <React.Fragment>
              <Grid item>
                <Typography color="textPrimary" component="span" variant="h6">
                  <strong>{screen_name}  </strong>
                  <span style={{ textAlign: 'right', fontSize: '12px' }}>({followers_count} followers)</span>
                </Typography>
              </Grid>
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              <Typography variant="body2" color="textPrimary">
                {text}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
    );
  });
  
};

class SentimentAnalysis extends React.Component {
  state = {
    tweets:[]
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selected !== this.props.selected || nextProps.name !== this.props.name || nextState.tweets.length !== this.state.tweets.length;
  }

  receiveTweets = ({ info: { }, message: {} }) => {
    const { tweets } = this.state;
    console.log(info);
    this.setState({ ...this.state, tweets: [info, ...tweets] });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      coinSocket.closeSpecificConnection(name.toLowerCase(), 'tweets');
      this.initTweetData(nextProps.selected, nextProps.name);
    }
  }

  initTweetData = async(selected, name) => {
    const tweets = await getTweets(selected);
    this.setState({ ...this.state, tweets: tweets.reverse() });
    coinSocket.openSpecificConnection(name.toLowerCase(), 'tweets', this.receiveTweets);
  }

  componentDidMount() {
    this.initTweetData(this.props.selected, this.props.name);
  }
  componentWillUnmount() {
    const { name } = this.props;
    coinSocket.closeSpecificConnection(name.toLowerCase(), 'tweets');
  }

  render() {
    const { classes, name } = this.props;
    const { tweets } = this.state;
    const parsedTweets = tweets;
    return (
      <Paper elevation={1}>
        <Grid container spacing={16} alignItems="center" justify="space-between">
          <Grid item>
            <Typography variant="h5" component="span" style={{ display: 'inline' }} align="left">
              Sentiment Analysis <span style={{fontSize:'0.75rem', textAlign:'right'}}>{`#${name}`}</span>
            </Typography>
          </Grid>
          <Grid item>
            {calculateSentimentAnalysis(parsedTweets)}
          </Grid>
          <Grid item xs={12}>
            <List className={classes.list}>
              {renderTweets(parsedTweets)}
            </List>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}



export default connect(mapReduxStateToComponentProps)(withStyles(styles)(SentimentAnalysis));