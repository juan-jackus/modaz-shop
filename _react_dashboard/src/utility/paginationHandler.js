/* eslint-disable */
function paginationHandler(totalPage, currentPage, pageToShow = 7) {
  // Numbers of Pagination to show (ood number)}
  const halfOfPageToShow = Math.trunc(pageToShow / 2);
  if (!totalPage || !currentPage) return null;

  const pagination = {
    numbers: [],
    truncateEnd: false,
    truncateStart: false,
  };

  // ********
  if (currentPage - halfOfPageToShow <= 0 && pageToShow <= totalPage) {
    if (pageToShow < totalPage) pagination.truncateEnd = true;
    for (let page = 1; page <= pageToShow; page++) {
      pagination.numbers.push(page);
    }
  }
  // ********
  else if (
    currentPage - halfOfPageToShow > 0 &&
    currentPage + halfOfPageToShow <= totalPage
  ) {
    if (currentPage - halfOfPageToShow > 1) {
      pagination.truncateStart = true;
    }
    if (currentPage + halfOfPageToShow < totalPage) {
      pagination.truncateEnd = true;
    }
    for (
      let page = currentPage - halfOfPageToShow;
      page <= currentPage + halfOfPageToShow;
      page++
    ) {
      pagination.numbers.push(page);
    }
  }
  // ********
  else if (
    currentPage + halfOfPageToShow > totalPage &&
    totalPage >= pageToShow
  ) {
    if (totalPage - pageToShow > 1) {
      pagination.truncateStart = true;
    }
    for (let page = totalPage - pageToShow + 1; page <= totalPage; page++) {
      pagination.numbers.push(page);
    }
  } else {
    for (let page = 1; page <= totalPage; page++) {
      pagination.numbers.push(page);
    }
  }

  return pagination;
}

module.exports = paginationHandler;
