import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Typography, ListItem, ListItemAvatar, ListItemText, Avatar } from '@material-ui/core';
const Tweet = ({ tweet }) => {
  const { created, text, user, id, entities } = tweet;
  const decodedText = text.replace(/&amp/g,'&');
  const time = new Date(created).toLocaleString();
  return (
    <ListItem alignItems="flex-start" dense button onClick={() => window.open(`https://twitter.com/${user.screen_name}/status/${id}`, '_blank')}>
      <ListItemAvatar>
        <Avatar alt={user.screen_name} style={{width:40,height:40}} src={user.profile_image_url.replace(/http:\/\//g,'//')} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h6">
                {user.screen_name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {time}
              </Typography>
            </Grid>
          </Grid>
        }
        secondary={
          <Typography variant="body2">
            {decodedText}
          </Typography>
        }
      />
    </ListItem>
  );
}

Tweet.propTypes = {
  tweet: PropTypes.object.isRequired
};
Tweet.defaultProps = {
  tweet: {
    created:Date.now(),
    text:'',
    user:''
  }
};
export default Tweet;