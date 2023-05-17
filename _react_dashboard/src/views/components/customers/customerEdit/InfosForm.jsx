// ** Third Party Components
import classnames from 'classnames';
import Cleave from 'cleave.js/react';
import Flatpickr from 'react-flatpickr';
import '@styles/react/libs/flatpickr/flatpickr.scss';
// ** Utils
import { capitalize } from '@utils';
// ** Styling Components
import { User, MapPin } from 'react-feather';
import {
  Col,
  Row,
  Form,
  Input,
  Media,
  Label,
  Button,
  Spinner,
  FormText,
  Container,
  FormGroup,
  InputGroup,
  CustomInput,
  InputGroupText,
  InputGroupAddon,
} from 'reactstrap';

const InformationsForm = (props) => {
  const {
    errors,
    params,
    control,
    history,
    register,
    onSubmit,
    dispatch,
    Controller,
    notEditable,
    isSubmitting,
    handleSubmit,
    handleFormEdit,
    selectedCustomer,
    setCustomerToManage,
    renderCustomerAvatar,
  } = props;
  return (
    <Container>
      <Row>
        {/* PERSONAL INFOS SECTION */}
        <Col sm='12'>
          <h4 className='mb-1'>
            <User size={20} className='mr-50' />
            <span className='align-middle'>Informations personnelles</span>
          </h4>
        </Col>
        {/* Form */}
        <Col sm='12'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm='12'>
                <Row className='d-flex justify-content-center'>
                  {/* Avatar */}
                  <Col md='3' lg='2' className='d-flex justify-content-center '>
                    <Media className='mb-2'>
                      {renderCustomerAvatar(
                        selectedCustomer.avatar,
                        selectedCustomer.fullName
                      )}
                    </Media>
                  </Col>
                  <Col lg='4' md='6'>
                    {/* Fullname */}
                    <FormGroup>
                      <Label for='full-name'>
                        Nom complet <span className='text-danger'>*</span>
                      </Label>
                      <Input
                        disabled={notEditable}
                        name='fullName'
                        id='full-name'
                        innerRef={register}
                        className={classnames('text-capitalize', {
                          'is-invalid': errors.fullName,
                        })}
                      />
                      <div className='invalid-feedback'>
                        {errors.fullName?.message}
                      </div>
                    </FormGroup>
                    {/* Username */}
                    <FormGroup>
                      <Label for='username'>
                        Nom d'utilisateur <span className='text-danger'>*</span>
                      </Label>
                      <Input
                        disabled={notEditable}
                        name='username'
                        id='username'
                        innerRef={register}
                        className={classnames({
                          'is-invalid': errors.username,
                        })}
                      />
                      <FormText color='muted'>
                        Vous ne pouvez utiliser que des lettres, des chiffres,
                        des sous-notes, des traits d'union et des points.
                      </FormText>
                      <div className='invalid-feedback'>
                        {errors.username?.message}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
              {/* Email */}
              <Col lg='4' md='6'>
                <FormGroup>
                  <Label for='email'>
                    Email <span className='text-danger'>*</span>
                  </Label>
                  <Input
                    disabled={notEditable}
                    type='email'
                    name='email'
                    id='email'
                    innerRef={register}
                    className={classnames({ 'is-invalid': errors.email })}
                  />
                  <div className='invalid-feedback'>
                    {errors.email?.message}
                  </div>
                </FormGroup>
              </Col>
              {/* Phone Number */}
              <Col lg='4' md='6'>
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
                    />
                  </InputGroup>
                  {errors.phoneNumber && (
                    <div className='invalid-text'>
                      {errors.phoneNumber?.message}
                    </div>
                  )}
                </FormGroup>
              </Col>
              {/* Birthdate */}
              <Col lg='4' md='6'>
                <FormGroup>
                  <Label for='birthdate'>Date de naissance</Label>
                  <Controller
                    disabled={notEditable}
                    control={control}
                    defaultValue=''
                    id='birthdate'
                    name='birthdate'
                    className='form-control'
                    as={Flatpickr}
                    options={{ dateFormat: 'd-m-Y', enableTime: false }}
                  />
                </FormGroup>
              </Col>
              {/* Gender */}
              <Col lg='4' md='6'>
                <FormGroup>
                  <Label className='d-block mb-1'>Genre</Label>
                  {selectedCustomer.gender && notEditable ? (
                    <CustomInput
                      inline
                      type='radio'
                      value={selectedCustomer.gender}
                      label={capitalize(selectedCustomer.gender)}
                      id='selected-gender'
                      checked={true}
                      readOnly
                    />
                  ) : (
                    <Controller
                      name='gender'
                      defaultValue=''
                      control={control}
                      render={(props) => {
                        delete props.ref;
                        return (
                          <FormGroup>
                            <CustomInput
                              {...props}
                              disabled={notEditable}
                              inline
                              type='radio'
                              value='male'
                              label='Homme'
                              id='gender-male'
                            />
                            <CustomInput
                              {...props}
                              disabled={notEditable}
                              inline
                              type='radio'
                              label='Femme'
                              value='female'
                              id='gender-female'
                            />
                            <CustomInput
                              {...props}
                              disabled={notEditable}
                              inline
                              type='radio'
                              label='Non spécifié'
                              value=''
                              id='no-gender'
                            />
                          </FormGroup>
                        );
                      }}
                    />
                  )}
                </FormGroup>
              </Col>
              {/* ADDRESS SECTION */}
              <Col sm='12'>
                <h4 className='mb-1 mt-2'>
                  <MapPin size={20} className='mr-50' />
                  <span className='align-middle'>Adresse</span>
                </h4>
              </Col>
              {/* Address */}
              <Col lg='4' md='6'>
                <FormGroup>
                  <Label for='address'>Addresse</Label>
                  <Input
                    disabled={notEditable}
                    name='moreInfos.address'
                    id='address'
                    innerRef={register}
                  />
                </FormGroup>
              </Col>
              {/* Postal Code */}
              <Col lg='4' md='6'>
                <FormGroup>
                  <Label for='postal-code'>Code postal</Label>
                  <Input
                    disabled={notEditable}
                    name='moreInfos.postalCode'
                    id='postal-code'
                    type='number'
                    innerRef={register}
                  />
                </FormGroup>
              </Col>
              {/* City */}
              <Col lg='4' md='6'>
                <FormGroup>
                  <Label for='city'>Ville</Label>
                  <Input
                    disabled={notEditable}
                    name='moreInfos.city'
                    id='city'
                    innerRef={register}
                  />
                </FormGroup>
              </Col>
              {/* Country */}
              <Col lg='4' md='6'>
                <FormGroup>
                  <Label for='city'>Pays</Label>
                  <Input
                    disabled={notEditable}
                    name='moreInfos.country'
                    id='country'
                    innerRef={register}
                  />
                </FormGroup>
              </Col>
              {/* Buttons */}
              <Col className='d-flex flex-sm-row flex-column mt-2' sm='12'>
                {/* Save Changes Button */}
                {!notEditable && !params.trash && (
                  <Button.Ripple
                    className='mb-1 mb-sm-0 mr-0 mr-sm-1'
                    type='submit'
                    color='primary'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size='sm' color='white' />
                        <span className='ml-50'>Sauvegarde...</span>
                      </>
                    ) : (
                      'Sauvegarder'
                    )}
                  </Button.Ripple>
                )}
                {/* Edit/Reset Changes Button */}
                {!params.trash && (
                  <>
                    <Button.Ripple
                      className='mb-1 mb-sm-0 mr-0 mr-sm-1'
                      type='button'
                      color={notEditable ? 'primary' : 'warning'}
                      disabled={isSubmitting}
                      onClick={handleFormEdit}
                    >
                      {notEditable ? 'Modifier' : 'Réinitialiser'}
                    </Button.Ripple>
                    {/* Delete Button */}
                    {!notEditable && (
                      <Button.Ripple
                        className='mb-1 mb-sm-0 mr-0 mr-sm-1'
                        type='button'
                        color='danger'
                        disabled={isSubmitting}
                        onClick={() => {
                          dispatch(setCustomerToManage(selectedCustomer));
                          history.goBack();
                        }}
                      >
                        Supprimer
                      </Button.Ripple>
                    )}
                  </>
                )}
                {/* Go Back Button */}
                <Button.Ripple
                  color='secondary'
                  type='button'
                  outline
                  disabled={isSubmitting}
                  onClick={() => history.goBack()}
                >
                  Retour
                </Button.Ripple>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default InformationsForm;
