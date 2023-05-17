const express = require('express');
const router = express.Router();
require('dotenv').config();
// Multer
const multer = require('multer');
const { fileStorage, fileFilter } = require('../../utils/multerConfig');
// Upload Image Handlers
const {
  avatarImgResizer,
  productImgResizer,
  carouselPostImgResizer,
} = require('../../utils/imageResizer');
// Controllers
const postsController = require('../../controllers/postsController');
const modazController = require('../../controllers/modazController');
const usersController = require('../../controllers/usersController');
const ordersController = require('../../controllers/ordersController');
const productsController = require('../../controllers/productsController');
const slidesController = require('../../controllers/slidesController');
// Schema
const addUserSchema = require('../../utils/Schema/user/addUserSchema');
const updateUserSchema = require('../../utils/Schema/user/updateUserSchema');
const schemaValidationResult = require('../../utils/Schema/schemaValidationResult');
const isAuthenticated = require('../../utils/isAuthenticated');

const fileUploadHandler = multer({
  storage: fileStorage,
  fileFilter,
  limits: { fileSize: 1300000 }, // 1.3mb
});

const carouselFileUploadHandler = multer({
  storage: fileStorage,
  fileFilter,
  limits: { fileSize: 10000000 }, // 10mb
});

const productFileUploadHandler = multer({
  storage: fileStorage,
  fileFilter,
  // limits: { fileSize: 333000 },
});

// ******************************************
// ********** DASHBOARD API ROUTES **********
// ******************************************

//********** AUTH PAGES ROUTES **********
router.post(
  '/login/verify-token',
  usersController.verifyPasswordToken,
  usersController.resetPasswordTokenResult
);
router.post('/login/forgot-password', usersController.sendPasswordResetEmail);
router.post(
  '/login/reset-password',
  usersController.verifyPasswordToken,
  updateUserSchema,
  schemaValidationResult,
  usersController.resetPassword
);
router.post('/login', usersController.login);
router.post('/logout', usersController.logout);

//********** AUTHENTIFICATION CHECK MIDDLEWARE **********
router.use(isAuthenticated);

//********** HOME PAGE ROUTES **********
router.get('/', modazController.getDashboardData);
router.get('/posts-stats', modazController.getPostsStats);

//********** CAROUSEL ROUTES **********
router.get('/carousel/:id', slidesController.getSlide);
router.get('/carousel', slidesController.getSlides);
router.post(
  '/carousel',
  carouselFileUploadHandler.single('img'),
  carouselPostImgResizer,
  slidesController.create
);
router.patch('/carousel/update-order', slidesController.updateOrder);
router.patch(
  '/carousel/:id',
  carouselFileUploadHandler.single('img'),
  carouselPostImgResizer,
  slidesController.update
);
router.delete('/carousel', slidesController.destroy);

//********** USERS ROUTES **********
router.get('/users/persist-login', usersController.persistLogin);
router.get('/users/roles', usersController.getRoles);
router.get('/users/:id', usersController.getUser);
router.get('/users', usersController.getUsers);
router.post('/users/restore', usersController.restore);
router.post(
  '/users',
  fileUploadHandler.single('avatar'),
  addUserSchema,
  schemaValidationResult,
  avatarImgResizer,
  usersController.create
);
router.patch(
  '/users/pwd/:id',
  updateUserSchema,
  schemaValidationResult,
  usersController.updatePassword
);
router.patch(
  '/users/:id',
  fileUploadHandler.single('avatar'),
  updateUserSchema,
  schemaValidationResult,
  avatarImgResizer,
  usersController.update
);
router.delete('/users/force-delete', usersController.forceDelete);
router.delete('/users', usersController.destroy);

//********** PRODUCT ROUTES **********
router.get('/products/categories', productsController.getCategories);
router.get('/products/:id', productsController.getProduct);
router.get('/products', productsController.getProducts);
router.post('/products/restore', productsController.restore);
router.post(
  '/products',
  productFileUploadHandler.array('productImg', 5),
  productImgResizer,
  productsController.create
);
router.patch(
  '/products/:id',
  productFileUploadHandler.array('productImg', 5),
  productImgResizer,
  productsController.update
);
router.delete('/products/force-delete', productsController.forceDelete);
router.delete('/products', productsController.destroy);

//********** POST ROUTES **********
router.get('/posts/categories', postsController.getCategories);
router.get('/posts/:id', postsController.getPost);
router.get('/posts', postsController.getPosts);
router.post('/posts/restore', postsController.restore);
router.post(
  '/posts',
  carouselFileUploadHandler.single('img'),
  carouselPostImgResizer,
  postsController.create
);
router.patch(
  '/posts/:id',
  carouselFileUploadHandler.single('img'),
  carouselPostImgResizer,
  postsController.update
);
router.delete('/posts/force-delete', postsController.forceDelete);
router.delete('/posts', postsController.destroy);

//********** ORDERS ROUTES **********
router.get('/orders/statuses', ordersController.getStatuses);
router.get('/orders/:id', ordersController.getOrder);
router.get('/orders', ordersController.getOrders);
router.post('/orders/restore', ordersController.restore);
router.post('/orders', ordersController.create);
router.patch('/orders/:id', ordersController.update);
router.delete('/orders/force-delete', ordersController.forceDelete);
router.delete('/orders', ordersController.destroy);

module.exports = router;
