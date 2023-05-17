//
function productResourceArray(result, params) {
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
  paginatedData.forEach((product, i) => {
    const colors = product.moreInfos?.colors
      ? product.moreInfos?.colors.split(',')
      : [];
    const productMoreInfos = {
      freeShipping: product.moreInfos?.freeShipping || false,
      rating: product.moreInfos?.rating || 0,
      description: product.moreInfos?.description || '',
      brand: product.moreInfos?.brand || '',
      colors,
    };
    const uid = `#-${i + product._id.toString()}`.substring(0, 7);

    data.push({
      uid,
      id: product._id,
      images: product.images,
      name: product.name,
      price: product.price,
      gender: product.gender,
      quantity: product.quantity,
      categories: product.categories,
      inCollection: product?.inCollection || false,
      moreInfos: productMoreInfos,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
      deleted_at: product.deletedAt,
    });
  });

  return { data, meta };
}

function productResource(product) {
  const colors = product.moreInfos?.colors
    ? product.moreInfos?.colors.split(',')
    : [];
  const productMoreInfos = {
    freeShipping: product.moreInfos?.freeShipping || false,
    rating: product.moreInfos?.rating || 0,
    description: product.moreInfos?.description || '',
    brand: product.moreInfos?.brand || '',
    colors,
  };
  const data = {
    id: product._id,
    images: product.images,
    name: product.name,
    price: product.price,
    gender: product.gender,
    quantity: product.quantity,
    categories: product.categories,
    inCollection: product?.inCollection || false,
    moreInfos: productMoreInfos,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
    deleted_at: product.deletedAt,
  };

  return data;
}

module.exports = { productResourceArray, productResource };
