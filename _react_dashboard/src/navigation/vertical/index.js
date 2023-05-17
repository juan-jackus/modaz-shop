// ** Styling Components
import {
  Box,
  User,
  Home,
  Users,
  Layout,
  Circle,
  Settings,
  FileText,
  ShoppingCart,
} from 'react-feather';

export default function getHorizontalMenuItems(loginUser) {
  // Login User Role
  const role = loginUser?.role?.toLowerCase();
  // Menu
  let menu = [
    {
      id: 'home-menu',
      title: 'Acceuil',
      icon: <Home size={20} />,
      navLink: '/home',
    },
    {
      id: 'modaz-carousel-menu',
      title: 'Modaz Carousel',
      icon: <Layout size={20} />,
      navLink: '/modaz-layout/main-slider',
      // children: [
      //   {
      //     id: 'modaz-main-slider',
      //     title: 'Main Slider',
      //     icon: <Circle size={12} />,
      //     navLink: '/modaz-layout/main-slider',
      //   },
      //   {
      //     id: 'modaz-home-section',
      //     title: 'Homepage Section',
      //     icon: <Circle size={12} />,
      //     navLink: '/modaz-layout/homepage-section',
      //   },
      // ],
    },
    {
      id: 'customers-menu',
      title: 'Clients',
      icon: <Users size={20} />,
      navLink: '/customers',
    },
    {
      id: 'products-menu',
      title: 'Produits',
      icon: <ShoppingCart size={20} />,
      navLink: '/products',
    },
    {
      id: 'orders-menu',
      title: 'Commandes',
      icon: <Box size={20} />,
      navLink: '/orders',
    },
    {
      id: 'blog-menu',
      title: 'Blog',
      icon: <FileText size={20} />,
      navLink: '/blog',
    },
    {
      id: 'users-menu',
      title: 'Utilisateurs',
      icon: <User size={20} />,
      navLink: '/users',
    },
    {
      id: 'account-settings-menu',
      title: 'Paramètres',
      icon: <Settings size={20} />,
      navLink: '/account-settings',
    },
  ];

  if (role === 'author' || role === 'editor') {
    menu = menu.filter(
      (item) =>
        item.id === 'home-menu' ||
        item.id === 'blog-menu' ||
        item.id === 'account-settings-menu'
    );
  }

  if (role === 'maintainer') {
    menu = menu.filter((item) => item.id !== 'blog-menu');
  }

  return menu;
}
