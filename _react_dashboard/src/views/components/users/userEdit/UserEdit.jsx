// ** React
import { useState, useEffect, Fragment } from 'react';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
// ** Redux Store and Actions
import { useSelector, useDispatch } from 'react-redux';
import { removeSelectedUser } from '@src/redux/actions/users';
// ** Third Party Components
import Flatpickr from 'react-flatpickr';
import '@styles/react/libs/flatpickr/flatpickr.scss';
// ** Utils
import { capitalize } from '@utils';
// ** Custom Components
import Sidebar from './NewUserSidebar';
import PermissionsTable from './PermissionsTable';
import Breadcrumbs from '@components/breadcrumbs';
import renderUserAvatar from './UserEditAvatar';
// ** Styling Components
import {
  Col,
  Row,
  Form,
  Label,
  Media,
  Input,
  Button,
  Container,
  FormGroup,
} from 'reactstrap';

const UserEdit = () => {
  const history = useHistory();
  const location = useLocation();
  const trashed = location.state?.showTrash;
  const dispatch = useDispatch();
  const loginUser = useSelector((state) => state.auth.userData);
  const store = useSelector((state) => state.users);
  const { selectedUser, userRoles } = store;
  const role = userRoles.find((role) => role.label === selectedUser.role);

  // ** States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ** Remove Selected User on Component Unmount
  useEffect(() => {
    return () => {
      dispatch(removeSelectedUser());
    };
  }, []);

  // ** Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return !selectedUser ? (
    <Redirect to='/users' />
  ) : (
    <Fragment>
      <Breadcrumbs
        breadCrumbTitle="Modifier l'utilisateur"
        breadCrumbParent='Utilisateurs'
        breadCrumbActive='Modifier'
      />
      <Container>
        <Row>
          <Col
            sm='12'
            className='d-flex justify-content-center align-items-center '
          >
            {/* Avatar */}
            <Media className='mb-2'>
              {renderUserAvatar(selectedUser.avatar, selectedUser.fullName)}
            </Media>
            {/* Full Name */}
            <FormGroup>
              <Label for='r-full-name'>Nom complet</Label>
              <Input id='r-full-name' value={selectedUser.fullName} disabled />
            </FormGroup>
          </Col>
          {/* Form */}
          <Col sm='12'>
            <Form className='read-only-form'>
              <Row>
                {/* Username */}
                <Col md='4' sm='12'>
                  <FormGroup>
                    <Label for='r-username'>Nom d'utilisateur</Label>
                    <Input
                      id='r-username'
                      value={selectedUser.username}
                      disabled
                    />
                  </FormGroup>
                </Col>
                {/* Email */}
                <Col md='4' sm='12'>
                  <FormGroup>
                    <Label for='r-email'>Email</Label>
                    <Input id='r-email' value={selectedUser.email} disabled />
                  </FormGroup>
                </Col>
                {/* Role */}
                <Col md='4' sm='12'>
                  <FormGroup>
                    <Label for='r-role'>Rôle de l'utilisateur</Label>
                    <Input id='r-role' value={role.labelFr || ''} disabled />
                  </FormGroup>
                </Col>
                {/* Phone Number */}
                <Col md='4' sm='12'>
                  <FormGroup>
                    <Label for='r-phoneNumber'>Numéro de téléphone</Label>
                    <Input
                      id='r-phoneNumber'
                      value={selectedUser.phoneNumber}
                      disabled
                    />
                  </FormGroup>
                </Col>
                {/* Birthdate */}
                <Col md='4' sm='12'>
                  <FormGroup>
                    <Label for='r-birthdate'>Date de naissance</Label>
                    <Flatpickr
                      id='r-birthdate'
                      value={selectedUser.birthdate}
                      className='form-control'
                      options={{ dateFormat: 'd-m-Y', enableTime: false }}
                      disabled
                    />
                  </FormGroup>
                </Col>
                {/* Permissions Table */}
                <Col sm='12'>
                  <PermissionsTable />
                </Col>
              </Row>
            </Form>
            {/* Buttons */}
            <div className='d-flex my-2'>
              {/* Show Edit if user not trashed */}
              {loginUser.id !== selectedUser.id && !trashed && (
                <Button.Ripple
                  className='mr-2'
                  color='primary'
                  onClick={toggleSidebar}
                  disabled={loginUser.id === selectedUser.id}
                >
                  Modifier
                </Button.Ripple>
              )}
              {/* Go Back */}
              <Button.Ripple
                color='secondary'
                outline
                onClick={() => history.goBack()}
              >
                Retour
              </Button.Ripple>
            </div>
          </Col>
        </Row>
        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar
            open={sidebarOpen}
            selectedUser={selectedUser}
            toggleSidebar={toggleSidebar}
          />
        )}
      </Container>
    </Fragment>
  );
};
export default UserEdit;
