import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import TimelineIcon from '@material-ui/icons/Timeline';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from 'next/link';
import { Divider, Typography } from '@material-ui/core';
import auth from '../components/authentication/Auth';
const styles = {
  fullList: {
    width: 250,
    paddingTop: '40px',
    height:'100vh',
    background: 'rgb(7, 16, 43)'
  },
};

class HeaderMenu extends React.Component {
  state = {
    left: false,
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    const { classes } = this.props;

    const fullList = (
      <div className={classes.fullList}>
        <Typography variant="h4" style={{width:'90%', marginLeft:'20px', marginBottom:'20px'}}>
          rémora
        </Typography>
        <List>
          <Link href="/">
            <ListItem button key="home">
              <ListItemIcon><HomeIcon style={{ color: 'white' }} /></ListItemIcon>
              <ListItemText primary='Home' />
            </ListItem>
          </Link>
          <Link href="/dashboard">
            <ListItem button key="dashboard">
              <ListItemIcon><TimelineIcon style={{ color: 'white' }} /></ListItemIcon>
              <ListItemText primary='Dashboard' />
            </ListItem>
          </Link>
          <Link href="/settings">
            <ListItem button key="settings">
              <ListItemIcon><SettingsIcon style={{ color: 'white' }} /></ListItemIcon>
              <ListItemText primary='Settings' />
            </ListItem>
          </Link>
          <Divider style={{marginTop:'60px', marginBottom:'10px'}}/>
          <ListItem button key="logout" onClick={() => auth.logout()} >
            <ListItemIcon><PowerSettingsNewIcon style={{ color: 'white' }} /></ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItem>
        </List>
      </div>
    );

    return (
      <div>
        <IconButton
          style={{color:'white'}}
          aria-label="Menu"
          onClick={this.toggleDrawer('left', true)}>
          <MenuIcon />
        </IconButton>
        <SwipeableDrawer
          open={this.state.left}
          onClose={this.toggleDrawer('left', false)}
          onOpen={this.toggleDrawer('left', true)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            {fullList}
          </div>
        </SwipeableDrawer>

      </div>
    );
  }
}

HeaderMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HeaderMenu);
