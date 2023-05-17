const _ = require('lodash');
const { Post, postCategories } = require('../models/post');
const { deleteFromGoogleDrive } = require('../utils/googleDriveFileHandler');
const postPolicies = require('../policies/postPolicies');
const { rolesId } = require('../models/user');
const {
  postResourceArray,
  postResource,
} = require('../resources/postResource');

const getCategories = (req, res) => {
  if (!postPolicies.authorize(req.user)) return res.sendStatus(403);
  res.status(200).send(postCategories);
};

const getPosts = (req, res, next) => {
  if (!postPolicies.authorize(req.user)) return res.sendStatus(403);
  let {
    q = '',
    page = 1,
    perPage = 6,
    status = null,
    sortBy = 'newest',
    categories = [],
  } = req.query;
  page = parseInt(page);
  perPage = parseInt(perPage);
  // Filter Object
  const filter = {};
  if (req.user.role == rolesId.authorId) filter.author = req.user.id;
  // Filter by trashed or not
  const trash = req.query.trash == 'true' ? true : false;
  filter.deletedAt = trash ? { $ne: null } : { $eq: null };
  // Filter by Status
  if (status == 'true') filter.status = true;
  if (status == 'false') filter.status = false;
  // Filter by Categories
  if (categories.length) filter.categories = { $in: categories };
  // Filter by Search Term
  if (q) {
    const text = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    filter.title = { $regex: text, $options: 'i' };
  }
  // Sorting By an Order
  let sortOrder = -1; // descending order
  const sortField = (() => {
    if (sortBy === 'mostReaded') {
      sortOrder = -1;
      return 'readCount';
    }
    if (sortBy === 'leastReaded') {
      sortOrder = 1;
      return 'readCount';
    }
    if (sortBy === 'oldest') sortOrder = 1;
    return '_id';
  })();
  // Find Posts by filter and sort result
  Post.find(filter)
    .select('-__v') // exclude fields
    .populate('author', {
      password: 0,
      __v: 0,
    })
    .sort({ [sortField]: sortOrder })
    .then((result) => {
      const params = {
        q: q,
        page: page,
        trash: trash,
        sortBy: sortBy,
        status: status,
        perPage: perPage,
        categories: categories,
      };
      res.status(200).send(postResourceArray(result, params));
    })
    .catch((err) => next(err));
};

const getPost = (req, res, next) => {
  if (!postPolicies.authorizeGetPost(req.user)) return res.sendStatus(403);
  Post.findOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).send(postResource(result));
    })
    .catch((err) => next(err));
};

const create = async (req, res, next) => {
  if (!postPolicies.authorize(req.user)) return res.sendStatus(403);
  if (!req.body.status) req.body.status = true;
  req.body.readCount = 0;
  req.body.deletedAt = null;
  const post = new Post(req.body);
  post
    .save()
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      next(err);
    });
};

const update = async (req, res, next) => {
  if (!postPolicies.authorizeGetPost(req.user, req.body.author)) {
    return res.sendStatus(403);
  }
  Post.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
    .then((result) => {
      res.status(200).send(result);
      if (!req.deletePreviousImg) return;
      deleteFromGoogleDrive(result.image);
    })
    .catch((err) => next(err));
};

const destroy = (req, res, next) => {
  const { ids = [], authorIds = [] } = req.body;
  if (!Array.isArray(ids) || !Array.isArray(authorIds)) {
    return res.sendStatus(422);
  }
  authorIds.forEach((authorId) => {
    if (!postPolicies.authorizeGetPost(req.user, authorId)) {
      return res.sendStatus(403);
    }
  });
  Post.updateMany(
    { _id: { $in: ids } },
    { $set: { deletedAt: Date.now(), status: false } }
  )
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => next(err));
};

const restore = (req, res, next) => {
  const { ids = [], authorIds = [] } = req.body;
  if (!Array.isArray(ids) || !Array.isArray(authorIds)) {
    return res.sendStatus(422);
  }
  authorIds.forEach((authorId) => {
    if (!postPolicies.authorize(req.user, authorId)) {
      return res.sendStatus(403);
    }
  });
  Post.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => next(err));
};

const forceDelete = (req, res, next) => {
  const { ids = [], authorIds = [], imgUrls = [] } = req.body;
  if (
    !Array.isArray(ids) ||
    !Array.isArray(authorIds) ||
    !Array.isArray(imgUrls)
  ) {
    return res.sendStatus(422);
  }
  authorIds.forEach((authorId) => {
    if (!postPolicies.authorizeGetPost(req.user, authorId)) {
      return res.sendStatus(403);
    }
  });
  Post.deleteMany({ _id: { $in: ids } })
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
  getPost,
  restore,
  destroy,
  getPosts,
  forceDelete,
  getCategories,
};
