import React from 'react'
import { Grid, Typography } from '@material-ui/core';
import SocketComponent from '../../common/SocketComponent';

export class CoinPrice extends SocketComponent {
  constructor(props) {
    super(props, `${props.exchange}_${props.coinID}_latest_price`);
    this.state = { ...props, price: 0 };
  }
  onSocketData = (price) => {
    this.setState({ ...this.state, price });
  }
  render() {
    const { price, against } = this.state;
    return (
      <Grid item>
        <Typography variant="body1">
          {price}{against}
        </Typography>
      </Grid>
    );
  }
}

export default CoinPrice
