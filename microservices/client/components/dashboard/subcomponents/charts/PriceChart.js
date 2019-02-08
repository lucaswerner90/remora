import React from 'react';
import PropTypes from 'prop-types';

import dynamic from 'next/dynamic';
import { green } from '@material-ui/core/colors';
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
          color: 'white',
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
          toolbar: {
            show: false
          },
          fontFamily: 'Roboto',
          foreColor:'white'
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          labels: {
            show:false,
            style:{
              color:'white'
            }
          },
          max: sell.price ? Math.max(sell.price, Math.max(...prices)) * 1.01 : Math.max(...prices) * 1.01,
          min: buy.price ? Math.min(buy.price, Math.min(...prices)) * 0.99: Math.min(...prices) * 0.99,
        },
        xaxis: {
          categories:[
            'Past',
            'Now',
            'Future'
          ],
          labels: {
            show: false,
            style: {
              fontSize: '1rem',
              colors:['white']
            }
          },
          axisBorder: {
            show: false
          },
        },
        grid: {
          borderColor:'white',
          show: false,
          yaxis: {
            lines: {
              show: false,
              offsetX: 0,
              offsetY: 0
            }
          },
        },
        annotations: {
          yaxis: [buyAnnotation, sellAnnotation],
        },
       
        colors:['white'],
        markers: {
          size: 0,
        },
        stroke: {
          curve: 'smooth',
          width: 4,
          lineCap: 'round',
          colors: ['white'],
          dashArray: 0,  
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
          height="350px"
        />
      );
    }
    return <Loading style={{ height: "250px" }} />;
  }
}

export default PriceChart;