import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { withStyles } from '@material-ui/core/styles';
import lightBlue from '@material-ui/core/colors/lightBlue';
import Paper from '@material-ui/core/Paper';

const Chart = dynamic(import('react-apexcharts'), { ssr: false });

const styles = theme => ({
  paper: {
    boxShadow: 'none',
    background: 'transparent'
  },
  fake: {
    backgroundColor: '#3ca5c4',
    background: 'linear-gradient(to right, #757f9a, #d7dde8);',
    height: theme.spacing.unit,
    margin: theme.spacing.unit * 2,
    // Selects every two elements among any group of siblings.
    '&:nth-child(2n)': {
      marginRight: theme.spacing.unit * 3,
    },
  },
});
class GenericPriceChart extends Component {
  static propTypes = {
    prices: PropTypes.array.isRequired,
    buyOrder: PropTypes.object.isRequired,
    sellOrder: PropTypes.object.isRequired,
    isFavorite: PropTypes.bool.isRequired
  }

  static defaultProps = {
    prices: [],
    buyOrder: {},
    sellOrder: {},
    isFavorite: false
  }

  constructor(props) {
    super(props, `${props.exchange}_${props.coinID}_price_list`);
  }

  shouldComponentUpdate(nextProps = {buyOrder:{}, sellOrder:{}, prices:[]}) {
    const { buyOrder = {}, sellOrder = {}, prices = [] } = this.props;
    const differentBuyOrder = buyOrder.price !== nextProps.buyOrder.price;
    const differentSellOrder = sellOrder.price !== nextProps.sellOrder.price;
    const differentPrice = prices[prices.length - 1] !== nextProps.prices[prices.length - 1];
    
    const rerender = differentBuyOrder || differentSellOrder || differentPrice;
    return rerender;
  }

  render() {
    const { prices = [], buy: buyOrder = {}, sell: sellOrder = {}, isFavorite = false } = this.props;
    const pricesList = prices.splice(prices.length - 20, prices.length - 1);
    const buyOrderAnnotation = buyOrder && buyOrder.price ? {
      y: buyOrder.price,
      borderColor: '#72CAA8',
      label: {
        position: 'left',
        offsetX: 100,
        offsetY: 13,
        borderColor: '#72CAA8',
        style: {
          color: '#fff',
          background: '#72CAA8',
          fontFamily: 'Roboto',
          fontSize: '0.625rem'
        },
        text: `Buy at ${buyOrder.price}$`,
      }
    } : {};
    const sellOrderAnnotation = sellOrder && sellOrder.price ? {
      y: sellOrder.price,
      borderColor: '#334887',
      label: {
        position: 'left',
        offsetX: 100,
        offsetY: 0,
        borderColor: '#334887',
        style: {
          color: '#fff',
          background: '#334887',
          fontFamily: 'Roboto',
          fontSize: '0.625rem'
        },
        text: `Sell at ${sellOrder.price}$`,
      }
    } : {};
    const { classes } = this.props;
    const fakeDivs = <div className={classes.fake} />;
    const graphOptions = {
      options: {
        tooltip: {
          enabled:false,
        },
        chart: {
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 2000
            }
          },
          toolbar: {
            show: false
          },
        },
        yaxis: {
          axisBorder: {
            show: true,
          },
        },
        xaxis: {
          labels: {
            show: false
          },
          axisBorder: {
            color: 'primary',
            width: '100%',
            height: 1
          },
          axisTicks: {
            show: false
          },
        },
        annotations: {
          yaxis: [buyOrderAnnotation, sellOrderAnnotation],
        },
        markers: {
          size: 0,
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        colors: [lightBlue[300]],
        grid: {
          show: false,
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            gradientToColors: ['transparent','white'],
            shadeIntensity: 0,
            type: 'horizontal',
            opacityFrom: 0,
            opacityTo: 1,
            stops: [0, 100, 0, 100]
          },
        },
      },
      series: [{
        data: pricesList
      }],
    };
    if (pricesList.length > 0) {
      return (
        <Chart
          options={graphOptions.options}
          series={graphOptions.series}
          type="line"
          width="100%"
          height={isFavorite ? "200px" : "100px"}
        />
      );
    }
    return (
      <Paper className={classes.paper}>
        {fakeDivs}
        {fakeDivs}
        {fakeDivs}
        {fakeDivs}
      </Paper>
    );
  }
}

export default withStyles(styles)(GenericPriceChart);