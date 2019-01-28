import React from 'react';
import CoinsList from './subcomponents/CoinsList';
import NotificationsList from './subcomponents/NotificationsList';

class RightSideView extends React.Component {

  render() {
    return (
      <React.Fragment>
        <CoinsList />
        <NotificationsList />
      </React.Fragment>
    );
  }
}

export default RightSideView;