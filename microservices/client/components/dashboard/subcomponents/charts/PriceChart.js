import React from 'react';
import PropTypes from 'prop-types';

import dynamic from 'next/dynamic';
import { green, blueGrey, grey } from '@material-ui/core/colors';
import Loading from '../../../common/utils/Loading';
import { Fade } from '@material-ui/core';

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
      borderColor: buy.hasDissapeared ? grey[500] : green[500],
      label: {
        position: 'left',
        offsetX: 400,
        offsetY: 5,
        borderColor: 'none',
        style: {
          color: 'white',
          background: buy.hasDissapeared ? grey[500] : green[500],
          fontFamily: 'Roboto',
          fontSize: '0.75rem'
        },
        text: `Buy at ${buy.price}$`,
      }
    } : {};
    
    const sellAnnotation = sell && sell.price ? {
      y: sell.price,
      strokeDashArray: 0,
      borderColor: sell.hasDissapeared ? grey[500] : 'rgb(255,0,102)',
      label: {
        position: 'left',
        offsetX: 300,
        offsetY: 5,
        borderColor: 'none',
        style: {
          color: 'white',
          background: sell.hasDissapeared ? grey[500] : 'rgb(255,0,102)',
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
          yaxis: buyAnnotation || sellAnnotation ? [buyAnnotation, sellAnnotation] : none,
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
    if (prices.length > 0 && sell.price && buy.price) {
      return (
        <Fade in={prices.length > 0} timeout={{ enter: 2 * 1000 }}>
          <Chart
            options={graphOptions.options}
            series={graphOptions.series}
            type="area"
            width="100%"
            height="350px"
          />
        </Fade>
      );
    }
    return (
      <div style={{height:'350px', width:'100%', paddingTop:'11rem', textAlign:'center'}}>
        <Fade in={prices.length > 0} timeout={{ enter: 2 * 1000, exit: 2*1000 }}>
          <Loading style={{ height: "250px" }} />
        </Fade>
      </div>
    );
  }
}

export default PriceChart;