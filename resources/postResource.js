//
function postResourceArray(result, params) {
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
  paginatedData.forEach((post, i) => {
    const postAuthor = post.author
      ? {
          id: post.author._id,
          avatar: post.author.avatar,
          fullName: post.author.fullName,
          username: post.author.username,
          email: post.author.email,
        }
      : {
          avatar: null,
          username: post.authorUsername,
        };
    const uid = `#-${i + post._id.toString()}`.substring(0, 7);

    data.push({
      uid,
      id: post._id,
      image: post.image,
      title: post.title,
      author: postAuthor,
      status: post.status,
      htmlText: post.htmlText,
      text: post.text,
      readCount: post.readCount,
      categories: post.categories,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      deleted_at: post.deletedAt,
    });
  });

  return { data, meta };
}

function postResource(post) {
  const postAuthor = post.author
    ? {
        id: post.author._id,
        avatar: post.author.avatar,
        fullName: post.author.fullName,
        username: post.author.username,
        email: post.author.email,
      }
    : {
        avatar: null,
        username: post.authorUsername,
      };

  const data = {
    id: post._id,
    image: post.image,
    title: post.title,
    author: postAuthor,
    status: post.status,
    htmlText: post.htmlText,
    text: post.text,
    readCount: post.readCount,
    categories: post.categories,
    created_at: post.createdAt,
    updated_at: post.updatedAt,
    deleted_at: post.deletedAt,
  };

  return data;
}

module.exports = { postResourceArray, postResource };
