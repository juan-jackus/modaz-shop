import axios from '../axiosConfig';
import errorsHandler from '../errors';

// const paginateArray = (array, perPage, page) => {
//   return array.slice((page - 1) * perPage, page * perPage);
// };

// ** GET USER ROLES
export const getUserRoles = () => {
  return async (dispatch) => {
    await axios
      .get('/users/roles')
      .then(async (response) => {
        const userRoles = [];
        response.data.forEach((role) => {
          userRoles.push({
            value: role.id,
            label: role.name,
            labelFr: role.nameFr,
            class: role.class,
            icon: role.icon,
          });
        });
        await dispatch({
          type: 'GET_ROLES',
          userRoles,
        });
      })
      .catch((error) => {
        // const action = null;
        // errorsHandler(error, action, dispatch);
      });
  };
};
// ** GET USER DATA
export const getUsersData = (params) => {
  return async (dispatch) => {
    await axios
      .get('/users', { params })
      .then(async (res) => {
        const { data, meta } = res.data;
        await dispatch({
          type: 'GET_USERS_DATA',
          totalUsers: meta.total,
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
// ** GET USER
export const getUser = (userId, user) => {
  return async (dispatch) => {
    if (user) {
      return await dispatch({ type: 'GET_USER', selectedUser: user });
    }
    await axios
      .get(`/users/${userId}`)
      .then(async (response) => {
        await dispatch({
          type: 'GET_USER',
          selectedUser: response.data,
        });
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
  };
};
// ** ADD NEW USER
export const addUser = (newUser) => {
  let successSubmit = false;
  return async (dispatch, getState) => {
    await axios
      .post('/users', newUser, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async (res) => {
        successSubmit = true;
        await dispatch(getUsersData(getState().users.params));
      })
      .catch((error) => {
        const action = 'ADD_USER_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};
// ** UPDATE USER
export const updateUser = (updatedUser, userId) => {
  return async (dispatch, getState) => {
    let successSubmit = false;
    await axios
      .patch(`/users/${userId}`, updatedUser, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async (res) => {
        successSubmit = true;
        const authUser = getState().auth.userData;
        const userRole = authUser.role.toLowerCase();
        if (userRole === 'admin' || userRole === 'superadmin') {
          await dispatch(getUsersData(getState().users.params));
        }
        await dispatch(getUser(userId));
        // Update Current login user if updated
        if (userId === authUser.id) {
          const updatedData = getState().users.selectedUser;
          await dispatch({
            type: 'LOGIN',
            user: updatedData,
          });
        }
      })
      .catch((error) => {
        const action = 'ADD_USER_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};
// ** UPDATE USER PASSWORD
export const updatePassword = (updatedPassword, userId) => {
  let successSubmit = false;
  return async (dispatch) => {
    await axios
      .patch(`/users/pwd/${userId}`, updatedPassword)
      .then((res) => {
        successSubmit = true;
      })
      .catch((error) => {
        const action = 'UPDATE_PASSWORD_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};
// ** REMOVE SELECTED USER
export const removeSelectedUser = () => {
  return async (dispatch) => {
    await dispatch({
      type: 'REMOVE_SELECTED_USER',
    });
  };
};
// ** DELETE USER
export const deleteUser = (user, trashed) => {
  return async (dispatch, getState) => {
    let successDeletion = false;
    const url = trashed ? '/users/force-delete' : '/users';
    const imgUrls = [user.avatar];
    await axios
      .delete(url, { data: { ids: [user.id], imgUrls } })
      .then(async (res) => {
        await dispatch(getUsersData(getState().users.params));
        successDeletion = true;
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
    return successDeletion;
  };
};
// ** RESTORE USER
export const restoreUser = (user) => {
  let successDeletion = false;
  return async (dispatch, getState) => {
    await axios
      .post('/users/restore', { ids: [user.id] })
      .then(async (res) => {
        await dispatch(getUsersData(getState().users.params));
        successDeletion = true;
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
    return successDeletion;
  };
};
// ** DELETE MUTIPLE USER
export const deleteMultipleUser = (users, trashed) => {
  return async (dispatch, getState) => {
    const url = trashed ? '/users/force-delete' : '/users';
    let successDeletion = 0;
    const usersIds = users.map((user) => user.id);
    const imgUrls = users.map((user) => user.avatar);
    await axios
      .delete(url, { data: { ids: usersIds, imgUrls } })
      .then(async (result) => {
        const { modifiedCount, deletedCount } = result.data;
        successDeletion = modifiedCount || deletedCount;
        await dispatch(getUsersData(getState().users.params));
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });

    return successDeletion;
  };
};
// ** RESTORE MUTIPLE USER
export const restoreMultipleUser = (users) => {
  return async (dispatch, getState) => {
    let successDeletion = 0;
    const usersIds = users.map((user) => user.id);
    await axios
      .post('/users/restore', { ids: usersIds })
      .then(async (result) => {
        successDeletion = result.data.modifiedCount;
        await dispatch(getUsersData(getState().users.params));
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });

    return successDeletion;
  };
};
