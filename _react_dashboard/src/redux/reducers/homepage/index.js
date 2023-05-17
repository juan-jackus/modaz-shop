// ** Initial State
const initialState = {
  stats: null,
  orderStatusCount: [],
  websiteDate: null,
  timeline: null,
  postsStats: {},
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_HOMEPAGE_DATA':
      return { ...state, ...action.data };
    case 'GET_POSTS_STATS':
      return { ...state, postsStats: action.data };
    default:
      return { ...state };
  }
};
export default users;
