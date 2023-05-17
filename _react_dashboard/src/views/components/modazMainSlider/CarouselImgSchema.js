import * as Yup from 'yup';

//
export const carouselImgSchema = Yup.object().shape({
  title: Yup.string().required('This field is required').trim(),
  // text1: Yup.string().required('This field is required').trim(),
  // text2: Yup.string().required('This field is required').trim(),
  // text3: Yup.string().required('This field is required').trim(),
  category: Yup.string().required('This field is required').trim(),
  linkText: Yup.string().required('This field is required').trim(),
});
