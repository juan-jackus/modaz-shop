// ** React
import { useEffect, useState, Fragment } from 'react';
// ** Redux Store and Actions
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '@store/actions/users/index';
// ** Form and Validation
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getSchemaValidation } from '../users/UserValidationSchema';
// ** Third Party Components
import _ from 'lodash';
import classnames from 'classnames';
import Cleave from 'cleave.js/react';
import Flatpickr from 'react-flatpickr';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import { toast, Slide } from 'react-toastify';
// ** Utils
import { fileUploadHandler, capitalize, formatDate } from '@utils';
// ** Custom Component
import ToastContent from '../users/ToastContent';
// ** Styling Component
import {
  Row,
  Col,
  Form,
  Label,
  Input,
  Media,
  Button,
  Spinner,
  FormText,
  FormGroup,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
} from 'reactstrap';

const GeneralTabs = ({ accountData }) => {
  // ** React Hook Form Initialization
  const {
    reset,
    errors,
    control,
    register,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(getSchemaValidation('editLoginSchema')),
    defaultValues: accountData,
  });
  // ** Store Vars
  const dispatch = useDispatch();
  const userErrors = useSelector((state) => state.errors.addUser);
  // ** States
  const [notEditable, setNotEditable] = useState(true),
    [avatar, setAvatar] = useState(accountData.avatar || ''),
    [previewAvatar, setPreviewAvatar] = useState(accountData.avatar || ''),
    [resetAvatar, setResetAvatar] = useState(Date.now()),
    [isSubmitting, setIsSubmitting] = useState(false);

  // ** File Upload Handler
  const onFileChange = (e) => {
    const avatar = e.target.files[0];
    fileUploadHandler(
      avatar,
      setAvatar,
      setPreviewAvatar,
      setResetAvatar,
      setError,
      clearErrors
    );
  };

  // ** Set server Errors response
  useEffect(() => {
    if (userErrors) {
      userErrors.forEach((error) => {
        setError(error.param, {
          type: 'manual',
          message: error.msg,
        });
      });
      dispatch({
        type: 'CLEAR_ERRORS',
        data: 'addUser',
      });
    }
  }, [userErrors]);

  // ** Reset Form
  const resetFormData = () => {
    setResetAvatar(Date.now());
    setAvatar(accountData.avatar);
    setPreviewAvatar(accountData.avatar);
    setNotEditable(true);
    reset(accountData);
  };

  // ** Function to handle form submit
  const onSubmit = async (values) => {
    setIsSubmitting(true);
    values.avatar = avatar;
    values.fullName = capitalize(values.fullName);
    values.birthdate = formatDate(values.birthdate);

    const userData = new FormData();
    for (const key in values) {
      userData.append(key, values[key]);
    }

    const successSubmit = await dispatch(
      updateUser(userData, accountData.id)
    ).then((res) => {
      setIsSubmitting(false);
      setNotEditable(true);
      return res;
    });

    if (successSubmit) {
      const toastValue = { type: 'success', text: 'Modifié avec succés' };
      toast.success(ToastContent(toastValue), {
        transition: Slide,
        hideProgressBar: true,
        autoClose: 3000,
        pauseOnHover: true,
      });
    }
  };

  return (
    <Fragment>
      <Media>
        {/* avatar */}
        <Media className='mr-25' left>
          {avatar ? (
            <Media
              object
              width='80'
              height='80'
              alt='Profil image'
              src={previewAvatar}
              className='rounded mr-50'
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <Media className='mr-25 avatar-bg' left />
          )}
        </Media>
        {/* Upload & Reset Buttons */}
        <Media className='mt-75 ml-1' body>
          <Button
            tag={Label}
            className='mr-75'
            size='sm'
            color='primary'
            disabled={notEditable}
          >
            Télécharger
            <Input
              type='file'
              disabled={notEditable}
              onChange={onFileChange}
              key={resetAvatar}
              hidden
              accept='image/*'
            />
          </Button>
          <Button
            color='secondary'
            size='sm'
            disabled={notEditable}
            outline
            onClick={() => {
              setResetAvatar(Date.now());
              setAvatar('');
            }}
          >
            Réinitialiser
          </Button>
          <p>Format autorisé: JPG, GIF or PNG. Taille maximale: 800kB</p>
        </Media>
      </Media>
      <div className='text-danger small my-1'>{errors.avatar?.message}</div>
      <Form className='mt-2' onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {/* Username */}
          <Col sm='6'>
            <FormGroup>
              <Label for='username'>Nom d'utilisateur</Label>
              <Input
                disabled={notEditable}
                name='username'
                id='username'
                innerRef={register}
                className={classnames({ 'is-invalid': errors.username })}
              />
              <FormText color='muted'>
                Autorisés : chiffres, underScore, trait d'union et points
              </FormText>
              <div className='invalid-feedback'>{errors.username?.message}</div>
            </FormGroup>
          </Col>
          {/* Full Name */}
          <Col sm='6'>
            <FormGroup>
              <Label for='full-name'>Nom complet</Label>
              <Input
                disabled={notEditable}
                name='fullName'
                id='full-name'
                innerRef={register}
                className={classnames('text-capitalize', {
                  'is-invalid': errors.fullName,
                })}
              />
              <div className='invalid-feedback'>{errors.fullName?.message}</div>
            </FormGroup>
          </Col>
          {/* Email */}
          <Col sm='6'>
            <FormGroup>
              <Label for='email'>Email</Label>
              <Input
                disabled={notEditable}
                type='email'
                name='email'
                id='email'
                innerRef={register}
                className={classnames({ 'is-invalid': errors.email })}
              />
              <div className='invalid-feedback'>{errors.email?.message}</div>
            </FormGroup>
          </Col>
          {/* Phone Number */}
          <Col sm='6'>
            <FormGroup>
              <Label for='phone-number'>Numéro de téléphone</Label>
              <InputGroup className='input-group-merge'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>SN (+221)</InputGroupText>
                </InputGroupAddon>
                <Controller
                  name='phoneNumber'
                  control={control}
                  render={(props) => {
                    delete props.ref;
                    return (
                      <Cleave
                        {...props}
                        disabled={notEditable}
                        id='phone-number'
                        className={classnames('form-control', {
                          'is-invalid': errors.phoneNumber,
                        })}
                        options={{
                          blocks: [2, 3, 2, 2],
                          delimiter: '-',
                          numericOnly: true,
                        }}
                      />
                    );
                  }}

                  // options={{ phone: true, phoneRegionCode: 'SN' }}
                  // rules={{ required: true }}
                />
              </InputGroup>
              {errors.phoneNumber && (
                <div className='invalid-text'>
                  {errors.phoneNumber?.message}
                </div>
              )}
            </FormGroup>
          </Col>
          {/* BirthDate */}
          <Col sm='6'>
            <FormGroup>
              <Label for='birthdate'>Date de naissance</Label>
              <Controller
                disabled={notEditable}
                as={Flatpickr}
                options={{ dateFormat: 'd-m-Y', enableTime: false }}
                control={control}
                id='birthdate'
                name='birthdate'
                className='form-control'
                // onChange={(date, dateStr) => dateStr}
              />
            </FormGroup>
          </Col>
          {/* User Role */}
          <Col sm='6'>
            <FormGroup>
              <Label for='role'>Rôle du compte</Label>
              <Input
                disabled
                type='text'
                id='role'
                value={capitalize(accountData.role)}
              />
            </FormGroup>
          </Col>
          {/* Buttons */}
          <Col className='mt-2' sm='12'>
            {notEditable ? (
              <Button
                color='primary'
                className='mr-1'
                onClick={() => setNotEditable(false)}
              >
                Modifier
              </Button>
            ) : (
              <Button.Ripple
                type='submit'
                disabled={isSubmitting}
                className='mr-1'
                color='primary'
              >
                {isSubmitting ? (
                  <>
                    <Spinner size='sm' color='white' />
                    <span className='ml-50'>Soumission...</span>
                  </>
                ) : (
                  'Sauvegarder les modifications'
                )}
              </Button.Ripple>
            )}

            <Button.Ripple
              disabled={notEditable || isSubmitting}
              color='secondary'
              outline
              onClick={resetFormData}
            >
              Annuler
            </Button.Ripple>
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

export default GeneralTabs;
