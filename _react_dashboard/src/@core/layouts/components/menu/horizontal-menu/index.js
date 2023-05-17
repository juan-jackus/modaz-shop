// ** React Imports
import { useState } from 'react';
// ** Redux Store and Actions
import { useSelector } from 'react-redux';
// ** Horizontal Menu Function
import getHorizontalMenuItems from '@src/navigation/horizontal';
// ** Horizontal Menu Components
import HorizontalNavMenuItems from './HorizontalNavMenuItems';

const HorizontalMenu = ({ currentActiveItem, routerProps }) => {
  // ** Get Menu Navigation Items
  const loginUser = useSelector((state) => state.auth.userData);
  const menuItems = getHorizontalMenuItems(loginUser);
  // ** States
  const [activeItem, setActiveItem] = useState(null);
  const [groupActive, setGroupActive] = useState([]);
  const [openDropdown, setOpenDropdown] = useState([]);

  // ** On mouse enter push the ID to openDropdown array
  const onMouseEnter = (id) => {
    const arr = openDropdown;
    arr.push(id);
    setOpenDropdown([...arr]);
  };

  // ** On mouse leave remove the ID to openDropdown array
  const onMouseLeave = (id) => {
    const arr = openDropdown;
    arr.splice(arr.indexOf(id), 1);
    setOpenDropdown([...arr]);
  };

  return (
    <div className='navbar-container main-menu-content'>
      <ul className='nav navbar-nav' id='main-menu-navigation'>
        <HorizontalNavMenuItems
          submenu={false}
          items={menuItems}
          activeItem={activeItem}
          groupActive={groupActive}
          routerProps={routerProps}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          openDropdown={openDropdown}
          setActiveItem={setActiveItem}
          setGroupActive={setGroupActive}
          setOpenDropdown={setOpenDropdown}
          currentActiveItem={currentActiveItem}
        />
      </ul>
    </div>
  );
};

export default HorizontalMenu;
