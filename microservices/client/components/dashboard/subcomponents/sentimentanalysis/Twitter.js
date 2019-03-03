import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import LensIcon from '@material-ui/icons/LensRounded';
import coinSocket from '../../../common/socket/CoinSocket';
import { getLastTweets } from '../../../common/utils/FetchCoinData';

import Loading from '../../../common/utils/Loading';

import { Typography, Paper, List, Fade } from '@material-ui/core';
import { connect } from 'react-redux';
import Tweet from './Tweet';


const TWITTER_CHANNEL = 'tweets';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  inline: {
    display: 'inline'
  },
  list: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    height: '30vh',
    overflowY: 'auto'
  },
});

const mapReduxStateToComponentProps = (state) => {
  const selected = state.user.userPreferences.selectedCoin;
  return { name: state.coins.all[selected].name };
};

const calculateSentimentAnalysis = (tweets = []) => {
  const howMany = tweets.length;
  let sentiment = 0;
  for (let i = 0; i < tweets.length; i++) {
    const article = tweets[i];
    if (article.sentiment > 0) {
      sentiment++;
    } else if (article.sentiment < 0) {
      sentiment--;
    }
  }
  sentiment = Math.round((sentiment / howMany) * 100);
  return sentiment;
};

const sortTweets = (a,b) => {
  const dateA = new Date(a.created).getTime();
  const dateB = new Date(b.created).getTime();
  if (dateA > dateB) {
    return -1;
  }
  if(dateA < dateB){
    return 1;
  }
  return 0;
}
const renderTweets = (tweets = []) => {
  return tweets.sort(sortTweets).map((tweet,i) => {
    return <Tweet key={i} tweet={tweet}/>
  });
};

class Twitter extends React.Component {
  state = {
    tweets: []
  };

  receiveNews = ({ info: { }, message: { } }) => {
    const { tweets = [] } = this.state;
    console.log('Receiving tweets...');
    this.setState({ ...this.state, tweets: [info, ...tweets] });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      coinSocket.closeSpecificConnection(name.toLowerCase(), TWITTER_CHANNEL);
      this.initTweetsData(nextProps.name);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.tweets.length !== this.state.tweets.length) {
      return true;
    }
    if (nextState.tweets.length && this.state.tweets.length && nextState.tweets[0] !== this.state.tweets[0]) {
      return true;
    }
    if (nextProps.name !== this.props.name) {
      return true;
    }
    return false;
  }

  initTweetsData = async (name) => {
    const tweets = await getLastTweets(name.toLowerCase());
    this.setState({ ...this.state, tweets });
    coinSocket.openSpecificConnection(name.toLowerCase(), TWITTER_CHANNEL, this.receiveTweets);
  }

  receiveTweets = ({ info: { }, message: { } }) => {
    const { tweets = [] } = this.state;
    this.setState({ ...this.state, tweets: [info, ...tweets] });
  }

  componentDidMount() {
    this.initTweetsData(this.props.name);
  }
  componentWillUnmount() {
    const { name } = this.props;
    coinSocket.closeSpecificConnection(name.toLowerCase(), TWITTER_CHANNEL);
  }

  render() {
    const { classes } = this.props;
    const { tweets = [] } = this.state;
    const parsedTweets = tweets.map(tweet => JSON.parse(tweet));
    const sentiment = calculateSentimentAnalysis(parsedTweets);
    if (parsedTweets.length > 0) {
      return (
        <Paper elevation={1}>
          <Grid container spacing={16} alignItems="center" justify="space-between">
            <Grid item>
              <Typography variant="h5" style={{ display: 'inline' }} align="left">
                Sentiment Analysis
                <LensIcon style={{ fontSize: '8px', marginLeft: '5px', marginTop: '2px' }} color={sentiment > 0 ? 'primary' : 'secondary'} />
              </Typography>
            </Grid>
            <Fade in={parsedTweets.length > 0} timeout={{ enter: 2 * 1000, exit: 5 * 1000 }}>
              <Grid item xs={12}>
                <List className={classes.list}>
                  {renderTweets(parsedTweets)}
                </List>
              </Grid>
            </Fade>
          </Grid>
        </Paper>
      );
    } else {
      return (
        <Paper elevation={1}>
          <Grid container spacing={16} alignItems="center" justify="space-between">
            <Grid item>
              <Typography variant="h5" style={{ display: 'inline' }} align="left">
                Sentiment Analysis
                <LensIcon style={{ fontSize: '8px', marginLeft: '5px', marginTop: '2px' }} color={sentiment > 0 ? 'primary' : 'secondary'} />
              </Typography>
            </Grid>
            <Fade in={parsedTweets.length === 0} timeout={{ enter: 2 * 1000, exit: 5 * 1000 }}>
              <Grid item>
                <Loading />
              </Grid>
            </Fade>
          </Grid>
        </Paper>
      );
    }
  }
}



export default connect(mapReduxStateToComponentProps)(withStyles(styles)(Twitter));