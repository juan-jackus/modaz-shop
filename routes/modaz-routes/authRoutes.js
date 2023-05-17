const express = require('express');
const router = express.Router();
const Customer = require('../../models/customer');
const usersController = require('../../controllers/usersController');
const addCustomerSchema = require('../../utils/Schema/customer/addCustomerSchema');
const schemaValidationResult = require('../../utils/Schema/schemaValidationResult');

// Login
router.post('/login', usersController.login);

// Register Page
router.get('/register', (req, res) => {
  const active = 'home';
  const title = 'Registration - ' + req.app.locals.appName;
  res.render('register', { active, title });
});

// Register
router.post(
  '/register',
  addCustomerSchema,
  schemaValidationResult,
  usersController.create
);

// Update
// router.post(
//   '/register',
//   addCustomerSchema,
//   schemaValidationResult,
//   usersController.create
// );

// Reset Password
router.get('/reset-password', (req, res) => {
  const active = 'home',
    title = 'Reset Password - ' + req.app.locals.appName,
    values = {},
    errors = {},
    success = false;
  res.render('resetPwd', {
    active,
    title,
    values,
    errors,
    success,
  });
});

// User Profile Page
router.get('/userprofile/:id', (req, res, next) => {
  Customer.findOne({ _id: req.params.id })
    .then((customer) => {
      if (!customer) return res.redirect('/');
      const active = 'user';
      const title = 'User Profile - ' + req.app.locals.appName;
      res.render('user-profile', { active, title, customer });
    })
    .catch((err) => {
      res.redirect('/');
      next(err);
    });
});

// Get Shopping Cart Checkout Items
// router.post(
//   '/cart/checkout',
//   modazController.get_modaz_cart_Ceckout,
//   (req, res) => {
//     res.send(req.products);
//   }
// );

module.exports = router;
