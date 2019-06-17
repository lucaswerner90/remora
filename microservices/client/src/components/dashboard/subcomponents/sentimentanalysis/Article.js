import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Typography, ListItem, ListItemAvatar, ListItemText, Avatar } from '@material-ui/core';
const Article = ({ article }) => {
  const { publishedAt, description = '', title = '', source = { name: '' }, url = '', urlToImage } = article;
  const time = new Date(publishedAt).toLocaleString();
  return (
    <ListItem alignItems="flex-start" dense button onClick={() => window.open(url, '_blank')}>
      <ListItemAvatar>
        <Avatar alt={title} style={{ width: 40, height: 40 }} src={urlToImage} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h6">
                {title}
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
          <React.Fragment>
            <Typography variant="body2">
              {description}
            </Typography>
            <Typography variant="body2">
              <i>{source.name}</i>
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
}

Article.propTypes = {
  article: PropTypes.object.isRequired
};
Article.defaultProps = {
  article: {
    publishAt: '',
    author: '',
    description: '',
    sentiment: 0,
    source: {
      id: '',
      name: ''
    },
    title: '',
    url:'',
    urlToImage:'',
  }
};
export default Article;