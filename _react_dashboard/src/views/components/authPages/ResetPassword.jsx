// ** React
import { useState, useEffect } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
// ** Redux Store and Actions
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, verifyResetPasswordToken } from '@store/actions/auth';
// ** Form and Validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import authSchema from './AuthValidationSchema';
// ** Third Party Components
import { toast, Slide } from 'react-toastify';
import classnames from 'classnames';
// ** Utils
import { useSkin } from '@hooks/useSkin';
// ** Custom Components
import ToastContent from '../users/ToastContent';
import InputPassword from '@components/input-password-toggle';
// ** Styling Components
import dashboardLogo from '@src/assets/images/logo/dashboard-logo.png';
import { ChevronLeft } from 'react-feather';
import {
  Row,
  Col,
  Form,
  Label,
  Alert,
  Button,
  Spinner,
  CardText,
  FormGroup,
  CardTitle,
} from 'reactstrap';
import '@styles/base/pages/page-auth.scss';

const AuthPages = () => {
  const history = useHistory();
  const [skin] = useSkin();
  const dispatch = useDispatch();
  const loginErrors = useSelector((state) => state.errors.login);
  const [resetEmail, setResetEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenError, setTokenError] = useState(false);
  const { register, errors, handleSubmit, setError } = useForm({
    mode: 'onBlur',
    defaultValues: {},
    resolver: yupResolver(authSchema),
  });
  const { token } = useParams();
  const illustration =
    skin === 'dark' ? 'reset-password-v2-dark.svg' : 'reset-password-v2.svg';
  const imgSource = require(`@src/assets/images/pages/${illustration}`).default;

  useEffect(async () => {
    const result = await dispatch(verifyResetPasswordToken(token)).then(
      (res) => res
    );
    setIsLoading(false);
    if (result.invalidToken) {
      history.replace('/');
    } else if (result.expiredToken) {
      setTokenError(result.expiredToken);
    } else {
      setResetEmail(result.email);
    }
  }, []);

  // ** Set server Errors response
  useEffect(() => {
    if (loginErrors) {
      loginErrors.forEach((error) => {
        setError(error.param, {
          type: 'manual',
          message: error.msg,
        });
      });
      dispatch({
        type: 'CLEAR_ERRORS',
        data: 'login',
      });
    }
  }, [loginErrors]);

  const resetPwdHandler = async (data) => {
    setIsSubmitting(true);
    data.token = token;
    data.email = resetEmail;
    const result = await dispatch(resetPassword(data)).then((res) => res);
    setIsSubmitting(false);
    if (result?.invalidToken) {
      return history.replace('/');
    } else if (result?.expiredToken) {
      return setTokenError(result.expiredToken);
    }
    if (!result) return;
    const toastValue = {
      type: 'success',
      text: 'Le mot de passe a été réinitialisé avec succès !',
    };
    toast[toastValue.type](ToastContent(toastValue), {
      transition: Slide,
      hideProgressBar: false,
      autoClose: 5000,
      pauseOnHover: true,
    });
    history.replace('/');
  };

  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={(e) => e.preventDefault()}>
          <img
            src={dashboardLogo}
            className='img-fluid'
            alt='logo'
            style={{ maxHeight: '50px' }}
          />
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={imgSource} alt='Login V2' />
          </div>
        </Col>
        <Col
          className='d-flex align-items-center auth-bg px-2 p-lg-5'
          lg='4'
          sm='12'
        >
          {isLoading ? (
            <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
              <CardTitle tag='h2' className='font-weight-bold mb-1'>
                Demande de réinitialisation du mot de passe...
              </CardTitle>
              <Spinner className='mx-auto' size='lg' color='primary' />
            </Col>
          ) : tokenError ? (
            <div>
              <h3>Demande de réinitialisation du mot de passe 🔒</h3>
              <Alert color='danger mt-2'>
                <div className='alert-body'>{tokenError}</div>
              </Alert>
              <Button.Ripple color='primary' block tag={Link} to='/'>
                <ChevronLeft className='mr-25' size={14} />
                <span className='align-middle'>
                  Retour à la page de connexion
                </span>
              </Button.Ripple>
            </div>
          ) : (
            <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
              <CardTitle tag='h2' className='font-weight-bold mb-1'>
                Réinitialiser le mot de passe 🔒
              </CardTitle>
              <CardText className='mb-2'>
                Votre nouveau mot de passe doit être différent de l'ancien
              </CardText>
              <Form
                className='auth-reset-password-form mt-2'
                onSubmit={handleSubmit(resetPwdHandler)}
              >
                <FormGroup>
                  <Label className='form-label' for='reset-pwd'>
                    Nouveau mot de passe
                  </Label>
                  <InputPassword
                    id='reset-pwd'
                    autoFocus
                    name='password'
                    innerRef={register}
                    required
                    className={classnames('input-group-merge', {
                      'is-invalid': errors['password'],
                    })}
                  />
                  <div className='invalid-feedback'>
                    {errors['password']?.message}
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label className='form-label' for='confirm-reset-pwd'>
                    Confirmer le mot de passe
                  </Label>
                  <InputPassword
                    id='confirm-reset-pwd'
                    name='passwordConfirmation'
                    innerRef={register}
                    required
                    className={classnames('input-group-merge', {
                      'is-invalid': errors['passwordConfirmation'],
                    })}
                  />
                  <div className='invalid-feedback'>
                    {errors['passwordConfirmation']?.message}
                  </div>
                </FormGroup>
                <Button.Ripple
                  color='primary'
                  disabled={isSubmitting}
                  type='submit '
                  block
                >
                  {isSubmitting ? (
                    <>
                      <Spinner color='white' />
                      <span className='ml-50'>Soumission...</span>
                    </>
                  ) : (
                    'Valider'
                  )}
                </Button.Ripple>
              </Form>
              <p className='text-center mt-2'>
                <Link to='/'>
                  <ChevronLeft className='mr-25' size={14} />
                  <span className='align-middle'>
                    Retour à la page de connexion
                  </span>
                </Link>
              </p>
            </Col>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AuthPages;
