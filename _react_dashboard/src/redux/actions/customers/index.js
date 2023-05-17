import axios from '../axiosConfig';
import errorsHandler from '../errors';

// const paginateArray = (array, perPage, page) => {
//   return array.slice((page - 1) * perPage, page * perPage);
// };

// ** GET CUSTOMER DATA
export const getCustomersData = (params) => {
  return async (dispatch) => {
    await axios
      .get('/users', { params: { ...params, model: 'customer' } })
      .then((res) => {
        const { data, meta } = res.data;
        dispatch({
          type: 'GET_CUSTOMERS_DATA',
          totalCustomers: meta.total,
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
// ** GET CUSTOMER
export const getCustomer = (customerId, customer) => {
  return async (dispatch) => {
    if (customer) {
      return await dispatch({
        type: 'GET_CUSTOMER',
        selectedCustomer: customer,
      });
    }
    await axios
      .get(`/users/${customerId}`, { params: { model: 'customer' } })
      .then(async (response) => {
        await dispatch({
          type: 'GET_CUSTOMER',
          selectedCustomer: response.data,
        });
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
  };
};
// ** ADD NEW CUSTOMER
export const addCustomer = (newCustomer) => {
  return async (dispatch, getState) => {
    let successSubmit = false;
    await axios
      .post(
        `${window.location.origin.toString()}/account/register`,
        newCustomer
      )
      .then(async (res) => {
        successSubmit = true;
        await dispatch(getCustomersData(getState().customers.params));
      })
      .catch((error) => {
        const action = 'ADD_CUSTOMER_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};
// // ** ADD NEW CUSTOMER
// export const addCustomer = (newCustomer) => {
//   return async (dispatch, getState) => {
//     let successSubmit = false;
//     await axios
//       .post('/users', newCustomer)
//       .then(async (res) => {
//         successSubmit = true;
//         await dispatch(getCustomersData(getState().customers.params));
//       })
//       .catch((error) => {
//         const action = 'ADD_CUSTOMER_ERRORS';
//         errorsHandler(error, action, dispatch);
//       });
//     return successSubmit;
//   };
// };
// ** UPDATE CUSTOMER
export const updateCustomer = (updatedCustomer, customerId) => {
  return async (dispatch, getState) => {
    updatedCustomer.model = 'customer';
    let successSubmit = false;
    await axios
      .patch(`/users/${customerId}`, updatedCustomer)
      .then(async (res) => {
        successSubmit = true;
        await dispatch(getCustomersData(getState().customers.params));
        await dispatch(getCustomer(customerId));
      })
      .catch((error) => {
        const action = 'ADD_CUSTOMER_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};
// ** SET CUSTOMER TO DELETE
export const setCustomerToManage = (customer) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_CUSTOMER_TO_MANAGE',
      data: customer,
    });
  };
};
// ** REMOVE SELECTED CUSTOMER
export const removeSelectedCustomer = () => {
  return async (dispatch) => {
    await dispatch({
      type: 'REMOVE_SLECTED_CUSTOMER',
    });
  };
};
// ** DELETE CUSTOMER
export const deleteCustomer = (customer, trashed) => {
  return async (dispatch, getState) => {
    let successDeletion = false;
    const url = trashed ? '/users/force-delete' : '/users';
    await axios
      .delete(url, { data: { ids: [customer.id], model: 'customer' } })
      .then(async (res) => {
        await dispatch(getCustomersData(getState().customers.params));
        successDeletion = true;
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });

    return successDeletion;
  };
};
// ** RESTORE CUSTOMER
export const restoreCustomer = (customer) => {
  let successDeletion = false;
  return async (dispatch, getState) => {
    await axios
      .post('/users/restore', { ids: [customer.id], model: 'customer' })
      .then(async (res) => {
        await dispatch(getCustomersData(getState().customers.params));
        successDeletion = true;
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
    return successDeletion;
  };
};
// ** DELETE MUTIPLE CUSTOMER
export const deleteMultipleCustomer = (customers, trashed) => {
  return async (dispatch, getState) => {
    const url = trashed ? '/users/force-delete' : '/users';
    let successDeletion = 0;
    const customersIds = customers.map((customer) => customer.id);
    await axios
      .delete(url, { data: { ids: customersIds, model: 'customer' } })
      .then(async (result) => {
        const { modifiedCount, deletedCount } = result.data;
        successDeletion = modifiedCount || deletedCount;
        await dispatch(getCustomersData(getState().customers.params));
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });

    return successDeletion;
  };
};
// ** RESTORE MUTIPLE USER
export const restoreMultipleCustomer = (customers) => {
  return async (dispatch, getState) => {
    let successDeletion = 0;
    const customersIds = customers.map((customer) => customer.id);
    await axios
      .post('/users/restore', { ids: customersIds, model: 'customer' })
      .then(async (result) => {
        successDeletion = result.data.modifiedCount;
        await dispatch(getCustomersData(getState().customers.params));
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });

    return successDeletion;
  };
};
