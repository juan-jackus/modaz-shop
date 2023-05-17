import axios from '../axiosConfig';
import errorsHandler from '../errors';

// ** GET ORDER STATUSES
export const getOrderStatuses = () => {
  return async (dispatch) => {
    await axios
      .get(`/orders/statuses`)
      .then((response) => {
        const statusOptions = [];
        response.data.forEach((status) => {
          statusOptions.push({
            value: status.id,
            label: status.name,
            color: status.color,
            hex_color: status.hex_color,
          });
        });
        dispatch({
          type: 'GET_STATUSES',
          statusOptions,
        });
      })
      .catch((error) => {
        // const action = null;
        // errorsHandler(error, action, dispatch);
      });
  };
};
// ** GET ORDER DATA
export const getOrdersData = (params) => {
  return async (dispatch) => {
    await axios
      .get('/orders', { params })
      .then(async (res) => {
        const { data, meta } = res.data;
        await dispatch({
          type: 'GET_ORDERS_DATA',
          totalOrders: meta.total,
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
// ** QUERRY CUSTOMERS
export const querryCustomers = async (searchText, callback) => {
  await axios
    .get('/users', { params: { q: searchText, model: 'customer' } })
    .then((res) => {
      const { data } = res.data;
      return callback(data);
    });
};
// ** QUERRY PRODUCTS
export const querryProducts = async (searchText, callback) => {
  await axios.get('/products', { params: { q: searchText } }).then((res) => {
    const { data } = res.data;
    return callback(data);
  });
};
// ** GET ORDER
export const getOrder = (orderId, order) => {
  return async (dispatch) => {
    if (order) {
      return await dispatch({ type: 'GET_ORDER', selectedOrder: order });
    }
    await axios
      .get(`/orders/${orderId}`)
      .then(async (response) => {
        await dispatch({
          type: 'GET_ORDER',
          selectedOrder: response.data,
        });
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
  };
};
// ** ADD NEW ORDER
export const addOrder = (newOrder) => {
  let successSubmit = false;
  return async (dispatch, getState) => {
    await axios
      .post('/orders', newOrder)
      .then(async (res) => {
        // return console.log(res.data);
        successSubmit = true;
        await dispatch(getOrdersData(getState().orders.params));
      })
      .catch((error) => {
        // return console.log(error.response.data);
        const action = 'ADD_ORDER_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};
// ** UPDATE ORDER
export const updateOrderStatus = (updatedOrder, orderId) => {
  let successSubmit = false;
  return async (dispatch, getState) => {
    await axios
      .patch(`/orders/${orderId}`, updatedOrder)
      .then(async (res) => {
        successSubmit = true;
        await dispatch(getOrdersData(getState().orders.params));
        await dispatch(getOrder(orderId));
      })
      .catch((error) => {
        const action = 'ADD_ORDERS_ERROR';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};
// ** REMOVE SELECTED ORDER
export const removeSelectedOrder = () => {
  return async (dispatch) => {
    await dispatch({
      type: 'REMOVE_SLECTED_ORDER',
    });
  };
};
// ** DELETE ORDER
export const deleteOrder = (order, trashed) => {
  return async (dispatch, getState) => {
    let successDeletion = false;
    const url = trashed ? '/orders/force-delete' : '/orders';
    await axios
      .delete(url, { data: { ids: [order.id] } })
      .then(async (res) => {
        successDeletion = true;
        await dispatch(getOrdersData(getState().orders.params));
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
    return successDeletion;
  };
};
// ** RESTORE ORDER
export const restoreOrder = (order) => {
  let successDeletion = false;
  return async (dispatch, getState) => {
    await axios
      .post('/orders/restore', { ids: [order.id] })
      .then(async (res) => {
        successDeletion = true;
        await dispatch(getOrdersData(getState().orders.params));
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
    return successDeletion;
  };
};
// ** DELETE MUTIPLE ORDER
export const deleteMultipleOrder = (orders, trashed) => {
  return async (dispatch, getState) => {
    const url = trashed ? '/orders/force-delete' : '/orders';
    let successDeletion = 0;
    const ordersIds = orders.map((order) => order.id);
    await axios
      .delete(url, { data: { ids: ordersIds } })
      .then(async (result) => {
        const { modifiedCount, deletedCount } = result.data;
        successDeletion = modifiedCount || deletedCount;
        await dispatch(getOrdersData(getState().orders.params));
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });

    return successDeletion;
  };
};
// ** RESTORE MUTIPLE ORDER
export const restoreMultipleOrder = (orders) => {
  return async (dispatch, getState) => {
    let successDeletion = 0;
    const orderIds = orders.map((order) => order.id);
    await axios
      .post('/orders/restore', { ids: orderIds })
      .then(async (result) => {
        successDeletion = result.data.modifiedCount;
        await dispatch(getOrdersData(getState().orders.params));
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });

    return successDeletion;
  };
};
