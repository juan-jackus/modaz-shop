// ** React
import { Fragment, useState, useEffect } from 'react';
// ** Redux Store and Actions
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteUser,
  restoreUser,
  getUsersData,
  deleteMultipleUser,
  restoreMultipleUser,
} from '@store/actions/users';
// ** Third Party Components
import ReactPaginate from 'react-paginate';
import { toast, Slide } from 'react-toastify';
import DataTable from 'react-data-table-component';
import '@styles/react/libs/tables/react-dataTable-component.scss';
import Select from 'react-select';
import classnames from 'classnames';
import '@styles/react/libs/react-select/_react-select.scss';
// ** Utils
import { selectThemeColors } from '@utils';
// ** Custom Components
import { getColumns } from './components/users/UsersColumns';
import UserCustomHeader from './components/users/UserCustomHeader';
import Sidebar from './components/users/userEdit/NewUserSidebar';
import UserModal from './components/users/userEdit/UserModal';
import Breadcrumbs from '@components/breadcrumbs';
import ToastContent from './components/users/ToastContent';
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

const UsersList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.auth.userData);
  const store = useSelector((state) => state.users);
  const { params, userRoles } = store;
  const paramsRole = userRoles.find((role) => role.value === params.role);
  // ** States
  const [searchTerm, setSearchTerm] = useState(params.q || ''),
    [currentPage, setCurrentPage] = useState(params.page || 1),
    [rowsPerPage, setRowsPerPage] = useState(params.perPage || 10),
    [currentRole, setCurrentRole] = useState(paramsRole || null),
    [sortByValue, setSortByValue] = useState(params.sortBy || null),
    [showTrash, setShowTrash] = useState(params.trash || false),
    [sidebarOpen, setSidebarOpen] = useState(false),
    [selectedUser, setSelectedUser] = useState(null),
    [selectedRows, setSelectedRows] = useState(null),
    [toggledClearRows, setToggleClearRows] = useState(false),
    [userToManage, setUserToManage] = useState(null),
    [showUserModal, setShowUserModal] = useState(false),
    [actionType, setActionType] = useState(null),
    [processing, setProcessing] = useState(false),
    [loadingData, setLoadingData] = useState(false);

  // ** Get All Users
  useEffect(async () => {
    if (store.data.length <= 0) setCurrentPage(1);
    setLoadingData(true);
    await dispatch(
      getUsersData({
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        role: currentRole?.value,
        trash: showTrash,
        sortBy: sortByValue,
      })
    );
    setLoadingData(false);
  }, [
    searchTerm,
    currentPage,
    rowsPerPage,
    currentRole,
    showTrash,
    sortByValue,
    store.data.length,
  ]);

  // ** Search Users by name or username
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setCurrentPage(1);
  };
  // ** Trashed User
  const getTrashedUsers = () => {
    const trash = !showTrash;
    const sortBy = trash ? 'trash_desc' : 'newest';
    setShowTrash(trash);
    setSortByValue(sortBy);
    setCurrentPage(1);
    setSelectedRows(null);
    setToggleClearRows(!toggledClearRows);
  };
  // ** Show User(s) to delete in deletion Modal
  const showUserModalData = (user) => {
    if (Array.isArray(user)) {
      return (
        <ul style={{ maxHeight: '300px', overflow: 'auto' }}>
          {user.map((u, i) => (
            <li key={i}>{u.fullName}</li>
          ))}
        </ul>
      );
    } else {
      return (
        <ul>
          <li>{user.fullName}</li>
        </ul>
      );
    }
  };
  // ** Users Deletion/Restore Handler
  const userDeleteRestoreHandler = async (
    user,
    actionType = 'DELETE',
    confirmAction
  ) => {
    if (!confirmAction) {
      setUserToManage(user);
      setActionType(actionType);
      setShowUserModal(true);
      return;
    }
    // If deletion Confirmed
    setProcessing(true);
    let toastValue;
    const action = {
      single: deleteUser,
      mutiple: deleteMultipleUser,
      text: 'deletion',
    };
    // eslint-disable-next-line
    if (actionType == 'RESTORE') {
      action.single = restoreUser;
      action.mutiple = restoreMultipleUser;
      action.text = 'restoration';
    }
    // If there is many customers to delete/restore
    if (user.selectedCount) {
      const successAction = await dispatch(
        action.mutiple(user.selectedRows, showTrash)
      ).then((res) => res);
      // Check if deletion/restoration are successfull
      toastValue =
        successAction === user.selectedCount
          ? {
              type: 'success',
              text: `Success ${action.text} of :`,
              value: user.selectedRows,
            }
          : {
              type: 'error',
              text: `Failed ${action.text} of :`,
              value: `${user.selectedCount - successAction} user(s)`,
            };
    } else {
      const successAction = await dispatch(action.single(user, showTrash)).then(
        (res) => res
      );
      toastValue = successAction
        ? {
            type: 'success',
            text: `Success ${action.text} of :`,
            value: user,
          }
        : {
            type: 'error',
            text: `Failed ${action.text} of :`,
            value: user,
          };
    }
    setProcessing(false);
    setShowUserModal(!showUserModal);
    if (toastValue.type === 'success') {
      setSelectedRows(null);
      setUserToManage(null);
    }
    setToggleClearRows(!toggledClearRows);
    toast[toastValue.type](ToastContent(toastValue, showUserModalData), {
      transition: Slide,
      hideProgressBar: true,
      autoClose: 5000,
      pauseOnHover: true,
    });
  };
  // ** Sidebar Toggler
  const toggleSidebar = (user) => {
    if (user) {
      setSelectedUser(user);
    } else {
      setSelectedUser(null);
    }
    setSidebarOpen(!sidebarOpen);
  };
  // ** Handle Table Sort
  const handleSort = (column, sortDirection) => {
    const sortBy = `${column.sortField}_${sortDirection}`;
    setSortByValue(sortBy);
  };
  // ** Mutiple Users selection handler
  const handleSelectedRowsChange = (selectedRows) => {
    setSelectedRows(selectedRows);
  };
  // ** Disable selection of actual logged user
  const rowDisabledCriteria = (row) => row.id === loggedUser.id;
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
        <Breadcrumbs breadCrumbTitle='Users ' breadCrumbActive='users' />
        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle tag='h4'>Filter</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              {/* Searh Input */}
              <Col md='4'>
                <div className='d-flex align-items-center mb-sm-0 mb-1 mr-1'>
                  <Label className='mb-0' for='search-invoice'>
                    Search:
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
              {/* Select Role */}
              <Col className='my-md-0 my-1' md='4'>
                <div className='d-flex align-items-center w-100'>
                  <Label className='mr-1' for='search-role'>
                    Role:
                  </Label>
                  <Select
                    // isDisabled
                    id='search-role'
                    isClearable={true}
                    theme={selectThemeColors}
                    className='react-select w-100'
                    classNamePrefix='select'
                    placeholder=''
                    options={userRoles}
                    value={currentRole}
                    onChange={(data) => {
                      setCurrentRole(data);
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
        {/* Users Table */}
        <Card className={classnames({ 'd-none': loadingData })}>
          <DataTable
            // theme='dark'
            noHeader
            pagination
            subHeader
            responsive
            highlightOnHover
            paginationServer
            className='react-dataTable'
            sortServer
            sortIcon={<ChevronDown />}
            onSort={handleSort}
            selectableRows
            onSelectedRowsChange={handleSelectedRowsChange}
            clearSelectedRows={toggledClearRows}
            selectableRowDisabled={rowDisabledCriteria}
            paginationComponent={CustomPagination}
            data={store.data}
            columns={getColumns(
              userDeleteRestoreHandler,
              showTrash,
              toggleSidebar
            )}
            // progressPending={tableLoader}
            subHeaderComponent={
              <UserCustomHeader
                showTrash={showTrash}
                rowsPerPage={rowsPerPage}
                selectedRows={selectedRows}
                totalUser={store.totalUsers}
                toggleSidebar={toggleSidebar}
                setRowsPerPage={setRowsPerPage}
                getTrashedUsers={getTrashedUsers}
                userDeleteRestoreHandler={userDeleteRestoreHandler}
              />
            }
          />
        </Card>
      </div>
      {/* Modal */}
      {showUserModal && (
        <UserModal
          processing={processing}
          actionType={actionType}
          userToManage={userToManage}
          showUserModal={showUserModal}
          setShowUserModal={setShowUserModal}
          showUserModalData={showUserModalData}
          userDeleteRestoreHandler={userDeleteRestoreHandler}
        />
      )}
      {/* SideBar */}
      {sidebarOpen && (
        <Sidebar
          open={sidebarOpen}
          toggleSidebar={toggleSidebar}
          selectedUser={selectedUser}
        />
      )}
    </Fragment>
  );
};

export default UsersList;
