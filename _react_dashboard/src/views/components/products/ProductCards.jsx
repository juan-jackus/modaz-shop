// ** React Imports
import { Link } from 'react-router-dom';
// ** Third Party Components
import classnames from 'classnames';
// ** Styling Components
import { Star, Eye, Delete, RefreshCw } from 'react-feather';
import {
  Card,
  Badge,
  Button,
  CardBody,
  CardText,
  CustomInput,
  UncontrolledTooltip,
} from 'reactstrap';

const ProductCards = (props) => {
  // ** Props
  const {
    dispatch,
    products,
    showTrash,
    getProduct,
    activeView,
    setActionType,
    selectedProducts,
    setProductToManage,
    setShowProductModal,
    productSelectionHandler,
  } = props;

  return (
    <div
      id='product-cards'
      className={classnames({
        'grid-view': activeView === 'grid',
        'list-view': activeView === 'list',
      })}
    >
      {/* Renders products */}
      {products.map((product, i) => {
        return (
          <Card className='ecommerce-card' key={product.name}>
            <div className='item-img text-center mx-auto'>
              {/* Grid View Free Shipping  */}
              {product.moreInfos?.freeShipping ? (
                <CardText
                  className={classnames('free-shipping', {
                    'd-none': activeView === 'list',
                  })}
                >
                  <Badge color='light-success'>Free Shipping</Badge>
                </CardText>
              ) : null}
              {/* Checkbox */}
              <div className='product-checkbox'>
                <CustomInput
                  type='checkbox'
                  id={`product-checkbox${i}`}
                  label=''
                  checked={selectedProducts.some((p) => p.id === product.id)}
                  onChange={(e) =>
                    productSelectionHandler(e.currentTarget.checked, product)
                  }
                />
              </div>
              {/* Images */}
              <Link
                to={`/products/edit/${product.id}`}
                onClick={() => dispatch(getProduct(product.id, product))}
              >
                <img
                  className='img-fluid card-img-top p-1 background-spinner'
                  src={product.images[0]}
                  alt={product.name}
                />
              </Link>
            </div>
            <CardBody>
              <div className='item-wrapper'>
                {/* Rating */}
                <div className='item-rating'>
                  <ul className='unstyled-list list-inline'>
                    {new Array(5).fill().map((listItem, index) => {
                      return (
                        <li key={index} className='ratings-list-item mr-25'>
                          <Star
                            className={classnames({
                              'filled-star':
                                index + 1 <= product.moreInfos?.rating,
                              'unfilled-star':
                                index + 1 > product.moreInfos?.rating,
                            })}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {/* Price */}
                <div className='item-cost'>
                  <h6 className='item-price'>
                    {`$${(+product.price.toFixed(2)).toLocaleString()}`}
                  </h6>
                </div>
              </div>
              {/* Name & Brand */}
              <h6 className='item-name'>
                <Link
                  id={`product-name${i}`}
                  className='text-body'
                  to={`/products/edit/${product.id}`}
                  onClick={() => dispatch(getProduct(product.id, product))}
                >
                  {product.name}
                </Link>
                <UncontrolledTooltip
                  placement='top'
                  target={`product-name${i}`}
                >
                  {product.name}
                </UncontrolledTooltip>
                {product?.moreInfos?.brand && (
                  <CardText tag='span' className='item-company text-primary'>
                    By{' '}
                    <span className='company-name'>
                      {product.moreInfos.brand}
                    </span>
                  </CardText>
                )}
              </h6>
              {/* Description */}
              <CardText className='item-description'>
                {product.description}
              </CardText>
            </CardBody>
            <div className='item-options text-center'>
              {/* List View Price & Free Shipping */}
              <div className='item-wrapper'>
                <div className='item-cost'>
                  <h4 className='item-price'>{`$${product.price}`}</h4>
                  {product?.moreInfos?.freeShipping ? (
                    <CardText className='shipping'>
                      <Badge color='light-success'>Free Shipping</Badge>
                    </CardText>
                  ) : null}
                </div>
              </div>
              {showTrash ? (
                // Restore Button
                <Button
                  color='warning'
                  className='btn-cart restore-btn'
                  onClick={() => {
                    dispatch(setProductToManage(product));
                    setActionType('RESTORE');
                    setShowProductModal(true);
                  }}
                >
                  <span className='text-nowrap'>
                    <RefreshCw className='mr-50' size={14} />
                    Restore
                  </span>
                </Button>
              ) : (
                // View Button
                <Button
                  color='primary'
                  tag={Link}
                  className='btn-cart view-btn'
                  to={`/products/edit/${product.id}`}
                  onClick={() => dispatch(getProduct(product.id, product))}
                >
                  <span className='text-nowrap'>
                    <Eye className='mr-50' size={14} />
                    View
                  </span>
                </Button>
              )}
              {/* Delete Button */}
              <Button
                color='secondary'
                className='btn-cart delete-btn'
                onClick={() => {
                  dispatch(setProductToManage(product));
                  setActionType('DELETE');
                  setShowProductModal(true);
                }}
              >
                <span className='text-nowrap'>
                  <Delete className='mr-50' size={14} />
                  Delete
                </span>
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductCards;
