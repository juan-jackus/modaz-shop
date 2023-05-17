// ** React
import { useEffect } from 'react';
// ** Styling Components
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import paginationHandler from '@src/utility/paginationHandler';
import _ from 'lodash';

const ProductsPage = ({
  products,
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  useEffect(() => {
    if (products.length <= 0) setCurrentPage(1);
  }, [products.length]);
  const pageToShow = 9;
  const paginationItems = paginationHandler(
    totalPages,
    currentPage,
    pageToShow
  );
  // ** Handles pagination
  const handlePageChange = (val) => {
    if (val === 'next') {
      if (currentPage === totalPages) return;
      setCurrentPage(currentPage + 1);
    } else if (val === 'prev') {
      if (currentPage === 1) return;
      setCurrentPage(currentPage - 1);
    } else {
      if (currentPage === val) return;
      setCurrentPage(val);
    }
    window.scrollTo(0, 0);
  };

  // ** Render pages
  const renderPageItems = () => {
    return paginationItems.numbers.map((number, index) => {
      return (
        <PaginationItem
          key={number}
          active={currentPage === number}
          onClick={() => handlePageChange(number)}
        >
          <PaginationLink href='/' onClick={(e) => e.preventDefault()}>
            {number}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  return (
    <Pagination className='d-flex justify-content-center'>
      {/* Prev Buttons */}
      <PaginationItem
        disabled={currentPage === 1}
        className='prev-item'
        onClick={() => handlePageChange('prev')}
      >
        <PaginationLink
          href='/'
          onClick={(e) => e.preventDefault()}
        ></PaginationLink>
      </PaginationItem>
      {/* Pagination Truncate Start */}
      {paginationItems.truncateStart && (
        <PaginationItem
          key={1}
          active={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          <PaginationLink href='/' onClick={(e) => e.preventDefault()}>
            1
          </PaginationLink>
        </PaginationItem>
      )}
      {paginationItems.truncateStart && paginationItems.numbers[0] > 2 && (
        <div className='pagination-truncate px-2'>...</div>
      )}
      {/* Pages */}
      {renderPageItems()}
      {/*  Pagination Truncate End */}
      {paginationItems.truncateEnd &&
        totalPages -
          paginationItems.numbers[paginationItems.numbers.length - 1] >
          1 && <div className='pagination-truncate px-2'>...</div>}
      {paginationItems.truncateEnd && (
        <PaginationItem
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          <PaginationLink href='/' onClick={(e) => e.preventDefault()}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )}
      {/* Next Buttons */}
      <PaginationItem
        className='next-item'
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange('next')}
      >
        <PaginationLink
          href='/'
          onClick={(e) => e.preventDefault()}
        ></PaginationLink>
      </PaginationItem>
    </Pagination>
  );
};

export default ProductsPage;
