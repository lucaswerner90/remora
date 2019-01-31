import React, { Component } from 'react'


import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SendIcon from '@material-ui/icons/Send';
import MessageIcon from '@material-ui/icons/MessageOutlined';
import Badge from '@material-ui/core/Badge';

import { connect } from 'react-redux';

import fetch from 'isomorphic-unfetch';

import io from 'socket.io-client';
import getConfig from 'next/config';
import { Paper } from '@material-ui/core';

const mapReduxStateToComponentProps = state => ({
  selectedCoin: state.user.userPreferences.selectedCoin,
  coinInfo: state.coins.coins[state.user.userPreferences.selectedCoin],
  username: state.user.userInfo.username
});

const welcomeMessage = {
  created: Date.now(),
  username:'Rémora',
  message: 'Hi! Why don\'t you share your ideas with the world about this coin?'
}
const { publicRuntimeConfig } = getConfig();
const { backend = 'localhost:8080' } = publicRuntimeConfig;

const socket = io(backend, { forceNew: true });

export class Chat extends Component {
  state = {
    open: false,
    chatMessages: [welcomeMessage],
    message:'',
    pendingNotifications: 0
  };

  onReceiveChatMessage = (info) => {
    this.setState({
      ...this.state,
      chatMessages: [...this.state.chatMessages, info],
      pendingNotifications: this.state.pendingNotifications+1
    });
  }

  handleMessageChange = (event = new Event()) => {
    const message = event.target.value;
    this.setState({ ...this.state, message });
  }

  onSendMessage = () => {
    const info = {
      message: this.state.message,
      username: this.props.username,
      created: Date.now()
    };
    socket.emit(`${this.props.selectedCoin}_chat`, info);
    this.setState({ ...this.state, message: '' });
    
  }
  componentWillReceiveProps(nextProps) {
    const newChannel = `${nextProps.selectedCoin}_chat`;
    socket.off(`${this.props.selectedCoin}_chat`);
    socket.on(newChannel, this.onReceiveChatMessage);
    this.setState({
      ...this.state,
      open: false,
      chatMessages: [welcomeMessage],
      pendingNotifications: 0
    });
    this.getInitialMessages(newChannel);
  }
  getInitialMessages = async(chatChannel) => {
    const request = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ chat: chatChannel }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const messagesFetch = await fetch(`http://${backend}/api/chat/messages`, request);
    const { messages = [] } = await messagesFetch.json();
    if (this.state.open) {
      this.setState({
        ...this.state,
        chatMessages: messages.length ? messages : [welcomeMessage]
      });
    } else {
      this.setState({
        ...this.state,
        pendingNotifications: messages.length,
        chatMessages: messages.length ? messages : [welcomeMessage]
      });
      
    }
  }
  componentWillMount() {
    socket.on(`${this.props.selectedCoin}_chat`, this.onReceiveChatMessage);
    this.getInitialMessages(`${this.props.selectedCoin}_chat`);

  }

  componentWillUnmount() {
    socket.off(`${this.props.selectedCoin}_chat`);
  }

  renderMessages = (chatMessages) => {
    return chatMessages.map(({ message, username, created }) => {
      const time = new Date(created);
      const parsedMinutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
      const parsedHours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
      const parsedTime = `${parsedHours}:${parsedMinutes}`;
      return (
        <ListItem key={created} alignItems="flex-start">
        <ListItemAvatar>
          <PersonIcon color="primary"/>
        </ListItemAvatar>
        <ListItemText
          primary={
            <React.Fragment>
                <Typography component="span" variant="body1" color="textPrimary">
                {`${username}`}
              </Typography>
            </React.Fragment>    
          }
          secondary={
            <React.Fragment>
              <Typography component="span" color="textPrimary">
                {message}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      );
    });
  }
  render() {
    const { chatMessages = [] } = this.state;
    const { coinInfo = { name: '', exchange: '', symbol: '', against: '' } } = this.props;
    const { open = false , pendingNotifications = 0} = this.state;
    if (open) {
      return (
        <div style={{ zIndex: 100, maxWidth: '300px', width: '100%', position: 'fixed', bottom: '5%', right: '5%' }}>
          <Grid container spacing={16} style={{ background: 'rgba(34, 35, 35, 0.52)', padding:20, borderRadius: 10}}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {coinInfo.name} ({coinInfo.symbol}{coinInfo.against}) 
              </Typography>
              <Typography variant="body2" style={{textTransform:'uppercase'}}>
                {coinInfo.exchange}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <List dense={true} style={{ overflowY: 'auto', height:'40vh'}}>
                {this.renderMessages(chatMessages)}
              </List>
            </Grid>
            <Grid item xs={12}>
              <TextField
                placeholder="Send a message"
                fullWidth
                value={this.state.message}
                onKeyPress={({ key }) => {
                  if (key === 'Enter') this.onSendMessage();
                }}
                onChange={this.handleMessageChange}
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="primary" onClick={() => this.onSendMessage()} aria-label="Send message">
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <IconButton style={{ float: 'right', background:'#47a9fd85' }} onClick={() => {
            this.setState({ ...this.state, open: !this.state.open, pendingNotifications: 0 });
          }
          }>
            <MessageIcon />
          </IconButton>
            
        </div>
      )
    } else {
      return (
        <div style={{ zIndex: 100, maxWidth: '50px', width: '100%', position: 'fixed', bottom: '5%', right: '5%' }}>
          <Badge badgeContent={pendingNotifications} color="secondary">
            <IconButton style={{ background: '#47a9fd85'}} onClick={() => this.setState({...this.state, open: !this.state.open})}>
              <MessageIcon />
            </IconButton>
          </Badge>
        </div>
      );
    }
  }
}

export default connect(mapReduxStateToComponentProps)(Chat);
