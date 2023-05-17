// ** Initial State
const initialState = {
  posts: [],
  params: {},
  currentPage: 1,
  totalPages: 1,
  totalPosts: 0,
  selectedPost: null,
  postToManage: null,
  postCategories: [],
};

const Posts = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_POSTS_DATA':
      return {
        ...state,
        posts: action.data,
        totalPages: action.totalPages,
        totalPosts: action.totalPosts,
        currentPage: action.currentPage,
        params: action.params,
      };
    case 'GET_POST':
      return { ...state, selectedPost: action.selectedPost };
    case 'GET_CATEGORIES':
      if (action.postCategories) {
        return { ...state, postCategories: action.postCategories };
      }
    case 'SET_POST_TO_MANAGE':
      return { ...state, postToManage: action.data };
    case 'REMOVE_SELECTED_POST':
      return { ...state, selectedPost: null };
    default:
      return { ...state };
  }
};

export default Posts;
