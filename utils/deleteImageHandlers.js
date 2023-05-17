const path = require('path');
const fs = require('fs');

// Delete Previous Avatar and Carousel Image
const deletePreviousImage = (req, next) => {
  let img, previousImg, imgSubFolder;
  if (req.body.previousAvatar) {
    img = req.body.avatar;
    previousImg = req.body.previousAvatar;
    imgSubFolder = req.app.locals.avatarFolder;
  } else if (req.body.previousCarousel) {
    img = req.body.img;
    previousImg = req.body.previousCarousel;
    imgSubFolder = req.app.locals.carouselFolder;
  } else if (req.body.previousPostImg) {
    img = req.body.img;
    previousImg = req.body.previousPostImg;
    imgSubFolder = req.app.locals.blogFolder;
  }

  if (img === previousImg || !previousImg || !imgSubFolder) return;
  // Get previous Image Name from Url
  const previousImgName = previousImg.substring(
    previousImg.lastIndexOf('/') + 1
  );
  // Create Previous Image Path
  const previousImgPath = path.join(
    req.app.locals.publicPath,
    imgSubFolder,
    previousImgName
  );
  // delete previous Avatar
  if (fs.existsSync(previousImgPath)) {
    fs.unlink(previousImgPath, (err) => {
      if (err) return next(err);
    });
  }
};

const deleteMultipleImage = (req) => {
  let imgArray, imgSubFolder;
  if (req.body.prevUserImgArray) {
    imgArray = req.body.prevUserImgArray;
    imgSubFolder = req.app.locals.avatarFolder;
  } else if (req.body.prevProductImgArray) {
    imgArray = req.body.prevProductImgArray;
    imgSubFolder = req.app.locals.productFolder;
  } else if (req.body.prevPostImgArray) {
    imgArray = req.body.prevPostImgArray;
    imgSubFolder = req.app.locals.blogFolder;
  }

  if (!imgArray || !Array.isArray(imgArray) || !imgArray.length) return;

  imgArray.forEach((previousImg) => {
    if (!previousImg) return;
    // Get previous Image Name from Url
    const previousImgName = previousImg.substring(
      previousImg.lastIndexOf('/') + 1
    );
    // Create Previous Image Path
    const previousAvatarPath = path.join(
      req.app.locals.publicPath,
      imgSubFolder,
      previousImgName
    );
    // delete previous Avatar
    if (fs.existsSync(previousAvatarPath)) {
      fs.unlink(previousAvatarPath, (err) => {
        if (err) console.log(err);
      });
    }
  });
};

module.exports = {
  deletePreviousImage,
  deleteMultipleImage,
};
