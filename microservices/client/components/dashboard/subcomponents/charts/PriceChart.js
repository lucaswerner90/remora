import React from 'react';
import PropTypes from 'prop-types';

import dynamic from 'next/dynamic';
import lightBlue from '@material-ui/core/colors/lightBlue';

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
    const { prices = [] } = this.props;
    const differentPrice = prices.length && nextProps.prices.length && (prices[prices.length - 1] !== nextProps.prices[prices.length - 1]);

    const rerender = differentPrice;
    return rerender;
  }
  render() {
    const { sell={}, buy={}, prices=[] } = this.props;
    const price = prices.length ? prices[prices.length - 1] : 0;
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
          fontSize: '10px'
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
          fontSize: '10px'
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
          yaxis: [buyAnnotation, sellAnnotation],
        },
        markers: {
          size: 0,
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        colors: ['#fff'],
        grid: {
          show: false,
        },
        fill: {
          type: 'gradient',
          gradient: {
            gradientToColors: ['#fff', lightBlue[500]],
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
          height="300px"
        />
      );
    }
    return null;
  }
}

export default PriceChart;