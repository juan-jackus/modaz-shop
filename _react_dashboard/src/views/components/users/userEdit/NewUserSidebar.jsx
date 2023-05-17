// ** React
import { useState, useEffect } from 'react';
// ** Redux Store and Actions
import { useSelector, useDispatch } from 'react-redux';
import { addUser, updateUser } from '@store/actions/users';
// ** Form and Validation
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getSchemaValidation } from '../UserValidationSchema';
// ** Third Party Components
import { toast, Slide } from 'react-toastify';
// ** Utils
import _ from 'lodash';
import { fileUploadHandler, capitalize, formatDate } from '@utils';
// ** Custom Components
import Sidebar from '@components/sidebar';
import ToastContent from '../ToastContent';
import UserForm from './SidebarFom';

const NewUserSidebar = ({ selectedUser, open, toggleSidebar }) => {
  // ** Store Vars
  const dispatch = useDispatch();
  const userRoles = useSelector((state) => state.users.userRoles);
  const userErrors = useSelector((state) => state.errors.addUser);
  // ** States
  const [avatar, setAvatar] = useState(selectedUser?.avatar || '');
  const [previewAvatar, setPreviewAvatar] = useState(
    selectedUser?.avatar || ''
  );
  const [resetAvatar, setResetAvatar] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ** React Hook Form Initialization
  let defaultValues = {};
  if (selectedUser) {
    const role = userRoles.find((r) => r.label === selectedUser.role);
    defaultValues = { ...selectedUser, role: role.value };
  }
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
    resolver: yupResolver(getSchemaValidation(selectedUser)),
    defaultValues,
  });

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
      // setResetImg(Date.now());
      setTimeout(() => {
        clearErrors();
      }, 5000);
    }
  }, [userErrors]);

  // ** Function to handle form submit
  const onSubmit = async (values) => {
    setIsSubmitting(true);
    let userId = null;
    let processData = addUser;
    values.avatar = avatar || null;
    values.fullName = capitalize(values.fullName);
    values.birthdate = formatDate(values.birthdate);
    if (selectedUser) {
      userId = selectedUser.id;
      processData = updateUser;
    }

    const userData = new FormData();
    for (const key in values) {
      userData.append(key, values[key] || '');
    }
    // for (const value of userData.values()) {
    //   console.log(value);
    // }

    const successSubmit = await dispatch(processData(userData, userId)).then(
      (res) => {
        setIsSubmitting(false);
        return res;
      }
    );

    let toastValue = {
      type: 'error',
      text: selectedUser
        ? `Modification of ${selectedUser.fullName} failed`
        : `Creation of user failed`,
    };

    if (successSubmit) {
      setAvatar('');
      setPreviewAvatar('');
      setResetAvatar(Date.now());
      reset();
      toastValue = {
        type: 'success',
        text: selectedUser
          ? `User ${selectedUser.fullName} successfully modified!`
          : 'User successfully added!',
      };
      if (selectedUser) {
        toggleSidebar();
      }
    }

    toast[toastValue.type](ToastContent(toastValue), {
      transition: Slide,
      hideProgressBar: true,
      autoClose: 3000,
      pauseOnHover: true,
    });
  };

  return (
    <Sidebar
      size='lg'
      open={open}
      title={selectedUser ? 'Edit User' : 'Add New User'}
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={() => toggleSidebar()}
    >
      <UserForm
        errors={errors}
        avatar={avatar}
        control={control}
        register={register}
        onSubmit={onSubmit}
        userRoles={userRoles}
        setAvatar={setAvatar}
        Controller={Controller}
        resetAvatar={resetAvatar}
        selectedUser={selectedUser}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        onFileChange={onFileChange}
        toggleSidebar={toggleSidebar}
        previewAvatar={previewAvatar}
        setResetAvatar={setResetAvatar}
      />
    </Sidebar>
  );
};

export default NewUserSidebar;
