import axios from '../axiosConfig';
import errorsHandler from '../errors';

// ** GET ALL DATA
export const getHomepageData = () => {
  return async (dispatch) => {
    await axios
      .get('/')
      .then(async (res) => {
        await dispatch({
          type: 'GET_HOMEPAGE_DATA',
          data: res.data,
        });
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
  };
};
// ** GET POSTS STATS
export const getPostsStats = () => {
  return async (dispatch) => {
    await axios
      .get('/posts-stats')
      .then(async (res) => {
        await dispatch({
          type: 'GET_POSTS_STATS',
          data: res.data,
        });
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
  };
};
