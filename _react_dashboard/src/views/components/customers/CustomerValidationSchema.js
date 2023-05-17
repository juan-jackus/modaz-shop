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
  const addCustomerSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('This field is required')
      .trim()
      .max(50, 'Name too long (limit 50)')
      .matches(nameRegex, 'Invalid Name')
      .min(3, 'Name too short (minimum 3)'),
    username: Yup.string()
      .required('This field is required')
      .trim()
      .max(20, 'Username too long (limit 20)')
      .matches(
        usernameRegex4,
        '".","_", or "-" must not be the first or last character'
      )
      .matches(usernameRegex3, '".","_", or "-" does not appear consecutively')
      .matches(
        usernameRegex2,
        '".","_", or "-" must not be the first or last character'
      )
      .matches(
        usernameRegex1,
        'Only alphanumeric characters, "-", "_" and "." are allowed'
      )
      .min(7, 'username too short (minimum 7)'),
    email: Yup.string()
      .trim()
      .lowercase()
      .email('Invalid Email')
      .required('This field is required'),
    password: Yup.string()
      .required('This field is required')
      .trim()
      .matches(pwdNumberRegex, 'Must contains a number')
      .matches(pwdUppercaseRegex, 'Must contains a capital letter')
      .matches(pwdLowercaseRegex, 'Must contains lowercase letter')
      .min(8, 'Password to short (minimum 8)'),
    passwordConfirmation: Yup.string()
      .trim()
      .oneOf([Yup.ref('password')], "Passwords doesn't match")
      .required('This field is required'),
  });

  const editCustomerSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('This field is required')
      .trim()
      .max(50, 'Name too long (limit 50)')
      .matches(nameRegex, 'Invalid Name')
      .min(3, 'Name too short (minimum 3)'),
    username: Yup.string()
      .required('This field is required')
      .trim()
      .max(20, 'Username too long (limit 20)')
      .matches(
        usernameRegex4,
        '".","_", or "-" must not be the first or last character'
      )
      .matches(usernameRegex3, '".","_", or "-" does not appear consecutively')
      .matches(
        usernameRegex2,
        '".","_", or "-" must not be the first or last character'
      )
      .matches(
        usernameRegex1,
        'Only alphanumeric characters, "-", "_" and "." are allowed'
      )
      .min(7, 'username too short (minimum 7)'),
    email: Yup.string()
      .trim()
      .lowercase()
      .email('Invalid Email')
      .required('This field is required'),
    phoneNumber: Yup.lazy((value) => {
      if (value) {
        return Yup.string().matches(phoneNumberRegex, 'Invalid Phone Number');
      } else return Yup.string().nullable();
    }),
    moreInfos: Yup.object().shape({
      city: Yup.string().trim(),
      address: Yup.string().trim(),
      country: Yup.string().trim(),
      postalCode: Yup.lazy((value) => {
        if (value) {
          return Yup.number('Must be number');
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
    //     .required('This field is required'),
    // }),
    // gender: Yup.string().required('Choose a gender'),
  });

  if (editValues) {
    return editCustomerSchema;
  } else {
    return addCustomerSchema;
  }
};
