// ** Dropdowns Imports
import { Fragment } from 'react';

import UserDropdown from './UserDropdown';

// ** Third Party Components
import { Sun, Moon, Menu, Globe } from 'react-feather';
import { NavItem, NavLink, UncontrolledTooltip } from 'reactstrap';

const NavbarUser = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props;

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = (props) => {
    if (skin === 'dark') {
      return <Sun {...props} onClick={() => setSkin('light')} />;
    } else {
      return <Moon {...props} onClick={() => setSkin('dark')} />;
    }
  };

  return (
    <Fragment>
      {/* HAMBURGER MENU */}
      <ul className='navbar-nav d-xl-none d-flex align-items-center'>
        <NavItem className='mobile-menu mr-auto'>
          <NavLink
            className='nav-menu-main menu-toggle hidden-xs is-active'
            onClick={() => setMenuVisibility(true)}
          >
            <Menu className='ficon' />
          </NavLink>
        </NavItem>
      </ul>
      {/* END HAMBURGER MENU */}
      {/* THEME TOGGLER */}
      <div className='bookmark-wrapper d-flex align-items-center'>
        <NavItem className='d-none d-lg-block'>
          <a href='/' target='_blank' style={{ color: 'inherit' }}>
            <Globe id='website-link' className='ml-2' />
            <UncontrolledTooltip placement='top' target='website-link'>
              Aller au site web
            </UncontrolledTooltip>
          </a>
          <ThemeToggler id='set-theme' className='ficon ml-2 cursor-pointer' />
          <UncontrolledTooltip placement='top' target='set-theme'>
            Changer l'apparence du thème
          </UncontrolledTooltip>
        </NavItem>
      </div>
      {/* END THEME TOGGLER */}
      <ul className='nav navbar-nav align-items-center ml-auto'>
        <UserDropdown />
      </ul>
    </Fragment>
  );
};
export default NavbarUser;
