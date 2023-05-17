// ** React Imports
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// ** Custom Components
import Avatar from '@components/avatar';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { handleLogout } from '@store/actions/auth';

// ** Third Party Components
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from 'reactstrap';
import { User, Power } from 'react-feather';

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/placeholder-profil.png';

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);

  // ** State
  const [userData, setUserData] = useState(null);

  //** ComponentDidMount
  useEffect(() => {
    setUserData(user);
  }, [user]);

  //** Vars
  const userAvatar = userData?.avatar || defaultAvatar;

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle
        href='/'
        tag='a'
        className='nav-link dropdown-user-link'
        onClick={(e) => e.preventDefault()}
      >
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name font-weight-bold'>
            {userData?.username}
          </span>
          <span className='user-status'>{userData?.role}</span>
        </div>
        <Avatar img={userAvatar} imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to='/account-settings'>
          <User size={14} className='mr-75' />
          <span className='align-middle'>Profil</span>
        </DropdownItem>
        <DropdownItem
          className='w-100'
          onClick={() => dispatch(handleLogout(userData.id))}
        >
          <Power size={14} className='mr-75' />
          <span className='align-middle'>Déconnexion</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
