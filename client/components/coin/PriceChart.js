// import React, { Component } from 'react'

// export class PriceChart extends Component {
//   render() {
//     return (
//       <div>
//         <p>{this.props.pricesList}</p>
//         <p>{this.props.buyOrder}</p>
//         <p>{this.props.sellOrder}</p>
//       </div>
//     )
//   }
// }

// export default PriceChart;


import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';

class PriceChart extends Component {
  render() {
    const chartData = [];
    const { buyOrder, sellOrder } = this.props;
    const buyOrderValue = buyOrder && buyOrder.price ? buyOrder.price : 0;
    const sellOrderValue = sellOrder && sellOrder.price ? sellOrder.price : 0;
    for (let i = 0; i < 3; i++) {
      chartData.push({ buy: buyOrderValue, sell: sellOrderValue });
      
    }
    return (
      <div>
        <p>Buy order: {buyOrder}</p>
        <p>Sell order: {sellOrder}</p>
        <ResponsiveContainer width="25%" height={320}>
          <LineChart data={chartData}>
            <YAxis />
            <Line type="monotone" dataKey="buy" stroke="#4caf50" />
            <Line type="monotone" dataKey="sell" stroke="#ff0000" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
};
export default PriceChart;