const _ = require('lodash');
const { User, rolesId } = require('../models/user');
const Slide = require('../models/slide');
const { Order } = require('../models/order');
const Customer = require('../models/customer');
const { Post, postCategories } = require('../models/post');
const { Product, productCategories } = require('../models/product');
const objectId = require('mongodb').ObjectId;
const userPolicies = require('../policies/userPolicies');
const postPolicies = require('../policies/postPolicies');

const getDashboardData = async (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  // ** Get Statistics
  const homepageData = {};
  const stats = {};
  const { maintainerId, adminId, superAdminId } = rolesId;
  const filter = { deletedAt: null };

  if (req.user.role === maintainerId) {
    filter.$and = [
      { role: { $ne: superAdminId } },
      { role: { $ne: adminId } },
      { role: { $ne: maintainerId } },
    ];
  }

  if (req.user.role === adminId) {
    filter.$and = [{ role: { $ne: superAdminId } }, { role: { $ne: adminId } }];
  }

  stats.usersCount = await User.find(filter).count().exec();
  stats.postsCount = await Post.find({ deletedAt: null }).count().exec();
  stats.productsCount = await Product.find({ deletedAt: null }).count().exec();
  stats.customersCount = await Customer.find({ deletedAt: null })
    .count()
    .exec();

  await Order.aggregate([
    { $match: { deletedAt: null } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    // { $addFields: { id: '$_id' } },
    { $sort: { _id: 1 } },
    { $set: { id: '$_id' } },
    { $unset: '_id' },
  ])
    .then((result) => {
      stats.ordersCount = result.reduce(
        (accumulator, status) => accumulator + status.count,
        0
      );
      homepageData.orderStatusCount = result;
    })
    .catch((err) => next(err));
  homepageData.stats = stats;
  res.status(200).send(homepageData);
};

const getPostsStats = async (req, res, next) => {
  if (!postPolicies.authorize(req.user)) return res.sendStatus(403);
  // ** Get Statistics
  const postsStats = {};
  const { authorId } = rolesId;
  const filter = {};

  if (req.user.role === authorId) filter.author = req.user.id;

  const posts = await Post.find(filter).exec();
  if (posts.length) {
    postsStats.postsCount = posts.length;
    postsStats.publishedPosts = posts.filter(
      (post) => post.status == true && post.deletedAt == null
    ).length;
    postsStats.draftedPosts = posts.filter(
      (post) => post.status == false && post.deletedAt == null
    ).length;
    postsStats.deletedPosts = posts.filter(
      (post) => post.deletedAt != null
    ).length;
  }

  res.status(200).send(postsStats);
};

const getModazHomepageData = async (req, res, next) => {
  try {
    // Get All Carousel Sliders
    const slides = await Slide.find({ status: true }).sort({ order: 1 }).exec();
    // Get New Products (limit 4)
    const newProducts = await Product.aggregate([
      { $match: { deletedAt: null } },
      { $sort: { _id: -1 } },
      { $limit: 4 },
      {
        $project: {
          name: 1,
          price: 1,
          image: { $arrayElemAt: ['$images', 0] },
          colors: '$moreInfos.colors',
        },
      },
    ]).exec();
    // Get Best Selling Products
    let bestSellingProducts = await Product.aggregate([
      { $match: { deletedAt: null } },
      { $sort: { 'moreInfos.rating': -1 } },
      { $limit: 8 },
      {
        $project: {
          name: 1,
          price: 1,
          image: { $arrayElemAt: ['$images', 0] },
          rating: '$moreInfos.rating',
          colors: '$moreInfos.colors',
        },
      },
    ]).exec();
    // Get Best Selling Clothing
    const clothingCategory = productCategories.find(
      (c) => c.name === 'Clothing'
    );
    const bestSellingClothing = await Product.aggregate([
      {
        $match: { deletedAt: null, categories: clothingCategory.id.toString() },
      },
      { $sort: { 'moreInfos.rating': -1 } },
      { $limit: 4 },
      {
        $project: {
          name: 1,
          price: 1,
          image: { $arrayElemAt: ['$images', 0] },
          rating: '$moreInfos.rating',
          colors: '$moreInfos.colors',
        },
      },
    ]).exec();
    // Get Best Selling Shoes
    const shoesCategory = productCategories.find((c) => c.name === 'Shoes');
    const bestSellingShoes = await Product.aggregate([
      { $match: { deletedAt: null, categories: shoesCategory.id.toString() } },
      { $sort: { 'moreInfos.rating': -1 } },
      { $limit: 4 },
      {
        $project: {
          name: 1,
          price: 1,
          image: { $arrayElemAt: ['$images', 0] },
          rating: '$moreInfos.rating',
          colors: '$moreInfos.colors',
        },
      },
    ]).exec();
    // Get Best Selling Sportswear
    const sportswearCategory = productCategories.find(
      (c) => c.name === 'Sportswear'
    );
    const bestSellingSportswear = await Product.aggregate([
      {
        $match: {
          deletedAt: null,
          categories: sportswearCategory.id.toString(),
        },
      },
      { $sort: { 'moreInfos.rating': -1 } },
      { $limit: 4 },
      {
        $project: {
          name: 1,
          price: 1,
          image: { $arrayElemAt: ['$images', 0] },
          rating: '$moreInfos.rating',
          colors: '$moreInfos.colors',
        },
      },
    ]).exec();
    // Get Best Selling Acessories
    const AcessoriesCategories = productCategories.filter(
      (c) =>
        c.name === 'Acessories' ||
        c.name === 'Handbags' ||
        c.name === 'Jewelry' ||
        c.name === 'Watches'
    );
    const AcessoriesIds = AcessoriesCategories.map((c) => c.id.toString());
    const bestSellingAcessories = await Product.aggregate([
      { $match: { deletedAt: null, categories: { $in: AcessoriesIds } } },
      { $sort: { 'moreInfos.rating': -1 } },
      { $limit: 4 },
      {
        $project: {
          name: 1,
          price: 1,
          image: { $arrayElemAt: ['$images', 0] },
          rating: '$moreInfos.rating',
          colors: '$moreInfos.colors',
        },
      },
    ]).exec();

    // Get Latest Posts (limit 3)
    const posts = await Post.find(
      { deletedAt: null },
      { title: 1, author: 1, image: 1, createdAt: 1 }
    )
      .populate('author', { fullName: 1, avatar: 1 })
      .sort({ $natural: -1 })
      .limit(6)
      .exec();

    req.body.carousel = slides;
    req.body.newProducts = newProducts;
    req.body.posts = posts;
    req.body.bestSellingProducts = bestSellingProducts.concat(
      bestSellingClothing,
      bestSellingShoes,
      bestSellingSportswear,
      bestSellingAcessories
    );
    next();
  } catch (error) {
    next(error);
  }
};

const getModazProducts = async (req, res, next) => {
  let {
    textSearch,
    selectedPriceRange,
    selectedCategories,
    selectedGender,
    inCollection = false,
    perPage = 9,
    currentPage = 1,
    sortBy = 'newest',
  } = req.query;
  currentPage = parseInt(currentPage);
  perPage = parseInt(perPage);
  // Filter
  const filter = { deletedAt: null };
  // Filter product in collection
  if (inCollection == 'true') filter.inCollection = true;
  // Filter by Gender
  if (selectedGender === 'men') filter.gender = { $ne: 'women' };
  else if (selectedGender === 'women') filter.gender = { $ne: 'men' };
  // Filter by Categories
  if (selectedCategories) {
    selectedCategories = selectedCategories.toLocaleLowerCase().split(',');
    let categoriesIds = productCategories.filter((c) =>
      selectedCategories.includes(c.name.toLocaleLowerCase())
    );
    categoriesIds = categoriesIds.map((c) => c.id.toString());
    filter.categories = { $in: categoriesIds };
  }
  // Filter by price range
  if (selectedPriceRange) {
    const range = selectedPriceRange.split(',');
    if (range[0]) filter.price = { $gt: +range[0] };
    if (range[1]) filter.price['$lt'] = +range[1];
  }
  // Filter by textSearch
  if (textSearch) {
    const text = textSearch.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    filter.name = { $regex: text, $options: 'i' };
  }
  // Determine Sort Field & Order
  let sortOrder = -1; // descending order
  const sortField = (() => {
    if (sortBy === 'latest') {
      sortOrder = 1;
      return '_id';
    }
    if (sortBy === 'price-asc') {
      sortOrder = 1;
      return 'price';
    }
    if (sortBy === 'rating-down') {
      sortOrder = 1;
      return 'moreInfos.rating';
    }
    if (sortBy === 'price-desc') return 'price';
    if (sortBy === 'rating-up') return 'moreInfos.rating';
    return '_id';
  })();

  Product.aggregate([
    { $match: filter },
    { $sort: { [sortField]: sortOrder } },
    {
      $project: {
        name: 1,
        price: 1,
        rating: '$moreInfos.rating',
        colors: '$moreInfos.colors',
        image: { $arrayElemAt: ['$images', 0] },
      },
    },
  ])
    .then((result) => {
      const totalProduct = result.length;
      const totalPage = Math.ceil(totalProduct / perPage) || 1;
      const products = result.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
      );

      req.shopData = {
        sortBy,
        perPage,
        products,
        totalPage,
        textSearch,
        currentPage,
        totalProduct,
        selectedGender: selectedGender || '',
        inCollection: inCollection || false,
        selectedPriceRange: selectedPriceRange || '0',
        selectedCategories: selectedCategories || [],
      };
      next();
    })
    .catch((err) => next(err));
};

const getModazProductDetails = (req, res, next) => {
  Product.findOne({ deletedAt: null, _id: req.params.id })
    .then(async (product) => {
      req.productDetails = product.toObject();
      req.productDetails.categories = productCategories.filter((c) =>
        req.productDetails.categories.some((el) => el == c.id)
      );
      req.shoppingDetails = _.pick(req.productDetails, [
        '_id',
        'name',
        'price',
      ]);
      req.shoppingDetails.image = req.productDetails.images[0];
      req.shoppingDetails.rating = req.productDetails.moreInfos.rating;
      req.shoppingDetails.colors = req.productDetails.moreInfos.colors;
      // Get Related Products (limit 4)
      req.relatedProducts = await Product.aggregate([
        {
          $match: {
            $and: [
              { deletedAt: null },
              { _id: { $ne: product._id } },
              { gender: req.productDetails.gender },
              { categories: { $in: product.categories } },
            ],
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 4 },
        {
          $project: {
            name: 1,
            price: 1,
            rating: '$moreInfos.rating',
            colors: '$moreInfos.colors',
            image: { $arrayElemAt: ['$images', 0] },
          },
        },
      ]).exec();
      next();
    })
    .catch((err) => res.redirect('/shop'));
};

const getModazBlogPosts = async (req, res, next) => {
  let {
    textSearch = '',
    perPage = 3,
    currentPage = 1,
    sortBy = 'newest',
    selectedCategory = '',
  } = req.query;
  currentPage = parseInt(currentPage);
  perPage = parseInt(perPage);
  // Filter
  const filter = { deletedAt: null, status: true };
  // Filter by selected categories
  if (selectedCategory) {
    filter.categories = selectedCategory;
  }
  // Filter by searched text
  if (textSearch) {
    const text = textSearch.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    filter.title = { $regex: text, $options: 'i' };
  }
  // Determine Sort Order
  let sortOrder = sortBy === 'latest' ? 1 : -1;

  Post.find(filter, { __v: 0, status: 0 })
    .populate('author', { fullName: 1 })
    .sort({ _id: sortOrder })
    .then(async (result) => {
      const totalPost = result.length;
      const totalPage = Math.ceil(totalPost / perPage) || 1;
      const posts = result.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
      );
      // Get Most Readed Posts (6)
      const popularPosts = await Post.find(
        { deletedAt: null, status: true },
        { title: 1, image: 1, createdAt: 1 }
      )
        .sort({ readCount: -1 })
        .limit(6)
        .exec();

      req.blogData = {
        posts,
        sortBy,
        perPage,
        textSearch,
        totalPost,
        totalPage,
        currentPage,
        popularPosts,
        selectedCategory,
      };
      next();
    })
    .catch((err) => next(err));
};

const getModazBlogPostDetails = (req, res, next) => {
  Post.findOneAndUpdate(
    { _id: req.params.id, status: true },
    { $inc: { readCount: 0.5 } },
    {
      projection: { __v: 0, status: 0, text: 0 },
      returnOriginal: true,
    }
  )
    .populate('author', { fullName: 1 })
    .then(async (post) => {
      req.postDetails = post.toObject();
      req.postDetails.categories = postCategories.filter((p) =>
        req.postDetails.categories.some((el) => el == p.id)
      );
      // Get Latest Posts (4)
      req.latestPosts = await Post.find(
        { status: true },
        { title: 1, image: 1, createdAt: 1 }
      )
        .sort({ $natural: -1 })
        .limit(4)
        .exec();
      // Get Related Posts (4)
      req.relatedPosts = await Post.aggregate([
        {
          $match: {
            $and: [
              { status: true },
              { _id: { $ne: post._id } },
              { categories: { $in: post.categories } },
            ],
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 4 },
        { $project: { title: 1, image: 1, createdAt: 1 } },
      ]).exec();

      next();
    })
    .catch((err) => next(err));
};

const get_modaz_cart_Ceckout = async (req, res, next) => {
  const customer = await Customer.findOne({ _id: req.body.customerId });
  if (!customer) return next();
  const items = {};
  const idArray = [];
  req.body.shoppingCart.forEach((item) => {
    items[item.product._id] = { color: item.color, qty: item.qty };
    idArray.push(objectId(item.product._id));
  });

  const products = await Product.aggregate([
    { $match: { _id: { $in: idArray } } },
    {
      $project: {
        name: 1,
        price: 1,
        inStock: '$quantity',
        brand: '$moreInfos.brand',
        color: '$moreInfos.colors',
        image: { $arrayElemAt: ['$images', 0] },
      },
    },
  ]).exec();
  // Update Order Informations
  products.forEach((prod) => {
    // Check if number of odered product is avaible
    prod.inStock = prod.inStock >= items[prod._id].qty;
    // Check if odered color is avaible
    if (prod.color) {
      const index = prod.color.indexOf(items[prod._id].color);
      prod.color = prod.color[index] || prod.color[0];
    }
  });

  req.customerId = customer._id;
  req.products = products;
  next();
};

module.exports = {
  getPostsStats,
  getDashboardData,
  getModazHomepageData,
  getModazProducts,
  getModazProductDetails,
  getModazBlogPosts,
  getModazBlogPostDetails,
  // get_modaz_cart_Ceckout,
};
