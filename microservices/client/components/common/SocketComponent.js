import React, { Component } from 'react'
import io from 'socket.io-client';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { backend = 'localhost:8080' } = publicRuntimeConfig;

export class SocketComponent extends Component {
  onSocketData = () => { };
  constructor(props, channel) {
    super(props);
    this.socket = io(backend, { forceNew: true });
    this.channel = channel;
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }
  componentDidMount() {
    this.socket.on(this.channel, this.onSocketData);
  }
  render() {
    throw Error('You need to include the render() method');
  }
}

export default SocketComponent;
