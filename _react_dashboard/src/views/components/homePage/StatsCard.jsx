// ** React Imports
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import Avatar from '@components/avatar';
import { ShoppingCart, Users, User, Box, FileText } from 'react-feather';
import {
  Card,
  Media,
  Spinner,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
} from 'reactstrap';

const StatsCard = ({ stats, loader, includeRole }) => {
  // ** Stats Data
  let title = 'Global Stats';
  let data = [
    {
      count: stats?.usersCount || 0,
      title: 'User(s)',
      link: '/users',
      color: 'light-primary',
      icon: <User size={24} />,
    },
    {
      count: stats?.customersCount || 0,
      title: 'Customer(s)',
      link: '/customers',
      color: 'light-info',
      icon: <Users size={24} />,
    },
    {
      count: stats?.productsCount || 0,
      title: 'Product(s)',
      link: '/products',
      color: 'light-danger',
      icon: <Box size={24} />,
    },
    {
      count: stats?.postsCount || 0,
      title: 'Post(s)',
      link: '/blogs',
      color: 'light-success',
      icon: <FileText size={24} />,
    },
    {
      count: stats?.ordersCount || 0,
      title: 'Order(s)',
      link: '/orders',
      color: 'light-secondary',
      icon: <ShoppingCart size={24} />,
    },
  ];
  // If Login user role is author or editor
  if (includeRole) {
    title = 'Posts Stats';
    data = [
      {
        count: stats?.postsCount || 0,
        title: 'Total',
        color: 'light-primary',
        icon: <FileText size={24} />,
      },
      {
        count: stats?.publishedPosts || 0,
        title: 'Published',
        color: 'light-success',
        icon: <FileText size={24} />,
      },
      {
        count: stats?.draftedPosts || 0,
        title: 'Drafted',
        color: 'light-secondary',
        icon: <FileText size={24} />,
      },
      {
        count: stats?.deletedPosts || 0,
        title: 'Deleted',
        color: 'light-danger',
        icon: <FileText size={24} />,
      },
    ];
  }

  const renderData = () => {
    const length = data.length;
    return data.map((item, i) => {
      return (
        <div key={i} className={classnames({ 'mr-2 mb-1': length !== i })}>
          <Media>
            <Link to={item.link ? item.link : '#'}>
              <Avatar color={item.color} icon={item.icon} className='mr-1' />
            </Link>
            {loader ? (
              <Spinner color='primary' />
            ) : (
              <Link to={item.link ? item.link : '#'}>
                <Media className='my-auto' body role='button'>
                  <h4 className='font-weight-bolder text-center mb-0'>
                    {item.count}
                  </h4>
                  <CardText className='font-small-3 mb-0 text-dark'>
                    {item.title}
                  </CardText>
                </Media>
              </Link>
            )}
          </Media>
        </div>
      );
    });
  };

  return (
    <Card className='card-statistics'>
      <CardHeader>
        <CardTitle tag='h4'>{title}</CardTitle>
        <CardText className='card-text font-small-2 mr-25 mb-0'>
          Up to date
        </CardText>
      </CardHeader>
      <CardBody className='py-1'>
        <div className='d-flex flex-wrap justify-content-lg-around mx-auto'>
          {renderData()}
        </div>
      </CardBody>
    </Card>
  );
};

export default StatsCard;
