const { rolesId } = require('../models/user');

const authorize = (user) => {
  const { superAdminId, adminId, maintainerId } = rolesId;
  if (
    user.role === superAdminId ||
    user.role === adminId ||
    user.role === maintainerId
  ) {
    return true;
  }

  return false;
};

const authorizeGetUser = (user, paramId) => {
  const { maintainerId } = rolesId;
  if (user.role >= maintainerId || user.id == paramId) {
    return true;
  }
  return false;
};

const authorizeCreateUser = (user, body) => {
  const { superAdminId, maintainerId } = rolesId;
  const { role = null } = body;
  // Customer can be created only by superAdmin, admin or maintainer
  if (user.role === superAdminId) return true;
  if (!role && user.role >= maintainerId) return true;
  // Admin and maintainer can only create a User with role lower than their
  if (role && role < user.role) return true;

  return false;
};

const authorizeUpdateUser = (user, paramId, body) => {
  const { superAdminId, maintainerId } = rolesId;
  const { role = null } = body;
  // Customer can be updated by superAdmin, admin, maintainer and logged in customer
  if (user.role === superAdminId) return true;
  if (!role && (user.role >= maintainerId || user.id == paramId)) {
    return true;
  }
  // Admin and maintainer can only update a User with role lower than their
  if (role && role < user.role) return true;

  return false;
};

const authorizeUpdatePassword = (user, paramId) => {
  if (user.id == paramId) return true;

  return false;
};

const authorizeDelete = (user, ids) => {
  const { maintainerId } = rolesId;
  if (user.role >= maintainerId && !ids.includes(user.id)) {
    return true;
  }
  return false;
};

module.exports = {
  authorize,
  authorizeDelete,
  authorizeGetUser,
  authorizeCreateUser,
  authorizeUpdateUser,
  authorizeUpdatePassword,
};
