const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderStatuses = [
  { id: 1, name: 'Proceed', color: 'light-info', hex_color: '#00cfe8' },
  { id: 2, name: 'Shipped', color: 'light-warning', hex_color: '#ff9f43' },
  { id: 3, name: 'Completed', color: 'light-success', hex_color: '#28c76f' },
  { id: 4, name: 'Cancelled', color: 'light-danger', hex_color: '#ea5455' },
];

const statusesIds = orderStatuses.map((s) => s.id);

const orderSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    customer: new Schema({
      fullName: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phoneNumber: String,
      moreInfos: {
        city: String,
        country: String,
        address: String,
        postalCode: Number,
      },
    }),
    products: {
      type: [
        new Schema({
          name: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          color: String,
          quantity: Number,
        }),
      ],
      validate: (p) => Array.isArray(p) && p.length > 0,
      message: 'Products field is required',
    },
    status: {
      type: String,
      required: true,
      validate: {
        validator: function (status) {
          if (!statusesIds.some((id) => id == status)) {
            return false;
          }
          return true;
        },
        message: 'Invalid status value',
      },
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

// const ordersSchema = new Schema({
//   allOrders: [allOrderSchema],
//   counter: Number,
// });

const Order = mongoose.model('Orders', orderSchema);

module.exports = { Order, orderStatuses };
