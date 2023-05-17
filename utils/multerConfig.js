const multer = require('multer');
const path = require('path');
const ErrorObject = require('../errors/ErrorObject');

const fileStorage = multer.memoryStorage();

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/images/users-avatar');
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + '_' + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    const errorObj = [
      {
        msg: 'Please upload only images (JPEG,PNG,JPG,WEBP)',
        param: 'img',
      },
    ];
    const multerError = new ErrorObject(422, '', '', errorObj);
    cb(multerError, false);
  }
};

module.exports = { fileStorage, fileFilter };
