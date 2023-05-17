// ** React
import { Fragment, useState, useEffect } from 'react';
// ** Redux Store and Actions
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteCustomer,
  restoreCustomer,
  getCustomersData,
  setCustomerToManage,
  deleteMultipleCustomer,
  restoreMultipleCustomer,
} from '@store/actions/customers';
// ** Third Party Components
import ReactPaginate from 'react-paginate';
import { toast, Slide } from 'react-toastify';
import DataTable from 'react-data-table-component';
import classnames from 'classnames';
import '@styles/react/libs/tables/react-dataTable-component.scss';
// ** Utils
import { selectThemeColors } from '@utils';
// ** Custom Components
import { getColumns } from './components/customers/CustomersColumns.jsx';
import CustomerCustomHeader from './components/customers/CustomerCustomHeader';
import Sidebar from './components/customers/NewCustomerSidebar.jsx';
import CustomerModal from './components/customers/customerEdit/CustomerModal';
import Breadcrumbs from '@components/breadcrumbs';
import ToastContent from './components/users/ToastContent';
import Select from 'react-select';
import '@styles/react/libs/react-select/_react-select.scss';
// ** Styling Components
import { ChevronDown } from 'react-feather';
import {
  Col,
  Row,
  Card,
  Label,
  Input,
  Spinner,
  CardBody,
  CardTitle,
  CardHeader,
} from 'reactstrap';

const CustomersList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.customers);
  const { customerToManage, params, genders } = store;
  // ** States
  const [searchTerm, setSearchTerm] = useState(params.q || ''),
    [currentPage, setCurrentPage] = useState(params.page || 1),
    [rowsPerPage, setRowsPerPage] = useState(params.perPage || 10),
    [currentGender, setCurrentGender] = useState(params.gender || null),
    [showTrash, setShowTrash] = useState(params.trash || false),
    [sortByValue, setSortByValue] = useState(params.sortBy || null),
    [sidebarOpen, setSidebarOpen] = useState(false),
    [selectedRows, setSelectedRows] = useState(null),
    [toggledClearRows, setToggleClearRows] = useState(false),
    [showCustomerModal, setShowCustomerModal] = useState(!!customerToManage),
    [actionType, setActionType] = useState(false),
    [processing, setProcessing] = useState(false),
    [loadingData, setLoadingData] = useState(false);

  // ** Get All Customer
  useEffect(async () => {
    if (store.data.length <= 0) setCurrentPage(1);
    setLoadingData(true);
    await dispatch(
      getCustomersData({
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        gender: currentGender?.value,
        trash: showTrash,
        sortBy: sortByValue,
      })
    );
    setLoadingData(false);
  }, [
    searchTerm,
    currentPage,
    rowsPerPage,
    currentGender,
    showTrash,
    sortByValue,
    store.data.length,
  ]);
  // ** Search Customers by name or username
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setCurrentPage(1);
  };
  // ** Trashed Customer
  const getTrashedCustomers = () => {
    const trash = !showTrash;
    const sortBy = trash ? 'trash_desc' : 'newest';
    setShowTrash(trash);
    setSortByValue(sortBy);
    setCurrentPage(1);
    setSelectedRows(null);
    setToggleClearRows(!toggledClearRows);
  };
  // ** Show Customer(s) to delete in deletion Modal
  const showCustomerModalData = (customer) => {
    if (Array.isArray(customer)) {
      return (
        <ul style={{ maxHeight: '300px', overflow: 'auto' }}>
          {customer.map((c, i) => (
            <li key={i}>{c.fullName}</li>
          ))}
        </ul>
      );
    } else {
      return (
        <ul>
          <li>{customer.fullName}</li>
        </ul>
      );
    }
  };
  // ** Customers Deletion/Restore Handler
  const customerDeleteRestoreHandler = async (
    customer,
    actionType = 'DELETE',
    confirmAction
  ) => {
    if (!confirmAction) {
      dispatch(setCustomerToManage(customer));
      setActionType(actionType);
      setShowCustomerModal(true);
      return;
    }
    // If deletion Confirmed
    setProcessing(true);
    let toastValue;
    const action = {
      single: deleteCustomer,
      mutiple: deleteMultipleCustomer,
      text: 'Suppression',
    };
    // eslint-disable-next-line
    if (actionType === 'RESTORE') {
      action.single = restoreCustomer;
      action.mutiple = restoreMultipleCustomer;
      action.text = 'Restauration';
    }
    // If there is many customers to delete
    if (customer.selectedCount) {
      const successAction = await dispatch(
        action.mutiple(customer.selectedRows, showTrash)
      ).then((res) => res);
      // Check if all deletion/restoration are successfull
      toastValue =
        successAction === customer.selectedCount
          ? {
              type: 'success',
              text: `${action.text} reussie de :`,
              value: customer.selectedRows,
            }
          : {
              type: 'error',
              text: `Echec de la ${action.text} de :`,
              value: `${customer.selectedCount - successAction} Client(s)`,
            };
    } else {
      const successAction = await dispatch(
        action.single(customer, showTrash)
      ).then((res) => res);
      toastValue = successAction
        ? {
            type: 'success',
            text: `${action.text} reussie de :`,
            value: customer,
          }
        : {
            type: 'error',
            text: `Echec de la ${action.text} de :`,
            value: customer,
          };
    }
    setProcessing(false);
    setShowCustomerModal(!showCustomerModal);
    dispatch(setCustomerToManage(null));
    if (toastValue.type === 'success') {
      setSelectedRows(null);
      setCustomerToManage(null);
    }
    setToggleClearRows(!toggledClearRows);
    toast[toastValue.type](ToastContent(toastValue, showCustomerModalData), {
      transition: Slide,
      hideProgressBar: true,
      autoClose: 5000,
      pauseOnHover: true,
    });
  };
  // ** Handle Table Sort
  const handleSort = (column, sortDirection) => {
    const sortBy = `${column.sortField}_${sortDirection}`;
    setSortByValue(sortBy);
  };
  // ** Mutiple Customers selection handler
  const handleSelectedRowsChange = (selectedRows) => {
    setSelectedRows(selectedRows);
  };
  // ** Custom Pagination
  const CustomPagination = () => {
    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={store.totalPages || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => setCurrentPage(page.selected + 1)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={
          'pagination react-paginate justify-content-end my-2 pr-1'
        }
      />
    );
  };

  return (
    <Fragment>
      <div className='container'>
        <Breadcrumbs
          breadCrumbTitle='Liste des Clients'
          breadCrumbActive='Clients'
        />
        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle tag='h4'>Filtre</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              {/* Search Input */}
              <Col md='4'>
                <div className='d-flex align-items-center mb-sm-0 mb-1 mr-1'>
                  <Label className='mb-0' for='search-invoice'>
                    Recherche:
                  </Label>
                  <Input
                    // disabled
                    type='text'
                    id='search-invoice'
                    className='ml-50 w-100'
                    defaultValue={params.q}
                    onChange={_.debounce(handleSearch, 300)}
                  />
                </div>
              </Col>
              {/* Select Gender */}
              <Col className='my-md-0 my-1' md='4'>
                <div className='d-flex align-items-center w-100'>
                  <Label className='mr-1' for='search-gender'>
                    Genre:
                  </Label>
                  <Select
                    // isDisabled
                    isClearable={true}
                    theme={selectThemeColors}
                    className='react-select w-100'
                    classNamePrefix='select'
                    placeholder=''
                    options={genders}
                    value={currentGender}
                    onChange={(data) => {
                      dispatch(
                        getCustomersData({
                          page: 1,
                          q: searchTerm,
                          perPage: rowsPerPage,
                          gender: data?.value,
                          trash: showTrash,
                          sortBy: sortByValue,
                        })
                      );
                      setCurrentGender(data);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
        {/* Loarder */}
        {loadingData && (
          <div className=' p-3 d-flex justify-content-center '>
            <Spinner id='datable-loader' />
          </div>
        )}
        {/* Customers Table */}
        <Card
          id='customers-table'
          className={classnames({ 'd-none': loadingData })}
        >
          <DataTable
            noHeader
            pagination
            subHeader
            responsive
            striped={true}
            highlightOnHover
            paginationServer
            className='react-dataTable'
            sortServer
            sortIcon={<ChevronDown />}
            onSort={handleSort}
            selectableRows
            onSelectedRowsChange={handleSelectedRowsChange}
            clearSelectedRows={toggledClearRows}
            paginationComponent={CustomPagination}
            data={store.data}
            columns={getColumns(customerDeleteRestoreHandler, showTrash)}
            customStyles={{
              rows: { stripedStyle: { backgroundColor: '#f7f7f7' } },
            }}
            subHeaderComponent={
              <CustomerCustomHeader
                showTrash={showTrash}
                sidebarOpen={sidebarOpen}
                rowsPerPage={rowsPerPage}
                selectedRows={selectedRows}
                setSidebarOpen={setSidebarOpen}
                setRowsPerPage={setRowsPerPage}
                totalCustomer={store.totalCustomers}
                getTrashedCustomers={getTrashedCustomers}
                customerDeleteRestoreHandler={customerDeleteRestoreHandler}
              />
            }
          />
        </Card>
      </div>
      {/* Modal */}
      {showCustomerModal && (
        <CustomerModal
          dispatch={dispatch}
          showCustomerModal={showCustomerModal}
          processing={processing}
          actionType={actionType}
          setShowCustomerModal={setShowCustomerModal}
          showCustomerModalData={showCustomerModalData}
          customerToManage={customerToManage}
          setCustomerToManage={setCustomerToManage}
          customerDeleteRestoreHandler={customerDeleteRestoreHandler}
        />
      )}
      {/* SideBar */}
      {sidebarOpen && (
        <Sidebar
          open={sidebarOpen}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}
    </Fragment>
  );
};

export default CustomersList;
