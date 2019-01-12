import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { withStyles } from '@material-ui/core/styles';
import lightBlue from '@material-ui/core/colors/lightBlue';
import grey from '@material-ui/core/colors/grey';
import Paper from '@material-ui/core/Paper';

const Chart = dynamic(import('react-apexcharts'), { ssr: false });

const styles = theme => ({
  paper: {
    boxShadow: 'none',
  },
  fake: {
    backgroundColor: grey[100],
    height: theme.spacing.unit,
    margin: theme.spacing.unit * 2,
    // Selects every two elements among any group of siblings.
    '&:nth-child(2n)': {
      marginRight: theme.spacing.unit * 3,
    },
  },
});

class GenericPriceChart extends Component {
  constructor(props) {
    super(props, `${props.exchange}_${props.coinID}_price_list`);
  }
  render() {
    const { prices = [], buy: buyOrder = {}, sell: sellOrder = {} } = this.props;
    const buyOrderAnnotation = buyOrder && buyOrder.price ? {
      y: buyOrder.price,
      borderColor: '#00E396',
      label: {
        position: 'left',
        offsetX: 100,
        offsetY: 13,
        borderColor: '#00E396',
        style: {
          color: '#fff',
          background: '#00E396',
          fontFamily: 'Roboto',
          fontSize: '0.5rem'
        },
        text: `Buy at ${buyOrder.price}$`,
      }
    } : {};
    const sellOrderAnnotation = sellOrder && sellOrder.price ? {
      y: sellOrder.price,
      borderColor: '#FF4560',
      label: {
        position: 'left',
        offsetX: 100,
        offsetY: 0,
        borderColor: '#FF4560',
        style: {
          color: '#fff',
          background: '#FF4560',
          fontFamily: 'Roboto',
          fontSize: '0.5rem'
        },
        text: `Sell at ${sellOrder.price}$`,
      }
    } : {};
    const { classes } = this.props;
    const fakeDivs = <div className={classes.fake} />;
    const graphOptions = {
      options: {
        chart: {
          toolbar: {
            show: false
          },

        },
        tooltip: {
          show: false,
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          min: Math.min(...prices),
          max: Math.max(...prices),
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
          }
        },
        annotations: {
          yaxis: [buyOrderAnnotation, sellOrderAnnotation],
        },
        markers: {
          size: 0,
        },
        stroke: {
          curve: 'straight',
          width: 2
        },
        colors: [lightBlue[300]],
        // colors: [priceIncreased ? lightGreen[300] : red[300]],
        grid: {
          show: false,
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
          type="line"
          width="100%"
          height="200px"
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