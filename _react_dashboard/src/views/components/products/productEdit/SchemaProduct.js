import * as Yup from 'yup';

export const productSchema = Yup.object().shape({
  name: Yup.string()
    .required('Ce champ est obligatoire')
    .trim()
    .max(100, 'Nom trop long (limite 100)')
    .min(3, 'Nom trop court (minimum 5)'),
  price: Yup.string().required('Ce champ est obligatoire'),
  quantity: Yup.string().required('Ce champ est obligatoire'),
  categories: Yup.array()
    .nullable(true)
    .min(1, 'Sélectionner une catégorie')
    .required('Sélectionner une catégorie'),
});
