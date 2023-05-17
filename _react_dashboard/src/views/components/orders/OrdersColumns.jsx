// ** React Imports
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
// ** Redux Store and Actions
import { useDispatch, useSelector } from 'react-redux';
import { getOrder, updateOrderStatus } from '@src/redux/actions/orders';
// import { getCustomer } from '@src/redux/actions/customers';
// ** Utils
import { formatDate } from '@utils';
// ** Styling Components
import {
  Trash2,
  Eye,
  RefreshCw,
  ChevronDown,
  MoreVertical,
} from 'react-feather';
import {
  Badge,
  Spinner,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

const renderStatus = (
  data,
  dispatch,
  statusOptions,
  showTrash,
  loader,
  setLoader
) => {
  // eslint-disable-next-line
  const status = statusOptions.find((option) => option.value == data.status);
  // const arrowStyle = i === 0 ? 'arrow-top' : 'arrow-bottom';
  const statusUpdateHandler = async (st, data) => {
    setLoader(data.id);
    await dispatch(updateOrderStatus({ status: st.value }, data.id));
    setLoader(false);
  };

  return loader === data.id ? (
    <div className='w-100 d-flex justify-content-center '>
      <Spinner color='primary' />
    </div>
  ) : (
    <UncontrolledDropdown>
      <DropdownToggle tag='div' className='btn btn-sm'>
        <Badge className='text-capitalize' color={status?.color} pill>
          {status.label}
          <ChevronDown style={{ marginLeft: '5px' }} />
        </Badge>
      </DropdownToggle>
      {!showTrash && (
        <DropdownMenu className='status-dropdown '>
          {statusOptions.map((st, i) => {
            // eslint-disable-next-line
            return st.value != data.status ? (
              <DropdownItem
                key={i}
                className='w-100 text-capitalize'
                onClick={() => statusUpdateHandler(st, data)}
              >
                {st.label}
              </DropdownItem>
            ) : null;
          })}
        </DropdownMenu>
      )}
    </UncontrolledDropdown>
  );
};

export const getColumns = (
  oderDeleteRestoreHandler,
  statusOptions,
  showTrash
) => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const statusOptions = useSelector((state) => state.orders.statusOptions);
  const [loader, setLoader] = useState(false);

  return [
    {
      name: 'Id',
      width: '130px',
      sortable: true,
      sortField: 'id',
      // sortFunction: uidSortFunction,
      cell: (data) => (
        <Link
          to={`/orders/view/${data.id}`}
          onClick={() => dispatch(getOrder(_, data))}
        >
          <span className='font-weight-bold'>{data.uid}</span>
        </Link>
      ),
    },
    {
      name: 'Clients',
      minWidth: '200px',
      cell: (data) => <span>@{data.customer.username}</span>,
    },
    {
      name: 'Prix total',
      minWidth: '150px',
      sortable: true,
      sortField: 'price',
      cell: (data) => `$${(+data.totalPrice.toFixed(2)).toLocaleString()}`,
    },
    {
      name: 'Statut',
      width: '150px',
      cell: (data) =>
        renderStatus(
          data,
          dispatch,
          statusOptions,
          showTrash,
          loader,
          setLoader
        ),
    },
    {
      name: 'Créée',
      width: '130px',
      sortable: true,
      sortField: 'id',
      omit: showTrash,
      cell: (data) => formatDate(data.created_at, true),
    },
    {
      name: 'Supprimée',
      width: '130px',
      sortable: true,
      sortField: 'trash',
      omit: !showTrash,
      cell: (data) => formatDate(data.deleted_at, true),
    },
    {
      name: 'Actions',
      width: '130px',
      cell: (data) => (
        <UncontrolledDropdown>
          <DropdownToggle tag='div' className='btn btn-sm'>
            <MoreVertical size={14} className='cursor-pointer' />
          </DropdownToggle>
          <DropdownMenu right>
            {showTrash ? (
              <DropdownItem
                className='w-100'
                onClick={() => oderDeleteRestoreHandler(data, 'RESTORE')}
                style={{ width: '100%', borderTop: '1px solid #e9e9e9' }}
              >
                <RefreshCw size={14} color='#2dc872' className='mr-50' />
                <span className='align-middle '>Restaurer</span>
              </DropdownItem>
            ) : (
              <DropdownItem
                className='w-100'
                onClick={() => {
                  dispatch(getOrder(null, data));
                  history.push(`/orders/view/${data.id}`);
                }}
              >
                <Eye size={14} color='#2dc872' className='mr-50' />
                <span className='align-middle '>Voir</span>
              </DropdownItem>
            )}
            {/* Delete */}
            <DropdownItem
              className='w-100'
              onClick={() => oderDeleteRestoreHandler(data)}
              style={{ width: '100%', borderTop: '1px solid #e9e9e9' }}
            >
              <Trash2 size={14} color='#ea5455' className='mr-50' />
              <span className='align-middle '>Supprimer</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ];
};
