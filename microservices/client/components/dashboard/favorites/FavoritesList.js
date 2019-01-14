import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Grid, Typography } from '@material-ui/core';
import CoinSocketComponent from '../../common/CoinSocketComponent';


import { connect } from 'react-redux';
import { getFavorites } from '../../../redux/actions/coinActions';

const mapStateToProps = state => ({
  favorites: state.coin.favorites,
});

const renderList = (coinsArray = [], tileSize = 3, {showExchange = false}) => {
  return coinsArray.map(coin =>
    <CoinSocketComponent key={coin.id} coin={coin} tileSize={tileSize} showExchange={showExchange} isFavorite={true}/>
  );
}
export class FavoritesList extends Component {

  static propTypes = {
    favorites: PropTypes.arrayOf(PropTypes.object).isRequired
  };
  static defaultProps = {
    favorites:[]
  }

  componentWillMount() {
    this.props.getFavorites();
  }

  render() {
    const { favorites = [] } = this.props;
    const header = (
      <Grid item xs={12}>
        <Typography variant="h4">
          <strong>Favorites</strong>
        </Typography>
        <Typography variant="body1">
          Add coins to your favorites and get access to more info faster.
        </Typography>
      </Grid>
    );
    
    return (
      <Grid container style={{flexGrow:1}} spacing={24}>
        {header}
        {(() => {
          if (favorites && favorites.length) {
            return (
              <Grid item xs={12}>
                <Grid container style={{flexGrow:1}} spacing={24}>
                  {renderList(favorites, 4, { showExchange: true, isFavorite: true })}
                </Grid>
              </Grid>
            );
          }
          return null;
        })()}
      </Grid>
    );
  }
}

export default connect(mapStateToProps, { getFavorites })(FavoritesList);
