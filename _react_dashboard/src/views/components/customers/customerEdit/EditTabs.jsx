// ** React
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
// ** Redux Store and Actions
import { useSelector, useDispatch } from 'react-redux';
import { removeSelectedCustomer } from '@src/redux/actions/customers';
// ** Utils
import _ from 'lodash';
// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs';
import InfosTab from './InfosTab.jsx';
import SocialTab from './SocialTab.jsx';
// ** Styling Components
import { User, Share2 } from 'react-feather';
import {
  Row,
  Col,
  Nav,
  Card,
  NavItem,
  NavLink,
  TabPane,
  CardBody,
  TabContent,
} from 'reactstrap';
import '@styles/react/apps/app-users.scss';

const CustomerEdit = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  // ** States
  const [activeTab, setActiveTab] = useState('1'),
    customerErrors = useSelector((state) => state.errors.addCustomer),
    store = useSelector((state) => state.customers),
    params = useSelector((state) => state.customers.params),
    selectedCustomer = store.selectedCustomer
      ? _.cloneDeep(store.selectedCustomer)
      : null;
  // ** Function to toggle tabs
  const toggle = (tab) => setActiveTab(tab);

  // ** Remove Selected User on Component Unmount
  useEffect(() => {
    return () => {
      dispatch(removeSelectedCustomer());
    };
  }, []);

  return !selectedCustomer ? (
    <Redirect to='/customers' />
  ) : (
    <>
      <Breadcrumbs
        breadCrumbTitle='Modifier le client'
        breadCrumbParent='Clients'
        breadCrumbActive='Modifier'
      />

      <Row>
        <Col sm='12'>
          <Card>
            <CardBody className='pt-2'>
              <Nav pills>
                {/* Informations */}
                <NavItem>
                  <NavLink
                    active={activeTab === '1'}
                    onClick={() => toggle('1')}
                  >
                    <User size={14} />
                    <span className='align-middle d-none d-sm-block'>
                      Informations
                    </span>
                  </NavLink>
                </NavItem>
                {/* Social */}
                <NavItem>
                  <NavLink
                    active={activeTab === '2'}
                    onClick={() => toggle('2')}
                  >
                    <Share2 size={14} />
                    <span className='align-middle d-none d-sm-block'>
                      Socials
                    </span>
                  </NavLink>
                </NavItem>
              </Nav>
              {/* Tab Content */}
              <TabContent activeTab={activeTab}>
                {/* Informations Tab */}
                <TabPane tabId='1'>
                  <InfosTab
                    params={params}
                    customerErrors={customerErrors}
                    selectedCustomer={selectedCustomer}
                  />
                </TabPane>
                {/* Socials Tabs */}
                <TabPane tabId='2'>
                  <SocialTab
                    customerErrors={customerErrors}
                    selectedCustomer={selectedCustomer}
                  />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default CustomerEdit;
