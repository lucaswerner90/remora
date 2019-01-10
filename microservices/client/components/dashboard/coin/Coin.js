import React, { Component } from 'react'
import io from 'socket.io-client';
import CoinCard from './Card';

export class Coin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: 0,
      pricesList: [],
      priceChange24hr: 0,
      volumeDifference: 0,
      tendency: '',
      buyOrder: {},
      sellOrder: {},
      symbol: this.props.symbol
    };
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }
  componentDidMount() {
    const { exchange, symbol } = this.props;
    this.socket = io('localhost:8080', { forceNew: true });
    this.socket.on(`${exchange}_${symbol}`, (data) => {
      const { type } = data;
      switch (type) {
        case 'volume_difference':
          const volumeDifference = data.currentVolumeDifference;
          const tendency = data.tendency;
          this.setState({ volumeDifference, tendency });
          break;
        case 'latest_price':
          if (this.state.price !== data.price) {
            const price = data.price;
            this.setState({ price });
          }
          break;
        case 'price_list':
            const pricesList = data.prices;
            // const pricesList = data.prices.slice(data.prices.length-20,data.prices.length-1);
            this.setState({ pricesList });
          break;
        case 'price_change_24hr':
          const priceChange24hr = parseFloat(data.price);
          this.setState({ priceChange24hr });
          break;
        case 'order':
          const { details } = data;
          if (details.type === 'buy') {
            const buyOrder = details;
            this.setState({ buyOrder });
          } else {
            const sellOrder = details;
            this.setState({ sellOrder });
          }
          break;
        default:
          break;
      }
    });
  }
  render() {
    return (
      <div>
        <CoinCard fields={this.state}/>
      </div>
    )
  }
}

export default Coin;
