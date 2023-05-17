import axios from '../axiosConfig';
import errorsHandler from '../errors';
import { getUserRoles } from '@store/actions/users';
import { getPostCategories } from '@store/actions/blog';
import { getOrderStatuses } from '@store/actions/orders';
import { getProductCategories } from '@store/actions/products';

// ** Handle User Login
export const handleLogin = (userData) => {
  let successSubmit = false;
  return async (dispatch) => {
    await axios
      .post('/login', userData)
      .then(async (res) => {
        successSubmit = true;
        await dispatch({
          type: 'LOGIN',
          user: res.data,
        });
        dispatch(getPostCategories());
        const role = res.data.role.toLowerCase();
        if (role === 'author' || role === 'editor') return;
        dispatch(getUserRoles());
        dispatch(getOrderStatuses());
        dispatch(getProductCategories());
      })
      .catch((error) => {
        const action = 'LOGIN_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};

// ** Persist User Login
export const persistLogin = () => {
  return async (dispatch) => {
    await axios.get('/users/persist-login').then(async (res) => {
      await dispatch({
        type: 'LOGIN',
        user: res.data,
      });
      dispatch(getPostCategories());
      const role = res.data.role.toLowerCase();
      if (role === 'author' || role === 'editor') return;
      dispatch(getUserRoles());
      dispatch(getOrderStatuses());
      dispatch(getProductCategories());
    });
  };
};

// ** Handle User Logout
export const handleLogout = (userId) => {
  return async (dispatch) => {
    dispatch({ type: 'LOGOUT' });
    await axios
      .post('/logout', { userId })
      .then(() => {})
      .catch(async (error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
  };
};

// ** Handle User Forgot Password
export const handleForgotPassword = (data) => {
  let successSubmit = false;
  return async (dispatch) => {
    await axios
      .post('/login/forgot-password', data)
      .then((res) => {
        successSubmit = true;
      })
      .catch((error) => {
        const action = 'LOGIN_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};

// ** Handle User Forgot Password
export const verifyResetPasswordToken = (token) => {
  return async (dispatch) => {
    let result = {};
    await axios
      .post(`/login/verify-token`, { token })
      .then((res) => {
        result = res.data;
      })
      .catch((error) => {
        const action = 'LOGIN_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return result;
  };
};

// ** Handle User Forgot Password
export const resetPassword = (data) => {
  let result = null;
  return async (dispatch) => {
    await axios
      .post('/login/reset-password', data)
      .then(async (res) => {
        result = res.data;
      })
      .catch((error) => {
        const action = 'LOGIN_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return result;
  };
};
