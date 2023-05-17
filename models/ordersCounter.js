const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersCounter = mongoose.model(
  'OrdersCounter',
  new Schema(
    {
      counter: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true }
  )
);

module.exports = OrdersCounter;
