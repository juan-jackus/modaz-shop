const initialState = {
  products: [],
  params: {},
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  selectedProduct: null,
  productToManage: null,
  productCategories: [],
  uiState: {},
};

const products = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PRODUCTS_DATA':
      return {
        ...state,
        products: action.data,
        totalPages: action.totalPages,
        currentPage: action.currentPage,
        totalProducts: action.totalProducts,
        params: action.params,
      };
    case 'GET_PRODUCT':
      return { ...state, selectedProduct: action.selectedProduct };
    case 'GET_CATEGORIES':
      if (action.productCategories) {
        return { ...state, productCategories: action.productCategories };
      }
    case 'REMOVE_SELECTED_PRODUCT':
      return { ...state, selectedProduct: null };
    case 'SET_PRODUCT_TO_DELETE':
      return { ...state, productToManage: action.data };
    case 'SET_UI_STATE':
      return { ...state, uiState: { ...state.uiState, ...action.data } };
    default:
      return state;
  }
};

export default products;
