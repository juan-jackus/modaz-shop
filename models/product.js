const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productCategories = [
  { id: 1, name: 'Accessories' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Bags' },
  { id: 4, name: 'Jewelry' },
  { id: 5, name: 'Shoes' },
  { id: 6, name: 'Sportswear' },
  { id: 7, name: 'Watches' },
];

const categoriesIds = productCategories.map((c) => c.id);

const productSchema = new Schema(
  {
    images: {
      type: [String],
      validate: (i) => Array.isArray(i) && i.length > 0,
      message: 'Image field is required',
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ['men', 'women', null],
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
    inCollection: Boolean,
    moreInfos: {
      freeShipping: Boolean,
      brand: String,
      colors: String,
      rating: Number,
      description: String,
    },
    deletedAt: Date,
  },
  { timestamps: true },
  { versionKey: false } // Don't include __v field
);

const Product = mongoose.model('products', productSchema);

module.exports = { Product, productSchema, productCategories };
