const { roles } = require('../models/user');
//
function userResourceArray(user, params) {
  const { perPage, page } = params;
  const totalData = user.length || 0;
  const totalPages = Math.ceil(totalData / perPage) || 1;
  const paginatedData = user.slice((page - 1) * perPage, page * perPage);
  const meta = {
    current_page: page,
    last_page: totalPages,
    per_page: perPage,
    total: totalData,
    params,
  };

  const data = [];
  paginatedData.forEach((user, i) => {
    const role = roles.find((role) => role.id == user.role);
    const uid = `#-${i + user._id.toString()}`.substring(0, 7);
    data.push({
      uid,
      id: user._id,
      role: role.name,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      birthdate: user.birthdate,
      avatar: user.avatar,
      moreInfos: user.moreInfos,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      deleted_at: user.deletedAt,
    });
  });

  return { data, meta };
}

function userResource(user) {
  const role = roles.find((role) => role.id == user.role);
  const data = {
    id: user._id,
    role: role.name,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    birthdate: user.birthdate,
    avatar: user.avatar,
    moreInfos: user.moreInfos,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    deleted_at: user.deletedAt,
  };

  return data;
}

module.exports = { userResourceArray, userResource };
