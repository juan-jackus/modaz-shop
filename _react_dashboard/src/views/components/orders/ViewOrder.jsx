// ** React Imports
import { Fragment } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
// ** Store & Actions
import { useSelector } from 'react-redux';
// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs';
// ** Utils
import { formatDate } from '@utils';
// ** Styling Components
import { Row, Col, Card, Input, Button, CardBody, CardText } from 'reactstrap';

const ViewOrder = () => {
  // ** Var
  const history = useHistory();
  const order = useSelector((state) => state.orders.selectedOrder);
  const dueDate = new Date(order.created_at);
  dueDate.setDate(dueDate.getDate() + 7);

  return !order ? (
    <Redirect to='/orders' />
  ) : (
    <Fragment>
      <Breadcrumbs
        breadCrumbTitle='View Order '
        breadCrumbParent='Orders'
        breadCrumbActive='view'
      />

      <Card className='p-2 container'>
        {/* Header */}
        <CardBody>
          <div className='d-flex justify-content-between flex-md-row flex-column'>
            {/* Office */}
            <div className='mb-2'>
              <p className='card-text mb-25'>
                Office 149, 450 South Brand Brooklyn
              </p>
              <p className='card-text mb-25'>San Diego County, CA 91905, USA</p>
              <p className='card-text mb-0'>
                +1 (123) 456 7891, +44 (876) 543 2198
              </p>
            </div>
            {/* UID & Date */}
            <div>
              <div className='d-flex align-items-center mb-1'>
                <h4 className='mr-1'>Invoice</h4>
                <Input value={`#-${order.id}`} disabled />
              </div>
              <div className='d-flex align-items-center mb-1'>
                <span className='mr-1 text-nowrap'>Created At :</span>
                <Input value={formatDate(order.created_at)} disabled />
              </div>
              <div className='d-flex align-items-center'>
                <span className='mr-1 text-nowrap'>Due Date :</span>
                <Input value={formatDate(dueDate)} disabled />
              </div>
            </div>
          </div>
        </CardBody>
        <hr />
        {/* Address and Contact */}
        <CardBody>
          <Row>
            {/* Customer Informations */}
            <Col className='p-0' lg='8'>
              <h5 className='mb-2'>
                <u> Invoice To</u> :
              </h5>
              <h6 className='mb-25'>{order.customer.fullName}</h6>
              <CardText className='mb-25'>{order.customer.username}</CardText>
              <CardText className='mb-25'>{order.customer.email}</CardText>
              <CardText className='mb-25'>
                {order.customer?.phoneNumber}
              </CardText>
              <CardText className='mb-0'>
                {order.customer?.moreInfos?.address}
              </CardText>
            </Col>
            {/* Payement Details */}
            <Col className='p-0 mt-xl-0 mt-2' lg='4'>
              <h5 className='mb-2'>
                <u>Payment Details</u> :
              </h5>
              <table>
                <tbody>
                  <tr>
                    <td className='pr-1'>Method:</td>
                    <td>PayPal</td>
                  </tr>
                  <tr>
                    <td className='pr-1'>Discount:</td>
                    <td>$0</td>
                  </tr>
                  <tr>
                    <td className='pr-1'>Tax:</td>
                    <td>%19</td>
                  </tr>
                  <tr>
                    <td colSpan='2'>
                      <hr className='my-50' />
                    </td>
                  </tr>

                  <tr>
                    <td className='pr-1'>Total Due:</td>
                    <td>
                      <span className='font-weight-bolder'>
                        {`$${(+order.totalPrice.toFixed(2)).toLocaleString()}`}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
        </CardBody>
        {/* Product Details */}
        {/* Header */}
        <CardBody>
          <Row>
            <Col sm='6'>
              <h5>Items</h5>
            </Col>
            <Col sm='2' className='d-none d-sm-block'>
              <h5>Color</h5>
            </Col>
            <Col sm='2' className='d-none d-sm-block'>
              <h5>Price</h5>
            </Col>
            <Col sm='2' className='d-none d-sm-block'>
              <h5>Qty</h5>
            </Col>
          </Row>
          {/* Rows */}
          {order.products.map((product, i) => (
            <Row key={i} className='border rounded py-1 mb-1'>
              <Col sm='6' className='d-flex align-items-center'>
                {product.name}
              </Col>
              <Col sm='2' className='d-none d-sm-block'>
                {product.color ? (
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '100%',
                      backgroundColor: product.color,
                    }}
                  ></div>
                ) : (
                  'N/A'
                )}
              </Col>
              <Col sm='2' className='d-none d-sm-block'>
                {`$${product.price}`}
              </Col>
              <Col sm='2' className='d-none d-sm-block pl-2'>
                {product.quantity}
              </Col>
            </Row>
          ))}
          <Button
            type='button'
            color='secondary'
            className='mt-1'
            onClick={() => history.goBack()}
          >
            Go Back
          </Button>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default ViewOrder;
