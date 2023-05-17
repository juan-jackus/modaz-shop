// ** React Imports
import { Suspense, lazy, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { persistLogin } from '../redux/actions/auth';

// ** Utils
import { useLayout } from '@hooks/useLayout';
import { useRouterTransition } from '@hooks/useRouterTransition';

// ** Custom Components
import Spinner from '@components/spinner/Loading-spinner';
import LayoutWrapper from '@layouts/components/layout-wrapper';

import { toast, Slide } from 'react-toastify';
import Avatar from '@components/avatar';
import { AlertCircle } from 'react-feather';

// ** Router Components
import {
  BrowserRouter as AppRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

// ** Routes & Default Routes
import { DefaultRoute, Routes } from './routes';

// ** Layouts
import BlankLayout from '@layouts/BlankLayout';
import VerticalLayout from '@src/layouts/VerticalLayout';
import HorizontalLayout from '@src/layouts/HorizontalLayout';

const ToastContent = (toast) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='danger' icon={<AlertCircle size={12} />} />
        <h6 className='toast-title font-weight-bold text-center'>{toast}</h6>
      </div>
    </div>
  </Fragment>
);

const Router = () => {
  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector((state) => state.auth.isLogin);
  const networkError = useSelector((state) => state.errors.network);
  // ** Hooks
  const [layout, setLayout] = useLayout();
  const [transition, setTransition] = useRouterTransition();

  // ** Default Layout
  const DefaultLayout =
    layout === 'horizontal' ? 'HorizontalLayout' : 'VerticalLayout';

  // ** All of the available layouts
  const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout };

  // ** Current Active Item
  const currentActiveItem = null;

  // ** Return Filtered Array of Routes & Paths
  const LayoutRoutesAndPaths = (layout) => {
    const LayoutRoutes = [];
    const LayoutPaths = [];

    if (Routes) {
      Routes.filter((route) => {
        // ** Checks if Route layout or Default layout matches current layout
        if (
          route.layout === layout ||
          (route.layout === undefined && DefaultLayout === layout)
        ) {
          LayoutRoutes.push(route);
          LayoutPaths.push(route.path);
        }
      });
    }

    return { LayoutRoutes, LayoutPaths };
  };

  // ** Init Error Component
  const Error = lazy(() => import('@src/views/Error'));

  /**
   ** Final Route Component Checks for Login & User Role and then redirects to the route
   */
  const FinalRoute = (props) => {
    const route = props.route;

    if (
      (!isUserLoggedIn && route.meta === undefined) ||
      (!isUserLoggedIn &&
        route.meta &&
        !route.meta.authRoute &&
        !route.meta.publicRoute)
    ) {
      /**
       ** If user is not Logged in & route meta is undefined
       ** OR
       ** If user is not Logged in & route.meta.authRoute, !route.meta.publicRoute are undefined
       ** Then redirect user to login
       */

      return <Redirect to='/login' />;
    } else if (isUserLoggedIn && route.meta && route.meta.authRoute) {
      // ** If route has meta and authRole and user is Logged in then redirect user to home page (DefaultRoute)
      return <Redirect to='/' />;
    } else {
      // ** If none of the above render component
      return <route.component {...props} />;
    }
  };

  // ** Return Route to Render
  const ResolveRoutes = () => {
    return Object.keys(Layouts).map((layout, index) => {
      // ** Convert Layout parameter to Layout Component
      // ? Note: make sure to keep layout and component name equal

      const LayoutTag = Layouts[layout];

      // ** Get Routes and Paths of the Layout
      const { LayoutRoutes, LayoutPaths } = LayoutRoutesAndPaths(layout);

      // ** We have freedom to display different layout for different route
      // ** We have made LayoutTag dynamic based on layout, we can also replace it with the only layout component,
      // ** that we want to implement like VerticalLayout or HorizontalLayout
      // ** We segregated all the routes based on the layouts and Resolved all those routes inside layouts

      // ** RouterProps to pass them to Layouts
      const routerProps = {};

      return (
        <Route path={LayoutPaths} key={index}>
          <LayoutTag
            routerProps={routerProps}
            layout={layout}
            setLayout={setLayout}
            transition={transition}
            setTransition={setTransition}
            currentActiveItem={currentActiveItem}
          >
            <Switch>
              {LayoutRoutes.map((route) => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact === true}
                    render={(props) => {
                      // ** Assign props to routerProps
                      Object.assign(routerProps, {
                        ...props,
                        meta: route.meta,
                      });

                      return (
                        <Suspense fallback={<Spinner />}>
                          {/* Layout Wrapper to add classes based on route's layout, appLayout and className */}
                          <LayoutWrapper
                            layout={DefaultLayout}
                            transition={transition}
                            setTransition={setTransition}
                            /* Conditional props */
                            /*eslint-disable */
                            {...(route.appLayout
                              ? {
                                  appLayout: route.appLayout,
                                }
                              : {})}
                            {...(route.meta
                              ? {
                                  routeMeta: route.meta,
                                }
                              : {})}
                            {...(route.className
                              ? {
                                  wrapperClass: route.className,
                                }
                              : {})}
                            /*eslint-enable */
                          >
                            <FinalRoute route={route} {...props} />
                          </LayoutWrapper>
                        </Suspense>
                      );
                    }}
                  />
                );
              })}
            </Switch>
          </LayoutTag>
        </Route>
      );
    });
  };

  // ** Persist loggin
  useEffect(() => {
    dispatch(persistLogin());
  }, []);

  // ** Show Network Error
  useEffect(() => {
    if (networkError) {
      toast.error(ToastContent(networkError), {
        transition: Slide,
        hideProgressBar: true,
        autoClose: 5000,
        pauseOnHover: true,
      });
      dispatch({
        type: 'CLEAR_ERRORS',
        data: 'network',
      });
    }
  }, [networkError]);

  return (
    <AppRouter basename='/admin/dashboard'>
      <Switch>
        {/* If user is logged in Redirect user to DefaultRoute else to login */}
        <Route
          exact
          path='/'
          render={() => {
            return isUserLoggedIn ? (
              <Redirect to={DefaultRoute} />
            ) : (
              <Redirect to='/login' />
            );
          }}
        />
        {/* Not Auth Route */}
        {ResolveRoutes()}
        {/* NotFound Error page */}
        <Route path='*' component={Error} />/
      </Switch>
    </AppRouter>
  );
};

export default Router;
