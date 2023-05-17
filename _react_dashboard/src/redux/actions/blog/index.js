import axios from '../axiosConfig';
import errorsHandler from '../errors';

// ** GET USER POST CATEGORIES
export const getPostCategories = () => {
  return async (dispatch) => {
    await axios
      .get(`/posts/categories`)
      .then((response) => {
        const postCategories = [];
        response.data.forEach((category) => {
          postCategories.push({
            value: category.id,
            label: category.nameFr,
            color: category.color,
            icon: category.icon,
          });
        });
        dispatch({
          type: 'GET_CATEGORIES',
          postCategories,
        });
      })
      .catch((error) => {
        // const action = null;
        // errorsHandler(error, action, dispatch);
      });
  };
};
// ** GET POSTS DATA
export const getPostsData = (params) => {
  return async (dispatch) => {
    await axios
      .get('/posts', { params })
      .then(async (res) => {
        const { data, meta } = res.data;
        await dispatch({
          type: 'GET_POSTS_DATA',
          totalPosts: meta.total,
          totalPages: meta.last_page,
          params: meta.params,
          data,
        });
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
  };
};
// ** GET POST
export const getPost = (postId, post) => {
  return async (dispatch) => {
    if (post) {
      return await dispatch({ type: 'GET_POST', selectedPost: post });
    }
    await axios
      .get(`/posts/${postId}`)
      .then(async (response) => {
        await dispatch({
          type: 'GET_POST',
          data: response.data,
        });
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
  };
};
// ** ADD NEW POST
export const addPost = (newPost) => {
  let successSubmit = false;
  return async (dispatch, getState) => {
    await axios
      .post('/posts', newPost, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async (res) => {
        successSubmit = true;
        await dispatch(getPostsData(getState().blog.params));
      })
      .catch((error) => {
        const action = 'ADD_POST_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};
// ** UPDATE POST
export const updatePost = (updatedPost, postId) => {
  return async (dispatch, getState) => {
    let successSubmit = false;
    await axios
      .patch(`/posts/${postId}`, updatedPost, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async (res) => {
        successSubmit = true;
        await dispatch(getPostsData(getState().blog.params));
      })
      .catch((error) => {
        const action = 'ADD_POST_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};
// ** REMOVE SELECTED POST
export const removeSelectedPost = () => {
  return async (dispatch) => {
    await dispatch({
      type: 'REMOVE_SELECTED_POST',
    });
  };
};
// ** SET POST TO DELETE
export const setPostToManage = (post) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_POST_TO_MANAGE',
      data: post,
    });
  };
};
// ** DELETE POST
export const deletePost = (post, trashed) => {
  return async (dispatch, getState) => {
    let successDeletion = false;
    const url = trashed ? '/posts/force-delete' : '/posts';
    const ids = [post.id];
    const imgUrls = [post.image];
    const authorIds = [post.author.id];
    await axios
      .delete(url, { data: { ids, imgUrls, authorIds } })
      .then(async (res) => {
        successDeletion = true;
        await dispatch(getPostsData(getState().blog.params));
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
    return successDeletion;
  };
};
// ** RESTORE POST
export const restorePost = (post) => {
  return async (dispatch, getState) => {
    let successRestoration = false;
    const ids = [post.id];
    const authorIds = [post.author.id];
    await axios
      .post('/posts/restore', { ids, authorIds })
      .then(async (res) => {
        await dispatch(getPostsData(getState().blog.params));
        successRestoration = true;
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
    return successRestoration;
  };
};
// ** DELETE MUTIPLE POST
export const deleteMultiplePost = (posts, trashed) => {
  return async (dispatch, getState) => {
    let successDeletion = 0;
    const url = trashed ? '/posts/force-delete' : '/posts';
    const ids = posts.map((post) => post.id);
    const imgUrls = posts.map((post) => post.image);
    const authorIds = posts.map((post) => post.author.id);
    await axios
      .delete(url, { data: { ids, imgUrls, authorIds } })
      .then(async (result) => {
        const { modifiedCount, deletedCount } = result.data;
        successDeletion = modifiedCount || deletedCount;
        await dispatch(getPostsData(getState().blog.params));
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });

    return successDeletion;
  };
};
// ** RESTORE MUTIPLE POST
export const restoreMultiplePost = (posts) => {
  return async (dispatch, getState) => {
    let successRestoration = 0;
    const postsId = posts.map((p) => p.id);
    await axios
      .post('/posts/restore', { ids: postsId })
      .then(async (result) => {
        successRestoration = result.data.modifiedCount;
        await dispatch(getPostsData(getState().blog.params));
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });

    return successRestoration;
  };
};
