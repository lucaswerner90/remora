import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(import('react-apexcharts'), { ssr: false });
class PriceChart extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { sellOrder, buyOrder, pricesList, price } = this.props;
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
    const buyOrderAnnotation = buyOrder && buyOrder.price ? {
      y: buyOrder.price,
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
        text: `Buy at ${buyOrder.price}$, margin of ${Math.round((((price / buyOrder.price) - 1) * 100) * 10) / 10}%`,
      }
    }: {};
    const sellOrderAnnotation = sellOrder && sellOrder.price ? {
      y: sellOrder.price,
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
        text: `Sell at ${sellOrder.price}$, margin of ${Math.round((((sellOrder.price/price)-1)*100)*10)/10}%`,
      }
    } : {};
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
          min: Math.min(...pricesList)*0.98,
          max: Math.max(...pricesList) * 1.02,
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
          yaxis: [priceAnnotation,buyOrderAnnotation, sellOrderAnnotation],
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
        data: this.props.pricesList
      }],
    };
    if (price && pricesList.length > 0) {
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
    return null;
  }
}

export default PriceChart;