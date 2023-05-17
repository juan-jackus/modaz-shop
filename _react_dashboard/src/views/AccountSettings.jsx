// ** React
import { Fragment, useState, useEffect } from 'react';
// ** Redux Store and Actions
import { useSelector } from 'react-redux';
// ** Custom Component
import Breadcrumbs from '@components/breadcrumbs';
import GeneralTabContent from './components/accountSettings/GeneralTab';
import PasswordTabContent from './components/accountSettings/PasswordTab';
// ** Styling Component
import { User, Lock } from 'react-feather';
import '@styles/react/pages/page-account-settings.scss';
import {
  Row,
  Col,
  Nav,
  Card,
  TabPane,
  NavItem,
  NavLink,
  CardBody,
  TabContent,
} from 'reactstrap';

const AccountSettings = () => {
  const userData = useSelector((state) => state.auth.userData);
  const [activeTab, setActiveTab] = useState('1');
  const [accountData, setAccountData] = useState(userData);

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setAccountData(userData);
  }, [userData]);

  return (
    <Fragment>
      <Breadcrumbs
        breadCrumbTitle='Paramètres du compte'
        breadCrumbActive='Paramètres du compte'
      />

      <Row>
        <Col className='mb-2 mb-md-0' md='3'>
          <Nav className='nav-left' pills vertical>
            <NavItem>
              <NavLink
                active={activeTab === '1'}
                onClick={() => toggleTab('1')}
              >
                <User size={18} className='mr-1' />
                <span className='font-weight-bold'>Général</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === '3'}
                onClick={() => toggleTab('3')}
              >
                <Lock size={18} className='mr-1' />
                <span className='font-weight-bold'>
                  Modifier le mot de passe
                </span>
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
        <Col md='9'>
          <Card>
            <CardBody>
              <TabContent activeTab={activeTab}>
                <TabPane tabId='1'>
                  <GeneralTabContent accountData={accountData} />
                </TabPane>
                <TabPane tabId='3'>
                  <PasswordTabContent accountData={accountData} />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AccountSettings;
