import { lazy } from 'react';

// ** Document title
const TemplateTitle = 'Modaz Admin Dashboard';

// ** Default Route
const DefaultRoute = '/home';

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/HomePage.jsx')),
  },
  {
    path: '/modaz-layout/main-slider',
    component: lazy(() => import('../../views/ModazMainSlider.jsx')),
  },
  {
    path: '/modaz-layout/homepage-section',
    component: lazy(() => import('../../views/HomepageSection.jsx')),
  },
  {
    path: '/customers/edit/:id',
    component: lazy(() =>
      import('../../views/components/customers/customerEdit/EditTabs.jsx')
    ),
    meta: {
      navLink: '/customers/edit',
    },
  },
  {
    path: '/customers',
    component: lazy(() => import('../../views/Customers.jsx')),
  },
  {
    path: '/products/add',
    className: 'ecommerce-application',
    component: lazy(() =>
      import('../../views/components/products/productEdit/ProductEdit.jsx')
    ),
    meta: {
      navLink: '/products/add',
    },
  },
  {
    path: '/products/edit/:id',
    className: 'ecommerce-application',
    component: lazy(() =>
      import('../../views/components/products/productEdit/ProductEdit.jsx')
    ),
    meta: {
      navLink: '/products/edit',
    },
  },
  {
    path: '/products',
    className: 'ecommerce-application',
    exact: true,
    component: lazy(() => import('../../views/Products.jsx')),
  },
  {
    path: '/orders/view/:id',
    component: lazy(() =>
      import('../../views/components/orders/ViewOrder.jsx')
    ),
  },
  {
    path: '/orders',
    component: lazy(() => import('../../views/Orders.jsx')),
  },
  {
    path: '/blog/view/:id',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/components/blog/BlogDetail.jsx')),
  },
  {
    path: '/blog/edit/:id',
    className: 'ecommerce-application',
    component: lazy(() =>
      import('../../views/components/blog/blogEdit/BlogEdit.jsx')
    ),
  },
  {
    path: '/blog/add',
    className: 'ecommerce-application',
    component: lazy(() =>
      import('../../views/components/blog/blogEdit/BlogEdit.jsx')
    ),
  },
  {
    path: '/blog',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/Blog.jsx')),
  },
  {
    path: '/users/edit/:id',
    component: lazy(() =>
      import('../../views/components/users/userEdit/UserEdit.jsx')
    ),
    meta: {
      navLink: '/users/edit',
    },
  },
  {
    path: '/users',
    exact: true,
    component: lazy(() => import('../../views/Users.jsx')),
  },
  {
    path: '/account-settings',
    component: lazy(() => import('../../views/AccountSettings.jsx')),
  },
  {
    path: '/login/reset-password/:token',
    component: lazy(() =>
      import('../../views/components/authPages/ResetPassword.jsx')
    ),
    layout: 'BlankLayout',
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/AuthPages.jsx')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout',
  },
];

export { DefaultRoute, TemplateTitle, Routes };
