import React from 'react';
import PropTypes from 'prop-types';

import dynamic from 'next/dynamic';
import { green, lightBlue } from '@material-ui/core/colors';
import Loading from '../../../common/utils/Loading';

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


  render() {
    const { sell = {}, buy = {}, prices = [] } = this.props;
    
    const buyAnnotation = buy && buy.price ? {
      y: buy.price,
      strokeDashArray: 0,
      borderColor: green[500],
      label: {
        position: 'left',
        offsetX: 400,
        borderColor: 'none',
        style: {
          color: green[500],
          background: green[500],
          fontFamily: 'Roboto',
          fontSize: '0.75rem'
        },
        text: `Buy at ${buy.price}$`,
      }
    } : {};
    
    const sellAnnotation = sell && sell.price ? {
      y: sell.price,
      strokeDashArray: 0,
      borderColor: 'rgb(255,0,102)',
      label: {
        position: 'left',
        offsetX: 300,
        borderColor: 'none',
        style: {
          color: 'white',
          background: 'rgb(255,0,102)',
          fontFamily: 'Roboto',
          fontSize: '0.75rem'
        },
        text: `Sell at ${sell.price}$`,
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
              speed:2000
            },
            dynamicAnimation: {
              enabled: true,
              speed: 2000
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
        },
        xaxis: {
          labels: {
            show:false,
          },
          axisBorder: {
            show: false,
          },
        },
        grid: {
          show: false
        },
        annotations: {
          yaxis: [buyAnnotation, sellAnnotation],
        },
        markers: {
          size: 0,
        },
        stroke: {
          curve: 'smooth',
          width: 4
        },
        colors: ['white'],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.9,
            opacityTo: 0,
            stops: [0, 90, 100]
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
    return <Loading height="250px" />;
  }
}

export default PriceChart;