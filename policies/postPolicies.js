const { rolesId } = require('../models/user');

const authorize = (user) => {
  const { maintainerId } = rolesId;
  if (
    Object.values(rolesId).includes(user.role) &&
    user.role !== maintainerId
  ) {
    return true;
  }

  return false;
};

const authorizeGetPost = (user, paramId) => {
  const { editorId, adminId } = rolesId;
  if (user.role >= adminId) return true;
  if (user._id == paramId || user.role == editorId) return true;
  return false;
};

module.exports = {
  authorize,
  authorizeGetPost,
};
