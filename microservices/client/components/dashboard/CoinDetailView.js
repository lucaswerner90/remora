import React, {Component} from 'react';
import PropTypes from 'prop-types';


import { Grid, Typography, Paper, Fade } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import OpenInNew from '@material-ui/icons/OpenInNew';

import { connect } from 'react-redux';


import PriceChart from './subcomponents/charts/PriceChart';
import BasicInfo from './subcomponents/info/CoinBasicInfo';
import Loading from '../common/utils/Loading';
import OrderInfo from './subcomponents/info/OrderInfo';
import ChartTimelineSelector from './subcomponents/charts/ChartTimelineSelector';
import coinSocket from '../common/socket/CoinSocket';

import {getAllProperties} from '../common/utils/FetchCoinData';
import SentimentAnalysis from './subcomponents/sentimentanalysis/SentimentAnalysis';

const mapReduxStateToComponentProps = state => ({
  selectedCoin: state.user.userPreferences.selectedCoin,
  coinInfo: state.coins.all[state.user.userPreferences.selectedCoin],
  chartTimeline: state.dashboard.chartTimeline,
  buyOrder: state.live.buyOrder,
  sellOrder: state.live.sellOrder,
  previousBuyOrder: state.live.previousBuyOrder,
  previousSellOrder: state.live.previousSellOrder
});

const timelineChartValues = {
  REALTIME: 'REAL',
  MINUTE: 'MINUTE',
  FIVE: 'FIVE',
  FIFTEEN: 'FIFTEEN'
}


export class CoinDetailView extends Component {

  static propTypes = {
    selectedCoin: PropTypes.string.isRequired,
    coinInfo: PropTypes.object.isRequired,
  }

  static defaultProps = {
    selectedCoin: '',
    coinInfo: {}
  }

  constructor(props) {
    super(props); 
  }

  componentDidMount() {
    const { selectedCoin = '' } = this.props;
    getAllProperties(selectedCoin);
    coinSocket.openCoinConnections(selectedCoin);
  }
  componentWillUnmount() {
    const { selectedCoin = '' } = this.props;
    coinSocket.closeCoinConnections(selectedCoin);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCoin && nextProps.selectedCoin !== this.props.selectedCoin) {
      coinSocket.closeCoinConnections(this.props.selectedCoin);
      coinSocket.openCoinConnections(nextProps.selectedCoin);
      getAllProperties(nextProps.selectedCoin);
    }
  }
  render() {
    const { previousBuyOrder, previousSellOrder, buyOrder, sellOrder, price = 0, coinInfo } = this.props;

    if (coinInfo.name) {
      return (
        <Fade in={true} timeout={{enter:2*1000, exit:5*1000}}>
        
          <Grid container direction="row" spacing={16}>
            <Grid item xs={12}>
              <Paper elevation={1}>
                <Grid container spacing={8}>
                  <Grid item xs={12} style={{ zIndex: 100 }}>
                    <Typography align="center" style={{ textTransform: 'uppercase' }} variant="body2">
                      {`${coinInfo.exchange}`}
                    </Typography>
                    <Typography align="center" variant="h4">
                      {`${coinInfo.name} (${coinInfo.symbol})`}
                      <IconButton aria-label="Open coin url" onClick={() => window.open(coinInfo.url, 'blank')}>
                        <OpenInNew />
                      </IconButton>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{marginBottom:'-40px'}}>
                    <PriceChart />
                  </Grid>
                  <Grid item xs={12}>
                    <ChartTimelineSelector />
                  </Grid>
                  <Grid item xs={12}>
                    <BasicInfo />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
              

          <Grid item xs={12} sm={12} md={6}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <OrderInfo order={buyOrder} previous={previousBuyOrder} message="Buy order" coinPrice={price} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <OrderInfo order={sellOrder} previous={previousSellOrder} message="Sell order" coinPrice={price} />
              </Grid>
              <Grid item xs={12}>
                <SentimentAnalysis/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        </Fade>
      );
    } else {
      return (
        <Fade in={coinInfo.name.length === 0} timeout={{enter: 500, exit:2*1000}}>
          <Grid container spacing={0} justify="center" style={{flexGrow:1, height:'90vh'}} alignItems="center">
            <Grid item xs={12}>
            </Grid>
            <Loading/>
          </Grid>
        </Fade>
      );
    }
  }
}

export default connect(mapReduxStateToComponentProps)(CoinDetailView);
