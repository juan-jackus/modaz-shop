import * as Yup from 'yup';

// Regex for Password Schema
const pwdUppercaseRegex = /(?=.*[A-Z])/;
const pwdLowercaseRegex = /(?=.*[a-z])/;
const pwdNumberRegex = /(?=.*[0-9])/;

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .trim()
    .matches(pwdNumberRegex, 'Must contains a number')
    .matches(pwdUppercaseRegex, 'Must contains a capital letter')
    .matches(pwdLowercaseRegex, 'Must contains lowercase letter')
    .min(8, 'Password to short (minimum 8)'),
  passwordConfirmation: Yup.string()
    .trim()
    .oneOf([Yup.ref('password')], "Passwords doesn't match"),
});

export default resetPasswordSchema;
