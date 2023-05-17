const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User, roles, rolesId } = require('../models/user');
const userPolicies = require('../policies/userPolicies');
const Customer = require('../models/customer');
const ErrorObject = require('../errors/ErrorObject');
const createHtmlEmail = require('../utils/createHtmlEmail');
const { deleteFromGoogleDrive } = require('../utils/googleDriveFileHandler');
const {
  userResourceArray,
  userResource,
} = require('../resources/userResource');
const {
  customerResourceArray,
  customerResource,
} = require('../resources/customerResource');

const login = async (req, res, next) => {
  const { email, password, rememberMe, model } = req.body;
  const Model = model === 'customer' ? Customer : User;
  const ressource = model === 'customer' ? customerResource : userResource;
  const user = await Model.findOne({ email: email });
  const errorObj = {
    msg: 'Invalid email or password',
    param: 'login',
  };
  if (!user) {
    return next(new ErrorObject(422, 'Login_Error', null, errorObj));
  }
  const validPwd = await bcrypt.compare(password, user.password);
  if (!validPwd) {
    return next(new ErrorObject(422, 'Login_Error', null, errorObj));
  }

  if (model !== 'customer') {
    const accessToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: rememberMe ? '3d' : '1h',
    });

    const expiresIn = rememberMe
      ? 1000 * 60 * 60 * 24 * 3 // expire in 3 days
      : 1000 * 60 * 60; // expire in 1h

    res.cookie('token', accessToken, {
      maxAge: expiresIn,
      httpOnly: true,
      sameSite: 'lax',
      // secure: true,
    });
  }
  res.status(200).send(ressource(user));
};

const persistLogin = async (req, res) => {
  const user = req.user;
  return res.status(200).send(userResource(user));
};

const sendPasswordResetEmail = async (req, res, next) => {
  const { email, model } = req.body;
  const Model = model === 'customer' ? Customer : User;
  const user = await Model.findOne({ email: email });
  if (!user) {
    const errorObj = {
      msg: `This email doesn't exist`,
      param: 'email',
    };
    return next(new ErrorObject(422, 'Login_Error', null, errorObj));
  }

  const { htmlEmail, token } = await createHtmlEmail(req, next);
  user.resetPwdToken = token;
  user.resetPwdTokenExp = Date.now() + 3600000; // current date + 1hour
  user
    .save()
    .then((result) => {
      res.status(201).send(result);
      const transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      transport.sendMail({
        from: process.env.MAIL_FROM,
        to: user.email,
        subject: 'Reset Password',
        html: htmlEmail,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const verifyPasswordToken = async (req, res, next) => {
  const Model = req.body.model === 'customer' ? Customer : User;
  const token = req.body.token || req.params.token;
  const user = await Model.findOne({ resetPwdToken: token });
  const result = {};
  if (!user) {
    result.invalidToken = 'Invalid Token';
  } else if (user.resetPwdTokenExp < Date.now()) {
    result.expiredToken =
      'Reset password link has expired. Please Make another request to reset your password';
  }
  if (!_.isEmpty(result)) return res.status(200).send(result);
  req.body.result = result;
  next();
};

const resetPasswordTokenResult = (req, res) => {
  res.status(200).send(req.body.result);
};

const resetPassword = async (req, res, next) => {
  if (!req.body.password) {
    const errorObj = [
      {
        msg: `Password is required`,
        param: 'password',
      },
    ];
    return next(new ErrorObject(422, 'Update_Error', null, errorObj));
  }
  const Model = req.body.model === 'customer' ? Customer : User;
  const token = req.body.token;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  Model.findOneAndUpdate(
    { resetPwdToken: token },
    {
      $set: { password: hashedPassword },
      $unset: { resetPwdToken: '', resetPwdTokenExp: '' },
    }
  )
    .then(() => {
      res.status(200).send({});
    })
    .catch((err) => next(err));
};

const getRoles = (req, res) => {
  const user = req.user;
  if (!userPolicies.authorize(user)) return res.sendStatus(403);
  const { superAdminId, adminId, maintainerId } = rolesId;
  if (user.role == superAdminId) {
    return res.status(200).send(roles);
  }
  if (user.role == adminId) {
    return res
      .status(200)
      .send(
        roles.filter((role) => role.id != superAdminId && role.id != adminId)
      );
  }
  const filteredRoles = roles.filter(
    (role) =>
      role.id != superAdminId && role.id != adminId && role.id != maintainerId
  );
  res.status(200).send(filteredRoles);
};

const getUsers = (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const {
    q = '',
    perPage = 10,
    page = 1,
    role = null,
    model = null,
    gender = null,
    sortBy = 'id_desc',
  } = req.query;

  const Model = model === 'customer' ? Customer : User;
  const ressource =
    model === 'customer' ? customerResourceArray : userResourceArray;
  const trash = req.query.trash == 'true' ? true : false;

  const authRoleId = req.user.role;
  const { superAdminId, adminId, maintainerId } = rolesId;
  // Filter Object
  const filter = {};
  // Filter by trashed or not
  filter.deletedAt = trash ? { $ne: null } : { $eq: null };
  // If not SuperAdmin, only get Users with role lower than logged user
  if (model !== 'customer') {
    if (authRoleId != superAdminId && authRoleId == adminId) {
      filter.$and = [
        { role: { $ne: superAdminId } },
        { role: { $ne: adminId } },
      ];
    } else if (authRoleId != superAdminId && authRoleId == maintainerId) {
      filter.$and = [
        { role: { $ne: superAdminId } },
        { role: { $ne: adminId } },
        { role: { $ne: maintainerId } },
      ];
    }
    // Filter by Role
    if (role) filter.role = role;
    // Exclude login user
    filter._id = { $ne: req.user._id };
  }
  // Filter by Gender
  if (gender) filter.gender = gender === 'unspecified' ? null : gender;
  // Filter by Search Term
  if (q) {
    const text = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    filter.$or = [
      { fullName: { $regex: text, $options: 'i' } },
      { username: { $regex: text, $options: 'i' } },
    ];
  }
  // Sorting By an Order
  let sortOrder = -1; // descending order
  const sortedField = (() => {
    if (sortBy === 'id_asc') {
      sortOrder = 1;
      return '_id';
    }
    if (sortBy === 'name_asc') {
      sortOrder = 1;
      return 'fullName';
    }
    if (sortBy === 'name_desc') return 'fullName';
    if (sortBy === 'trash_asc') {
      sortOrder = 1;
      return 'deletedAt';
    }
    if (sortBy === 'trash_desc') return 'deletedAt';
    return '_id';
  })();
  // Find Users by filter and sort result
  Model.find(filter)
    .select('-__v -password') // exclude version key and Password
    .sort({ [sortedField]: sortOrder })
    .then((result) => {
      const params = {
        q: q,
        role: role,
        trash: trash,
        page: page,
        perPage: perPage,
        gender: gender,
      };

      res.status(200).send(ressource(result, params));
    })
    .catch((err) => next(err));
};

const getUser = async (req, res) => {
  if (!userPolicies.authorizeGetUser(req.user, req.params.id)) {
    return res.sendStatus(403);
  }
  const { model } = req.query;
  const Model = model === 'customer' ? Customer : User;
  const ressource = model === 'customer' ? customerResource : userResource;
  const user = await Model.findOne({ _id: req.params.id });
  if (!user) return res.sendStatus(404);
  res.status(200).send(ressource(user));
};

const create = async (req, res, next) => {
  if (req.body.model !== 'customer') {
    if (!userPolicies.authorizeCreateUser(req.user, req.body)) {
      return res.sendStatus(403);
    }
  }
  req.body.deletedAt = null;
  const Model = req.body.model === 'customer' ? Customer : User;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const model = new Model({ ...req.body, password: hashedPassword });
  model
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      next(err);
      deleteFromGoogleDrive(req.body.avatar);
    });
};

const update = async (req, res, next) => {
  if (req.body.model !== 'customer') {
    if (!userPolicies.authorizeUpdateUser(req.user, req.params.id, req.body)) {
      return res.sendStatus(403);
    }
  }
  const Model = req.body.model === 'customer' ? Customer : User;
  // Replace empty string value with null
  const updatedValue = JSON.parse(
    JSON.stringify(req.body, (i, value) => {
      if (!value || value === 'null') {
        return null;
      }
      return value;
    })
  );

  if (updatedValue.password) {
    const hashedPassword = await bcrypt.hash(updatedValue.password, 10);
    updatedValue.password = hashedPassword;
  }
  Model.findOneAndUpdate(
    { _id: req.params.id },
    { $set: updatedValue }
    // { returnNewDocument: true }
  )
    .then((result) => {
      res.sendStatus(200);
      if (!req.deletePreviousImg) return;
      deleteFromGoogleDrive(result.avatar);
    })
    .catch((err) => next(err));
};

const updatePassword = async (req, res, next) => {
  if (!userPolicies.authorizeUpdatePassword(req.user, req.params.id)) {
    return res.sendStatus(403);
  }

  if (!req.body.password) {
    const errorObj = [
      {
        msg: `Password is required`,
        param: 'password',
      },
    ];
    return next(new ErrorObject(422, 'Update_Error', null, errorObj));
  }
  if (req.body.oldPassword === req.body.password) {
    const errorObj = [
      {
        msg: `Old and new password are similar`,
        param: 'password',
      },
    ];
    return next(new ErrorObject(422, 'Update_Error', null, errorObj));
  }
  const { password, oldPassword, model = null } = req.body;
  const Model = model === 'customer' ? Customer : User;
  const user = await Model.findOne({ _id: req.params.id });
  if (!user) res.sendStatus(404);
  const checkedPassword = await bcrypt.compare(oldPassword, user.password);
  if (!checkedPassword) {
    const errorObj = [
      {
        msg: `Wrong password`,
        param: 'oldPassword',
      },
    ];
    return next(new ErrorObject(422, 'Update_Error', null, errorObj));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  Model.updateOne(
    { _id: req.params.id },
    { $set: { password: hashedPassword } }
  )
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => next(err));
};

const destroy = (req, res, next) => {
  const { ids = null, model = null } = req.body;
  if (!ids || !Array.isArray(ids)) return res.sendStatus(422);
  if (!userPolicies.authorizeDelete(req.user, ids)) return res.sendStatus(403);
  const Model = model === 'customer' ? Customer : User;
  Model.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: Date.now() } })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => next(err));
};

const restore = (req, res, next) => {
  if (!userPolicies.authorize(req.user)) return res.sendStatus(403);
  const { ids = null, model = null } = req.body;
  if (!ids || !Array.isArray(ids)) return res.sendStatus(422);
  const Model = model === 'customer' ? Customer : User;
  Model.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => next(err));
};

const forceDelete = (req, res, next) => {
  const { ids = null, imgUrls = [], model = null } = req.body;
  if (!ids || !Array.isArray(ids) || !Array.isArray(imgUrls)) {
    return res.sendStatus(422);
  }
  if (!userPolicies.authorizeDelete(req.user, ids)) return res.sendStatus(403);
  const Model = model === 'customer' ? Customer : User;
  Model.deleteMany({ _id: { $in: ids } })
    .then((result) => {
      res.status(200).send(result);
      imgUrls.forEach((url) => deleteFromGoogleDrive(url));
    })
    .catch((err) => next(err));
};

const logout = async (req, res, next) => {
  const Model = req.query.model === 'customer' ? Customer : User;
  const user = await Model.findOne({ _id: req.body.userId });
  res.clearCookie('token');
  if (!user) return res.sendStatus(400);
  res.sendStatus(200);
};

module.exports = {
  login,
  create,
  logout,
  update,
  restore,
  getUser,
  destroy,
  getRoles,
  getUsers,
  forceDelete,
  persistLogin,
  resetPassword,
  updatePassword,
  verifyPasswordToken,
  sendPasswordResetEmail,
  resetPasswordTokenResult,
};
