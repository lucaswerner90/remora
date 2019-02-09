import React, { Component } from 'react'


import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SendIcon from '@material-ui/icons/Send';
import ChatIcon from '@material-ui/icons/Chat';
import Badge from '@material-ui/core/Badge';

import { connect } from 'react-redux';

import fetch from 'isomorphic-unfetch';

import io from 'socket.io-client';
import getConfig from 'next/config';
import { Divider, Avatar, ClickAwayListener, Fade } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';

const mapReduxStateToComponentProps = state => ({
  selectedCoin: state.user.userPreferences.selectedCoin,
  coinInfo: state.coins.coins[state.user.userPreferences.selectedCoin],
  name: state.user.userInfo.name,
  avatar: state.user.userInfo.picture,
});

const chatStyle = { zIndex: 100, maxWidth: '50px', width: '100%', position: 'fixed', bottom: '2%', right: '2%' };

const welcomeMessage = {
  created: Date.now(),
  name: 'Rémora',
  avatar: '/static/images/icons/whale_tail_avatar.png',
  message: 'Hi ! Why don\'t you share your knowledge with the world?'
}
const { publicRuntimeConfig } = getConfig();
const { api } = publicRuntimeConfig;

const socket = io(api, { forceNew: true });

export class Chat extends Component {
  state = {
    open: false,
    chatMessages: [welcomeMessage],
    message:'',
    pendingNotifications: 0
  };
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  componentDidUpdate() {
    if (this.ref.current) {
      this.ref.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  }

  onReceiveChatMessage = (info) => {
    this.setState({
      ...this.state,
      chatMessages: [...this.state.chatMessages, info],
      pendingNotifications: this.state.pendingNotifications+1
    });
    this.newMessagePlayAudio();
  }
  
  newMessagePlayAudio = () => {
    const audio = new Audio('/static/sounds/new_chat_message.mp3');
    audio.play();  
  }

  handleMessageChange = (event = new Event()) => {
    const message = event.target.value;
    this.setState({ ...this.state, message });
  }

  onSendMessage = () => {
    const info = {
      message: this.state.message,
      name: this.props.name,
      created: Date.now(),
      avatar: this.props.avatar || '',
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
    const messagesFetch = await fetch(`${api}/api/chat/messages`, request);
    const { messages } = await messagesFetch.json();
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
  componentDidMount() {
    socket.on(`${this.props.selectedCoin}_chat`, this.onReceiveChatMessage);
    this.getInitialMessages(`${this.props.selectedCoin}_chat`);

  }

  componentWillUnmount() {
    socket.off(`${this.props.selectedCoin}_chat`);
  }

  renderMessages = (chatMessages) => {
    return chatMessages.map(({ message = '', name = '', created = Date.now(), avatar = '' }) => {
      const time = new Date(created);
      const parsedMinutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
      const parsedHours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
      const parsedTime = `${parsedHours}:${parsedMinutes}`;
      return (
        <ListItem key={created} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={name} src={avatar} />
          </ListItemAvatar>
        <ListItemText
          primary={
              <Grid container alignItems="center">
                <Grid item xs={10}>
                  <Typography component="span" variant="body1" color="textPrimary" align="left" style={{display: 'inline-block'}}>
                    {name}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography component="span" variant="body2" color="textPrimary" align="right" style={{display: 'inline-block'}}>
                    {parsedTime}
                  </Typography>
                </Grid>
            </Grid>    
          }
          secondary={
            <React.Fragment>
              <Typography component="span" style={{color:cyan[500]}}>
                {message}
              </Typography>
              </React.Fragment>
            }
            />
          <Divider/>
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
        <div style={{ ...chatStyle, maxWidth: '350px' }}>
          <ClickAwayListener onClickAway={() => this.setState({ ...this.state, open: false })}>
            <Fade in={open} timeout={{ enter: 1 * 1000, exit: 1 * 1000 }}>
            
            <Grid container spacing={16} style={{ background: 'rgba(4, 21, 51, 0.85)', padding: 20, borderRadius: 10 }}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {coinInfo.name} ({coinInfo.symbol}{coinInfo.against})
                </Typography>
                <Typography variant="body2" style={{ textTransform: 'uppercase' }}>
                  {coinInfo.exchange}
                </Typography>
                <Divider style={{ marginTop: '10px' }} />
              </Grid>
              <Grid item xs={12}>
                <List dense={true} style={{ overflowY: 'auto', height: '40vh' }}>
                  {this.renderMessages(chatMessages)}
                  <div ref={this.ref} id="lastListItem"></div>
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
                  autoFocus={true}
                  onChange={this.handleMessageChange}
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => this.onSendMessage()} aria-label="Send message">
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            </Fade>
          </ClickAwayListener>
          <IconButton style={{ float: 'right', background: '#0000001f' }} onClick={() => {
            this.setState({ ...this.state, open: !this.state.open, pendingNotifications: 0 });
          }
          }>
            <ChatIcon />
          </IconButton>
              
        </div>
      );
    } else {
      return (
        <div style={chatStyle}>
          <Badge badgeContent={pendingNotifications > 1 ? '+1' : pendingNotifications} color="secondary">
            <IconButton style={{ background: '#0000001f'}} onClick={() => this.setState({...this.state, open: !this.state.open})}>
              <ChatIcon />
            </IconButton>
          </Badge>
        </div>
      );
    }
  }
}

export default connect(mapReduxStateToComponentProps)(Chat);
