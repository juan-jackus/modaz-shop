// ** React
import { useState, useEffect } from 'react';
// ** Redux Store and Actions
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '@store/actions/users/index';
// ** Form and Validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getSchemaValidation } from '../users/UserValidationSchema';
// ** Third Party Components
import classnames from 'classnames';
import { toast, Slide } from 'react-toastify';
// ** Custom Component
import ToastContent from '../users/ToastContent';
import InputPasswordToggle from '@components/input-password-toggle';
// ** Styling Component
import { Form, FormGroup, Row, Col, Button, Spinner } from 'reactstrap';

const PasswordTabContent = ({ accountData }) => {
  // States
  const dispatch = useDispatch();
  const changePwdErrors = useSelector((state) => state.errors.changePwd);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors, register, setError, handleSubmit, reset } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(getSchemaValidation('changePwdSchema')),
  });

  // ** Set server Errors response
  useEffect(() => {
    if (changePwdErrors) {
      changePwdErrors.forEach((error) => {
        setError(error.param, {
          type: 'manual',
          message: error.msg,
        });
      });
      dispatch({
        type: 'CLEAR_ERRORS',
        data: 'changePwd',
      });
    }
  }, [changePwdErrors]);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    const successSubmit = await dispatch(
      updatePassword(values, accountData.id)
    ).then((res) => {
      setIsSubmitting(false);
      return res;
    });

    if (successSubmit) {
      const toastValue = {
        type: 'success',
        text: 'Password successfuly changed',
      };
      toast.success(ToastContent(toastValue), {
        transition: Slide,
        hideProgressBar: true,
        autoClose: 3000,
        pauseOnHover: true,
      });
      reset();
    } else {
      const toastValue = { type: 'error', text: 'Modification failed' };
      toast.error(ToastContent(toastValue), {
        transition: Slide,
        hideProgressBar: true,
        autoClose: 3000,
        pauseOnHover: true,
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        {/* Old Password */}
        <Col sm='6'>
          <FormGroup>
            <InputPasswordToggle
              label='Old Password'
              htmlFor='oldPassword'
              name='oldPassword'
              innerRef={register}
              className={classnames('input-group-merge', {
                'is-invalid': errors['oldPassword'],
              })}
            />
            <div className='invalid-feedback'>
              {errors.oldPassword?.message}
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        {/* New Password */}
        <Col sm='6'>
          <FormGroup>
            <InputPasswordToggle
              label='New Password'
              htmlFor='password'
              name='password'
              innerRef={register}
              className={classnames('input-group-merge', {
                'is-invalid': errors['password'],
              })}
            />
            <div className='invalid-feedback'>{errors.password?.message}</div>
          </FormGroup>
        </Col>
        {/* Confirm New Password */}
        <Col sm='6'>
          <FormGroup>
            <InputPasswordToggle
              label='Retype New Password'
              htmlFor='passwordConfirmation'
              name='passwordConfirmation'
              innerRef={register}
              className={classnames('input-group-merge', {
                'is-invalid': errors['passwordConfirmation'],
              })}
            />
            <div className='invalid-feedback'>
              {errors.passwordConfirmation?.message}
            </div>
          </FormGroup>
        </Col>
        {/* Buttons */}
        <Col className='mt-1' sm='12'>
          <Button.Ripple
            type='submit'
            className='mr-1'
            color='primary'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size='sm' color='white' />
                <span className='ml-50'>Saving...</span>
              </>
            ) : (
              'Save changes'
            )}
          </Button.Ripple>
          <Button.Ripple
            type='button'
            color='secondary'
            disabled={isSubmitting}
            outline
            onClick={() => reset()}
          >
            Cancel
          </Button.Ripple>
        </Col>
      </Row>
    </Form>
  );
};

export default PasswordTabContent;
