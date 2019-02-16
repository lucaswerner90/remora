import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import LensIcon from '@material-ui/icons/LensRounded';
import coinSocket from '../../../common/socket/CoinSocket';
import { getLastNews } from '../../../common/utils/FetchCoinData';

import Loading from '../../../common/utils/Loading';

import { Typography, Paper, List, ListItem, ListItemAvatar, ListItemText, Avatar, Fade } from '@material-ui/core';
import {connect} from 'react-redux';
import Twitter from './Twitter';


const NEWS_CHANNEL_NAME = 'last_name';

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

const mapReduxStateToComponentProps = (state) => {
  const selected = state.user.userPreferences.selectedCoin;
  return { name: state.coins.all[selected].name };
};

const calculateSentimentAnalysis = (articles = []) => {
  const howManyArticles = articles.length;
  let sentiment = 0;
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (article.sentiment > 0) {
      sentiment++;
    } else if (article.sentiment < 0) {
      sentiment--;
    }
  }
  sentiment = Math.round((sentiment / howManyArticles) * 100);
  return sentiment;
};

const renderNews = (news = []) => {
  return news.map((article,i) => {
    const { description = '', title = '', url = '', urlToImage: image = '', publishedAt = '', source = {}, sentiment } = article;
    const { name = '' } = source;
    const time = new Date(publishedAt);
    const parsedTime = time.toLocaleDateString();
    return (
      <ListItem key={i} alignItems="flex-start" dense button onClick={() => window.open(url,'_blank')}>
        <ListItemAvatar>
          <Avatar alt={title} src={image}/>
        </ListItemAvatar>
        <ListItemText
          primary={
            <React.Fragment>
              <Grid item>
                <Typography variant="h6">
                  {title}
                </Typography>
              </Grid>
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              <Typography variant="body2">
                {description}
              </Typography>
              <Typography variant="body2" style={{fontStyle:'italic'}}>
                {name}
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
    news:[]
  };

  receiveNews = ({ info: { }, message: {} }) => {
    const { news = [] } = this.state;
    console.log('Receiving news...')
    this.setState({ ...this.state, news: [info, ...news] });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      coinSocket.closeSpecificConnection(name.toLowerCase(), NEWS_CHANNEL_NAME);
      this.initNewsData(nextProps.name);
    }
  }
  shouldComponentUpdate(nextProps,nextState) {
    if(nextProps.name !== this.props.name){
      return true;
    }
    if (nextState.news.length !== this.state.news.length){
      return true;
    }
    if (nextState.news[0].url !== this.state.news[0].url){
      return true;
    }
    return false;
  }

  initNewsData = async(name) => {
    const news = await getLastNews(name.toLowerCase());
    this.setState({ ...this.state, news });
    coinSocket.openSpecificConnection(name.toLowerCase(), NEWS_CHANNEL_NAME, this.receiveNews);
    coinSocket.openSpecificConnection(name.toLowerCase(), 'tweets', this.receiveTweets);
  }
  receiveTweets = (data)=> {
    console.log(data);
  }
  shouldComponentUpdate() {
    return true;
  }
  componentDidMount() {
    this.initNewsData(this.props.name);
  }
  componentWillUnmount() {
    const { name } = this.props;
    coinSocket.closeSpecificConnection(name.toLowerCase(), NEWS_CHANNEL_NAME);
    coinSocket.openSpecificConnection(name.toLowerCase(), 'tweets');
  }

  render() {
    const { classes } = this.props;
    const { news = [] } = this.state;
    const { articles = [] } = news;
    const sentiment = calculateSentimentAnalysis(articles);
    if (articles.length > 0) {
      return (
        <Paper elevation={1}>
          <Grid container spacing={16} alignItems="center" justify="space-between">
            <Grid item>
              <Typography variant="h5" style={{ display: 'inline' }} align="left">
                Sentiment Analysis
                <LensIcon style={{ fontSize: '8px', marginLeft: '5px', marginTop: '2px' }} color={sentiment > 0 ? 'primary' : 'secondary'} />
              </Typography>
            </Grid>
            <Fade in={articles.length > 0} timeout={{ enter: 2 * 1000, exit: 5 * 1000 }}>
              <Grid item xs={12}>
                <List className={classes.list}>
                  {renderNews(articles)}
                </List>
                <Twitter/>
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
            <Fade in={articles.length === 0} timeout={{ enter: 2 * 1000, exit: 5 * 1000 }}>
              <Grid item>
                <Loading/>
              </Grid>
            </Fade> 
          </Grid>
        </Paper>
      );
    }
  }
}



export default connect(mapReduxStateToComponentProps)(withStyles(styles)(SentimentAnalysis));