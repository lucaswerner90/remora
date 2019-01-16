import React from 'react';
import PropTypes from 'prop-types';

import dynamic from 'next/dynamic';
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
    const { buy = {}, sell = {}, prices = [] } = this.props;
    const differentbuy = buy && buy.price && (buy.price !== nextProps.buy.price);
    const differentsell = sell && sell.price && (sell.price !== nextProps.sell.price);
    const differentPrice = prices.length && nextProps.prices.length && (prices[prices.length - 1] !== nextProps.prices[prices.length - 1]);

    const rerender = differentbuy || differentsell || differentPrice;
    return rerender;
  }
  render() {
    const { sell={}, buy={}, prices=[] } = this.props;
    const price = prices.length ? prices[prices.length - 1] : 0;
    const priceAnnotation = price ? {
      y: price,
      borderColor: 'blue',
      label: {
        position: 'right',
        offsetX: -20,
        offsetY: -10,
        borderColor: 'blue',
        style: {
          color: '#fff',
          background: 'blue',
          fontFamily: 'Roboto',
          fontSize: '12px'
        },
        text: `Price: ${price}$`,
      }
    } : {};
    const buyAnnotation = buy && buy.price ? {
      y: buy.price,
      borderColor: '#00E396',
      label: {
        position: 'left',
        offsetX: 400,
        offsetY: 20,
        borderColor: '#00E396',
        style: {
          color: '#fff',
          background: '#00E396',
          fontFamily: 'Roboto',
          fontSize: '12px'
        },
        text: `Buy at ${buy.price}$, margin of ${Math.round((((price / buy.price) - 1) * 100) * 10) / 10}%`,
      }
    }: {};
    const sellAnnotation = sell && sell.price ? {
      y: sell.price,
      borderColor: '#FF4560',
      label: {
        position: 'left',
        offsetX: 200,
        offsetY: -10,
        borderColor: '#FF4560',
        style: {
          color: '#fff',
          background: '#FF4560',
          fontFamily: 'Roboto',
          fontSize: '12px'
        },
        text: `Sell at ${sell.price}$, margin of ${Math.round((((sell.price/price)-1)*100)*10)/10}%`,
      }
    } : {};
    const graphOptions = {
      options: {
        tooltip: {
          enabled: false,
        },
        chart: {
          toolbar: {
            show: false
          },
          
        },
        tooltip: {
          show: false,
        },
        yaxis: {
          labels: {
            show: true,
            minWidth: 0,
            maxWidth: 160,
            style: {
              color: 'primary',
              fontSize: '12px',
              fontFamily: 'Roboto',
              cssClass: 'apexcharts-yaxis-label',
            },
            offsetX: 0,
            offsetY: 0,
            formatter: (val) => Math.round(val)
          },
          axisBorder: {
            show: true,
            color: 'primary',
            width: 1,
          },
          min: Math.min(...prices)*0.98,
          max: Math.max(...prices) * 1.02,
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
          axisTicks:{
            show: false
          }
        },
        markers: {
          size: 0,
        },
        annotations: {
          yaxis: [priceAnnotation,buyAnnotation, sellAnnotation],
        },
        stroke: {
          curve: 'straight',
        },
        grid: {
          column: {
            colors: ['transparent'],
            opacity: 0.2
          },
          row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
          },
        },
      },
      series: [{
        name: 'Price',
        data: this.props.prices
      }],
    };
    if (prices.length > 0) {
      return (
        <Chart
          options={graphOptions.options}
          series={graphOptions.series}
          type="line"
          width="100%"
          height="300px"
        />
      );
    }
    return null;
  }
}

export default PriceChart;