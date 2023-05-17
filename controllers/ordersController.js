const _ = require('lodash');
const Customer = require('../models/customer');
const { Order, orderStatuses } = require('../models/order');
const OrdersCounter = require('../models/ordersCounter');
const { Product } = require('../models/product');
const userPolicies = require('../policies/userPolicies');
const {
  orderResourceArray,
  orderResource,
} = require('../resources/orderResource');

const getStatuses = (req, res) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  res.status(200).send(orderStatuses);
};

const getOrders = (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const {
    q = '',
    perPage = 10,
    page = 1,
    status = null,
    sortBy = 'id_desc',
  } = req.query;
  const trash = req.query.trash == 'true' ? true : false;
  // Filter Object
  const filter = {};
  // Filter by trashed or not
  filter.deletedAt = trash ? { $ne: null } : { $eq: null };
  // Filter by Order status
  if (status) filter.status = status;
  // Filter by Search Term
  if (q) {
    const text = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    filter.$or = [
      { uid: { $regex: text, $options: 'i' } },
      { 'customer.fullName': { $regex: text, $options: 'i' } },
      { 'customer.username': { $regex: text, $options: 'i' } },
      { 'products.name': { $regex: text, $options: 'i' } },
      { 'products.name': { $regex: text, $options: 'i' } },
    ];
  }
  // Sorting By an Order
  let sortOrder = -1; // descending order
  const sortedField = (() => {
    if (sortBy === 'id_asc') {
      sortOrder = 1;
      return '_id';
    }
    if (sortBy === 'price_asc') {
      sortOrder = 1;
      return 'totalPrice';
    }
    if (sortBy === 'price_desc') return 'totalPrice';
    if (sortBy === 'trash_asc') {
      sortOrder = 1;
      return 'deletedAt';
    }
    if (sortBy === 'trash_desc') return 'deletedAt';
    return '_id';
  })();

  // Find Orders by filter and sort result
  Order.find(filter)
    .select('-__v') // exclude fields
    .sort({ [sortedField]: sortOrder })
    .then((result) => {
      const params = {
        q: q,
        page: page,
        trash: trash,
        sortBy: sortBy,
        status: status,
        perPage: perPage,
      };
      res.status(200).send(orderResourceArray(result, params));
    })
    .catch((err) => next(err));
};

const getOrder = (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  Order.findOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).send(orderResource(result));
    })
    .catch((err) => next(err));
};

const create = async (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const productsIds = req.body.products.map((p) => p.id);
  let count,
    customer,
    products = null;
  // Get Customer, Products & Order Count
  try {
    customer = await Customer.findOne(
      { _id: req.body.customerId, deletedAt: { $eq: null } },
      {
        fullName: 1,
        username: 1,
        email: 1,
        phoneNumber: 1,
        moreInfos: 1,
      }
    ).exec();
    products = await Product.find(
      { _id: { $in: productsIds }, deletedAt: { $eq: null } },
      { name: 1, price: 1, quantity: 1 }
    ).exec();
    const counterData = await OrdersCounter.findOne().exec();
    if (!counterData) count = 1;
    else count = counterData.toObject().counter + 1;
  } catch (err) {
    next(err);
  }
  if (!count || !customer || !products || !products.length) {
    return res.sendStatus(422);
  }

  const orderData = {};
  orderData.deletedAt = null;
  orderData.uid = `Ord-#${count}`;
  orderData.customer = customer;
  orderData.status = '1';
  orderData.products = [];
  orderData.totalPrice = req.body.products.reduce((sum, item) => {
    let totalItemPrice = 0;
    const product = products.find((p) => p._id == item.id);
    if (product && product.quantity > 0) {
      const quantity =
        product.quantity >= item.quantity ? item.quantity : product.quantity;
      totalItemPrice = product.price * quantity;
      product.quantity = quantity;
      if (item.color) product.color = item.color;
      orderData.products.push(product);
    }
    return sum + totalItemPrice;
  }, 0);
  // Add new Order
  const order = new Order(orderData);
  order
    .save()
    .then((result) => {
      res.status(201).send(result);
      OrdersCounter.findOneAndUpdate(
        {},
        { $inc: { counter: 1 } },
        { upsert: true }
      ).exec();
    })
    .catch((err) => {
      next(err);
    });
};

const update = async (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  Order.updateOne(
    { _id: req.params.id },
    {
      $set: { status: req.body.status },
    }
  )
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => next(err));
};

const destroy = (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const { ids = null } = req.body;
  if (!ids || !Array.isArray(ids)) return res.sendStatus(422);
  Order.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: Date.now() } })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => next(err));
};

const restore = (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const { ids = null } = req.body;
  if (!ids || !Array.isArray(ids)) return res.sendStatus(422);
  Order.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => next(err));
};

const forceDelete = (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const { ids = null } = req.body;
  if (!ids || !Array.isArray(ids)) return res.sendStatus(422);
  Order.deleteMany({ _id: { $in: ids } })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => next(err));
};

module.exports = {
  create,
  update,
  restore,
  destroy,
  getOrder,
  getOrders,
  getStatuses,
  forceDelete,
};
