import React, { Component } from 'react'
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

const orders = {};

export class DashboardTable extends Component {
  constructor(props){
    super(props);
    this.state = {
      orders:[]
    };
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }
  componentDidMount(){
    const socketChannel = `${this.props.exchange}_order`;
    this.socket = io('localhost:8080', { forceNew: true });
    this.socket.on(socketChannel, (data) => {
      const { details, exchange, id, name } = data;
      const { type, position, quantity, price } = details;

      const newOrder = { exchange, id, coin: name, type, position, quantity, price };

      const orderIndex = this.state.orders.findIndex(order => order.id === newOrder.id);
      const ordersFromState = this.state.orders;

      if (orderIndex > -1) {
        ordersFromState[orderIndex] = newOrder;
      } else {
        ordersFromState.unshift(newOrder);
      }
      this.setState({ orders: ordersFromState });
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Coin</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Position</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
            {this.state.orders.map(order => {
              return (
                <TableRow key={order.id}>
                  <TableCell align="center">{order.coin}</TableCell>
                  <TableCell align="center">{order.type}</TableCell>
                  <TableCell align="center">{order.price}$</TableCell>
                  <TableCell align="center">{order.quantity}$</TableCell>
                  <TableCell align="center">{order.position}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

DashboardTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DashboardTable);