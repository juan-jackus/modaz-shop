// ** React
import { Link } from 'react-router-dom';
// ** Redux Store and Actions
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '@src/redux/actions/users';
// ** Utils
import { formatDate } from '@utils';
// ** Custom Components
import RenderAvatar from './RenderAvatar';
// ** Styling Components
import {
  Hash,
  Edit,
  User,
  Edit3,
  Slack,
  Trash2,
  Archive,
  Settings,
  RefreshCw,
  MoreVertical,
} from 'react-feather';
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

// ** Renders Role Columns
const renderRole = (data, userRoles) => {
  const role = userRoles.find((role) => role.label === data.role);
  const icons = { Edit3, Edit, Settings, Slack, Hash };
  const Icon = icons[role?.icon] || User;
  return (
    <span className='text-truncate text-capitalize align-middle'>
      <Icon size={18} className={`${role?.class} mr-50`} />
      {role.label}
    </span>
  );
};

export const getColumns = (
  userDeleteRestoreHandler,
  showTrash,
  toggleSidebar
) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.userData);
  const userRoles = useSelector((state) => state.users.userRoles);

  return [
    {
      name: 'Id',
      width: '130px',
      cell: (data) => <strong style={{ color: '#96999b' }}>{data.uid}</strong>,
    },
    {
      name: 'Name',
      minWidth: '250px',
      sortable: true,
      sortField: 'name',
      cell: (data) => (
        <div className='d-flex justify-content-left align-items-center'>
          <RenderAvatar avatar={data.avatar} name={data.fullName} />
          <div className='d-flex flex-column'>
            <Link
              to={{
                pathname: `/users/edit/${data.id}`,
                state: { showTrash },
              }}
              className='user-name text-truncate mb-0'
              onClick={() => dispatch(getUser(data.id, data))}
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
      selector: (data) => data.email,
    },
    {
      name: 'Role',
      width: '170px',
      cell: (data) => renderRole(data, userRoles),
    },
    {
      name: 'Created',
      width: '130px',
      sortable: true,
      sortField: 'id',
      omit: showTrash,
      cell: (data) => formatDate(data.created_at, true),
    },
    {
      name: 'Deleted',
      width: '130px',
      sortable: true,
      sortField: 'trash',
      omit: !showTrash,
      cell: (data) => formatDate(data.deleted_at, true),
    },
    {
      name: 'Actions',
      width: '130px',
      cell: (data) => {
        if (authUser.id === data.id) return null;

        return (
          <UncontrolledDropdown>
            <DropdownToggle tag='div' className='btn btn-sm'>
              <MoreVertical size={14} className='cursor-pointer' />
            </DropdownToggle>
            <DropdownMenu right>
              {showTrash ? (
                <DropdownItem
                  className='w-100'
                  onClick={() => userDeleteRestoreHandler(data, 'RESTORE')}
                  style={{ width: '100%', borderTop: '1px solid #e9e9e9' }}
                >
                  <RefreshCw size={14} color='#2dc872' className='mr-50' />
                  <span className='align-middle '>Restore</span>
                </DropdownItem>
              ) : (
                // Edit
                <DropdownItem
                  className='w-100'
                  onClick={() => toggleSidebar(data)}
                >
                  <Archive size={14} color='#2dc872' className='mr-50' />
                  <span className='align-middle '>Edit</span>
                </DropdownItem>
              )}
              {/* Delete */}
              <DropdownItem
                className='w-100'
                onClick={() => userDeleteRestoreHandler(data)}
                style={{ width: '100%', borderTop: '1px solid #e9e9e9' }}
              >
                <Trash2 size={14} color='#ea5455' className='mr-50' />
                <span className='align-middle '>Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        );
      },
    },
  ];
};
