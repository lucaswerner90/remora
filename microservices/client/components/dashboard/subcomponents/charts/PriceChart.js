import React from 'react';
import PropTypes from 'prop-types';

import dynamic from 'next/dynamic';
import lightBlue from '@material-ui/core/colors/lightBlue';
import { green, red } from '@material-ui/core/colors';

const Chart = dynamic(import('react-apexcharts'), { ssr: false });


class PriceChart extends React.Component {

  static propTypes = {
    prices: PropTypes.array.isRequired,
    buy: PropTypes.object.isRequired,
    sell: PropTypes.object.isRequired,
  }

  static defaultProps = {
    prices: [],
    buy: {},
    sell: {},
  }

  shouldComponentUpdate(nextProps = { buy: {}, sell: {}, prices: [] }) {
    const { prices = [], buy = {}, sell= {} } = this.props;
    const differentPrice = prices.length && nextProps.prices.length && (prices[prices.length - 1] !== nextProps.prices[prices.length - 1]);
    const differentBuy = buy.price !== nextProps.buy.price;
    const differentSell = sell.price !== nextProps.sell.price;

    return differentPrice || differentBuy || differentSell;
    
  }
  render() {
    const { sell={}, buy={}, prices=[], priceChange = 0 } = this.props;
    const buyAnnotation = buy && buy.price ? {
      y: buy.price,
      borderColor: green[900],
      label: {
        position: 'left',
        offsetX: 400,
        offsetY: -5,
        borderColor: green[900],
        style: {
          color: '#fff',
          background: green[900],
          fontFamily: 'Roboto',
          fontSize: '0.875rem'
        },
        text: `${buy.price}$`,
      }
    }: {};
    const sellAnnotation = sell && sell.price ? {
      y: sell.price,
      borderColor: red[700],
      label: {
        position: 'left',
        offsetX: 350,
        offsetY: 18,
        borderColor: red[700],
        style: {
          color: '#fff',
          background: red[700],
          fontFamily: 'Roboto',
          fontSize: '0.875rem'
        },
        text: `${sell.price}$`,
      }
    } : {};
    const graphOptions = {
      options: {
        tooltip: {
          enabled: false,
        },
        chart: {
          animations: {
            enabled: true,
            easing: 'linear',
            animateGradually: {
              enabled: true,
              delay: 200
            },
            dynamicAnimation: {
              enabled: true,
              speed: 1000
            }
          },
          toolbar: {
            show: false
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          max: sell.price ? sell.price * 1.01 : Math.min(...prices),
          min: buy.price ? buy.price * 0.99 : Math.min(...prices)
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
            show: true
          },
        },
        annotations: {
          yaxis: [buyAnnotation, sellAnnotation],
        },
        markers: {
          size: 0,
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        colors: [priceChange >= 0 ? lightBlue[300] : red[300]],
        grid: {
          show: false,
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            shadeIntensity: 0,
            type: 'vertical',
            opacityFrom: 1,
            opacityTo: 0,
          },
        },
        dataLabels: {
          enabled: false
        },
      },
      series: [{
        data: prices
      }],
    };
    if (prices.length > 0) {
      return (
        <Chart
          options={graphOptions.options}
          series={graphOptions.series}
          type="area"
          width="100%"
          height="250px"
        />
      );
    }
    return <Loading height="250px"/>;
  }
}

export default PriceChart;