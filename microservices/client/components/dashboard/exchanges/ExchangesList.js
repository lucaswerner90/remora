import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import CoinSocketComponent from '../../common/CoinSocketComponent';


import { connect } from 'react-redux';
import { getExchangesInfo } from '../../../redux/actions/exchangeActions';

const mapStateToProps = state => ({
  exchanges: state.exchange,
});

const styles = theme => ({
  root: {
    flexGrow:1
  },
});
const renderList = (coinsArray = [], tileSize = 3, { showExchange = false, isFavorite = false }) => {
  return coinsArray.map(coin =>
    <CoinSocketComponent key={`${coin.id}_${Math.random()}`}
      coin={coin}
      tileSize={tileSize}
      showExchange={showExchange}
      isFavorite={isFavorite}
    />
  );
}
export class ExchangesList extends Component {
  componentWillMount() {
    this.props.getExchangesInfo();
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }
  shouldComponentUpdate(nextProps) {
    return Object.keys(this.props.exchanges) !== Object.keys(nextProps.exchanges);
  }
  render() {
    const { classes = {}, exchanges = {} } = this.props;
    const exchangesName = Object.keys(exchanges);
    const exchangesRender = (exch = []) => {
      const mapExchanges = exch.map(e => exchanges[e]);
      return mapExchanges.map(({name = '', coins = []}) =>
        <Grid item key={name} xs={12}>
          <Grid container className={classes.root} spacing={8}>
            <Grid item xs={12}>
              <Typography variant="h6">
                <strong>{name.toUpperCase()}</strong>
              </Typography>
            </Grid>
            {renderList(coins, 3, {showExchange: false, isFavorite: false})}
          </Grid>
        </Grid>
      );
    };
    return (
      <Grid container className={classes.root} spacing={24}>
        {exchangesRender(exchangesName)}
      </Grid>
    )
  }
}

export default connect(mapStateToProps, {getExchangesInfo})(withStyles(styles)(ExchangesList));
