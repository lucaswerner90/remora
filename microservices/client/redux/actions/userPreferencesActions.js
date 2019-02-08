import fetch from 'isomorphic-unfetch';
import store from '../store';

import { UPDATE_USER_PREFERENCES, UPDATE_USER_FAVORITE_COINS, UPDATE_USER_SELECTED_COIN, UPDATE_USER_INFO, UPDATE_USER_NOTIFICATIONS } from './types';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { api } = publicRuntimeConfig;

const sendPostRequest = async (payload = {}, type = '') => {
  
  // We get the email from the other part of the redux state
  const { email = '' } = store.getState().user.userInfo;
  
  const userRequestData = {
    method: 'POST',
    body: JSON.stringify({ email, payload }),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const response = await fetch(`${document.location.origin}:8080/api/user/${type}`, userRequestData);
  return await response.json();
  

};

export const updateUserSelectedCoin = payload => async dispatch => {
  try {
    const response = await sendPostRequest(payload, 'selected');
    if (!response.error) {
      dispatch({
        payload,
        type: UPDATE_USER_SELECTED_COIN,
      });
    }
  } catch (error) {

  }
  
}
export const updateUserNotifications = payload => dispatch => {
  dispatch({
    payload,
    type: UPDATE_USER_NOTIFICATIONS,
  });
}
export const updateUserFavorites = payload => async dispatch => {
  try {
    const response = await sendPostRequest(payload, 'favorites');
    if (!response.error) {
      dispatch({
        payload,
        type: UPDATE_USER_FAVORITE_COINS,
      });
    }
  } catch (error) {
    
  }
}
export const updateUserPreferences = payload => dispatch => {
  dispatch({
    payload,
    type: UPDATE_USER_PREFERENCES,
  });
}
export const updateUserInfo = payload => dispatch => {
  dispatch({
    payload,
    type: UPDATE_USER_INFO,
  });
}




// export const fetchPosts = () => async dispatch => {
//   const res = await fetch('https://jsonplaceholder.typicode.com/posts');
//   const posts = await res.json();
//   dispatch({
//     type: FETCH_USER_PREFERENCES,
//     payload: posts
//   });
// };

// export const createPost = postData => async dispatch => {
//   const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
//     method: 'POST',
//     headers: {
//       'content-type': 'application/json'
//     },
//     body: JSON.stringify(postData)
//   });
//   const post = await res.json();
//   dispatch({
//     type: UPDATE_USER_PREFERENCES,
//     payload: post
//   });
// };