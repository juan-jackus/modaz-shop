// ** Initial State
const initialState = {
  data: [],
  params: {},
  currentPage: 1,
  totalPages: 1,
  totalCustomers: 0,
  customerToManage: null,
  selectedCustomer: null,
  genders: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Femelle' },
    { value: 'unspecified', label: 'Non spécifié' },
  ],
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CUSTOMERS_DATA':
      return {
        ...state,
        data: action.data,
        totalPages: action.totalPages,
        currentPage: action.currentPage,
        totalCustomers: action.totalCustomers,
        params: action.params,
      };
    case 'GET_CUSTOMER':
      return { ...state, selectedCustomer: action.selectedCustomer };
    case 'SET_CUSTOMER_TO_MANAGE':
      return { ...state, customerToManage: action.data };
    case 'REMOVE_SLECTED_CUSTOMER':
      return { ...state, selectedCustomer: null };
    default:
      return { ...state };
  }
};
export default users;
