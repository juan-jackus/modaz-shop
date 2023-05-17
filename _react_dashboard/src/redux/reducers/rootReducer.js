// ** Redux Imports
import { combineReducers } from 'redux';

// ** Reducers Imports
import auth from './auth';
import blog from './blog';
import users from './users';
import orders from './orders';
import navbar from './navbar';
import layout from './layout';
import errors from './errors';
import products from './products';
import modazImg from './modazImg';
import homepage from './homepage';
import customers from './customers';

const appReducer = combineReducers({
  auth,
  blog,
  users,
  orders,
  navbar,
  layout,
  errors,
  products,
  modazImg,
  homepage,
  customers,
});

// Reset state of redux store on logout
const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
