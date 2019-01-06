import React, { Component } from 'react'
import PriceChart from './PriceChart';

export class Coin extends Component {
  render() {
    const { tendency, symbol, price, priceChange24hr, pricesList, volumeDifference, buyOrder, sellOrder } = this.props;
    return (
      <div>
        <p>Symbol: {symbol}</p>
        <p>Tendency: {tendency}</p>
        <p>Price: {price}</p>
        <p>Prices Change 24 hr: {priceChange24hr}%</p>
        <p>Volume Difference: {volumeDifference}%</p>
        <p>Prices List: {pricesList}%</p>
        <PriceChart pricesList={pricesList} buyOrder={buyOrder} sellOrder={sellOrder}/>
      </div>
    )
  }
}

export default Coin;
