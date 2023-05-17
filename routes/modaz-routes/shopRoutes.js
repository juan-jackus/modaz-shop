const express = require('express');
const router = express.Router();
const modazController = require('../../controllers/modazController');
const paginationHandler = require('../../utils/paginationHandler');
const { productCategories } = require('../../models/product');
// Products Categories Filter
const allCategories = productCategories.map((cat) => {
  return { value: cat.name.toLocaleLowerCase(), label: cat.name };
});
// Products Price Range Filter
const allPriceRange = [
  { value: '0', label: 'All' },
  { value: '0,25', label: 'under $25' },
  { value: '25,150', label: '$25 - $150' },
  { value: '150,500', label: '$150 - $500' },
  { value: '500,1000', label: '$500 - $1000' },
  { value: '1000', label: 'above $1000' },
];
// "/Shop" Route
router.get('/', modazController.getModazProducts, (req, res) => {
  const { totalPage, currentPage } = req.shopData;
  const pageToShow = 5;
  req.shopData.pagination = paginationHandler(
    totalPage,
    currentPage,
    pageToShow
  );
  const active = 'shop';
  const title = 'Shop - ' + req.app.locals.appName;
  res.render('shop', {
    active,
    title,
    allCategories,
    allPriceRange,
    ...req.shopData,
  });
});
// "/shop/product-details/:id" Route
router.get(
  '/product-details/:id',
  modazController.getModazProductDetails,
  (req, res) => {
    const active = 'shop';
    const title = req.productDetails.name + ' - ' + req.app.locals.appName;
    res.render('product-details', {
      active,
      title,
      productDetails: req.productDetails,
      shoppingDetails: req.shoppingDetails,
      relatedProducts: req.relatedProducts,
    });
  }
);

module.exports = router;
