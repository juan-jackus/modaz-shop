const { validationResult } = require('express-validator');
const ErrorObject = require('../../errors/ErrorObject');

const schemaValidationResult = (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Foward errors to Errors Middleware Handler
    next(
      new ErrorObject(
        422,
        'validationError',
        'Unprocessable Entity',
        errors.array()
      )
    );
  }
  // Continue if there is no errors
  next();
};

module.exports = schemaValidationResult;
