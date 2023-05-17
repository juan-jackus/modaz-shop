const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postCategories = [
  {
    id: 1,
    name: 'People',
    color: 'light-info',
    icon: 'Award',
  },
  {
    id: 2,
    name: 'Fashion',
    color: 'light-primary',
    icon: 'Scissors',
  },
  {
    id: 3,
    name: 'Music',
    color: 'light-danger',
    icon: 'Headphones',
  },
  {
    id: 4,
    name: 'Movies',
    color: 'light-warning',
    icon: 'Video',
  },
  {
    id: 5,
    name: 'Sports',
    color: 'light-secondary',
    icon: 'Dribbble',
  },
  {
    id: 6,
    name: 'Tech',
    color: 'light-success',
    icon: 'Monitor',
  },
];

const categoriesIds = postCategories.map((c) => c.id);

const postSchema = new Schema(
  {
    image: String,
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    authorUsername: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      validate: {
        validator: function (categories) {
          if (!Array.isArray(categories) || categories.length <= 0) {
            return false;
          }
          let success = true;
          categories.forEach((category) => {
            if (!categoriesIds.some((id) => id == category)) {
              success = false;
              return false;
            }
          });
          return success;
        },
        message: 'Invalid categories values',
      },
    },
    status: {
      type: Boolean,
      required: true,
    },
    htmlText: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    meta: String,
    readCount: Number,
    deletedAt: Date,
  },
  { timestamps: true }
);

const Post = mongoose.model('posts', postSchema);

module.exports = { Post, postCategories };
