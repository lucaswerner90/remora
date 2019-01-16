import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { Grid, Button } from '@material-ui/core';


import { connect } from 'react-redux';
import { selectCoin } from '../../../redux/actions/coinActions';


const styleButton = {
  background: '#449ff7',
  borderRadius: '20px',
  border: 0,
  fontSize: '10px',
  color: 'white',
  padding: '0 20px',
};

export class CoinCardButtons extends Component {
  static propTypes = {
    coin: PropTypes.object.isRequired,
    selectCoin: PropTypes.func.isRequired
  }
  selectCoin = () => {
    this.props.selectCoin(this.props.coin.id);
  }
  
  render() {
    return (
      <Grid container alignItems="flex-end">
        <Grid item xs={6}>
          <Button style={{ ...styleButton }} onClick={this.selectCoin}>
            See more
          </Button>
        </Grid>
        <Grid item xs={6} style={{textAlign:'right'}}>
          <Button color="primary">
            Open coin URL
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default connect(null, { selectCoin })(CoinCardButtons);
