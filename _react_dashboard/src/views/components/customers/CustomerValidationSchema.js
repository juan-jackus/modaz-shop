import * as Yup from 'yup';

// Regex for Yup Validation Schema
const pwdUppercaseRegex = /(?=.*[A-Z])/;
const pwdLowercaseRegex = /(?=.*[a-z])/;
const pwdNumberRegex = /(?=.*[0-9])/;
const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
const usernameRegex1 = /^.[a-zA-Z0-9-_.]+$/; // allowed characters
const usernameRegex2 = /^(?![._-])/; // no "_", "-" ou "." at the beginning
const usernameRegex3 = /^(?!.*[._-]{2})/; // no "__" or "_." or "._" or ".." inside
const usernameRegex4 = /(?<![_.])$/; // no "_" or "." at the end
const phoneNumberRegex =
  /^(77|70|33|76|78)(\s|-)\d{3}(\s|-)\d{2}(\s|-)[0-9]{2}$/;

export const getSchemaValidation = (editValues) => {
  //
  const addCustomerSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('Ce champ est obligatoire')
      .trim()
      .max(50, 'Nom trop long (limite 50)')
      .matches(nameRegex, 'Nom invalide')
      .min(3, 'Nom trop court (minimum 3)'),
    username: Yup.string()
      .required('Ce champ est obligatoire')
      .trim()
      .max(20, "Nom d'utilisateur trop long (limite 20)")
      .matches(
        usernameRegex4,
        '".","_", ou "-" ne doit pas être le premier ou le dernier caractère'
      )
      .matches(
        usernameRegex3,
        '".","_", ou "-" ne doit pas apparaître consécutivement'
      )
      .matches(
        usernameRegex2,
        '".","_", ou "-" ne doit pas être le premier ou le dernier caractère'
      )
      .matches(
        usernameRegex1,
        'Uniquement des caractères alphanumériques, "-", "_" et "." sont autorisés'
      )
      .min(7, "nom d'utilisateur trop court (minimum 7)"),
    email: Yup.string()
      .trim()
      .lowercase()
      .email('Email invalide')
      .required('Ce champ est obligatoire'),
    password: Yup.string()
      .required('Ce champ est obligatoire')
      .trim()
      .matches(pwdNumberRegex, 'Doit contenir un nombre')
      .matches(pwdUppercaseRegex, 'Doit contenir une majuscule')
      .matches(pwdLowercaseRegex, 'Doit contenir une lettre minuscule')
      .min(8, 'Mot de passe court (minimum 8)'),
    passwordConfirmation: Yup.string()
      .trim()
      .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
      .required('Ce champ est obligatoire'),
  });

  const editCustomerSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('Ce champ est obligatoire')
      .trim()
      .max(50, 'Nom trop long (limite 50)')
      .matches(nameRegex, 'Nom invalide')
      .min(3, 'Nom trop court (minimum 3)'),
    username: Yup.string()
      .required('Ce champ est obligatoire')
      .trim()
      .max(20, "Nom d'utilisateur trop long (limite 20)")
      .matches(
        usernameRegex4,
        '".","_", ou "-"  ne doit pas être le premier ou le dernier caractère'
      )
      .matches(
        usernameRegex3,
        '".","_", ou "-" ne doit pas apparaître consécutivement'
      )
      .matches(
        usernameRegex2,
        '".","_", ou "-" ne doit pas être le premier ou le dernier caractère'
      )
      .matches(
        usernameRegex1,
        'Uniquement des caractères alphanumériques, "-", "_" et "." sont autorisés'
      )
      .min(7, "nom d'utilisateur trop court (minimum 7)"),
    email: Yup.string()
      .trim()
      .lowercase()
      .email('Email invalide')
      .required('Ce champ est obligatoire'),
    phoneNumber: Yup.lazy((value) => {
      if (value) {
        return Yup.string().matches(
          phoneNumberRegex,
          'Numéro de téléphone invalide'
        );
      } else return Yup.string().nullable();
    }),
    moreInfos: Yup.object().shape({
      city: Yup.string().trim(),
      address: Yup.string().trim(),
      country: Yup.string().trim(),
      postalCode: Yup.lazy((value) => {
        if (value) {
          return Yup.number('Doit être un nombre');
        } else {
          return Yup.string();
        }
      }),
    }),
    // password: Yup.lazy((value) => {
    //   if (value) {
    //     return Yup.string()
    //       .trim()
    //       .matches(pwdNumberRegex, 'Must contains a number')
    //       .matches(pwdUppercaseRegex, 'Must contains a capital letter')
    //       .matches(pwdLowercaseRegex, 'Must contains lowercase letter')
    //       .min(8, 'Password to short (minimum 8)');
    //   } else {
    //     return Yup.string().notRequired();
    //   }
    // }),
    // passwordConfirmation: Yup.string().when('password', {
    //   is: (value) => value.length > 0,
    //   then: Yup.string()
    //     .trim()
    //     .oneOf([Yup.ref('password')], "Passwords doen't match")
    //     .required('Ce champ est obligatoire'),
    // }),
    // gender: Yup.string().required('Choose a gender'),
  });

  if (editValues) {
    return editCustomerSchema;
  } else {
    return addCustomerSchema;
  }
};
