// ** React
import { Fragment, useState, useEffect } from 'react';
// ** Redux Store and Actions
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteOrder,
  restoreOrder,
  getOrdersData,
  deleteMultipleOrder,
  restoreMultipleOrder,
} from '@src/redux/actions/orders';
// ** Third Party Components
import classnames from 'classnames';
import DataTable from 'react-data-table-component';
import '@styles/react/libs/tables/react-dataTable-component.scss';
import Select from 'react-select';
import '@styles/react/libs/react-select/_react-select.scss';
import { toast, Slide } from 'react-toastify';
import ReactPaginate from 'react-paginate';
// ** Utils
import { selectThemeColors } from '@utils';
// ** Custom Components
import { getColumns } from './components/orders/OrdersColumns.jsx';
import Sidebar from './components/orders/NewOrderSidebar.jsx';
import ToastContent from './components/users/ToastContent.jsx';
import OrderCustomHeader from './components/orders/OderCustomHearder';
import Breadcrumbs from '@components/breadcrumbs';
import OrderModal from './components/orders/OrderModal';
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

const OrdersList = () => {
  // ** Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.orders);
  const { params } = store;
  let paramStatus;
  const statusOptions = store.statusOptions.map((status) => {
    if (status.value === params.status) {
      paramStatus = status;
    }
    return { ...status, label: status.labelFr };
  });

  // console.log(store.statusOptions);
  // const paramStatus = statusOptions.find(
  //   (status) => status.value === params.status
  // );
  // ** States
  const [searchTerm, setSearchTerm] = useState(params.q || ''),
    [currentPage, setCurrentPage] = useState(params.page || 1),
    [rowsPerPage, setRowsPerPage] = useState(params.perPage || 10),
    [currentStatus, setCurrentStatus] = useState(paramStatus || null),
    [sortByValue, setSortByValue] = useState(params.sortBy || null),
    [showTrash, setShowTrash] = useState(params.trash || false),
    [orderToManage, setOrderToManage] = useState(null),
    [selectedRows, setSelectedRows] = useState(null),
    [toggledClearRows, setToggleClearRows] = useState(false),
    [sidebarOpen, setSidebarOpen] = useState(false),
    [showOrderModal, setShowOrderModal] = useState(false),
    [actionType, setActionType] = useState(null),
    [processing, setProcessing] = useState(false),
    [loadingData, setLoadingData] = useState(false);

  // ** Get All Customer On Mount
  useEffect(async () => {
    setLoadingData(true);
    await dispatch(
      getOrdersData({
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        status: currentStatus?.value || '',
        trash: showTrash,
        sortBy: sortByValue,
      })
    );
    setLoadingData(false);
  }, [
    searchTerm,
    currentPage,
    rowsPerPage,
    currentStatus,
    showTrash,
    sortByValue,
  ]);
  // ** Search Orders
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setCurrentPage(1);
  };
  // ** Trashed Orders
  const getTrashedOrders = () => {
    const trash = !showTrash;
    const sortBy = trash ? 'trash_desc' : 'newest';
    setShowTrash(trash);
    setSortByValue(sortBy);
    setCurrentPage(1);
    setSelectedRows(null);
    setToggleClearRows(!toggledClearRows);
  };
  // Show Order(s) to delete in deletion Modal
  const showOderModalData = (order) => {
    if (Array.isArray(order)) {
      return (
        <ul style={{ maxHeight: '300px', overflow: 'auto' }}>
          {order.map((o, i) => (
            <li key={i}>{o.uid}</li>
          ))}
        </ul>
      );
    } else {
      return (
        <ul>
          <li>{order.uid}</li>
        </ul>
      );
    }
  };
  // ** Orders Deletion/Restore Handler
  const oderDeleteRestoreHandler = async (
    order,
    actionType = 'DELETE',
    confirmDeletion
  ) => {
    if (!confirmDeletion) {
      setOrderToManage(order);
      setActionType(actionType);
      setShowOrderModal(!showOrderModal);
      return;
    }
    // If deletion Confirmed
    setProcessing(true);
    let toastValue;
    const action = {
      single: deleteOrder,
      mutiple: deleteMultipleOrder,
      text: 'suppression',
    };
    // eslint-disable-next-line
    if (actionType == 'RESTORE') {
      action.single = restoreOrder;
      action.mutiple = restoreMultipleOrder;
      action.text = 'restauration';
    }
    // If there is many orders to delete/restore
    if (order.selectedCount) {
      const successAction = await dispatch(
        action.mutiple(order.selectedRows, showTrash)
      ).then((res) => res);
      // Check if deletion/restoration are successfull
      toastValue =
        successAction === order.selectedCount
          ? {
              type: 'success',
              text: `${action.text} reussie de :`,
              value: order.selectedRows,
            }
          : {
              type: 'error',
              text: `Echec de la ${action.text} de :`,
              value: `${order.selectedCount - successAction} commande(s)`,
            };
    } else {
      // One Order to Delete
      const successAction = await dispatch(
        action.single(order, showTrash)
      ).then((res) => res);
      toastValue = successAction
        ? {
            type: 'success',
            text: `${action.text} reussie de:`,
            value: order,
          }
        : {
            type: 'error',
            text: `Echec de la ${action.text} de :`,
            value: order,
          };
    }
    setProcessing(false);
    setShowOrderModal(!showOrderModal);
    if (toastValue.type === 'success') {
      setSelectedRows(null);
      setOrderToManage(null);
    }
    setToggleClearRows(!toggledClearRows);
    toast[toastValue.type](ToastContent(toastValue, showOderModalData), {
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
  // ** Mutiple Orders selection handler
  const handleSelectedRowsChange = (selectedRows) => {
    setSelectedRows(selectedRows);
  };
  // ** Custom Pagination
  const oderCustomPagination = () => {
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
  // ** Sidebar Toogler
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Fragment>
      <Breadcrumbs
        breadCrumbTitle='Liste des Commandes '
        breadCrumbActive='commandes'
      />
      <Card className='container'>
        <CardHeader>
          <CardTitle tag='h4'>Filtre de recherche</CardTitle>
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
                  type='text'
                  id='search-invoice'
                  className='ml-50 w-100'
                  defaultValue={params.q}
                  onChange={_.debounce(handleSearch, 300)}
                />
              </div>
            </Col>
            {/* Select Status */}
            <Col className='my-md-0 my-1' md='4'>
              <div className='d-flex align-items-center w-100'>
                <Label className='mr-1' for='search-status'>
                  Statut:
                </Label>
                <Select
                  id='search-status'
                  isClearable={true}
                  theme={selectThemeColors}
                  className='react-select w-100'
                  classNamePrefix='select'
                  placeholder=''
                  options={statusOptions}
                  value={currentStatus}
                  onChange={(data) => {
                    setCurrentStatus(data);
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
      {/* Orders Table */}
      <Card
        id='orders-table'
        className={classnames('container px-0', { 'd-none': loadingData })}
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
          paginationComponent={oderCustomPagination}
          data={store.data}
          columns={getColumns(
            oderDeleteRestoreHandler,
            statusOptions,
            showTrash
          )}
          customStyles={{
            rows: { stripedStyle: { backgroundColor: '#f7f7f7' } },
          }}
          subHeaderComponent={
            <OrderCustomHeader
              showTrash={showTrash}
              rowsPerPage={rowsPerPage}
              selectedRows={selectedRows}
              toggleSidebar={toggleSidebar}
              totalOrder={store.totalOrders}
              setRowsPerPage={setRowsPerPage}
              getTrashedOrders={getTrashedOrders}
              oderDeleteRestoreHandler={oderDeleteRestoreHandler}
            />
          }
        />
      </Card>
      {showOrderModal && (
        <OrderModal
          processing={processing}
          actionType={actionType}
          orderToManage={orderToManage}
          showOrderModal={showOrderModal}
          setShowOrderModal={setShowOrderModal}
          showOderModalData={showOderModalData}
          oderDeleteRestoreHandler={oderDeleteRestoreHandler}
        />
      )}
      {sidebarOpen && (
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      )}
    </Fragment>
  );
};

export default OrdersList;
