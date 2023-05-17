const { body } = require('express-validator');

// Regex Validation Schema
const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
const pwdUppercaseRegex = /(?=.*[A-Z])/;
const pwdLowercaseRegex = /(?=.*[a-z])/;
const pwdNumberRegex = /(?=.*[0-9])/;
const usernameRegex1 = /^.[a-zA-Z0-9-_.]+$/; // allowed characters
const usernameRegex2 = /^(?![._-])/; // no "_", "-" or "." at the beginning
const usernameRegex3 = /^(?!.*[._-]{2})/; // no "__" or "_." or "._" or ".." inside
const usernameRegex4 = /(?<![._-])$/; // no "_", "-" or "." at the end
const phoneNumberRegex =
  /^(77|70|33|76|78)(\s|-)\d{3}(\s|-)\d{2}(\s|-)[0-9]{2}$/;

const addCustomerSchema = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage('Name lenght must be in range [3-50]')
    .bail()
    .matches(nameRegex)
    .withMessage('Invalid Name'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .bail()
    .isLength({ min: 7, max: 20 })
    .withMessage('Username lenght must be in range [7-20]')
    .bail()
    .matches(usernameRegex1)
    .withMessage('Only alphanumeric characters, "-", "_" and "." are allowed')
    .matches(usernameRegex2)
    .withMessage(
      '" . "," _ ", or " - " must not be the first or last character'
    )
    .matches(usernameRegex3)
    .withMessage('" . "," _ ", or " - " does not appear consecutively')
    .matches(usernameRegex4)
    .withMessage(
      '" . "," _ ", or " - " must not be the first or last character'
    ),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Password too short')
    .bail()
    .matches(pwdUppercaseRegex)
    .withMessage('Password must contains a Uppercase')
    .matches(pwdLowercaseRegex)
    .withMessage('Password must contains a Lowercase')
    .matches(pwdNumberRegex)
    .withMessage('Password must contains a Number'),
  body('passwordConfirmation')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .custom((confirmPwd, { req }) => {
      if (req.body.password !== confirmPwd) {
        throw new Error('Passwords must be same');
      }
      return true;
    }),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Invalid Email')
    .bail()
    .normalizeEmail()
    .toLowerCase(),
  body('phoneNumber', 'Invalid Phone Number')
    .trim()
    .if(body('phoneNumber').exists({ checkFalsy: true }))
    .matches(phoneNumberRegex),
];

module.exports = addCustomerSchema;
