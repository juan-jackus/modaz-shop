// ** React
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// ** Redux Store and Actions
import { useDispatch, useSelector } from 'react-redux';
import { handleLogin, handleForgotPassword } from '@store/actions/auth';
// ** Form and Validation
import { useForm } from 'react-hook-form';
// ** Third Party Components
import { toast, Slide } from 'react-toastify';
// ** Utils
import { useSkin } from '@hooks/useSkin';
// ** Custom Components
import ToastContent from './components/users/ToastContent';
import Login from './components/authPages/Login';
import ForgotPassword from './components/authPages/ForgotPassword';
// ** Styling Components
import dashboardLogo from '@src/assets/images/logo/dashboard-logo.png';
import { Row, Col } from 'reactstrap';
import '@styles/base/pages/page-auth.scss';

const AuthPages = () => {
  const [skin] = useSkin();
  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.errors.login);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authForm, setAuthForm] = useState('login');
  const { register, handleSubmit } = useForm();

  let illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg';
  // ** Set server Errors response
  useEffect(() => {
    if (loginError) {
      setTimeout(() => {
        dispatch({
          type: 'CLEAR_ERRORS',
          data: 'login',
        });
      }, 5000);
    }
  }, [loginError]);

  const forgotPwdHandler = async (data) => {
    setIsSubmitting(true);
    const successSubmit = await dispatch(handleForgotPassword(data)).then(
      (res) => res
    );
    setIsSubmitting(false);
    if (successSubmit) {
      setAuthForm('login');
      const toastValue = {
        type: 'success',
        text: `A password reset link has been sent to "${data.email}". !`,
      };
      toast[toastValue.type](ToastContent(toastValue), {
        transition: Slide,
        hideProgressBar: false,
        autoClose: 7000,
        pauseOnHover: true,
      });
    }
  };

  const loginHandler = async (data) => {
    setIsSubmitting(true);
    const successSubmit = await dispatch(handleLogin(data)).then((res) => res);
    if (!successSubmit) {
      setIsSubmitting(false);
    }
  };

  const AuthComponent = (function () {
    if (authForm === 'forgotPwd') {
      illustration =
        skin === 'dark'
          ? 'forgot-password-v2-dark.svg'
          : 'forgot-password-v2.svg';
      return (
        <ForgotPassword
          register={register}
          loginError={loginError}
          setAuthForm={setAuthForm}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          forgotPwdHandler={forgotPwdHandler}
        />
      );
    }
    return (
      <Login
        register={register}
        loginError={loginError}
        setAuthForm={setAuthForm}
        handleSubmit={handleSubmit}
        loginHandler={loginHandler}
        isSubmitting={isSubmitting}
      />
    );
  })();

  const imgSource = require(`@src/assets/images/pages/${illustration}`).default;

  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo logo1' to='/'>
          <img
            src={dashboardLogo}
            className='img-fluid'
            alt='logo'
            // style={{ height: '5rem' }}
          />
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={imgSource} alt='Login V2' />
          </div>
        </Col>
        {AuthComponent}
      </Row>
    </div>
  );
};

export default AuthPages;
