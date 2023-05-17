import { Link } from 'react-router-dom';
// ** Styling Components
import { ChevronLeft, AlertCircle } from 'react-feather';
import {
  Col,
  Form,
  Label,
  Alert,
  Input,
  Button,
  Spinner,
  CardText,
  CardTitle,
  FormGroup,
} from 'reactstrap';
import '@styles/base/pages/page-auth.scss';

const ForgotPassword = (props) => {
  //
  const {
    register,
    loginError,
    setAuthForm,
    handleSubmit,
    isSubmitting,
    forgotPwdHandler,
  } = props;

  return (
    <Col
      className='d-flex align-items-center auth-bg px-2 p-lg-5'
      lg='4'
      sm='12'
    >
      <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
        <CardTitle tag='h2' className='font-weight-bold mb-1'>
          Mot de passe oublié ? 🔒
        </CardTitle>
        <CardText className='mb-2'>
          Saisissez votre adresse électronique et nous vous enverrons les
          instructions pour réinitialiser votre mot de passe.
        </CardText>
        <Alert color='danger' isOpen={!!loginError}>
          <div className='alert-body'>
            <AlertCircle size={15} />
            <span className='ms-1'>{loginError?.msg}</span>
          </div>
        </Alert>
        <Form
          className='auth-forgot-password-form mt-2'
          onSubmit={handleSubmit(forgotPwdHandler)}
        >
          <FormGroup>
            <Label className='form-label' for='forgotPwd-email'>
              Email
            </Label>
            <Input
              required
              autoFocus
              type='email'
              id='forgotPwd-email'
              name='email'
              placeholder='juan@example.com'
              innerRef={register}
            />
          </FormGroup>
          <Button.Ripple
            block
            type='submit'
            color='primary'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner color='white' />
            ) : (
              'Envoyer le lien de réinitialisation'
            )}
          </Button.Ripple>
        </Form>
        {!isSubmitting && (
          <p className='text-center mt-2'>
            <Link to='#' onClick={() => setAuthForm('login')}>
              <ChevronLeft className='mr-25' size={14} />
              <span className='align-middle'>
                Retour à la page de connexion
              </span>
            </Link>
          </p>
        )}
      </Col>
    </Col>
  );
};

export default ForgotPassword;
