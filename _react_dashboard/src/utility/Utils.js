// ** File Resizer
import Resizer from 'react-image-file-resizer';
import defaultImg from '@src/assets/images/avatars/broken-image.png';

// ** GENERATE RANDOM KEY
export const generateRandomKey = () => {
  const randomKey = [
    `${Math.random()}a`,
    `${Math.random()}b`,
    `${Math.random()}c`,
  ];
  return randomKey;
};

// ** RESIZE AVATAR IMAGE
export const resizeAvatarHandler = (file) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      'PNG',
      100,
      0,
      (resizedFile) => {
        resolve(resizedFile);
      },
      'file'
    );
  });
};

// ** RESIZE CAROUSEL IMAGE
export const resizeCarouselHandler = (file) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1920,
      750,
      'WEBP',
      100,
      0,
      (resizedFile) => {
        resolve(resizedFile);
      },
      'file',
      1280,
      500
    );
  });
};

// ** IMAGE VALIDATION
export const imageValidation = (img, imgField) => {
  const fileType = img['type'];
  const validImageTypes = [
    'image/gif',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];
  let error = null;
  // invalid file type Check.
  if (!validImageTypes.includes(fileType)) {
    error = 'Only upload Image (gif,jpeg,png,jpg,webp)';
  } else if (img.size > 1300000 && imgField !== 'carouselImg') {
    // image > 1.3mb
    error = 'Image size too large max (1mb)';
  } else if (img.size > 10300000) {
    // image > 1.3mb
    error = 'Image size too large max (10mb)';
  }

  return error;
};

// ** HANDLE FILE UPLOAD
export const fileUploadHandler = async (
  img,
  setImg,
  setPreviewImg,
  setResetImg,
  setError,
  clearErrors,
  imgField,
  setLoadingImg
) => {
  //
  if (!img) return;
  const error = imageValidation(img, imgField);
  if (error) {
    setError('img', {
      type: 'matches',
      message: error,
    });
    setResetImg(Date.now());
    setTimeout(() => {
      clearErrors('img');
    }, 5000);
    return;
  }

  if (setLoadingImg) setLoadingImg(true);

  let minWidth, minHeight;
  switch (imgField) {
    case 'carouselImg':
      minWidth = 1000;
      minHeight = 500;
      break;
    case 'productImg':
      minWidth = 250;
      minHeight = 250;
      break;
    default:
      minWidth = 500;
      minHeight = 300;
      break;
  }
  const checkImg = new Image();
  checkImg.src = URL.createObjectURL(img);
  checkImg.onload = async function () {
    if (this.width < minWidth || this.height < minHeight) {
      setError('img', {
        type: 'matches',
        message: 'Invalid image width or height',
      });
      setResetImg(Date.now());
      setTimeout(() => {
        clearErrors('img');
      }, 5000);
    } else {
      setImg(img);
      setPreviewImg(URL.createObjectURL(img));
    }

    if (setLoadingImg) setLoadingImg(false);
  };
};

// ** CONVERT IMAGE URL TO FILE
export const imgUrlToFile = async (imgUrl) => {
  if (!imgUrl) return;

  const response = await fetch(imgUrl);
  const blob = await response.blob();
  const imgName = `${Date.now()}.${blob.type.substring(
    imgUrl.lastIndexOf('/')
  )}`;
  const imgFile = new File([blob], imgName, {
    lastModified: new Date().getTime(),
    type: blob.type,
  });

  return imgFile;
};

// ** CONVERT MUTIPLE IMAGE URL TO FILE
export const imgUrlArrayToFiles = async (imgUrlArray) => {
  if (!imgUrlArray || !imgUrlArray.length) return imgUrlArray;
  const imgFileArray = await Promise.all(
    imgUrlArray.map((imgUrl) => {
      return getProductImg(imgUrl);
    })
  );
  return imgFileArray;
};

// ** BROKEN IMAGE LINK HANDLER
export const onImageError = (e) => {
  e.target.onerror = null;
  e.target.src = defaultImg;
};

// ** PHONE NUMBER VALIDATOR
export const phoneNumberValidator = (...args) => {
  const [phoneNumber, setValue, setError, clearErrors] = args;
  const phoneNumberRegex = /^(77|70|33|76|78)/;

  if (phoneNumber) {
    if (phoneNumber.length !== 9 || !phoneNumber.match(phoneNumberRegex)) {
      setError('phoneNumber', {
        type: 'matches',
        message: 'Invalid Phone Number',
      });
    } else {
      clearErrors('phoneNumber');
      setValue('phoneNumber', phoneNumber);
    }
  } else {
    setError('phoneNumber', {
      type: 'matches',
      message: 'Phone Number is required',
    });
  }
};

// ** CAPITALIZE STRING
export const capitalize = (input) => {
  if (!input) return '';
  return input
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
};

// ** FORMAT DATE
export const formatDate = (value, format = null) => {
  const valueDate = new Date(value);
  if (isNaN(valueDate)) return null;
  const dd = String(valueDate.getDate()).padStart(2, '0');
  const mm = String(valueDate.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = valueDate.getFullYear();
  const formatedDate = format ? `${dd}/${mm}/${yyyy}` : `${yyyy}/${mm}/${dd}`;

  return formatedDate;
};

export const textTruncater = (text) => {
  if (text.length > 93) {
    return `${text.substring(0, 93)}...`;
  }
  return text;
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

// ** Returns K format from a number
export const kFormatter = (num, digits = 1) => {
  const formats = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  // regex to trim trailing zeros
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = formats
    .slice()
    .reverse()
    .find(function (item) {
      return Math.abs(num) >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
};

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, '');

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
// export const formatDate = (
//   value,
//   formatting = { month: 'short', day: 'numeric', year: 'numeric' }
// ) => {
//   if (!value) return value;
//   return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value));
// };

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting = { month: 'short', day: 'numeric' };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' };
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value));
};

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData');

export const getUserData = () => JSON.parse(localStorage.getItem('userData'));

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} role Role of user
 */
export const getHomeRouteForLoggedInUser = (role) => {
  if (role === 'admin') return '/';
  if (role === 'client') return '/access-control';
  return '/login';
};

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed', // for input hover border-color
  },
});

export const selectThemeColors2 = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#82868b', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#82868b', // for input border-color
    neutral30: '#82868b', // for input hover border-color
  },
});
