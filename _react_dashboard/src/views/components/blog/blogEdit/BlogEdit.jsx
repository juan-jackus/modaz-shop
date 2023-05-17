// ** React
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
// ** Redux Store and Actions
import { useSelector, useDispatch } from 'react-redux';
import {
  addPost,
  updatePost,
  setPostToManage,
  removeSelectedPost,
} from '@store/actions/blog';
// ** Third Party Components
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { toast, Slide } from 'react-toastify';
// ** Utils
import { imageValidation, slugify, capitalize } from '@utils';
import { serialize } from 'object-to-formdata';
// ** Custom Components
import BlogEditForm from './BlogEditForm';
import ToastContent from '../../users/ToastContent';
import Breadcrumbs from '@components/breadcrumbs';

const BlogEdit = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const history = useHistory();
  const store = useSelector((state) => state.blog);
  const { selectedPost, postCategories } = store;
  const loginUser = useSelector((state) => state.auth.userData);
  const postErrors = useSelector((state) => state.errors.addPost);
  // ** Convert text to Editor State Function
  const toEditorState = (htmlText) => {
    const contentBlock = htmlToDraft(htmlText);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    return EditorState.createWithContent(contentState);
  };

  let editorState = EditorState.createEmpty();
  let categoriesState = [];
  let statusState = true;
  if (selectedPost) {
    statusState = selectedPost?.status;
    editorState = toEditorState(selectedPost.htmlText);
    categoriesState = selectedPost.categories.map((category) => {
      // eslint-disable-next-line
      return postCategories.find((c) => category == c.value);
    });
  }
  // ** State
  const [content, setContent] = useState(editorState),
    [categories, setBlogCategories] = useState(categoriesState),
    [title, setTitle] = useState(selectedPost?.title || ''),
    [slug, setSlug] = useState(selectedPost?.slug || ''),
    [status, setStatus] = useState(statusState),
    [featuredImg, setFeaturedImg] = useState(''),
    [previewImg, setPreviewImg] = useState(selectedPost?.image || ''),
    [resetImg, setResetImg] = useState(1),
    [isSubmitting, setIsSubmitting] = useState(false),
    [formErrors, setFormErrors] = useState(null);

  // ** Remove Selected Post On Unmount
  useEffect(() => {
    return () => dispatch(removeSelectedPost());
  }, []);
  // ** Set server Errors response
  useEffect(() => {
    if (postErrors) {
      setFormErrors({ message: postErrors[0].msg });
      setTimeout(() => {
        setFormErrors(null);
      }, 3000);
      dispatch({
        type: 'CLEAR_ERRORS',
        data: 'addPost',
      });
    }
  }, [postErrors]);
  // ** File Upload Handler
  const onFileChange = (e) => {
    const img = e.target.files[0];
    if (!img) {
      setPreviewImg('');
      return;
    }
    const error = imageValidation(img);
    if (error) {
      setFormErrors({ invalidImg: error });
      setResetImg(Date.now());
      setPreviewImg(selectedPost?.image || '');
      setTimeout(() => {
        setFormErrors(null);
      }, 3000);
      return;
    }
    const checkImg = new Image();
    checkImg.src = URL.createObjectURL(img);
    checkImg.onload = async function () {
      if (this.width < 500 || this.height < 300) {
        setFormErrors({ invalidImg: 'Invalid image width or height' });
        setResetImg(Date.now());
        setPreviewImg(selectedPost?.image || '');
        setTimeout(() => {
          setFormErrors(null);
        }, 3000);
      } else {
        setFeaturedImg(img);
        setPreviewImg(URL.createObjectURL(img));
      }
    };
  };
  // ** Form Edit and Reset Handler
  const handleFormReset = () => {
    setContent(editorState);
    setBlogCategories(categoriesState);
    setTitle(selectedPost?.title || '');
    setSlug(selectedPost?.slug || '');
    setStatus(selectedPost?.status);
    setFeaturedImg('');
    setPreviewImg(selectedPost?.image || '');
    setResetImg(Date.now());
  };
  // ** Form Edit and Reset Handler
  const formValidation = () => {
    if (
      !title ||
      !categories.length ||
      (!featuredImg && !selectedPost) ||
      !content.getCurrentContent().hasText()
    ) {
      setIsSubmitting(false);
      setFormErrors({ message: 'Fill all required fields (*) please!' });
      setTimeout(() => {
        setFormErrors(null);
      }, 3500);
      return false;
    }
    return true;
  };
  // ** Function to handle form submit
  const onSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    if (!formValidation()) return;
    // Transform Editor text to Html in String
    const htmlText = draftToHtml(convertToRaw(content.getCurrentContent()));
    const text = content.getCurrentContent().getPlainText();
    const values = { title: capitalize(title), status, htmlText, text };
    values.slug = slug ? slugify(slug) : slugify(title);
    values.author = loginUser.id;
    values.authorUsername = loginUser.username;
    values.categories = categories.map((category) => category.value);
    let postId = null;
    let processData = addPost;
    if (selectedPost) {
      postId = selectedPost.id;
      processData = updatePost;
    }
    // Transform values Form Data
    const postData = serialize(values);
    postData.append('img', featuredImg || selectedPost.image);
    // for (const value of postData.values()) {
    //   console.log(value);
    // }
    // return;
    const successSubmit = await dispatch(processData(postData, postId)).then(
      (res) => {
        setIsSubmitting(false);
        return res;
      }
    );

    let toastValue = {
      type: 'error',
      text: selectedPost
        ? 'Update of Post failed'
        : 'Creation of new Post failed',
    };

    if (successSubmit) {
      toastValue = {
        type: 'success',
        text: selectedPost
          ? 'Post successfuly Modified'
          : 'New Post successfuly Added',
      };

      if (!selectedPost) {
        setTitle('');
        setBlogCategories([]);
        setSlug('');
        setStatus('');
        setPreviewImg('');
        setFeaturedImg('');
        setResetImg(Date.now());
        setContent(EditorState.createEmpty());
      }
    }
    toast[toastValue.type](ToastContent(toastValue), {
      transition: Slide,
      hideProgressBar: false,
      autoClose: 3000,
      pauseOnHover: true,
    });
  };

  return (
    <div className='blog-edit-wrapper'>
      <Breadcrumbs
        breadCrumbTitle='Blog Edit'
        breadCrumbParent='Blog'
        breadCrumbActive='Edit'
      />
      <BlogEditForm
        slug={slug}
        title={title}
        status={status}
        setSlug={setSlug}
        content={content}
        history={history}
        dispatch={dispatch}
        resetImg={resetImg}
        onSubmit={onSubmit}
        setTitle={setTitle}
        setStatus={setStatus}
        setContent={setContent}
        formErrors={formErrors}
        previewImg={previewImg}
        categories={categories}
        selectedPost={selectedPost}
        onFileChange={onFileChange}
        isSubmitting={isSubmitting}
        postCategories={postCategories}
        handleFormReset={handleFormReset}
        setPostToManage={setPostToManage}
        setBlogCategories={setBlogCategories}
      />
    </div>
  );
};

export default BlogEdit;
