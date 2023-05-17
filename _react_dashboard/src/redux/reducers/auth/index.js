// **  Initial State
const initialState = {
  isLogin: false,
  userData: {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        isLogin: true,
        userData: action.user,
      };
    case 'LOGOUT':
      return { isLogin: false, userData: {} };
    default:
      return state;
  }
};

export default authReducer;
