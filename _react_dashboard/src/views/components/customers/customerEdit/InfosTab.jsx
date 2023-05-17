// ** React
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
// ** Redux Store and Actions
import { useDispatch } from 'react-redux';
import { updateCustomer, setCustomerToManage } from '@store/actions/customers';
// ** Form and Validation
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getSchemaValidation } from '../CustomerValidationSchema';
// ** Third Party Components
import { toast, Slide } from 'react-toastify';
// ** Utils
import _ from 'lodash';
import { capitalize, formatDate } from '@utils';
// ** Custom Components
import renderCustomerAvatar from '../../users/userEdit/UserEditAvatar';
import ToastContent from '../../users/ToastContent';
import InformationsForm from './InfosForm';

const CustomerInfos = ({ selectedCustomer, customerErrors, params }) => {
  // ** States
  const history = useHistory(),
    dispatch = useDispatch(),
    [notEditable, setNotEditable] = useState(true),
    [isSubmitting, setIsSubmitting] = useState(false);
  if (selectedCustomer.birthdate) {
    selectedCustomer.birthdate = new Date(selectedCustomer.birthdate);
  }
  // ** React Hook Form Initialization
  const { reset, errors, control, register, setError, handleSubmit } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(getSchemaValidation('editValues')),
    defaultValues: selectedCustomer || {},
  });

  // ** Set server Errors response
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

  // ** Form Edit and Reset Handler
  const handleFormEdit = () => {
    if (notEditable) {
      setNotEditable(false);
    } else {
      setNotEditable(true);
      reset(selectedCustomer);
    }
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    values.fullName = capitalize(values.fullName);
    values.birthdate = formatDate(values.birthdate);
    values.moreInfos = _.pickBy(values.moreInfos, _.identity);
    if (_.isEmpty(values.moreInfos)) values.moreInfos = null;
    const initialValues = _.omit(selectedCustomer, [
      'id',
      'created_At',
      'updated_At',
    ]);
    if (_.isEqual(initialValues, values)) {
      setIsSubmitting(false);
      const toastValue = {
        type: 'warning',
        text: 'No modification!',
      };
      toast.warning(ToastContent(toastValue), {
        transition: Slide,
        hideProgressBar: true,
        autoClose: 3000,
        pauseOnHover: true,
      });
      return false;
    }

    const successSubmit = await dispatch(
      updateCustomer(values, selectedCustomer.id)
    ).then((res) => {
      setIsSubmitting(false);
      return res;
    });

    let toastValue = {
      type: 'error',
      text: 'Failed to edit customer',
    };

    if (successSubmit) {
      toastValue = {
        type: 'success',
        text: `Customer succesfully editted`,
      };
      setNotEditable(true);
    }
    toast.success(ToastContent(toastValue), {
      transition: Slide,
      hideProgressBar: true,
      autoClose: 3000,
      pauseOnHover: true,
    });
  };

  return (
    <InformationsForm
      errors={errors}
      params={params}
      control={control}
      history={history}
      register={register}
      onSubmit={onSubmit}
      dispatch={dispatch}
      Controller={Controller}
      notEditable={notEditable}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      handleFormEdit={handleFormEdit}
      selectedCustomer={selectedCustomer}
      setCustomerToManage={setCustomerToManage}
      renderCustomerAvatar={renderCustomerAvatar}
    />
  );
};
export default CustomerInfos;
