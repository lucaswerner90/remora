import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { Grid, Typography } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

import { connect } from 'react-redux';
import { fetchExchangesInfo } from '../../../redux/actions/exchangeActions';

const mapStateToProps = state => ({
  exchange: state.exchange,
});

export class CoinProperty extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    symbol: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value;
  }

  render() {
    const { value = '-', label = '', symbol = '' } = this.props;
    const textColor = value > 0 ? green[300] : red[300];
    
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
