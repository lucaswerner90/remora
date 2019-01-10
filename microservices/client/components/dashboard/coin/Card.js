import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';

import PriceChart from './PriceChart';

const title = {
  color: "primary",
  textDecoration: "none",
  fontWeight: "300",
  marginTop: "30px",
  marginBottom: "25px",
  minHeight: "32px",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  "& small": {
    color: "#777",
    fontWeight: "400",
    lineHeight: "1"
  }
};

const cardTitle = {
  ...title,
  marginTop: "0",
  marginBottom: "3px",
  minHeight: "auto",
  color: "primary",
  "& a": {
    ...title,
    marginTop: ".625rem",
    marginBottom: "0.75rem",
    minHeight: "auto"
  }
};
const textAlign = {
  textAlign: 'left'
};
const styles = theme => ({
  cardTitle,
  card: {
    background: 'white'
  },
  graphicCard: {
    // background:'linear-gradient(to bottom right, #9AA3FA , #4BA0F2)',
  },
  container: {
    flexGrow: 1,
  },
  positivePrice: {
    ...textAlign,
    color: 'green'
  },
  negativePrice: {
    ...textAlign,
    color: 'red'
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  buyOrderInfo: {
    background: 'green'
  },
  sellOrderInfo: {
    background: 'red'
  }
});

function CoinCard(props) {
  const { classes } = props;
  const { tendency, symbol, price, pricesList, priceChange24hr, volumeDifference, buyOrder, sellOrder } = props.fields;
  return (
    <div>
      <Grid container className={classes.container} spacing={24}>
        <Grid item xs={5}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Grid container className={classes.container} spacing={24}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>QUICK STATS</strong>
                    </Typography>
                    <Divider />
                  </Grid>
                </Grid>
                <Grid container className={classes.container} spacing={24}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Price Change 24hr: </strong>{priceChange24hr}%
                  </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Volume Difference: </strong>{volumeDifference}%
                  </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>    
        </Grid>
        <Grid item xs={7}>
          <Card className={classes.graphicCard}>
            <CardContent>
              <Grid container className={classes.container} spacing={24}>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>PRICE EVOLUTION</strong>
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  {pricesList.length ?
                    <PriceChart pricesList={pricesList} price={price} buyOrder={buyOrder} sellOrder={sellOrder} />
                    :
                    <CircularProgress className={classes.progress} />
                  }
                </Grid>
              </Grid>
              
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </div>


  );
}

CoinCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CoinCard);