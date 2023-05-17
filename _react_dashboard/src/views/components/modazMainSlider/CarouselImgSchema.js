import * as Yup from 'yup';

//
export const carouselImgSchema = Yup.object().shape({
  title: Yup.string().required('Ce champ est obligatoire').trim(),
  // text1: Yup.string().required('Ce champ est obligatoire').trim(),
  // text2: Yup.string().required('Ce champ est obligatoire').trim(),
  // text3: Yup.string().required('Ce champ est obligatoire').trim(),
  category: Yup.string().required('Ce champ est obligatoire').trim(),
  linkText: Yup.string().required('Ce champ est obligatoire').trim(),
});
