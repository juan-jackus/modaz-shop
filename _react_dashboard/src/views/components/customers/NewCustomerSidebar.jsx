// ** React Import
import { useState, useEffect } from 'react';
// ** Custom Components
import Sidebar from '@components/sidebar';
import ToastContent from '../users/ToastContent';
import InputPasswordToggle from '@components/input-password-toggle';
// ** Store & Actions
import { addCustomer } from '@store/actions/customers';
import { useSelector, useDispatch } from 'react-redux';
// ** Utils
import _ from 'lodash';
import { capitalize } from '@utils';
// ** Third Party Components
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import Cleave from 'cleave.js/react';
import { toast, Slide } from 'react-toastify';
import {
  Form,
  Input,
  Label,
  Button,
  Spinner,
  FormText,
  FormGroup,
  InputGroup,
  CustomInput,
  InputGroupText,
  InputGroupAddon,
} from 'reactstrap';

//Yup Validation Schema
import { getSchemaValidation } from './CustomerValidationSchema';

const NewCustomerSidebar = ({ open, sidebarOpen, setSidebarOpen }) => {
  // ** States
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ** Store Vars
  const dispatch = useDispatch();
  const customerErrors = useSelector((state) => state.errors.addCustomer);
  // ** Vars
  const { reset, errors, control, register, setError, handleSubmit } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(getSchemaValidation()),
  });

  // ** Set server Errors response
  useEffect(() => {
    if (customerErrors) {
      customerErrors.forEach((error) => {
        setError(error.param, {
          type: 'manual',
          message: error.msg,
        });
      });
      dispatch({
        type: 'CLEAR_ERRORS',
        data: 'addCustomer',
      });
    }
  }, [customerErrors]);

  // ** Function to handle form submit
  const onSubmit = async (values) => {
    setIsSubmitting(true);
    values.fullName = capitalize(values.fullName);
    if (!values.gender) values.gender = null;
    values.model = 'customer';

    const successSubmit = await dispatch(addCustomer(values)).then((res) => {
      setIsSubmitting(false);
      return res;
    });

    let toastValue = {
      type: 'error',
      text: "Échec de l'ajout du client",
    };

    if (successSubmit) {
      reset();
      toastValue = {
        type: 'success',
        text: `Le client ${values.fullName} a été ajouté avec succés`,
      };
    }

    toast[toastValue.type](ToastContent(toastValue), {
      transition: Slide,
      hideProgressBar: false,
      autoClose: 3000,
      pauseOnHover: true,
    });
  };

  return (
    <Sidebar
      size='lg'
      open={open}
      title='Ajouter un nouveau client'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Required Field Text */}
        <FormText className='d-flex mb-1' color='muted'>
          <div className='ml-auto'>
            [<span className='text-danger'> * </span>] Champs obligatoires
          </div>
        </FormText>
        {/* Full Name */}
        <FormGroup>
          <Label for='full-name'>
            Nom complet <span className='text-danger'>*</span>
          </Label>
          <Input
            name='fullName'
            id='full-name'
            innerRef={register}
            className={classnames('text-capitalize', {
              'is-invalid': errors.fullName,
            })}
          />
          <div className='invalid-feedback'>{errors.fullName?.message}</div>
        </FormGroup>
        {/* Username */}
        <FormGroup>
          <Label for='username'>
            Nom d'utilisateur <span className='text-danger'>*</span>
          </Label>
          <Input
            name='username'
            id='username'
            innerRef={register}
            className={classnames({ 'is-invalid': errors.username })}
          />
          <FormText color='muted'>
            Vous ne pouvez utiliser que des lettres, des chiffres, des
            sous-notes, des traits d'union et des points.
          </FormText>
          <div className='invalid-feedback'>{errors.username?.message}</div>
        </FormGroup>
        {/* Email */}
        <FormGroup>
          <Label for='email'>
            Email <span className='text-danger'>*</span>
          </Label>
          <Input
            type='email'
            name='email'
            id='email'
            innerRef={register}
            className={classnames({ 'is-invalid': errors.email })}
          />
          <div className='invalid-feedback'>{errors.email?.message}</div>
        </FormGroup>
        {/* Password */}
        <FormGroup>
          <Label for='customer-password'>
            Mot de passe <span className='text-danger'>*</span>
          </Label>
          <InputPasswordToggle
            id='customer-password'
            name='password'
            placeholder=' '
            className={classnames({ 'is-invalid': errors.password })}
            innerRef={register}
          />
          <div className='invalid-feedback'>{errors.password?.message}</div>
        </FormGroup>
        {/* Confirm Password */}
        <FormGroup>
          <Label for='confirm-password'>
            Confirmer le mot de passe <span className='text-danger'>*</span>
          </Label>
          <InputPasswordToggle
            id='confirm-password'
            name='passwordConfirmation'
            placeholder=' '
            className={classnames({
              'is-invalid': errors.passwordConfirmation,
            })}
            innerRef={register}
          />
          <div className='invalid-feedback'>
            {errors.passwordConfirmation?.message}
          </div>
        </FormGroup>
        {/* Phone Number */}
        <FormGroup>
          <Label for='phone-number'>Numéro de téléphone</Label>
          <InputGroup className='input-group-merge'>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>SN (+221)</InputGroupText>
            </InputGroupAddon>
            <Controller
              name='phoneNumber'
              control={control}
              defaultValue=''
              render={(props) => {
                delete props.ref;
                return (
                  <Cleave
                    {...props}
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
            <div className='invalid-text'>{errors.phoneNumber?.message}</div>
          )}
        </FormGroup>
        {/* Gender */}
        <FormGroup className='mt-2 mb-3'>
          <label className='d-block mb-1'>Genre</label>
          <CustomInput
            inline
            name='gender'
            type='radio'
            value='male'
            label='Homme'
            id='gender-male'
            innerRef={register}
          />
          <CustomInput
            inline
            name='gender'
            type='radio'
            label='Femme'
            value='female'
            id='gender-female'
            innerRef={register}
          />
          <CustomInput
            inline
            name='gender'
            type='radio'
            label='Non spécifié'
            value=''
            id='gender-null'
            innerRef={register}
          />
        </FormGroup>
        {/* Buttons */}
        <Button
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
            'Ajouter'
          )}
        </Button>
        <Button
          type='reset'
          color='secondary'
          outline
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          Annuler
        </Button>
      </Form>
    </Sidebar>
  );
};

export default NewCustomerSidebar;
