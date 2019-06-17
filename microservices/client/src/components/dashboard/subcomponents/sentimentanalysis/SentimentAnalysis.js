import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import LensIcon from '@material-ui/icons/LensRounded';
import coinSocket from '../../../common/socket/CoinSocket';
import { getLastTweets, getLastNews } from '../../../common/utils/FetchCoinData';

import Loading from '../../../common/utils/Loading';

import { Typography, Paper, List, Fade } from '@material-ui/core';
import { connect } from 'react-redux';
import Tweet from './Tweet';
import Article from './Article';


const TWITTER_CHANNEL = 'tweets';
const NEWS_CHANNEL = 'last_news';

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

const calculateSentimentAnalysis = (articles = []) => {
  const howMany = articles.length;
  let sentiment = 0;
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (article.sentiment > 0) {
      sentiment++;
    } else if (article.sentiment < 0) {
      sentiment--;
    }
  }
  sentiment = Math.round((sentiment / howMany) * 100);
  return sentiment;
};

const sortArticlesAndTweets = (a,b) => {
  const dateA = a.created ? new Date(a.created).getTime() : new Date(a.publishedAt).getTime();
  const dateB = b.created ? new Date(b.created).getTime() : new Date(b.publishedAt).getTime();
  if (dateA > dateB) {
    return -1;
  }
  if(dateA < dateB){
    return 1;
  }
  return 0;
}

class SentimentAnalysis extends React.Component {
  state = {
    tweets: [],
    news:[],
  };
  renderArticlesAndTweets = () => {
    const all = [...this.state.tweets, ...this.state.news];
    return all.sort(sortArticlesAndTweets).map((obj, i) => {
      if(obj.source !== undefined){
        return <Article key={i} article={obj}/>
      } else {
        return <Tweet key={i} tweet={obj} />
      }
    });
  };
  receiveNews = (data) => {
    let { news = [] } = this.state;
    if (news.length > 20) {
      news = news.splice(news.length - 20);
    }
    this.setState({ ...this.state, news: [data.info, ...news] });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.setState({ ...this.state, tweets: [], news: [] });
      coinSocket.closeSpecificConnection(name.toLowerCase(), TWITTER_CHANNEL);
      coinSocket.closeSpecificConnection(name.toLowerCase(), NEWS_CHANNEL);
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
    const news = await getLastNews(name.toLowerCase());
    this.setState({ ...this.state, tweets: tweets.map(tweet => JSON.parse(tweet)), news: news.map(article => JSON.parse(article)) });
    coinSocket.openSpecificConnection(name.toLowerCase(), TWITTER_CHANNEL, this.receiveTweets);
    coinSocket.openSpecificConnection(name.toLowerCase(), NEWS_CHANNEL, this.receiveNews);
  }

  receiveTweets = ({info}) => {
    let { tweets = [] } = this.state;
    if (tweets.length > 20) {
      tweets = tweets.splice(tweets.length - 20);
    }
    this.setState({ ...this.state, tweets: [info, ...tweets] });
  }

  componentDidMount() {
    this.initTweetsData(this.props.name);
  }
  componentWillUnmount() {
    const { name } = this.props;
    coinSocket.closeSpecificConnection(name.toLowerCase(), TWITTER_CHANNEL);
    coinSocket.closeSpecificConnection(name.toLowerCase(), NEWS_CHANNEL);
  }

  render() {
    const { classes } = this.props;
    const { tweets = [], news = [] } = this.state;
    const sentiment = calculateSentimentAnalysis([...tweets,...news]);
    if (tweets.length > 0) {
      return (
        <Paper elevation={1}>
          <Grid container spacing={16} alignItems="center" justify="space-between">
            <Grid item>
              <Typography variant="h5" style={{ display: 'inline' }} align="left">
                Sentiment Analysis
                <LensIcon style={{ fontSize: '8px', marginLeft: '5px', marginTop: '2px' }} color={sentiment > 0 ? 'primary' : 'secondary'} />
              </Typography>
            </Grid>
            <Fade in={tweets.length > 0 || news.length > 0} timeout={{ enter: 2 * 1000, exit: 5 * 1000 }}>
              <Grid item xs={12}>
                <List className={classes.list}>
                  {this.renderArticlesAndTweets()}
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
            <Fade in={tweets.length === 0} timeout={{ enter: 2 * 1000, exit: 5 * 1000 }}>
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



export default connect(mapReduxStateToComponentProps)(withStyles(styles)(SentimentAnalysis));