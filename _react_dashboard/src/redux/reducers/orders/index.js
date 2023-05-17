// ** Initial State
const initialState = {
  data: [],
  currentPage: 1,
  totalPages: 1,
  totalOrders: 0,
  params: {},
  selectedOrder: null,
  statusOptions: [],
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ORDERS_DATA':
      return {
        ...state,
        data: action.data,
        totalPages: action.totalPages,
        currentPage: action.currentPage,
        totalOrders: action.totalOrders,
        params: action.params,
      };
    case 'GET_ORDER':
      return { ...state, selectedOrder: action.selectedOrder };
    case 'GET_STATUSES':
      return { ...state, statusOptions: action.statusOptions };
    case 'REMOVE_SLECTED_ORDER':
      return { ...state, selectedOrder: null };
    default:
      return { ...state };
  }
};
export default users;
