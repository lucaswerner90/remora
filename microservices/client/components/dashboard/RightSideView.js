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
      <Grid item xs={12}>
        <TextField
          label="Search coins or notifications"
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
      <Grid container spacing={40} direction="row" alignContent="center" style={{ marginLeft: '0px', borderLeft: '1px solid rgba(255, 255, 255, 0.18)' }}>
        <Grid item xs={12} style={{paddingTop:0}}>
          {this.renderSearchInput()}
        </Grid>
        <Grid item xs={12} style={{ paddingTop: 0 }}>
          <CoinsList filter={this.state.filter} style={{height:'30vh'}}/>
        </Grid>
        <Grid item xs={12} style={{ paddingTop: 0 }}>
          <NotificationsList filter={this.state.filter} style={{ height: '40vh' }}/>
        </Grid>
      </Grid>
    );
  }
}

export default RightSideView;