import React from 'react';

import { Grid, Typography, Card, CardContent, CardActions, IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import CoinPrice from '../coin/CoinPrice';
import GenericPriceChart from '../coin/GenericPriceChart';
import CoinCardButtons from '../coin/CoinCardButtons';

const coinRender = (coins = [], size = 3, {showExchange = false}) => {
  return coins.map(({ url = '', isFavorite = false, name = '', against = '', coinSymbol = '', id = '', exchange = '' }) =>
    <Grid key={`${name}_${id}`} item xs={size}>
      <Card>
        <CardContent>
          <Grid container style={{ flexGrow: 1 }} spacing={0}>

            <Grid item xs={8}>
              <Typography variant="body1">
                <strong>{name}</strong> ({coinSymbol})
                {showExchange ?
                  <span style={{ color: 'grey', fontSize: '0.625rem', marginLeft:'4px' }}>
                    {exchange.toUpperCase()}
                  </span>
                : null}
              </Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'right' }}>
              {isFavorite ?
                <IconButton style={{ padding: '4px' }} aria-label="Add to favorites">
                  <StarIcon fontSize="small" />
                </IconButton>
                :
                <IconButton style={{ padding: '4px' }} aria-label="Add to favorites">
                  <StarBorderIcon fontSize="small" />
                </IconButton>
              }
            </Grid>
            
            <Grid item xs={3} style={{ textAlign: 'right' }}>
              <CoinPrice exchange={exchange} against={against} coinID={id} />
            </Grid>
            <Grid item xs={3} style={{ textAlign: 'right' }}>
              <CoinPrice exchange={exchange} against={against} coinID={id} />
            </Grid>
            <Grid item xs={3} style={{ textAlign: 'right' }}>
              <CoinPrice exchange={exchange} against={against} coinID={id} />
            </Grid>
            <Grid item xs={3} style={{ textAlign: 'right' }}>
              <CoinPrice exchange={exchange} against={against} coinID={id} />
            </Grid>
            
            <Grid item xs={12}>
              <GenericPriceChart exchange={exchange} coinID={id} />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <CoinCardButtons coin={id} url={url}/>
        </CardActions>
      </Card>
    </Grid>
  )
};

export default coinRender;