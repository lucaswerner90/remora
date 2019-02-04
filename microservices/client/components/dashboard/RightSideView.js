import React from 'react';
import CoinsList from './subcomponents/CoinsList';
import NotificationsList from './subcomponents/NotificationsList';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

class RightSideView extends React.Component {
  state = {
    filter:''
  }
  handlerFilterChange = (event) => {
    this.setState({ ...this.state, filter: event.target.value });
  }
  renderSearchInput = () => {
    return (
      <Grid item xs={12} style={{ textAlign: 'right' }}>
        <TextField
          id="outlined-search"
          label="Search for coins or notifications"
          type="text"
          margin="dense"
          variant="standard"
          onChange={this.handlerFilterChange}
          autoCapitalize="true"
          autoFocus={true}
          fullWidth={true}
          autoComplete="off"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    );
  }

  handleShowFilters = () => {
    const currentValue = this.state.showFilters;
    this.setState({ ...this.state, showFilters: !currentValue });
  }
  render() {
    return (
      <Grid container spacing={24} alignContent="center" style={{position:'relative'}}>
        <Grid item xs={12}>
          {this.renderSearchInput()}
        </Grid>
        <Grid item xs={12}>
          <CoinsList filter={this.state.filter}/>
        </Grid>
        <Grid item xs={12}>
          <NotificationsList filter={this.state.filter}/>
        </Grid>
      </Grid>
    );
  }
}

export default RightSideView;