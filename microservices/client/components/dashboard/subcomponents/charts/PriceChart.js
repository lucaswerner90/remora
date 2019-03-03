import React from 'react';
import PropTypes from 'prop-types';

import dynamic from 'next/dynamic';
import Loading from '../../../common/utils/Loading';
import { Fade } from '@material-ui/core';
import { connect } from 'react-redux';

import { timelineChartValues } from '../../../common/constants';
const Chart = dynamic(import('react-apexcharts'), { ssr: false });

const mapReduxStateToComponentProps = state => ({
  prices: state.live.pricesList,
  buy: state.live.buyOrder,
  sell: state.live.sellOrder,
  timeline: state.dashboard.chartTimeline,
  previousBuyOrder: state.live.previousBuyOrder,
  previousSellOrder: state.live.previousSellOrder,
  price: state.live.price,
  notification: state.dashboard.hoverNotification
});



class PriceChart extends React.Component {

  static propTypes = {
    prices: PropTypes.array.isRequired,
    buy: PropTypes.object.isRequired,
    sell: PropTypes.object.isRequired,
    previousBuyOrder: PropTypes.object.isRequired,
    previousSellOrder: PropTypes.object.isRequired,
  }

  static defaultProps = {
    prices: [],
    buy: {},
    sell: {},
    previousBuyOrder: {},
    previousSellOrder: {},
  }

  shouldComponentUpdate(nextProps) {
    const { prices = [], buy, sell, price, timeline, notification } = nextProps;

    // Notification has been hovered
    if (notification !== this.props.notification) {
      return true;
    }

    // The price has changed
    if (price !== this.props.price) {
      return true;
    }
    // The user has modified the scale
    if (timeline !== this.props.timeline) {
      return true;
    }

    // From no prices at all to someprices
    if (this.props.prices.length !== prices.length) {
      return true;
    }
    
    // Latest price has changed
    if (prices.length > 0 && prices[prices.length-1][1] !== this.props.prices[this.props.prices.length-1][1]) {
      return true;
    }

    // Buy or sell orders have different prices (they have changed)
    if (buy.price !== this.props.buy.price || sell.price !== this.props.sell.price) {
      return true;
    }

    // Otherwise return false
    return false;
  }

  render() {
    const { sell = {}, buy = {}, prices = [], previousBuyOrder, previousSellOrder, price, notification, timeline } = this.props;

    // Either use the previous order or the current one checking if the price property exists
    const buyOrder = buy.price ? buy : previousBuyOrder;
    const sellOrder = sell.price ? sell : previousSellOrder;
    const buyAnnotation = buyOrder && buyOrder.price ? {
      y: buyOrder.price,
      strokeDashArray: 0,
      borderColor: buyOrder.hasDissapeared ? '#66ffff3d' : 'rgb(102,255,255)',
      label: {
        position: 'right',
        offsetX: -100,
        offsetY: 17,
        borderColor: 'none',
        style: {
          color: buyOrder.hasDissapeared ? '#66ffff3d' : 'rgb(102,255,255)',
          background: 'transparent',
          fontFamily: 'Roboto',
          fontWeight: 100,
          fontSize: buyOrder.hasDissapeared ? '0.875rem' : '1.125rem'
        },
        text: `buy at ${buyOrder.price}$`,
      }
    } : {};
    const sellAnnotation = sell && sellOrder.price ? {
      y: sellOrder.price,
      strokeDashArray: 0,
      borderColor: sellOrder.hasDissapeared ? '#ff00665e' : 'rgb(255,0,102)',
      label: {
        position: 'right',
        offsetX: -200,
        offsetY: 0,
        borderColor: 'none',
        style: {
          color: sellOrder.hasDissapeared ? '#ff00665e' : 'rgb(255,0,102)',
          background: 'transparent',
          fontFamily: 'Roboto',
          fontWeight: 100,
          fontSize: sellOrder.hasDissapeared ? '0.875rem':'1.125rem'
        },
        text: `sell at ${sellOrder.price}$`,
      }
    } : {};

    if (prices.length > 0 && buyOrder.price && sellOrder.price && price) {
      let pricesFiltered = prices;
      if (notification && notification.createdAt && timeline === timelineChartValues.MINUTE) {
        const minValue = notification.createdAt - (notification.createdAt % 60) - (100 * 60 * 1000);
        pricesFiltered = pricesFiltered.filter(price => price[0] > minValue);
      }
      let extended = (pricesFiltered[pricesFiltered.length - 1][0] - pricesFiltered[0][0])/3;
      let offsetX = 30;
      if (timeline === timelineChartValues.FIVE || timeline === timelineChartValues.FIFTEEN) {
        offsetX = 40;
      } else if (timeline === timelineChartValues.HOUR || timeline === timelineChartValues.TWOHOURS) {
        offsetX = 30;
      }

      const hoverNotification = notification && notification.createdAt ? {
        x: notification.createdAt - (notification.createdAt % 60),
        strokeDashArray: 2,
        borderColor: notification.good ? 'rgb(102,255,255)' : 'rgb(255,0,102)',
        label: {
          position: 'right',
          offsetX: 0,
          offsetY: -150,
          borderColor: 'none',
          style: {
            color: notification.good ? 'rgb(102,255,255)' : 'rgb(255,0,102)',
            background: 'transparent',
            fontFamily: 'Roboto',
            fontWeight: 100,
            fontSize: '0.75rem',
          },
          text: `${notification.message}`,
        }
      } : {};

      const priceAnnotation = price > 0 ? {
        y: price,
        strokeDashArray: 0,
        borderColor: '#ffffff7a'
      } : {};
      const values = pricesFiltered.map(price => price[1]);
      const options = {
        chart: {
          foreColor: "#ffffff12",
          toolbar: {
            show: false
          }
        },
        colors: ["white"],
        stroke: {
          width: 3
        },
        grid: {
          borderColor: "#ffffff12",
          borderWidth: 1,
          clipMarkers: false,
          yaxis: {
            lines: {
              show: false
            }
          },
          xaxis: {
            lines: {
              show: true,
            },
          }
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          gradient: {
            enabled: true,
            opacityFrom: 0.4,
            opacityTo: 0
          }
        },
        markers: {
          size: 0
        },
        tooltip: {
          enabled: true,
          theme: 'dark',
          // custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          //   return '<div class="arrow_box">' +
          //     '<span>' + series[seriesIndex][dataPointIndex] + '</span>' +
          //     '</div>'
          // },
          style: {
            fontSize: '20px',
            fontFamily: 'Roboto'
          },
          x: {
            show: true,
            format:'HH:mm'
          },
          y: {
            show:true,
            formatter:(value) => `${value}$`
          },
          marker: {
            show: false,
          },
        },
        xaxis: {
          type: "datetime",
          axisTicks:{
            show:false
          },
          axisBorder: {
            show: false
          },
          labels: {
            offsetX,
            offsetY: -15,
            style: {
              fontFamily: 'Roboto',
              color:'white',
              fontSize:'0.875rem',
              fontWeight:100
            }
          },
          format: 'dd:HH:mm',
          max: pricesFiltered[pricesFiltered.length - 1][0] + extended
        },
        annotations: {
          yaxis: buyAnnotation || sellAnnotation ? [buyAnnotation, sellAnnotation, priceAnnotation] : [priceAnnotation],
          xaxis: [hoverNotification],
          points: [
            {
              x: pricesFiltered[pricesFiltered.length-1][0],
              y: price,
              marker: {
                size: 7,
                fillColor: "#fff",
                strokeColor: "#ffffff12",
                radius: 1
              }
            }
          ]
        },
        yaxis: {
          opposite: true,
          axisBorder: {
            show: false
          },
          tooltip:{
            enabled:true
          },
          labels: {
            show: true
          },
          min: Math.min(...values),
          max: Math.max(...values)
          // min: buy.price ? Math.min(buy.price*0.99, Math.min(...values)) : Math.min(...values),
          // max: sell.price ? Math.max(sell.price*1.01, Math.max(...values)) : Math.max(...values),
        }
      };
      
      const series = [{
        name: 'Price',
        data: pricesFiltered
      }];
      return (
        <Fade in={prices.length > 0} timeout={{ enter: 2 * 1000 }}>
          <Chart
            id="priceChart"
            options={options}
            series={series}
            type="area"
            width="100%"
            height="350px"
          />
        </Fade>
      );
    }
    return (
      <div style={{ height: '350px', width: '100%', display:'flex', justifyContent: 'center', alignItems:'center' }}>
        <Fade in={prices.length > 0} timeout={{ enter: 2 * 1000, exit: 2 * 1000 }}>
          <Loading style={{ height: "350px" }} />
        </Fade>
      </div>
    );
  }
}

export default connect(mapReduxStateToComponentProps)(PriceChart);