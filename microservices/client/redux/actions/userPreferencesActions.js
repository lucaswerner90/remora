import { UPDATE_USER_PREFERENCES, UPDATE_USER_FAVORITE_COINS, UPDATE_USER_SELECTED_COIN, UPDATE_USER_INFO, UPDATE_USER_NOTIFICATIONS } from './types';

export const updateUserSelectedCoin = payload => dispatch => {
  dispatch({
    payload,
    type: UPDATE_USER_SELECTED_COIN,
  });
}
export const updateUserNotifications = payload => dispatch => {
  dispatch({
    payload,
    type: UPDATE_USER_NOTIFICATIONS,
  });
}
export const updateUserFavorites = payload => dispatch => {
  dispatch({
    payload,
    type: UPDATE_USER_FAVORITE_COINS,
  });
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