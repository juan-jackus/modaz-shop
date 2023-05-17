import * as Yup from 'yup';

// Regex for Yup Validation Schema
const pwdUppercaseRegex = /(?=.*[A-Z])/;
const pwdLowercaseRegex = /(?=.*[a-z])/;
const pwdNumberRegex = /(?=.*[0-9])/;
const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
const usernameRegex1 = /^.[a-zA-Z0-9-_.]+$/; // allowed characters
const usernameRegex2 = /^(?![._-])/; // no "_", "-" or "." at the beginning
const usernameRegex3 = /^(?!.*[._-]{2})/; // no "__" or "_." or "._" or ".." inside
const usernameRegex4 = /(?<![_.])$/; // no "_" or "." at the end
const phoneNumberRegex =
  /^(77|70|33|76|78)(\s|-)\d{3}(\s|-)\d{2}(\s|-)[0-9]{2}$/;

export const getSchemaValidation = (editValues) => {
  //
  const addUserSchema = Yup.object().shape({
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
        '".", "_" ou "-" ne doit pas être le premier ou le dernier caractère.'
      )
      .matches(
        usernameRegex3,
        '".", "_" ou "-" n\'apparaissent pas consécutivement'
      )
      .matches(
        usernameRegex2,
        '".", "_" ou "-" ne doit pas être le premier ou le dernier caractère.'
      )
      .matches(
        usernameRegex1,
        'Seuls les caractères alphanumériques, "-", "_" et "." sont autorisés.'
      )
      .min(7, "nom d'utilisateur trop court (minimum 7)"),
    email: Yup.string()
      .trim()
      .lowercase()
      .email('Email invalide')
      .required('Ce champ est obligatoire'),
    password: Yup.string()
      .trim()
      .required('Ce champ est obligatoire')
      .matches(pwdNumberRegex, 'Doit contenir un nombre')
      .matches(pwdUppercaseRegex, 'Doit contenir une lettre majuscule')
      .matches(pwdLowercaseRegex, 'Doit contenir une lettre minuscule')
      .min(8, 'Mot de passe court (minimum 8)'),
    passwordConfirmation: Yup.string()
      .trim()
      .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
      .required('Ce champ est obligatoire'),
    phoneNumber: Yup.string()
      .required('Ce champ est obligatoire')
      .matches(phoneNumberRegex, 'Numéro de téléphone invalide'),
  });

  const editUserSchema = Yup.object().shape({
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
        '".", "_" ou "-" ne doit pas être le premier ou le dernier caractère.'
      )
      .matches(
        usernameRegex3,
        '".", "_" ou "-" n\'apparaissent pas consécutivement'
      )
      .matches(
        usernameRegex2,
        '".", "_" ou "-" ne doit pas être le premier ou le dernier caractère.'
      )
      .matches(
        usernameRegex1,
        'Seuls les caractères alphanumériques, "-", "_" et "." sont autorisés.'
      )
      .min(7, "nom d'utilisateur trop court (minimum 7)"),
    email: Yup.string()
      .trim()
      .lowercase()
      .email('Email invalide')
      .required('Ce champ est obligatoire'),
    phoneNumber: Yup.string()
      .required('Ce champ est obligatoire')
      .matches(phoneNumberRegex, 'Numéro de téléphone invalide'),
    // password: Yup.lazy((value) => {
    //   if (value) {
    //     return Yup.string()
    //       .trim()
    //       .matches(pwdNumberRegex, 'Doit contenir un nombre')
    //       .matches(pwdUppercaseRegex, 'Doit contenir une lettre majuscule')
    //       .matches(pwdLowercaseRegex, 'Doit contenir une lettre minuscule')
    //       .min(8, 'Mot de passe court (minimum 8)');
    //   } else {
    //     return Yup.string().notRequired();
    //   }
    // }),
    // passwordConfirmation: Yup.string().when('password', {
    //   is: (value) => value.length > 0,
    //   then: Yup.string()
    //     .trim()
    //     .oneOf([Yup.ref('pwd')], "Passwords doen't match")
    //     .required('Ce champ est obligatoire'),
    // }),
  });

  const editLoginSchema = Yup.object().shape({
    fullName: Yup.string()
      .trim()
      .required('Ce champ est obligatoire')
      .max(50, 'Nom trop long (limite 50)')
      .matches(nameRegex, 'Nom invalide')
      .min(3, 'Nom trop court (minimum 3)'),
    username: Yup.string()
      .trim()
      .required('Ce champ est obligatoire')
      .max(20, "Nom d'utilisateur trop long (limite 20)")
      .matches(
        usernameRegex4,
        '".", "_" ou "-" ne doit pas être le premier ou le dernier caractère.'
      )
      .matches(
        usernameRegex3,
        '".", "_" ou "-" n\'apparaissent pas consécutivement'
      )
      .matches(
        usernameRegex2,
        '".", "_" ou "-" ne doit pas être le premier ou le dernier caractère.'
      )
      .matches(
        usernameRegex1,
        'Seuls les caractères alphanumériques, "-", "_" et "." sont autorisés.'
      )
      .min(7, "nom d'utilisateur trop court (minimum 7)"),
    email: Yup.string()
      .trim()
      .lowercase()
      .email('Email invalide')
      .required('Ce champ est obligatoire'),
    phoneNumber: Yup.string()
      .required('Ce champ est obligatoire')
      .matches(phoneNumberRegex, 'Numéro de téléphone invalide'),
  });

  const changePwdSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Ce champ est obligatoire').trim(),
    password: Yup.string()
      .required('Ce champ est obligatoire')
      .trim()
      .notOneOf(
        [Yup.ref('oldPassword')],
        "L'ancien et le nouveau mot de passe sont similaires"
      )
      .matches(pwdNumberRegex, 'Doit contenir un nombre')
      .matches(pwdUppercaseRegex, 'Doit contenir une lettre majuscule')
      .matches(pwdLowercaseRegex, 'Doit contenir une lettre minuscule')
      .min(8, 'Mot de passe court (minimum 8)'),
    passwordConfirmation: Yup.string()
      .trim()
      .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
      .required('Ce champ est obligatoire'),
  });

  if (editValues) {
    switch (editValues) {
      case 'editLoginSchema':
        return editLoginSchema;
      case 'changePwdSchema':
        return changePwdSchema;
      default:
        return editUserSchema;
    }
  } else {
    return addUserSchema;
  }
};
