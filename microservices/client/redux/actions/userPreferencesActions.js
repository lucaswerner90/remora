import { FETCH_USER_PREFERENCES, UPDATE_USER_PREFERENCES } from './types';

import fetch from 'isomorphic-unfetch';

export const fetchPosts = () => async dispatch => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();
  dispatch({
    type: FETCH_USER_PREFERENCES,
    payload: posts
  });
};

export const createPost = postData => async dispatch => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(postData)
  });
  const post = await res.json();
  dispatch({
    type: UPDATE_USER_PREFERENCES,
    payload: post
  });
};