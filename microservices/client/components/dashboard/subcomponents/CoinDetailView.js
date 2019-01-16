import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import PriceChart from './charts/PriceChart';

export class CoinDetailView extends Component {

  static propTypes = {
    coin: PropTypes.object.isRequired
  }

  static defaultProps = {
    coin: {}
  }

  constructor(props) {
    super(props, `${props.coin.exchange}_${props.coin.id}`);
  }

  render() {
    const { coin } = this.props;
    const { pricesList = [], priceChange = 0, volumeDifference = 0, buyOrder = {}, sellOrder = {} } = coin;
    console.log(coin);
    let hasPriceIncreased = false;
    if (pricesList.length > 1 ) {
      const lastPrice = pricesList.unshift() - pricesList[pricesList.length - 2];
      hasPriceIncreased = lastPrice > 0;
    }
    return (
      <Grid container style={{ flexGrow: 1 }} spacing={16}>
        <Grid item xs={12}>
          <Typography variant="h5">
            {name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <PriceChart prices={pricesList} buy={buyOrder} sell={sellOrder} />
        </Grid>
      </Grid>
    );
  }
}

export default CoinDetailView;
