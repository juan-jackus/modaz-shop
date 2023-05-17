const ErrorObject = require('../errors/ErrorObject');

function errorsHandler(err, req, res, next) {
  console.error(err);
  // Express Validator Errors
  if (err instanceof ErrorObject) {
    res.status(err.statusCode).send(err);
  } // Mongoose Schema Duplicate Key Errors
  else if (err.code === 11000) {
    const param = Object.keys(err.keyValue)[0];
    const errorObj = [
      {
        msg: `This ${param} already exist`,
        param,
      },
    ];
    const mongooseErr = new ErrorObject(422, err.name, err.message, errorObj);
    res.status(422).send(mongooseErr);
  } // Mongoose Schema Validation Errors
  else if (err.name === 'ValidationError') {
    const errorObj = Object.keys(err.errors).map((key) => {
      const param = key;
      const msg = err.errors[key].message;
      return { msg, param };
    });
    const mongooseErr = new ErrorObject(422, err.name, err.message, errorObj);
    res.status(422).send(mongooseErr);
  } //Multer Uploading Files Errors
  else if (err.code === 'LIMIT_FILE_SIZE') {
    const errorObj = [
      {
        msg: 'Image size is too big',
        param: 'img',
      },
    ];
    const multerError = new ErrorObject(422, '', '', errorObj);
    res.status(422).send(multerError);
  } else {
    res.sendStatus(500);
  }
}

module.exports = errorsHandler;
