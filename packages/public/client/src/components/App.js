import React, { Component } from 'react';
import './App.css';

import io from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props);
    const socket = io.connect('178.62.121.203');
    socket.on('connect', () => {
      console.log('Client connected...');
      
      socket.on('gdax_new_order', (message) => {
        console.log('GDAX');
        console.table(message);
      });
      socket.on('binance_new_order', (message) => {
        console.log('BINANCE');
        console.table(message);
      });
      
      // socket.on('binance_volume_difference', (message) => {
      //   console.log('Volume difference');
      //   console.table(message);
      // });
      // socket.on('binance_price_list', (message) => {
      //   console.log(message);
      // });
    });
    
  }
  
  render() {
    return (
      <div className="App">
        Welcome to Rémora
      </div>
    );
  }
  
}

export default App;
