// ** Initial State
const initialState = {
  data: [],
  params: {},
  currentPage: 1,
  totalPages: 1,
  totalUsers: 0,
  selectedUser: null,
  userRoles: [],
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_USERS_DATA':
      return {
        ...state,
        data: action.data,
        totalPages: action.totalPages,
        totalUsers: action.totalUsers,
        currentPage: action.currentPage,
        params: action.params,
      };
    case 'GET_USER':
      return { ...state, selectedUser: action.selectedUser };
    case 'GET_ROLES':
      if (action.userRoles) {
        return { ...state, userRoles: action.userRoles };
      }
    case 'REMOVE_SELECTED_USER':
      return { ...state, selectedUser: null };
    default:
      return { ...state };
  }
};
export default users;
