// ** Third Party Components
import _ from 'lodash';
import classnames from 'classnames';
import Cleave from 'cleave.js/react';
import Flatpickr from 'react-flatpickr';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import Select from 'react-select';
import '@styles/react/libs/react-select/_react-select.scss';
// ** Utils
import { onImageError, selectThemeColors } from '@utils';
// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle';
// ** Styling Components
import {
  Form,
  Input,
  Label,
  Media,
  Button,
  Spinner,
  FormText,
  FormGroup,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
} from 'reactstrap';

const UserFom = (props) => {
  //
  const {
    errors,
    avatar,
    control,
    register,
    onSubmit,
    setAvatar,
    userRoles,
    Controller,
    resetAvatar,
    isSubmitting,
    handleSubmit,
    onFileChange,
    selectedUser,
    toggleSidebar,
    previewAvatar,
    setResetAvatar,
  } = props;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* Profil Pictures */}
      <Media>
        {avatar ? (
          <Media
            object
            className='rounded mr-50'
            src={previewAvatar}
            alt='Profil image'
            height='80'
            width='80'
            style={{ objectFit: 'cover' }}
            onError={onImageError}
          />
        ) : (
          <Media className='mr-25 rounded avatar-bg' left />
        )}
        {/* Buttons Group */}
        <Media className='mt-75 ml-1' body>
          <Button.Ripple
            tag={Label}
            className='mr-75'
            size='sm'
            color='primary'
          >
            Upload
            <Input
              type='file'
              key={resetAvatar}
              onChange={onFileChange}
              hidden
              accept='image/*'
            />
          </Button.Ripple>
          <Button.Ripple
            color='secondary'
            size='sm'
            outline
            onClick={() => {
              setResetAvatar(Date.now());
              setAvatar('');
            }}
          >
            Reset
          </Button.Ripple>
          <p style={{ fontSize: '0.9rem' }}>
            Allowed format ( JPG, GIF or PNG)
          </p>
        </Media>
      </Media>
      <div className='text-danger'>{errors.img?.message}</div>
      {/* Required Field Text */}
      <FormText className='d-flex mb-1' color='muted'>
        <div className='ml-auto'>
          [<span className='text-danger'> * </span>] Required fields
        </div>
      </FormText>
      {/* Full Name */}
      <FormGroup>
        <Label for='full-name'>
          Full Name <span className='text-danger'>*</span>
        </Label>
        <Input
          name='fullName'
          id='full-name'
          // placeholder='John Doe'
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
          Username <span className='text-danger'>*</span>
        </Label>
        <Input
          name='username'
          id='username'
          // placeholder='john-Doe_9.9'
          innerRef={register}
          className={classnames({ 'is-invalid': errors.username })}
        />
        <FormText color='muted'>
          You can only use letters, numbers, underScore, hyphen & periods
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
          // placeholder='john.doe@example.com'
          innerRef={register}
          className={classnames({ 'is-invalid': errors.email })}
        />
        <div className='invalid-feedback'>{errors.email?.message}</div>
      </FormGroup>
      {!selectedUser && (
        <>
          {/* Password */}
          <FormGroup>
            <Label for='user-password'>
              Password <span className='text-danger'>*</span>
            </Label>
            <InputPasswordToggle
              id='user-password'
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
              Confirm Password <span className='text-danger'>*</span>
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
        </>
      )}
      {/* BirthDate */}
      <FormGroup>
        <Label for='birthdate'>Birth Date</Label>
        <Controller
          as={Flatpickr}
          control={control}
          defaultValue=''
          id='birthdate'
          name='birthdate'
          className='form-control'
          options={{ dateFormat: 'd-m-Y', enableTime: false }}
        />
      </FormGroup>
      {/* Phone Number */}
      <FormGroup>
        <Label for='phone-number'>
          Phone Number <span className='text-danger'>*</span>
        </Label>
        <InputGroup className='input-group-merge'>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>SN (+221)</InputGroupText>
          </InputGroupAddon>
          <Controller
            name='phoneNumber'
            defaultValue=''
            control={control}
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
      {/* User Role */}
      <FormGroup>
        <Label for='role'>User Role</Label>
        <Controller
          name='role'
          control={control}
          defaultValue=''
          render={({ onChange, value, ref }) => (
            <Select
              id='role'
              inputRef={ref}
              theme={selectThemeColors}
              placeholder='Select Role'
              options={userRoles}
              classNamePrefix='select'
              className={classnames('text-capitalize react-select', {
                'is-invalid': false,
              })}
              value={userRoles.find((c) => c.value === value)}
              onChange={(val) => onChange(val.value)}
            />
          )}
        />
        {errors.role && (
          <div className='invalid-text'>{errors.role?.message}</div>
        )}
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
            <span className='ml-50'>Submitting...</span>
          </>
        ) : (
          'Submit'
        )}
      </Button>
      <Button
        type='button'
        color='secondary'
        outline
        disabled={isSubmitting}
        onClick={() => toggleSidebar()}
      >
        Cancel
      </Button>
    </Form>
  );
};

export default UserFom;
