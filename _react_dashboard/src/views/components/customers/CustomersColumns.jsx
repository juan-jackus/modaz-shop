// ** React
import { Link, useHistory } from 'react-router-dom';
// ** Redux Store and Actions
import { useDispatch } from 'react-redux';
import { getCustomer } from '@store/actions/customers';
// ** Custom Components
import RenderAvatar from '../users/RenderAvatar';
// ** Utils
import { capitalize, formatDate } from '@utils';
// ** Styling Components
import { MoreVertical, Trash2, RefreshCw, Archive } from 'react-feather';
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

export const getColumns = (customerDeleteRestoreHandler, showTrash) => {
  const dispatch = useDispatch();
  const history = useHistory();

  return [
    {
      name: 'Id',
      width: '130px',
      cell: (data) => <strong style={{ color: '#96999b' }}>{data.uid}</strong>,
    },
    {
      name: 'Clients',
      minWidth: '250px',
      sortable: true,
      sortField: 'name',
      cell: (data) => (
        <div className='d-flex justify-content-left align-items-center'>
          <RenderAvatar avatar={data.avatar} name={data.fullName} />
          <div className='d-flex flex-column'>
            <Link
              to={`/customers/edit/${data.id}`}
              onClick={() => dispatch(getCustomer(null, data))}
              className='user-name text-truncate mb-0'
            >
              <span className='font-weight-bold'>{data.fullName}</span>
              <small className='text-truncate d-block text-muted mb-0'>
                @{data.username}
              </small>
            </Link>
          </div>
        </div>
      ),
    },
    {
      name: 'Email',
      minWidth: '270px',
      selector: 'email',
      cell: (data) => data.email,
      // style: {
      //   backgroundColor: 'yellow',
      //   '&:hover': { backgroundColor: 'grey' },
      // },
    },
    {
      name: 'Genre',
      width: '100px',
      cell: (data) => data.gender && capitalize(data?.gender),
      conditionalCellStyles: [
        {
          when: (data) => data.gender === 'male',
          style: { color: '#4a90e2' },
        },
        {
          when: (data) => data.gender === 'female',
          style: { color: '#F47373' },
        },
      ],
    },
    {
      name: 'créé',
      width: '130px',
      sortable: true,
      sortField: 'id',
      omit: showTrash,
      cell: (data) => formatDate(data.created_at, true),
    },
    {
      name: 'Supprimé',
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
                onClick={() => customerDeleteRestoreHandler(data, 'RESTORE')}
                style={{ width: '100%', borderTop: '1px solid #e9e9e9' }}
              >
                <RefreshCw size={14} color='#2dc872' className='mr-50' />
                <span className='align-middle '>Restaurer</span>
              </DropdownItem>
            ) : (
              <DropdownItem
                className='w-100'
                onClick={() => {
                  dispatch(getCustomer(null, data));
                  history.push(`/customers/edit/${data.id}`);
                }}
              >
                <Archive size={14} color='#2dc872' className='mr-50' />
                <span className='align-middle '>Modifier</span>
              </DropdownItem>
            )}
            {/* Delete */}
            <DropdownItem
              className='w-100'
              onClick={() => customerDeleteRestoreHandler(data)}
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
