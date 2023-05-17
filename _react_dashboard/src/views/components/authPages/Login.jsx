// ** React
import { Link } from 'react-router-dom';
// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle';
// ** Styling Components
import { AlertCircle } from 'react-feather';
import {
  Col,
  Form,
  Alert,
  Label,
  Input,
  Button,
  Spinner,
  CardText,
  FormGroup,
  CardTitle,
  CustomInput,
} from 'reactstrap';

const Login = (props) => {
  //
  const {
    register,
    loginError,
    setAuthForm,
    handleSubmit,
    loginHandler,
    isSubmitting,
  } = props;

  return (
    <Col
      className='d-flex align-items-center auth-bg px-2 p-lg-5'
      lg='4'
      sm='12'
    >
      <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
        <CardTitle tag='h2' className='font-weight-bold mb-1 text-center '>
          Bienvenue ! 👋
        </CardTitle>
        <CardText className='mb-2 text-center'>
          Veuillez vous connecter à votre compte
        </CardText>
        <Alert color='danger' isOpen={!!loginError}>
          <div className='alert-body'>
            <AlertCircle size={15} />
            <span className='ms-1'>{loginError?.msg}</span>
          </div>
        </Alert>
        <Form
          className='auth-login-form mt-2'
          onSubmit={handleSubmit(loginHandler)}
        >
          <FormGroup>
            <Label className='form-label' for='login-email'>
              Email
            </Label>
            <Input
              type='email'
              id='login-email'
              name='email'
              placeholder='Email'
              innerRef={register}
              autoFocus
              required
            />
          </FormGroup>
          <FormGroup>
            <div className='d-flex justify-content-between'>
              <Label className='form-label' for='login-password'>
                Mot de passe
              </Label>
              <Link to='#' onClick={() => setAuthForm('forgotPwd')}>
                <small>Mot de passe oublié ?</small>
              </Link>
            </div>
            <InputPasswordToggle
              name='password'
              id='login-password'
              placeholder='Mot de passe'
              innerRef={register}
              required
              className='input-group-merge'
            />
          </FormGroup>
          <FormGroup>
            <CustomInput
              type='checkbox'
              name='rememberMe'
              className='custom-control-Primary'
              id='rememberMe'
              label='Rester Connecté'
              innerRef={register}
            />
          </FormGroup>
          <Button.Ripple
            block
            type='submit'
            color='primary'
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner color='white' /> : 'Se connecter'}
          </Button.Ripple>
        </Form>
      </Col>
    </Col>
  );
};

export default Login;
