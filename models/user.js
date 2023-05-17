const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    avatar: String,
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
    phoneNumber: {
      type: String,
      required: true,
    },
    birthdate: Date,
    role: Number,
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

const User = mongoose.model('users', userSchema);

const rolesId = {
  authorId: 1,
  editorId: 2,
  maintainerId: 3,
  adminId: 4,
  superAdminId: 5,
};

const roles = [
  {
    id: rolesId.authorId,
    name: 'Author',
    class: 'text-success',
    icon: 'Edit3',
  },
  { id: rolesId.editorId, name: 'Editor', class: 'text-warning', icon: 'Edit' },
  {
    id: rolesId.maintainerId,
    name: 'Maintainer',
    class: 'text-secondary',
    icon: 'Settings',
  },
  { id: rolesId.adminId, name: 'Admin', class: 'text-primary', icon: 'Slack' },
  {
    id: rolesId.superAdminId,
    name: 'SuperAdmin',
    class: 'text-danger',
    icon: 'Hash',
  },
];
module.exports = { User, roles, rolesId };
