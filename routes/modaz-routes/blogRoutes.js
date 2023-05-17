const express = require('express');
const router = express.Router();
const modazController = require('../../controllers/modazController');
const paginationHandler = require('../../utils/paginationHandler');
const { postCategories } = require('../../models/post');
// Products Categories Filter
const allCategories = postCategories.map((cat) => {
  return { value: cat.id, label: cat.name };
});
// "/blog" Route
router.get('/', modazController.getModazBlogPosts, (req, res) => {
  const { totalPage, currentPage } = req.blogData;
  const pageToShow = 5;
  req.blogData.pagination = paginationHandler(
    totalPage,
    currentPage,
    pageToShow
  );
  const active = 'blog';
  const title = 'Blog - ' + req.app.locals.appName;
  res.render('blog', { active, title, allCategories, ...req.blogData });
});
// "blog/articles/:id" Route
router.get(
  '/articles/:id',
  modazController.getModazBlogPostDetails,
  (req, res) => {
    const active = 'blog';
    const title = req.postDetails.title + ' - ' + req.app.locals.appName;
    res.render('blogPost-details', {
      active,
      title,
      postDetails: req.postDetails,
      relatedPosts: req.relatedPosts,
      latestPosts: req.latestPosts,
    });
  }
);

module.exports = router;
