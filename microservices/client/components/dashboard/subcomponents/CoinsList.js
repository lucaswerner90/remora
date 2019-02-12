
// React Redux
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Icons
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';

// Redux
import { connect } from 'react-redux';
import { updateUserSelectedCoin, updateUserFavorites } from '../../../redux/actions/userPreferencesActions';
import { Fade } from '@material-ui/core';


const mapReduxStateToComponentProps = state => ({
  favorites: state.user.userPreferences.favorites,
  coins: Object.values(state.coins.coins)
});

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
  input:{
    borderRadius:'10px'
  }
});


class CoinsList extends React.Component {
  state = {
    onlyFavorites: false,
    showFilters: false,
  };
  shouldComponentUpdate(nextProps,nextState) {
    return nextState.onlyFavorites !== this.state.onlyFavorites || nextProps.coins.length !== this.props.coins.length || nextProps.favorites !== this.props.favorites || nextProps.filter !== this.props.filter;
  }

  selectCoin = (coinID = '') => {
    this.props.updateUserSelectedCoin(coinID);
  }
  componentWillReceiveProps({coins=[]}){
    this.setState({ ...this.state, coins });
  }

  markAsFavorite = (coinID = '') => {
    const {favorites} = this.props;
    if (favorites.indexOf(coinID) === -1) {
      this.props.updateUserFavorites([...favorites, coinID]);  
    } else {
      const newFav = favorites.filter(coin => coin !== coinID);
      this.props.updateUserFavorites(newFav);  
    }
  }
  getTrendingIcon = ({priceChange24hr:condition = 0}) => {
    if (condition >= 0) {
      return (
        <Avatar style={{ background: POSITIVE_COLOR }}>
          <TrendingUpIcon />
        </Avatar>
      );
    }
    return (
      <Avatar style={{ background: NEGATIVE_COLOR }}>
        <TrendingDownIcon />
      </Avatar>
    );
  }
  showCoins = (coins = this.state.coins) => {
    const { favorites } = this.props;
    return coins.map(coin => {
      const isFavorite = favorites.indexOf(coin.id) > -1;
      const color = isFavorite ? 'textPrimary' : 'textSecondary';
      return (        
        <ListItem key={coin.id} onClick={() => this.selectCoin(coin.id)} dense button>
          <ListItemText
            primary={
              <React.Fragment>
                <Grid container alignItems="flex-end">
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography color={color} component="h5" variant="h5">
                      {coin.name}
                      <span style={{ fontSize: '12px', color:'white' }}>  ({coin.symbol})  </span>
                    </Typography>
                  </Grid>
                </Grid>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <Typography component="span" style={{ textTransform: 'uppercase' }} variant="body2" style={{ color }}>
                  {coin.exchange.toString().toUpperCase()}
                </Typography>
              </React.Fragment>
            }
          />
          <ListItemSecondaryAction>
            <IconButton aria-label="Favorite" disabled={favorites.length === 1 && isFavorite} onClick={() => this.markAsFavorite(coin.id)}>
              {isFavorite && <StarIcon />}
              {!isFavorite && <StarBorderIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  }

  filterCoin = ({name='',exchange='',symbol=''}) => {
    const filter = this.props.filter.toLowerCase();
    if (filter.length) {
      return (name.toLowerCase().includes(filter) || exchange.toLowerCase().includes(filter) || symbol.toLowerCase().includes(filter));
    }
    return true;
  }
  
  sortCoin = (a, b) => a.name < b.name;


  handlerFilterChange = (event = new Event()) => {
    const filterValue = event.target.value;
    this.setState({ ...this.state, filterValue });
  }
  handleShowFavorites = (e, onlyFavorites) => {
    this.setState({ ...this.state, onlyFavorites });
  }
  
  render() {
    const { classes, coins = [], filter = '', favorites = [] } = this.props;
    const { onlyFavorites = false } = this.state;
    let filteredCoins = filter.length ? Object.values(coins).filter(this.filterCoin) : Object.values(coins);
    if (onlyFavorites) {
      filteredCoins = [
        ...filteredCoins.filter(coin => favorites.indexOf(coin.id) > -1).sort(this.sortCoin)
      ];
    } else {
      filteredCoins = [
        ...filteredCoins.filter(coin => favorites.indexOf(coin.id) > -1).sort(this.sortCoin),
        ...filteredCoins.filter(coin => favorites.indexOf(coin.id) === -1).sort(this.sortCoin),
      ];
    }
    return (
      <Grid container spacing={16} alignItems="center" justify="space-between">
        <Grid item>
          <Typography className={classes.padding} align="left" variant="h6">
            COINS
          </Typography>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={onlyFavorites}
                onChange={this.handleShowFavorites}
              />
            }
            labelPlacement="start"
            label={onlyFavorites ? 'Favorites' : 'All'}
          />
        </Grid>
        <Fade in={coins.length > 0} timeout={{enter:2*1000}}>
          <Grid item xs={12} sm={12} md={12} md={12}>
            <Paper elevation={0}>
              <List dense={true} className={classes.list}>
                {this.showCoins(filteredCoins)}
              </List>
            </Paper>
          </Grid>
        </Fade>
        
      </Grid>
    );
  }
}

CoinsList.propTypes = {
  classes: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired
};

export default connect(mapReduxStateToComponentProps, { updateUserSelectedCoin, updateUserFavorites })(withStyles(styles)(CoinsList));