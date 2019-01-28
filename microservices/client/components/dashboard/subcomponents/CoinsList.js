
// React Redux
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

// Icons
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';

// Redux
import { connect } from 'react-redux';
import { updateUserSelectedCoin } from '../../../redux/actions/userPreferencesActions';


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
    height: '40vh',
    marginBottom: 20,
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
    filterValue: '',
    coins: {
      'binance_ETHUSDT': {
        id: 'binance_ETHUSDT',
        isFavorite: true,
        name: 'Ethereum',
        symbol: 'ETH',
        exchange: 'Binance',
        price: 100,
        against: 'USD',
        priceChange24hr: -0.2,
        volumeDifference: 45
      },
      'binance_BTCUSDT': {
        id: 'binance_BTCUSDT',
        isFavorite: false,
        name: 'Bitcoin',
        symbol: 'BTC',
        exchange: 'Binance',
        price: 4000, against: 'USD',
        priceChange24hr: 3,
        volumeDifference: 10
      },
      'binance_TRXUSDT': {
        id: 'binance_TRXUSDT',
        name: 'Tron',
        isFavorite: false,
        symbol: 'TRX',
        exchange: 'Binance',
        price: 3,
        against: 'USD',
        priceChange24hr: 20,
        volumeDifference: 200
      },
      'binance_XRPUSDT': {
        id: 'binance_XRPUSDT',
        name: 'Ripple',
        isFavorite: true,
        symbol: 'XRP',
        exchange: 'Binance',
        price: 6.7,
        against: 'USD',
        priceChange24hr: 5,
        volumeDifference: 9
      },
    }
  };
  selectCoin = (coinID = '') => {
    this.props.updateUserSelectedCoin(coinID);
  }

  markAsFavorite = (coinID = '') => {
    const newCoin = this.state.coins[coinID];
    newCoin.isFavorite = !newCoin.isFavorite;

    this.setState({
      ...this.state,
      coins: {
        ...this.state.coins,
        [coinID]: newCoin
      }
    });
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
    return coins.map(coin => {
      return (
        <ListItem key={Math.random()} onClick={() => this.selectCoin(coin.id)} dense button>
          <ListItemAvatar>
            
            {this.getTrendingIcon(coin)}
            
          </ListItemAvatar>
          <ListItemText
            primary={
              <React.Fragment>
                <Grid container alignItems="flex-end">
                  <Grid item xs={6}>
                    <Typography component="span" variant="body1">
                      {`${coin.name} (${coin.symbol})`}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} >
                    <Typography component="span" align="right" variant="body2">
                      {`${coin.price}${coin.against === 'USD' ? '$' : 'BTC'}`}
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
          <ListItemSecondaryAction>
            <IconButton aria-label="Favorite" onClick={() => this.markAsFavorite(coin.id)}>
              {coin.isFavorite && <StarIcon />}
              {!coin.isFavorite && <StarBorderIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>

      );
    });

  }
  showFilterComponents = () => {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <TextField
          id="outlined-search"
          label="Search for coins"
          type="text"
          margin="dense"
          variant="outlined"
          onChange={this.handlerFilterChange}
          autoCapitalize="true"
          autoFocus={true}
          autoComplete="off"
          InputProps={{
            className: classes.input,
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </React.Fragment>
    );
  }
  handleShowFilters = () => {
    const currentValue = this.state.showFilters;
    this.setState({ ...this.state, showFilters: !currentValue });
  }
  showFilterButton = () => {
    return (
      <IconButton aria-label="Show/Hide filters" onClick={this.handleShowFilters}>
        <FilterListIcon/>
      </IconButton>
    );
  }
  filterCoin = ({name='',exchange='',symbol=''}) => {
    const filter = this.state.filterValue.toLowerCase();
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
    const { classes } = this.props;
    const { dense = true, coins = [], filterValue = '', showFilters = false } = this.state;
    let filteredCoins = filterValue.length ? Object.values(coins).filter(this.filterCoin): Object.values(coins);

    filteredCoins = filteredCoins.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase());

    return (
      <Grid container spacing={16} alignItems="center">
        <Grid item xs={10}>
          <Typography className={classes.padding} align="left" variant="h6">
            My coins
          </Typography>
        </Grid>
        <Grid item xs={2} md={2} style={{textAlign: 'right'}}>
          {this.showFilterButton()}
        </Grid>
        {showFilters && this.showFilterComponents()}
        <Grid item xs={12} md={12}>
            <List dense={dense} className={classes.list}>
              {this.generateItems(filteredCoins)}
            </List>
        </Grid>
      </Grid>
    );
  }
}

CoinsList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(null, { updateUserSelectedCoin })(withStyles(styles)(CoinsList));