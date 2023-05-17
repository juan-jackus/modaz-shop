const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slidesSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text1: String,
    text2: String,
    text3: String,
    position: String,
    textColor: String,
    category: {
      type: String,
      required: true,
    },
    link: String,
    linkText: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    order: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Slide = mongoose.model('slides', slidesSchema);

module.exports = Slide;
