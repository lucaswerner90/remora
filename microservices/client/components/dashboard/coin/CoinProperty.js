import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';


import { connect } from 'react-redux';
import { fetchExchangesInfo } from '../../../redux/actions/exchangeActions';

const mapStateToProps = state => ({
  exchange: state.exchange,
});

export class CoinProperty extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { value = '-', label = '', symbol = '' } = this.props;
    const textColor = value > 0 ? 'green' : 'red';
    
    return (
      <Grid container style={{ flexGrow: 1 }} spacing={0}>
        <Grid item xs={12}>
          <Typography style={{ color: 'grey', fontSize: '0.625rem' }} align="center" variant="body2">
            {label}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography style={{ color: textColor}} align="center" variant="body1">
            {value? `${value}${symbol}`: '-'}
          </Typography>
        </Grid>
      </Grid>
        
    );
  }
}

// export default connect(mapStateToProps, { fetchExchangesInfo })(CoinPrice);
export default CoinProperty;
