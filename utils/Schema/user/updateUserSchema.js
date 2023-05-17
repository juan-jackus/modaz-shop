const { body } = require('express-validator');
const { rolesId } = require('../../../models/user');
const rolesIdArray = [];
for (const key in rolesId) rolesIdArray.push(rolesId[key]);

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

const updateUserSchema = [
  body('fullName')
    .if(body('fullName').exists({ checkFalsy: true }))
    .trim()
    .matches(nameRegex)
    .withMessage('Invalid Name'),
  body('username')
    .if(body('username').exists({ checkFalsy: true }))
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage('Username lenght must be in range [8-20]')
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
    .if(body('password').exists({ checkFalsy: true }))
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password too short')
    .matches(pwdUppercaseRegex)
    .withMessage('Password must contains a Uppercase')
    .matches(pwdLowercaseRegex)
    .withMessage('Password must contains a Lowercase')
    .matches(pwdNumberRegex)
    .withMessage('Password must contains a Number'),
  body('email')
    .if(body('email').exists({ checkFalsy: true }))
    .trim()
    .isEmail()
    .withMessage('Invalid Email')
    .normalizeEmail()
    .toLowerCase(),
  body('phoneNumber', 'Invalid Phone Number')
    .trim()
    .if(body('phoneNumber').exists({ checkFalsy: true }))
    .matches(phoneNumberRegex),
  body('role')
    .if(body('role').exists({ checkFalsy: true }))
    .isIn(rolesIdArray)
    .withMessage('Invalid User Role'),
  body('gender')
    .if(body('gender').exists({ checkFalsy: true }))
    .isIn(['male', 'female'])
    .withMessage('Invalid gender'),
];

module.exports = updateUserSchema;
