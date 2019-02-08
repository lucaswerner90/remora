
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


const mapReduxStateToComponentProps = state => ({
  favorites: state.user.userPreferences.favorites,
  coins: Object.values(state.coins.coins)
});

const POSITIVE_COLOR = 'rgba(76, 175, 80, 0.5)';
const NEGATIVE_COLOR = 'rgba(244, 67, 54, 0.5)';

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
    dense: true,
    showFilters: false,
  };
  shouldComponentUpdate(nextProps) {
    return nextProps.coins.length !== this.props.coins.length || nextProps.favorites !== this.props.favorites || nextProps.filter !== this.props.filter;
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

  generateItems = (coins = this.state.coins) => {
    const { favorites } = this.props;
    const orderCoins = [...coins.filter(coin => favorites.indexOf(coin.id) > -1), ...coins.filter(coin => favorites.indexOf(coin.id) === -1)];
    return orderCoins.map(coin => {
      return (
        <ListItem key={coin.id} onClick={() => this.selectCoin(coin.id)} dense button>
          <ListItemText
            primary={
              <React.Fragment>
                <Grid container alignItems="flex-end">
                  <Grid item xs={12}>
                    <Typography component="span" variant="body1">
                      <strong>{`${coin.name} (${coin.symbol}-${coin.against})`}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <Typography component="span" style={{textTransform:'lowercase'}} variant="body2">
                  {coin.exchange.toLowerCase()}
                </Typography>
              </React.Fragment>
            }
          />
          <ListItemSecondaryAction>
            <IconButton aria-label="Favorite" disabled={favorites.length === 1 && favorites.indexOf(coin.id) > -1} onClick={() => this.markAsFavorite(coin.id)}>
              {favorites.indexOf(coin.id) > -1 && <StarIcon />}
              {favorites.indexOf(coin.id) === -1 && <StarBorderIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>

      );
    });

  }
  showFavorites = (coins = this.state.coins) => {
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
                  <Grid item xs={12}>
                    <Typography component="span" color={color} variant="body1">
                      {`${coin.name} (${coin.symbol}-${coin.against})`}
                    </Typography>
                  </Grid>
                </Grid>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <Typography component="span" style={{ textTransform: 'uppercase' }} style={{ color }}>
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
  render() {
    const { classes, coins = [], filter = '', favorites = [] } = this.props;
    const { dense = true } = this.state;
    let filteredCoins = filter.length ? Object.values(coins).filter(this.filterCoin): Object.values(coins);
    filteredCoins = [
      ...filteredCoins.filter(coin => favorites.indexOf(coin.id) > -1).sort(this.sortCoin),
      ...filteredCoins.filter(coin => favorites.indexOf(coin.id) === -1).sort(this.sortCoin),
    ]
    return (
      <Grid container spacing={16} alignItems="center">
        <Grid item xs={10}>
          <Typography className={classes.padding} align="left" variant="h6">
            COINS
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper elevation={0}>
              <List dense={dense} className={classes.list}>
                {!filter.length && this.showFavorites(filteredCoins)}
                {filter.length > 0 && this.generateItems(filteredCoins)}
              </List>
          </Paper>
          </Grid>
      </Grid>
    );
  }
}

CoinsList.propTypes = {
  classes: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired
};

export default connect(mapReduxStateToComponentProps, { updateUserSelectedCoin, updateUserFavorites })(withStyles(styles)(CoinsList));