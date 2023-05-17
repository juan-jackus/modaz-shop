// ** Initial State
const initialState = {};

const errors = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_USER_ERRORS':
      return { ...state, addUser: action.data };
    case 'ADD_CUSTOMER_ERRORS':
      return { ...state, addCustomer: action.data };
    case 'ADD_SLIDE_ERRORS':
      return { ...state, addSlide: action.data };
    case 'ADD_POST_ERRORS':
      return { ...state, addPost: action.data };
    case 'ADD_ORDER_ERRORS':
      return { ...state, addOrder: action.data };
    case 'ADD_PRODUCT_ERRORS':
      return { ...state, addProduct: action.data };
    case 'LOGIN_ERRORS':
      return { ...state, login: action.data };
    case 'UPDATE_PASSWORD_ERRORS':
      return { ...state, changePwd: action.data };
    case 'NETWORK_ERRORS':
      return { ...state, network: action.data };
    case 'CLEAR_ERRORS':
      const copieState = { ...state };
      delete copieState[action.data];
      return { ...copieState };
    default:
      return { ...state };
  }
};
export default errors;
