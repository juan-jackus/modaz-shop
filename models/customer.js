const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: String,
    gender: String,
    birthdate: Date,
    moreInfos: {
      city: String,
      country: String,
      address: String,
      postalCode: Number,
    },
    resetPwdToken: String,
    resetPwdTokenExp: Date,
    deletedAt: Date,
  },
  { timestamps: true }
);

customerSchema.index({ fullName: 'text' });
const Customer = mongoose.model('customers', customerSchema);
module.exports = Customer;
