import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { withStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import lightBlue from '@material-ui/core/colors/lightBlue';
import lightGreen from '@material-ui/core/colors/lightGreen';
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
    const { prices = [], previousValue = 0 } = this.props;
    const priceIncreased = prices.length ? Math.abs(prices[prices.length - 1] - previousValue) > 0 : false;
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
          height="100px"
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