const _ = require('lodash');
const { Product, productCategories } = require('../models/product');
const { deleteFromGoogleDrive } = require('../utils/googleDriveFileHandler');
const userPolicies = require('../policies/userPolicies');
const {
  productResourceArray,
  productResource,
} = require('../resources/productResource');

const getCategories = (req, res) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  res.status(200).send(productCategories);
};

const getProducts = (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  let {
    q = '',
    page = 1,
    perPage = 9,
    gender = '',
    sortBy = 'newest',
    categories = [],
    priceRange = [-Infinity, Infinity],
  } = req.query;
  page = parseInt(page);
  perPage = parseInt(perPage);
  // Filter Object
  const filter = {};
  // Filter by trashed or not
  const trash = req.query.trash == 'true' ? true : false;
  filter.deletedAt = trash ? { $ne: null } : { $eq: null };
  // Filter product in collection
  const inCollection = req.query.inCollection == 'true' ? true : false;
  if (inCollection) filter.inCollection = true;
  // Filter by product gender
  if (gender === 'men') filter.gender = { $ne: 'women' };
  else if (gender === 'women') filter.gender = { $ne: 'men' };
  // Filter by freeShipping
  const freeShipping = req.query.freeShipping == 'true' ? true : false;
  if (freeShipping) filter['moreInfos.freeShipping'] = true;
  // Filter by categories
  if (categories.length) filter.categories = { $in: categories };
  // Filter by Price Range
  if (!Array.isArray(priceRange)) priceRange = priceRange.split(',');
  if (priceRange[0]) filter.price = { $gt: +priceRange[0] };
  if (priceRange[1]) filter.price['$lt'] = +priceRange[1];
  // Filter by Search Term
  if (q) {
    const text = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    filter.name = { $regex: text, $options: 'i' };
  }
  // Sorting By an Order
  let sortOrder = -1; // descending order
  const sortedField = (() => {
    if (sortBy === 'oldest') {
      sortOrder = 1;
      return '_id';
    }
    if (sortBy === 'price_asc') {
      sortOrder = 1;
      return 'price';
    }
    if (sortBy === 'rating_asc') {
      sortOrder = 1;
      return 'moreInfos.rating';
    }
    if (sortBy === 'trash_asc') {
      sortOrder = 1;
      return 'deletedAt';
    }
    if (sortBy === 'price_desc') return 'price';
    if (sortBy === 'rating_desc') return 'moreInfos.rating';
    if (sortBy === 'trash_desc') return 'deletedAt';
    return '_id';
  })();
  // Find Products by filter and sort result
  Product.find(filter)
    .select('-__v') // exclude fields
    .sort({ [sortedField]: sortOrder })
    .then((result) => {
      const params = {
        q: q,
        page: page,
        trash: trash,
        sortBy: sortBy,
        gender: gender,
        perPage: perPage,
        priceRange: priceRange.join(','),
        categories: categories,
        inCollection: inCollection,
        freeShipping: freeShipping,
      };
      res.status(200).send(productResourceArray(result, params));
    })
    .catch((err) => next(err));
};

const getProduct = (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  Product.findOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).send(productResource(result));
    })
    .catch((err) => next(err));
};

const create = async (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  req.body.inCollection = req.body.inCollection === 'true' ? true : false;
  req.body.moreInfos.freeShipping =
    req.body.moreInfos.freeShipping === 'true' ? true : false;
  if (req.body.gender != 'men' && req.body.gender != 'women') {
    req.body.gender = null;
  }
  req.body.deletedAt = null;
  const product = new Product(req.body);
  product
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      next(err);
      req.body.images.forEach((imgUrl) => {
        deleteFromGoogleDrive(imgUrl);
      });
    });
};

const update = async (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  req.body.inCollection = req.body.inCollection === 'true' ? true : false;
  req.body.moreInfos.freeShipping =
    req.body.moreInfos.freeShipping === 'true' ? true : false;
  const updatedValue = req.body;
  Product.findOneAndUpdate({ _id: req.params.id }, { $set: updatedValue })
    .then((result) => {
      res.status(200).send(result);
      result.images.forEach((imgUrl) => {
        if (!req.body.images.includes(imgUrl)) {
          deleteFromGoogleDrive(imgUrl);
        }
      });
    })
    .catch((err) => next(err));
};

const destroy = (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const { ids = null } = req.body;
  if (!ids || !Array.isArray(ids)) return res.sendStatus(422);
  Product.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: Date.now() } })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => next(err));
};

const restore = (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const { ids = null } = req.body;
  if (!ids || !Array.isArray(ids)) return res.sendStatus(422);
  Product.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => next(err));
};

const forceDelete = (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const { ids = null, imgUrls = [] } = req.body;
  if (!ids || !Array.isArray(ids) || !Array.isArray(imgUrls)) {
    return res.sendStatus(422);
  }
  Product.deleteMany({ _id: { $in: ids } })
    .then((result) => {
      res.status(200).send(result);
      imgUrls.forEach((img) => {
        deleteFromGoogleDrive(img);
      });
    })
    .catch((err) => next(err));
};

module.exports = {
  create,
  update,
  destroy,
  restore,
  getProduct,
  getProducts,
  forceDelete,
  getCategories,
};
