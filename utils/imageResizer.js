const sharp = require('sharp');
const mime = require('mime-types');
const ErrorObject = require('../errors/ErrorObject');
const {
  avatarFolderId,
  blogFolderId,
  carouselFolderId,
  productFolderId,
  uploadToGoogleDrive,
} = require('./googleDriveFileHandler');

const avatarImgResizer = (req, res, next) => {
  if (!req.file) return next();

  const file = req.file;
  const imgName = `${file.fieldname}_${Date.now()}.${mime.extension(
    file.mimetype
  )}`;

  const fileInfos = {
    mimeType: file.mimetype,
    name: imgName,
    folderId: avatarFolderId,
  };
  sharp(file.buffer)
    .resize(170)
    .toBuffer()
    .then(async (data) => {
      const imgLink = await uploadToGoogleDrive(data, fileInfos);
      req.body.avatar = imgLink;
      req.deletePreviousImg = true;
      next();
    })
    .catch((err) => {
      console.log(err);
      next();
    });
};

const carouselPostImgResizer = async (req, res, next) => {
  if (!req.file && !req.body.img) {
    const errorObj = [
      {
        msg: 'Image is required',
        param: 'img',
      },
    ];
    return next(new ErrorObject(422, '', '', errorObj));
  } else if (!req.file && req.body.img) return next();
  // For Carousel Images
  let imgNamePrefix = 'carouselImg';
  let folderId = carouselFolderId;
  let validRatio = { width: 1000, height: 500 };
  // For posted blog article Images
  if (req.body.author) {
    imgNamePrefix = 'blogImg';
    folderId = blogFolderId;
    validRatio = { width: 500, height: 300 };
  }
  const file = req.file;
  const imgName = `${imgNamePrefix}_${Date.now()}.${mime.extension(
    file.mimetype
  )}`;
  const fileInfos = {
    mimeType: file.mimetype,
    name: imgName,
    folderId,
  };
  const resizedImage = sharp(file.buffer);
  try {
    resizedImage.metadata().then(function (img) {
      if (img.width < validRatio.width || img.height < validRatio.height) {
        const errorObj = [
          {
            msg: 'Invalid image width or height',
            param: 'img',
          },
        ];
        return next(new ErrorObject(422, '', '', errorObj));
      }
      // Resize image if resolution > 1920x1080 and size > 1mb
      if (img.width > 1920 && img.height > 1080 && img.size > 1000000) {
        return resizedImage
          .resize(1920, 1080, {
            fit: 'cover',
          })
          .toBuffer(async (err, data) => {
            if (err) return next(err);
            const imgLink = await uploadToGoogleDrive(data, fileInfos);
            req.body.image = imgLink;
            req.deletePreviousImg = true;
            next();
          });
      }

      return resizedImage.toBuffer(async (err, data) => {
        if (err) return next(err);
        const imgLink = await uploadToGoogleDrive(data, fileInfos);
        req.body.image = imgLink;
        req.deletePreviousImg = true;
        next();
      });
    });
  } catch (error) {
    return next(err);
  }
};

const productImgResizer = async (req, res, next) => {
  if (
    (!req.files || !req.files.length) &&
    (!req.body.imagesUrl || !req.body.imagesUrl.length)
  ) {
    const errorObj = [
      {
        msg: 'Product image is required (min:1, max:5)',
        param: 'img',
      },
    ];
    return next(new ErrorObject(422, '', '', errorObj));
  } else if (!req.files || !req.files.length) {
    req.body.images = req.body.imagesUrl;
    return next();
  }

  const imgArray = req.files;
  const imgLinkArray = req.body.imagesUrl || [];
  const filePosition = req.body.filePosition;
  const errorArray = [];

  for (const [i, file] of imgArray.entries()) {
    const imgName = `productImg-${Date.now()}.${mime.extension(file.mimetype)}`;
    const fileInfos = {
      mimeType: file.mimetype,
      name: imgName,
      folderId: productFolderId,
    };
    const resizedImage = sharp(file.buffer);
    try {
      await resizedImage.metadata().then(async (img) => {
        if (img.width < 300 || img.height < 300) return;
        // Resize image if resolution > 1920x1080 and size > 100ko
        if (img.height > 700) {
          return await resizedImage
            .resize({ height: 600 })
            .toBuffer()
            .then(async (data) => {
              const imgLink = await uploadToGoogleDrive(data, fileInfos);
              imgLinkArray.splice(+filePosition[i], 0, imgLink);
            })
            .catch((err) => {
              errorArray.push(err);
            });
        }

        return await resizedImage
          .toBuffer()
          .then(async (data) => {
            const imgLink = await uploadToGoogleDrive(data, fileInfos);
            imgLinkArray.splice(filePosition[i], 0, imgLink);
          })
          .catch((err) => {
            errorArray.push(err);
          });
      });
    } catch (error) {
      errorArray.push(error);
    }
  }

  // Return error if no image saved
  if (!imgLinkArray.length) {
    return next(new ErrorObject(422, '', '', errorArray));
  }
  req.body.images = imgLinkArray;
  return next();
};

module.exports = {
  avatarImgResizer,
  productImgResizer,
  carouselPostImgResizer,
};
