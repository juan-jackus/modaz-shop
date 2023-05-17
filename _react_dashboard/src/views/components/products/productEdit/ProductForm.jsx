// ** Form and Validation
import { Controller } from 'react-hook-form';
// ** Third Party Components
import _ from 'lodash';
import classnames from 'classnames';
import { ChromePicker } from 'react-color';
import Rating from 'react-rating';
import Select from 'react-select';
import '@styles/react/libs/react-select/_react-select.scss';
// ** Utils
import { onImageError, selectThemeColors } from '@utils';
// ** Styling Components
import { X, Edit, Tag, Star, Plus, DollarSign } from 'react-feather';
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
  UncontrolledTooltip,
} from 'reactstrap';

const ProductForm = (props) => {
  //
  const {
    user,
    errors,
    rating,
    control,
    history,
    dispatch,
    onSubmit,
    imgArray,
    resetImg,
    register,
    zoomImage,
    setRating,
    colorsArray,
    colorPicker,
    notEditable,
    handleSubmit,
    setZoomImage,
    onFileChange,
    isSubmitting,
    handleFormEdit,
    selectedProduct,
    previewImgArray,
    productCategories,
    handleColorPicker,
    handleDeleteColor,
    handleColorChange,
    setProductToManage,
    setProductImgPosition,
    handleDeleteProductImg,
  } = props;

  return (
    <Container>
      <Row id='product-infos'>
        <Col lg='10'>
          <Row>
            {/* PERSONAL INFOS SECTION */}
            <Col sm='12'>
              <h4 className='mb-1'>
                <Edit size={20} className='mr-50' />
                <span className='align-middle'>Product Informations</span>
              </h4>
            </Col>
            {/* Form */}
            <Col sm='12'>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  {/* Product Images */}
                  <Col sm='12'>
                    <Label style={{ marginBottom: '10px' }}>
                      Product Images (max: 5 images)
                    </Label>
                    {/* Image Preview */}
                    <div className='d-flex flex-wrap'>
                      {previewImgArray.length ? (
                        previewImgArray.map((previewImg, i) => (
                          <div key={i} style={{ position: 'relative' }}>
                            <Media
                              object
                              className='border product-img background-spinner'
                              src={previewImg}
                              alt='Profil image'
                              width='133px'
                              height='133px'
                              style={{
                                objectFit: 'contain',
                                backgroundColor: 'white',
                              }}
                              onError={onImageError}
                              onClick={() => setZoomImage(i)}
                            />
                            <button
                              type='button'
                              className='delete-product-img'
                              disabled={notEditable}
                              onClick={() => handleDeleteProductImg(i)}
                            >
                              <X size='17' id='delete-img' />
                              <UncontrolledTooltip
                                placement='top'
                                target='delete-img'
                              >
                                Delete Image
                              </UncontrolledTooltip>
                            </button>
                          </div>
                        ))
                      ) : (
                        <Media
                          className='border product-img-bg mb-1 '
                          alt='IMG'
                        />
                      )}
                      {/* Upload & Reset Buttons */}
                      <div className='ml-2'>
                        <FormText>Image size requirement :</FormText>
                        <FormText> - min Width (300px)</FormText>
                        <FormText> - min Height (300px)</FormText>
                        {/* <FormText> - max Size (1mb)</FormText> */}
                        <div className='mt-1'>
                          <Button.Ripple
                            tag={Label}
                            className='mr-75'
                            size='sm'
                            color='primary'
                            disabled={notEditable || imgArray.length >= 5}
                          >
                            Upload
                            <Input
                              type='file'
                              key={resetImg}
                              onChange={onFileChange}
                              hidden
                              name='imgArray'
                              accept='image/*'
                            />
                          </Button.Ripple>
                          {errors.img && (
                            <div className='text-danger mt-1 small text-center'>
                              {errors.img?.message}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Zoom Preview Images */}
                      {zoomImage !== null && (
                        <div
                          className='zoom-image-overlay'
                          onClick={() => setZoomImage(null)}
                        >
                          <div
                            className='zoom-image-wrapper'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FormGroup>
                              <Label for='img-position'>
                                Select Image Position
                              </Label>
                              <Input
                                type='select'
                                id='img-position'
                                defaultValue={zoomImage + 1}
                                disabled={notEditable}
                                onChange={(e) =>
                                  setProductImgPosition(
                                    zoomImage,
                                    e.target.value - 1
                                  )
                                }
                              >
                                {previewImgArray.map((previewImg, i) => (
                                  <option key={i}>{i + 1}</option>
                                ))}
                              </Input>
                            </FormGroup>
                            <Media
                              object
                              src={previewImgArray[zoomImage]}
                              onError={onImageError}
                              // onClick={(e) => e.stopPropagation()}
                            />
                            <X
                              size='30'
                              className='close-zoom'
                              onClick={() => setZoomImage(null)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                  {/* Name */}
                  <Col md='6'>
                    <FormGroup>
                      <Label for='product-name'>
                        Name <span className='text-danger'>*</span>
                      </Label>
                      <Input
                        name='name'
                        id='product-name'
                        innerRef={register}
                        disabled={notEditable}
                        className={classnames('text-capitalize', {
                          'is-invalid': errors.name,
                        })}
                      />
                      <div className='invalid-feedback'>
                        {errors.name?.message}
                      </div>
                    </FormGroup>
                  </Col>
                  {/* Gender */}
                  <Col md='6'>
                    <FormGroup>
                      <Label for='product-gender'>For</Label>
                      <Controller
                        defaultValue={''}
                        isDisabled={notEditable}
                        isClearable
                        as={Select}
                        id='product-gender'
                        control={control}
                        name='gender'
                        options={[
                          { value: 'men', label: 'Men' },
                          { value: 'women', label: 'Women' },
                        ]}
                        theme={selectThemeColors}
                        classNamePrefix='select'
                        className={classnames('react-select', {
                          'is-invalid': errors.gender,
                        })}
                      />
                      <div className='invalid-feedback'>
                        {errors.gender?.message}
                      </div>
                    </FormGroup>
                  </Col>
                  {/* Categories */}
                  <Col md='6'>
                    <FormGroup>
                      <Label for='product-categories'>
                        Categories <span className='text-danger'>*</span>
                      </Label>
                      <Controller
                        // isSearchable
                        defaultValue={[]}
                        isDisabled={notEditable}
                        isClearable
                        isMulti
                        as={Select}
                        id='product-categories'
                        control={control}
                        name='categories'
                        options={productCategories}
                        theme={selectThemeColors}
                        classNamePrefix='select'
                        className={classnames('react-select', {
                          'is-invalid': errors.categories,
                        })}
                      />
                      <div className='invalid-feedback'>
                        {errors.categories?.message}
                      </div>
                    </FormGroup>
                  </Col>
                  {/* Price */}
                  <Col md='6'>
                    <FormGroup>
                      <Label for='price'>
                        Price <span className='text-danger'>*</span>
                      </Label>
                      <InputGroup className='input-group-merge'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            <DollarSign size={15} />
                            {/* $ */}
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type='number'
                          name='price'
                          id='price'
                          step='0.01'
                          min='0'
                          innerRef={register}
                          disabled={notEditable}
                          className={classnames({
                            'is-invalid': errors.price,
                          })}
                        />
                      </InputGroup>
                      {errors.price && (
                        <div
                          className='text-danger small'
                          style={{ marginTop: '0.25rem' }}
                        >
                          {errors.price?.message}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  {/* Quantity */}
                  <Col md='6'>
                    <FormGroup>
                      <Label for='quantity'>
                        Quantity <span className='text-danger'>*</span>
                      </Label>
                      <Input
                        type='number'
                        name='quantity'
                        id='quantity'
                        innerRef={register}
                        disabled={notEditable}
                        className={classnames({
                          'is-invalid': errors.quantity,
                        })}
                      />
                      <div className='invalid-feedback'>
                        {errors.quantity?.message}
                      </div>
                    </FormGroup>
                  </Col>
                  {/* Collection */}
                  {user.username === 'juan-jackus' && (
                    <Col md='6' className='d-flex align-items-center'>
                      <CustomInput
                        type='checkbox'
                        name='inCollection'
                        id='in-collection'
                        label='In my collection'
                        innerRef={register}
                        disabled={notEditable}
                      />
                    </Col>
                  )}
                  {/* MORE INFOS SECTION */}
                  <Col sm='12'>
                    <h4 className='mb-1 mt-2'>
                      <Tag size={20} className='mr-50' />
                      <span className='align-middle'>More Infos</span>
                    </h4>
                  </Col>
                  {/* Brand */}
                  <Col lg='4' md='6'>
                    <FormGroup>
                      <Label for='brand'>Brand</Label>
                      <Input
                        name='moreInfos.brand'
                        id='brand'
                        innerRef={register}
                        disabled={notEditable}
                      />
                    </FormGroup>
                  </Col>
                  {/* Rating */}
                  <Col lg='3' xs='6'>
                    <FormGroup>
                      <Label className='d-flex align-items-center pr-3'>
                        <span>Rating</span>
                        <button
                          type='button'
                          className='reset-rating'
                          disabled={notEditable}
                          onClick={() => setRating(0)}
                        >
                          reset
                        </button>
                      </Label>

                      <div>
                        <Rating
                          emptySymbol={
                            <Star size={32} fill='#babfc7' stroke='#babfc7' />
                          }
                          fullSymbol={
                            <Star
                              size={32}
                              fill='#ff9f43'
                              stroke='npm start#ff9f43'
                            />
                          }
                          initialRating={rating}
                          readonly={notEditable}
                          onChange={(e) => setRating(e)}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  {/* Free Shipping */}
                  <Col lg='3' xs='6' className='d-flex align-items-center'>
                    <CustomInput
                      type='checkbox'
                      name='moreInfos.freeShipping'
                      id='free-shipping'
                      label='Free Shipping'
                      innerRef={register}
                      disabled={notEditable}
                    />
                  </Col>
                  {/* Color */}
                  <Col xs='8'>
                    <FormGroup>
                      <Label>Colors</Label>
                      <div className='d-flex align-items-center'>
                        <div className='product-colors'>
                          {colorsArray.map((color, i) => (
                            <div className='p-color-wrapper' key={i}>
                              <div
                                className='p-color'
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  if (notEditable) return;
                                  handleColorPicker(i);
                                }}
                              ></div>
                              {colorPicker === i && (
                                <div>
                                  <div
                                    className='color-cover'
                                    onClick={() => handleColorPicker()}
                                  ></div>
                                  <ChromePicker
                                    color={color}
                                    onChangeComplete={(color) =>
                                      handleColorChange(color, i)
                                    }
                                  />
                                  <button
                                    className='delete-color-btn'
                                    type='button'
                                    onClick={() => handleDeleteColor(i)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          className='add-color-btn'
                          type='button'
                          disabled={notEditable}
                          onClick={() => handleColorChange()}
                        >
                          <Plus size={19} id='add-tooltip' />
                          <UncontrolledTooltip
                            placement='top'
                            target='add-tooltip'
                          >
                            Add Color
                          </UncontrolledTooltip>
                        </button>
                      </div>
                    </FormGroup>
                  </Col>
                  {/* Description */}
                  <Col md='12'>
                    <FormGroup>
                      <Label for='description'>Description</Label>
                      <Input
                        type='textarea'
                        style={{ minHeight: '150px' }}
                        name='moreInfos.description'
                        id='description'
                        innerRef={register}
                        disabled={notEditable}
                      />
                    </FormGroup>
                  </Col>
                  {/* Buttons */}
                  <Col
                    className='d-flex flex-sm-row flex-column mt-2 mb-1'
                    sm='12'
                  >
                    {/* Save Changes Button */}
                    {!notEditable && (
                      <Button.Ripple
                        className='mb-1 mb-sm-0 mr-0 mr-sm-1'
                        type='submit'
                        color='primary'
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner size='sm' color='white' />
                            <span className='ml-50'>Saving...</span>
                          </>
                        ) : (
                          'Save'
                        )}
                      </Button.Ripple>
                    )}
                    {/* Edit/Reset Changes Button */}
                    {selectedProduct && (
                      <Button.Ripple
                        className='mb-1 mb-sm-0 mr-0 mr-sm-1'
                        type='button'
                        color={notEditable ? 'primary' : 'warning'}
                        disabled={isSubmitting}
                        onClick={handleFormEdit}
                      >
                        {notEditable ? 'Edit' : 'Reset'}
                      </Button.Ripple>
                    )}
                    {/* Delete Button */}
                    {!notEditable && selectedProduct && (
                      <Button.Ripple
                        className='mb-1 mb-sm-0 mr-0 mr-sm-1'
                        type='button'
                        color='danger'
                        disabled={isSubmitting}
                        onClick={() => {
                          dispatch(setProductToManage(selectedProduct));
                          history.goBack();
                        }}
                      >
                        Delete
                      </Button.Ripple>
                    )}
                    {/* Go Back Button */}
                    <Button.Ripple
                      color='secondary'
                      type='button'
                      outline
                      disabled={isSubmitting}
                      onClick={() => history.goBack()}
                    >
                      Go back
                    </Button.Ripple>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductForm;
