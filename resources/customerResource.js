//
function customerResourceArray(customer, params) {
  const { perPage, page } = params;
  const totalData = customer.length || 0;
  const totalPages = Math.ceil(totalData / perPage) || 1;
  const paginatedData = customer.slice((page - 1) * perPage, page * perPage);
  const meta = {
    current_page: page,
    last_page: totalPages,
    per_page: perPage,
    total: totalData,
    params,
  };

  const data = [];
  paginatedData.forEach((customer, i) => {
    const uid = `#-${i + customer._id.toString()}`.substring(0, 7);
    data.push({
      uid,
      id: customer._id,
      fullName: customer.fullName,
      username: customer.username,
      email: customer.email,
      gender: customer.gender,
      phoneNumber: customer.phoneNumber,
      birthdate: customer.birthdate,
      avatar: customer.avatar,
      moreInfos: customer.moreInfos,
      created_at: customer.createdAt,
      updated_at: customer.updatedAt,
      deleted_at: customer.deletedAt,
    });
  });

  return { data, meta };
}

function customerResource(customer) {
  const data = {
    id: customer._id,
    fullName: customer.fullName,
    username: customer.username,
    email: customer.email,
    gender: customer.gender,
    phoneNumber: customer.phoneNumber,
    birthdate: customer.birthdate,
    avatar: customer.avatar,
    moreInfos: customer.moreInfos,
    created_at: customer.createdAt,
    updated_at: customer.updatedAt,
    deleted_at: customer.deletedAt,
  };

  return data;
}

module.exports = { customerResourceArray, customerResource };
