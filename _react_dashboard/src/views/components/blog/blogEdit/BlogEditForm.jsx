// ** React
import { useEffect } from 'react';
// ** Third Party Components
import { Editor } from 'react-draft-wysiwyg';
import Select from 'react-select';
// ** Utils
import { selectThemeColors } from '@utils';
// ** Styling Components
import { AlertCircle } from 'react-feather';
import {
  Row,
  Col,
  Card,
  Form,
  Media,
  Label,
  Input,
  Alert,
  Button,
  Spinner,
  FormText,
  CardBody,
  FormGroup,
  CustomInput,
} from 'reactstrap';
import '@styles/react/libs/editor/editor.scss';
import '@styles/base/plugins/forms/form-quill-editor.scss';
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/base/pages/page-blog.scss';

const BlogEditForm = (props) => {
  const {
    slug,
    title,
    status,
    setSlug,
    content,
    history,
    dispatch,
    resetImg,
    onSubmit,
    setTitle,
    setStatus,
    setContent,
    formErrors,
    previewImg,
    categories,
    selectedPost,
    onFileChange,
    isSubmitting,
    postCategories,
    handleFormReset,
    setPostToManage,
    setBlogCategories,
  } = props;
  // Scroll on top to Error message
  useEffect(() => {
    if (formErrors?.message) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [formErrors]);

  // Editor Font Family Options
  const editorFonfamily = [
    'Poppins',
    'Montserrat',
    'Helvetica',
    'Arial',
    'Georgia',
    'Impact',
    'Tahoma',
    'Times New Roman',
    'Verdana',
  ];

  const editorColorPicker = [
    'rgb(45,40,94)',
    'rgb(0,0,0)',
    'rgb(34,34,34)',
    'rgb(204,204,204)',
    'rgb(97,189,109)',
    'rgb(184,49,47)',
    'rgb(44,130,201)',
    'rgb(26,188,156)',
    'rgb(84,172,210)',
    'rgb(147,101,184)',
    'rgb(71,85,119)',
    'rgb(65,168,95)',
    'rgb(0,168,133)',
    'rgb(61,142,185)',
    'rgb(41,105,176)',
    'rgb(85,57,130)',
    'rgb(40,50,78)',
    'rgb(247,218,100)',
    'rgb(251,160,38)',
    'rgb(235,107,86)',
    'rgb(226,80,65)',
    'rgb(163,143,132)',
    'rgb(239,239,239)',
    'rgb(255,255,255)',
    'rgb(250,197,28)',
    'rgb(243,121,52)',
    'rgb(209,72,65)',
    'rgb(124,112,107)',
    'rgb(209,213,216)',
  ];

  return (
    <Card className='container'>
      <CardBody>
        {/* Error Message & Required Field Text */}
        <div>
          {formErrors?.message ? (
            <Alert color='danger'>
              <div className='alert-body'>
                <AlertCircle size={15} />
                <span className='ml-1'>{formErrors.message}</span>
              </div>
            </Alert>
          ) : (
            <FormText className='d-flex mb-1' color='muted'>
              <div className='ml-auto'>
                [<span className='text-danger'> * </span>] Required fields
              </div>
            </FormText>
          )}
        </div>
        <Form className='mt-2' onSubmit={onSubmit}>
          <Row>
            {/* Title */}
            <Col md='6'>
              <FormGroup className='mb-2'>
                <Label for='blog-edit-title'>
                  Title <span className='text-danger'> * </span>
                </Label>
                <Input
                  // disabled={notEditable}
                  required
                  id='blog-edit-title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormGroup>
            </Col>
            {/* Categories */}
            <Col md='6'>
              <FormGroup className='mb-2'>
                <Label for='blog-edit-category'>
                  Category <span className='text-danger'> * </span>
                </Label>
                <Select
                  required
                  // isDisabled={notEditable}
                  id='blog-edit-category'
                  isClearable={false}
                  theme={selectThemeColors}
                  value={categories}
                  isMulti
                  name='colors'
                  options={postCategories}
                  className='react-select'
                  classNamePrefix='select'
                  onChange={(data) => setBlogCategories(data)}
                />
              </FormGroup>
            </Col>
            {/* Slug */}
            <Col md='6'>
              <FormGroup className='mb-2'>
                <Label for='blog-edit-slug'>Slug</Label>
                <Input
                  // disabled={notEditable}
                  id='blog-edit-slug'
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </FormGroup>
            </Col>
            {/* Status */}
            <Col md='6'>
              <FormGroup className='mb-2'>
                <Label for='blog-edit-status'>
                  Status <span className='text-danger'> * </span>
                </Label>
                <Input
                  // disabled={notEditable}
                  required
                  type='select'
                  id='blog-edit-status'
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value='true'>Published</option>
                  <option value='false'>Draft</option>
                </Input>
              </FormGroup>
            </Col>
            {/* Editor */}
            <Col sm='12'>
              <FormGroup className='mb-2'>
                <Label>
                  Content <span className='text-danger'> * </span>
                </Label>
                <Editor
                  // readOnly={notEditable}
                  editorState={content}
                  toolbar={{
                    fontFamily: { options: editorFonfamily },
                    colorPicker: { colors: editorColorPicker },
                  }}
                  onEditorStateChange={(data) => setContent(data)}
                  handlePastedText={() => false}
                />
              </FormGroup>
            </Col>
            {/* Image */}
            <Col className='mb-2' sm='12'>
              <div className='border rounded p-2'>
                <h5 className='mb-1'>
                  Featured Image <span className='text-danger'> * </span>
                </h5>
                <Media className='flex-column flex-md-row'>
                  {previewImg && (
                    <img
                      className='rounded border img-fluid mr-2 mb-1 mb-md-0'
                      src={previewImg}
                      alt='featured img'
                      maxheight='110'
                      width='250'
                      style={{ objectFit: 'contain' }}
                    />
                  )}

                  <Media body>
                    <div>
                      <small className='text-muted'>
                        Required image min resolution 500x300, max image size
                        1mb.
                      </small>
                    </div>

                    <div
                      className='d-inline-block mt-1'
                      style={{ overflow: 'hidden' }}
                    >
                      <FormGroup className='mb-0'>
                        <CustomInput
                          // disabled={notEditable}
                          type='file'
                          id='featured-img'
                          key={resetImg}
                          onChange={onFileChange}
                          accept='.jpg, .png, .jpeg, .webp'
                        />
                      </FormGroup>
                    </div>
                    {formErrors?.invalidImg && (
                      <div>
                        <small className='text-danger'>
                          {formErrors.invalidImg}
                        </small>
                      </div>
                    )}
                  </Media>
                </Media>
              </div>
            </Col>
            {/* Buttons */}
            <Col className='mt-50'>
              {/* Save Changes Button */}
              <Button.Ripple
                className='mb-1 mr-1'
                type='submit'
                color='primary'
                disabled={isSubmitting || !!formErrors}
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
              {/* Reset Changes Button */}
              {selectedPost && (
                <Button.Ripple
                  className='mb-1 mr-1'
                  type='button'
                  color='warning'
                  disabled={isSubmitting || !!formErrors}
                  onClick={handleFormReset}
                >
                  Reset
                </Button.Ripple>
              )}
              {/* Delete Button */}
              {selectedPost && (
                <Button.Ripple
                  className='mb-1 mr-1'
                  type='button'
                  color='danger'
                  disabled={isSubmitting || !!formErrors}
                  onClick={() => {
                    dispatch(setPostToManage(selectedPost));
                    history.goBack();
                  }}
                >
                  Delete
                </Button.Ripple>
              )}
              {/* Go Back Button */}
              <Button.Ripple
                color='secondary'
                className='mb-1 mr-1'
                type='button'
                outline
                disabled={isSubmitting || !!formErrors}
                onClick={() => history.goBack()}
              >
                Go back
              </Button.Ripple>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default BlogEditForm;
