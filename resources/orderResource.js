//
function orderResourceArray(result, params) {
  const { perPage, page } = params;
  const totalData = result.length || 0;
  const totalPages = Math.ceil(totalData / perPage) || 1;
  const paginatedData = result.slice((page - 1) * perPage, page * perPage);
  const meta = {
    current_page: page,
    last_page: totalPages,
    per_page: perPage,
    total: totalData,
    params,
  };

  const data = [];
  paginatedData.forEach((order, i) => {
    data.push({
      id: order._id,
      uid: order.uid,
      customer: order.customer,
      products: order.products,
      status: order.status,
      totalPrice: order.totalPrice,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      deleted_at: order.deletedAt,
    });
  });

  return { data, meta };
}

function orderResource(order) {
  const data = {
    id: order._id,
    uid: order.uid,
    customer: order.customer,
    products: order.products,
    status: order.status,
    totalPrice: order.totalPrice,
    created_at: order.createdAt,
    updated_at: order.updatedAt,
    deleted_at: order.deletedAt,
  };

  return data;
}

module.exports = { orderResourceArray, orderResource };
