import classnames from 'classnames';
// ** Utils
import { onImageError } from '@utils';
// ** Styling Components
import {
  Col,
  Row,
  Form,
  Media,
  Label,
  Input,
  Button,
  Spinner,
  FormText,
  FormGroup,
  ModalBody,
  CustomInput,
  ModalFooter,
} from 'reactstrap';

const ModalForm = (props) => {
  const {
    img,
    setImg,
    errors,
    onSubmit,
    resetImg,
    register,
    previewImg,
    loadingImg,
    setResetImg,
    onFileChange,
    isSubmitting,
    handleSubmit,
    confirmDeletion,
    selectedSlide,
    setshowSlideModal,
    setConfirmDeletion,
    publishedSlidesCount,
  } = props;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody className='mx-2'>
        {/* Image */}
        <Row noGutters={true} className='mb-1'>
          {/* Image Preview */}
          <Col>
            <FormText>Preview of Image Slide</FormText>
            {img ? (
              <div>
                <Media
                  object
                  className='border'
                  src={previewImg}
                  alt='Profil image'
                  width='230px'
                  height='90px'
                  style={{ objectFit: 'cover', marginTop: '3.5px' }}
                  onError={onImageError}
                />
              </div>
            ) : (
              <Media className='border carousel-img-bg' alt='IMG' />
            )}
            {loadingImg && (
              <div className='loading-img'>
                <Spinner color='primary' />
              </div>
            )}
            <div className='text-danger mt-1 small text-center'>
              {errors?.img?.message}
            </div>
          </Col>
          {/* Upload & Reset Buttons */}
          <Col className='ml-1'>
            <FormText>Image size requirement : </FormText>
            <FormText> - min 1280x500 px</FormText>
            <FormText> - best 1920x750 px</FormText>
            <FormText> - max Size (3mb)</FormText>
            <div className='mt-1'>
              <Button.Ripple
                tag={Label}
                className='mr-75'
                size='sm'
                color='primary'
                disabled={isSubmitting}
              >
                Upload
                <Input
                  type='file'
                  key={resetImg}
                  onChange={onFileChange}
                  hidden
                  accept='image/*'
                />
              </Button.Ripple>
              <Button.Ripple
                color='secondary'
                size='sm'
                outline
                disabled={isSubmitting}
                onClick={() => {
                  setResetImg(Date.now());
                  setImg('');
                }}
              >
                Reset
              </Button.Ripple>
            </div>
          </Col>
        </Row>
        {/* Required Field Text */}
        <FormText className='d-flex mb-1' color='muted'>
          (<span className='text-danger'> * </span>) Required fields
        </FormText>
        {/* Title */}
        <FormGroup row>
          <Label sm='3' for='slide-title'>
            Title<span className='text-danger'> * </span>
          </Label>
          <Col sm='9'>
            <Input
              type='text'
              id='slide-title'
              name='title'
              innerRef={register}
              className={classnames({ 'is-invalid': errors.title })}
            />
            <div className='text-danger small'>{errors.title?.message}</div>
          </Col>
        </FormGroup>
        {/* Text 1 */}
        <FormGroup row>
          <Label sm='3' for='slide-text1'>
            Text 1
          </Label>
          <Col sm='9'>
            <Input
              type='text'
              id='slide-text1'
              name='text1'
              innerRef={register}
              className={classnames({ 'is-invalid': errors.text1 })}
            />
            <div className='text-danger small'>{errors.text1?.message}</div>
          </Col>
        </FormGroup>
        {/* Text 2 */}
        <FormGroup row>
          <Label sm='3' for='slide-text2'>
            Text 2
          </Label>
          <Col sm='9'>
            <Input
              type='text'
              id='slide-text2'
              name='text2'
              innerRef={register}
              className={classnames({ 'is-invalid': errors.text2 })}
            />
            <div className='text-danger small'>{errors.text2?.message}</div>
          </Col>
        </FormGroup>
        {/* Text 3 */}
        <FormGroup row>
          <Label sm='3' for='slide-text3'>
            Text 3
          </Label>
          <Col sm='9'>
            <Input
              type='text'
              id='slide-text3'
              name='text3'
              innerRef={register}
              className={classnames({ 'is-invalid': errors.text3 })}
            />
            <div className='text-danger small'>{errors.text3?.message}</div>
          </Col>
        </FormGroup>
        {/* Text Color */}
        <FormGroup row>
          <Col sm='4'>
            <div className='text-nowrap'>Text Color</div>
          </Col>
          <Col sm='8'>
            <CustomInput
              inline
              name='textColor'
              type='radio'
              label='Black'
              value='black'
              id='text-black-color'
              defaultChecked
              innerRef={register}
            />
            <CustomInput
              inline
              name='textColor'
              type='radio'
              label='White'
              value='white'
              id='text-white-color'
              innerRef={register}
            />
          </Col>
        </FormGroup>
        {/* Text Position */}
        <FormGroup row>
          <Col sm='4'>
            <div className='text-nowrap'>Text Position</div>
          </Col>
          <Col sm='8'>
            <CustomInput
              inline
              name='position'
              type='radio'
              value='l'
              label='Left'
              id='left-position'
              defaultChecked
              innerRef={register}
            />
            <CustomInput
              inline
              name='position'
              type='radio'
              label='Rigth'
              value='r'
              id='rigth-position'
              innerRef={register}
            />
          </Col>
        </FormGroup>
        {/* Status */}
        <FormGroup row>
          <Col sm='4'>
            <div className='text-nowrap'>Status</div>
          </Col>
          <Col sm='8'>
            {publishedSlidesCount < 6 && (
              <CustomInput
                inline
                name='status'
                type='radio'
                label='Published'
                value='true'
                id='published'
                innerRef={register}
                defaultChecked={publishedSlidesCount < 6}
              />
            )}
            <CustomInput
              inline
              name='status'
              type='radio'
              label='Drafted'
              value='false'
              id='drafted'
              innerRef={register}
              defaultChecked={publishedSlidesCount >= 6}
            />
          </Col>
        </FormGroup>
        {/* Category */}
        <FormGroup row>
          <Label sm='3' for='slide-category'>
            Category<span className='text-danger'> * </span>
          </Label>
          <Col sm='9'>
            <Input
              type='select'
              id='slide-category'
              name='category'
              innerRef={register}
              className={classnames({ 'is-invalid': errors.category })}
            >
              <option value='' hidden></option>
              <option value='blog'>Blog</option>
              <option value='shop'>Shop</option>
            </Input>
            <div className='text-danger small'>{errors.category?.message}</div>
          </Col>
        </FormGroup>
        {/* Link Text */}
        <FormGroup row>
          <Label sm='3' for='slide-linkText'>
            Link Text<span className='text-danger'> * </span>
          </Label>
          <Col sm='9'>
            <Input
              type='text'
              id='slide-linkText'
              name='linkText'
              innerRef={register}
              className={classnames({ 'is-invalid': errors.linkText })}
            />
            <div className='text-danger small'>{errors.linkText?.message}</div>
          </Col>
        </FormGroup>
      </ModalBody>
      {/* Submit & Cancel Buttons */}
      <ModalFooter>
        <FormGroup className='mb-2' row>
          <Col>
            {/* Add & Update Button */}
            <Button.Ripple
              className='mr-1 mb-1'
              color='primary'
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size='sm' color='white' />
                  <span className='ml-50'>Submitting...</span>
                </>
              ) : selectedSlide ? (
                'Update'
              ) : (
                'Add'
              )}
            </Button.Ripple>
            {/* Cancel Button */}
            <Button.Ripple
              className='mb-1'
              color='secondary'
              onClick={() => setshowSlideModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button.Ripple>
            {/* Delete Button */}
            {selectedSlide && (
              <Button.Ripple
                className='ml-1 mb-1'
                color='danger'
                onClick={() => setConfirmDeletion(!confirmDeletion)}
                disabled={isSubmitting}
              >
                Delete
              </Button.Ripple>
            )}
          </Col>
        </FormGroup>
      </ModalFooter>
    </Form>
  );
};

export default ModalForm;
