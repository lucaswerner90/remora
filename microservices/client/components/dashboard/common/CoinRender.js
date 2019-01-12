import React from 'react';
import { Grid, Typography, Card, CardContent } from '@material-ui/core';
import CoinPrice from '../coin/CoinPrice';
import GenericPriceChart from '../coin/GenericPriceChart';


const coinRender = (coins = [], size = 3, {showExchange = false}) => {
  return coins.map(({ name = '', against = '', coinSymbol = '', id = '', exchange = '' }) =>
    <Grid key={`${name}_${id}`} item xs={size}>
      <Card>
        <CardContent>
          <Grid container style={{ flexGrow: 1 }} spacing={0}>
            <Grid item xs={8}>
              <Typography variant="body1">
                <strong>{name}</strong> ({coinSymbol})
              </Typography>
            </Grid>
            
            <Grid item xs={4} style={{ textAlign: 'right' }}>
              <CoinPrice exchange={exchange} against={against} coinID={id} />
            </Grid>

            {showExchange ?
              <Grid item xs={12}>
                <Typography variant="body2" style={{ color: 'grey', fontSize: '0.625rem' }}>
                  {exchange.toUpperCase()}
                </Typography>
              </Grid>
            : null }
            
            <Grid item xs={12}>
              <GenericPriceChart exchange={exchange} coinID={id} />
            </Grid>

          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
};

export default coinRender;