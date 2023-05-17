import * as Yup from 'yup';

export const productSchema = Yup.object().shape({
  name: Yup.string()
    .required('This field is required')
    .trim()
    .max(100, 'Name too long (limit 100)')
    .min(3, 'Name too short (minimum 5)'),
  price: Yup.string().required('This field is required'),
  quantity: Yup.string().required('This field is required'),
  categories: Yup.array()
    .nullable(true)
    .min(1, 'Select category')
    .required('Select category'),
});
