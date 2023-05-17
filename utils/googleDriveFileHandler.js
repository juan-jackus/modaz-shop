const { google } = require('googleapis');
const { Readable } = require('stream');
const fs = require('fs');

// Id of Folder on Google drive
const parentFolderId = '1q91iGM5GBZxYGIoVfsBL-bQNz67pn2dz';
const avatarFolderId = '19x0qF0Vxka5g0HskDcwFvXcRaiQVj_fD';
const blogFolderId = '1JGBhofRIY4xlcPK_9SO63rweY_3-a-xo';
const carouselFolderId = '1iV0eblwomySO6yXzqb59g-rpvLTjbqQ_';
const productFolderId = '1cK3Q-RIVgZCFOnwU9uttrSmaACMbpXec';

const authenticateGoogle = () => {
  return new google.auth.GoogleAuth({
    keyFile: `${__dirname}/../google-service-account-key.json`,
    scopes: 'https://www.googleapis.com/auth/drive',
  });
};

const uploadToGoogleDrive = async (fileBuffer, fileInfos) => {
  const auth = authenticateGoogle();

  const fileMetadata = {
    name: fileInfos.name,
    parents: [fileInfos.folderId],
  };

  const media = {
    mimeType: fileInfos.mimetype,
    body: Readable.from(fileBuffer),
  };

  const drive = google.drive({ version: 'v3', auth });
  // Create File
  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
  });
  // Stop if creating file fail
  if (response.status !== 200) return null;
  // Make file public access
  const fileId = response.data.id;
  drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });
  // Create File Url
  const fileUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
  return fileUrl;
};

const deleteFromGoogleDrive = (fileLink) => {
  if (!fileLink) return;
  // Get fileId from fileLink
  const fileId = fileLink.substring(fileLink.lastIndexOf('=') + 1);
  const auth = authenticateGoogle();
  const drive = google.drive({ version: 'v3', auth });
  drive.files.delete({ fileId }).catch((err) => {
    console.log(err.message);
  });
};

const getFromGoogleDrive = (fileId) => {
  if (!fileId) return;
  const auth = authenticateGoogle();
  const drive = google.drive({ version: 'v3', auth });
  var dest = fs.createWriteStream(`./tmp/${fileId}.jpg`);
  drive.files
    .get({
      fileId,
      alt: 'media',
    })
    .on('end', function () {
      console.log('Done');
    })
    .on('error', function (err) {
      console.log('Error during download', err);
    })
    .pipe(dest);
};

const listFilesFromGoogleDrive = (folderId) => {
  const auth = authenticateGoogle();
  const drive = google.drive({ version: 'v3', auth });
  drive.files.list(
    {
      includeRemoved: false,
      spaces: 'drive',
      q: `'${folderId ? folderId : parentFolderId}' in parents`,
      // fileId: parentFolderId,
      // fields: 'nextPageToken, files(id, name, parents, mimeType, modifiedTime)',
    },
    function (err, res) {
      if (err) return console.log('error: ', err);
      const filesArray = [];
      res.data.files.forEach((file) => {
        file.link = `https://drive.google.com/uc?export=view&id=${file.id}`;
        filesArray.push(file);
      });
      console.log(filesArray);
    }
  );

  // deleteFromGoogleDrive('1p16OfDAOcmwiflzcreNp5gv0QVfOtIhs');
};

module.exports = {
  blogFolderId,
  parentFolderId,
  avatarFolderId,
  productFolderId,
  carouselFolderId,
  getFromGoogleDrive,
  uploadToGoogleDrive,
  deleteFromGoogleDrive,
  listFilesFromGoogleDrive,
};
