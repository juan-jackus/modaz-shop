import axios from '../axiosConfig';
import errorsHandler from '../errors';

// ** GET PRODUCT CATEGORIES
export const getProductCategories = () => {
  return async (dispatch) => {
    await axios
      .get(`/products/categories`)
      .then((response) => {
        const productCategories = [];
        response.data.forEach((category) => {
          productCategories.push({
            value: category.id,
            label: category.name,
          });
        });
        dispatch({
          type: 'GET_CATEGORIES',
          productCategories,
        });
      })
      .catch((error) => {
        // const action = null;
        // errorsHandler(error, action, dispatch);
      });
  };
};
// ** GET PRODUCT DATA
export const getProductsData = (params) => {
  return async (dispatch) => {
    await axios
      .get('/products', { params })
      .then(async (res) => {
        const { data, meta } = res.data;
        await dispatch({
          type: 'GET_PRODUCTS_DATA',
          totalProducts: meta.total,
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
// ** GET PRODUCT
export const getProduct = (productId, product) => {
  return async (dispatch) => {
    if (product) {
      return await dispatch({
        type: 'GET_PRODUCT',
        selectedProduct: product,
      });
    }
    await axios
      .get(`/products/${productId}`)
      .then(async (response) => {
        await dispatch({
          type: 'GET_PRODUCT',
          selectedProduct: response.data,
        });
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
  };
};
// ** ADD NEW PRODUCT
export const addProduct = (newProduct) => {
  return async (dispatch, getState) => {
    let successSubmit = false;
    await axios
      .post('/products', newProduct, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async (res) => {
        successSubmit = true;
        await dispatch(getProductsData(getState().products.params));
      })
      .catch(async (error) => {
        const action = 'ADD_PRODUCT_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};
// ** UPDATE PRODUCT
export const updateProduct = (updatedProduct, productId) => {
  return async (dispatch, getState) => {
    let successSubmit = false;
    await axios
      .patch(`/products/${productId}`, updatedProduct, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async (res) => {
        successSubmit = true;
        await dispatch(getProductsData(getState().products.params));
        await dispatch(getProduct(productId));
      })
      .catch((error) => {
        const action = 'ADD_PRODUCT_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};
// ** REMOVE SELECTED PRODUCT
export const removeSelectedProduct = () => {
  return (dispatch) => {
    dispatch({
      type: 'REMOVE_SELECTED_PRODUCT',
    });
  };
};
// ** SET PRODUCT TO DELETE
export const setProductToManage = (product) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_PRODUCT_TO_DELETE',
      data: product,
    });
  };
};
// ** DELETE PRODUCT
export const deleteProduct = (product, trashed) => {
  return async (dispatch, getState) => {
    let successDeletion = false;
    const url = trashed ? '/products/force-delete' : '/products';
    const imgUrls = product.images;
    await axios
      .delete(url, { data: { ids: [product.id], imgUrls } })
      .then(async (res) => {
        await dispatch(getProductsData(getState().products.params));
        successDeletion = true;
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
    return successDeletion;
  };
};
// ** RESTORE PRODUCT
export const restoreProduct = (product) => {
  return async (dispatch, getState) => {
    let successRestoration = false;
    await axios
      .post('/products/restore', { ids: [product.id] })
      .then(async (res) => {
        await dispatch(getProductsData(getState().products.params));
        successRestoration = true;
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
    return successRestoration;
  };
};
// ** DELETE MUTIPLE PRODUCT
export const deleteMultipleProduct = (products, trashed) => {
  return async (dispatch, getState) => {
    let successDeletion = 0;
    const url = trashed ? '/products/force-delete' : '/products';
    const productIds = products.map((product) => product.id);
    const imgUrls = products.flatMap((product) => product.images);
    await axios
      .delete(url, { data: { ids: productIds, imgUrls } })
      .then(async (result) => {
        const { modifiedCount, deletedCount } = result.data;
        successDeletion = modifiedCount || deletedCount;
        await dispatch(getProductsData(getState().products.params));
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });

    return successDeletion;
  };
};
// ** RESTORE MUTIPLE PRODUCT
export const restoreMultipleProduct = (products) => {
  return async (dispatch, getState) => {
    let successRestoration = 0;
    const productIds = products.map((p) => p.id);
    await axios
      .post('/products/restore', { ids: productIds })
      .then(async (result) => {
        successRestoration = result.data.modifiedCount;
        await dispatch(getProductsData(getState().products.params));
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });

    return successRestoration;
  };
};
// ** SET UI STATE
export const setUiState = (ui) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_UI_STATE',
      data: ui,
    });
  };
};
