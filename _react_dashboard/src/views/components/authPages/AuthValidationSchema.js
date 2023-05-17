import * as Yup from 'yup';

// Regex for Password Schema
const pwdUppercaseRegex = /(?=.*[A-Z])/;
const pwdLowercaseRegex = /(?=.*[a-z])/;
const pwdNumberRegex = /(?=.*[0-9])/;

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .trim()
    .matches(pwdNumberRegex, 'Doit contenir un chiffre')
    .matches(pwdUppercaseRegex, 'Doit contenir une lettre majuscule')
    .matches(pwdLowercaseRegex, 'Doit contenir une lettre minuscule')
    .min(8, 'Mot de passe trop court (minimum 8)'),
  passwordConfirmation: Yup.string()
    .trim()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas'),
});

export default resetPasswordSchema;
