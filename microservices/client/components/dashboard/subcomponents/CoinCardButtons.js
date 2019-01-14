import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { Grid, Button } from '@material-ui/core';


import { connect } from 'react-redux';
import { selectCoin } from '../../../redux/actions/coinActions';
import CoinDetailDialog from '../common/CoinDetailDialog';

export class CoinCardButtons extends Component {
  static propTypes = {
    coin: PropTypes.object.isRequired,
    selectCoin: PropTypes.func.isRequired
  }
  selectCoin = (coin) => {
    this.props.selectCoin(coin);
  }
  
  render() {
    const { coin={} } = this.props;
    return (
      <Grid container alignItems="flex-end">
        <Grid item xs={6}>
          <CoinDetailDialog coin={coin}/>
        </Grid>
      </Grid>
    );
  }
}

export default connect(null, { selectCoin })(CoinCardButtons);
