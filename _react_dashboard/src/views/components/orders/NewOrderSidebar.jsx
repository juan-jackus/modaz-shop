// ** React Import
import { useState, useEffect, useRef, useCallback } from 'react';
// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import {
  addOrder,
  querryCustomers,
  querryProducts,
} from '@src/redux/actions/orders';
// ** Utils
import _ from 'lodash';
import { selectThemeColors } from '@utils';
// ** Third Party Components
import AsyncSelect from 'react-select/async';
import { toast, Slide } from 'react-toastify';
// ** Custom Components
import Sidebar from '@components/sidebar';
import ToastContent from '../users/ToastContent.jsx';
// ** Styling Components
import { AlertCircle, ChevronDown, ChevronUp } from 'react-feather';
import {
  Row,
  Col,
  Form,
  Alert,
  Label,
  Button,
  Spinner,
  FormText,
  FormGroup,
  UncontrolledTooltip,
} from 'reactstrap';

const NewOrderSidebar = ({ open, toggleSidebar }) => {
  // ** Store Vars
  const dispatch = useDispatch();
  const orderErrors = useSelector((state) => state.errors.addOrder);
  // ** States
  const quantityRef = useRef({});
  const [errors, setErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // ** Set server Errors response
  useEffect(() => {
    if (orderErrors) {
      setFormErrors('Server errors! Please retry');
      setTimeout(() => {
        setFormErrors(null);
      }, 3000);
      dispatch({
        type: 'CLEAR_ERRORS',
        data: 'addOrder',
      });
    }
  }, [orderErrors]);

  // ** Debounce Customer Input Search
  const debouncedCustomerLoadOptions = useCallback(
    _.debounce((inputText, callback) => {
      querryCustomers(inputText, callback);
    }, 500),
    []
  );

  // ** Debounce Customer Input Search
  const debouncedProductLoadOptions = useCallback(
    _.debounce((inputText, callback) => {
      querryProducts(inputText, callback);
    }, 500),
    []
  );

  const totalPriceHandler = (operation, price, productArray) => {
    switch (operation) {
      case 'inc':
        setTotalPrice((prevPrice) => prevPrice + price);
        break;
      case 'dec':
        setTotalPrice((prevPrice) => prevPrice - price);
        break;
      default:
        if (operation !== 'stop') {
          const items = productArray || selectedProducts;
          const newTotalPrice = items.reduce((sum, product) => {
            const quantity = quantityRef.current[product.id]?.value || 1;
            return sum + product.price * quantity;
          }, 0);
          setTotalPrice(newTotalPrice);
        }
        break;
    }
  };

  // ** handle Customer selection
  const quantityHandler = (id, value, price) => {
    const input = quantityRef.current[id];
    const numberRegex = /^[1-9][0-9]*$/;
    switch (value) {
      case 'inc':
        input.value++;
        break;
      case 'dec':
        if (input.value > 1) {
          input.value--;
        } else value = 'stop';
        break;
      default:
        if (numberRegex.test(value)) {
          input.value = value;
        } else input.value = 1;
        value = null;
        break;
    }
    totalPriceHandler(value, price);
  };

  // ** Function to handle form submit
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedProducts.length) {
      setErrors('"Customer" & "Products" fields are required');
      setTimeout(() => {
        setErrors(false);
      }, 3000);
      return;
    }
    setIsSubmitting(true);
    const customerId = selectedCustomer.id;
    const products = selectedProducts.map((prod) => {
      const quantity = quantityRef.current[prod.id].value;
      const item = { id: prod.id, quantity };
      // Pick a Random Color(test)
      if (prod?.moreInfos?.colors && prod?.moreInfos?.colors.length) {
        const random = Math.floor(Math.random() * prod.moreInfos.colors.length);
        item.color = prod.moreInfos.colors[random];
      }
      return item;
    });

    const orderValues = { customerId, products };

    // return console.log(orderValues);
    const successSubmit = await dispatch(addOrder(orderValues)).then((res) => {
      setIsSubmitting(false);
      return res;
    });

    let toastValue = {
      type: 'error',
      text: 'Order Failed',
    };

    if (successSubmit) {
      setSelectedCustomer('');
      setSelectedProducts([]);
      toastValue = {
        type: 'success',
        text: 'Order successfull',
      };
    }

    toast[toastValue.type](ToastContent(toastValue), {
      transition: Slide,
      hideProgressBar: false,
      autoClose: 3000,
      pauseOnHover: true,
    });
  };

  return (
    <Sidebar
      size='lg'
      open={open}
      id='order-sidebar'
      title='Add New Order'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={onSubmit}>
        {/* Required Field Text */}
        {errors ? (
          <Alert color='danger'>
            <div className='alert-body'>
              <AlertCircle size={15} />{' '}
              <span className='ml-1' style={{ fontSize: '13px' }}>
                {errors}
              </span>
            </div>
          </Alert>
        ) : (
          <FormText className='d-flex mb-1' color='muted'>
            <div className='ml-auto'>
              [<span className='text-danger'> * </span>] Required fields
            </div>
          </FormText>
        )}

        {/* Customer */}
        <FormGroup>
          <Label for='order-customer'>
            Customer <span className='text-danger'>*</span>
          </Label>
          <AsyncSelect
            isClearable
            isSearchable
            cacheOptions
            classNamePrefix='select'
            theme={selectThemeColors}
            value={selectedCustomer}
            placeholder='Enter customer username...'
            loadOptions={debouncedCustomerLoadOptions}
            getOptionValue={(customer) => customer.id}
            getOptionLabel={(customer) => customer.username}
            onChange={(value) => setSelectedCustomer(value)}
          />
        </FormGroup>
        {/* Products */}
        <FormGroup>
          <Label for='products'>
            Products <span className='text-danger'>*</span>
          </Label>
          <AsyncSelect
            isMulti
            isClearable
            isSearchable
            cacheOptions
            classNamePrefix='select'
            theme={selectThemeColors}
            value={selectedProducts}
            placeholder='Enter product name...'
            loadOptions={debouncedProductLoadOptions}
            getOptionValue={(product) => product}
            getOptionLabel={(product) => product.name}
            onChange={(value) => {
              setSelectedProducts(() => {
                const newValue = _.uniqBy(value, 'id');
                totalPriceHandler(null, null, newValue);
                return newValue;
              });
            }}
          />
        </FormGroup>
        {/* Quantity Select */}
        {selectedProducts.length ? (
          <FormGroup>
            <Label className='mb-1'>Select Quantity</Label>
            <Row>
              {selectedProducts.map((product, i) => (
                <Col
                  xs='6'
                  sm='4'
                  key={`${i}-${product.id}`}
                  className='product-quantity-wrapper mb-1'
                >
                  <img id={`product-img${i}`} src={product.images[0]} />
                  <UncontrolledTooltip
                    placement='top'
                    target={`product-img${i}`}
                  >
                    <img
                      src={product.images[0]}
                      style={{
                        width: '200px',
                        display: 'block',
                        objectFit: 'contain',
                        marginBottom: '10px',
                      }}
                    />
                    {product.name}
                    <div>Price : {`$${product.price}`}</div>
                  </UncontrolledTooltip>
                  <input
                    type='number'
                    defaultValue='1'
                    name={product.id}
                    onBlur={(e) =>
                      quantityHandler(
                        product.id,
                        e.currentTarget.value,
                        product.price
                      )
                    }
                    ref={(input) => (quantityRef.current[product.id] = input)}
                  />
                  <div className='inc-btn-wrapper '>
                    <ChevronUp
                      width='13px'
                      className=' svg svg1'
                      onClick={() =>
                        quantityHandler(product.id, 'inc', product.price)
                      }
                    />
                    <ChevronDown
                      width='13px'
                      className='svg'
                      onClick={() =>
                        quantityHandler(product.id, 'dec', product.price)
                      }
                    />
                  </div>
                </Col>
              ))}
            </Row>
            <div className='total-price'>
              Total price :
              <span>{`$${(+totalPrice.toFixed(2)).toLocaleString()}`}</span>
            </div>
          </FormGroup>
        ) : null}
        {/* Buttons */}
        <Button
          type='submit'
          disabled={isSubmitting || !!errors}
          className='mr-1'
          color='primary'
        >
          {isSubmitting ? (
            <>
              <Spinner size='sm' color='white' />
              <span className='ml-50'>Submitting...</span>
            </>
          ) : (
            'Submit'
          )}
        </Button>
        <Button type='button' color='secondary' outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  );
};

export default NewOrderSidebar;
