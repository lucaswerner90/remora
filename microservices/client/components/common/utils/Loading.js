import React, { PureComponent } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default class Loading extends PureComponent {
  render() {
    return (
      <CircularProgress color="secondary" variant="indeterminate"/>
    );
  }
}
