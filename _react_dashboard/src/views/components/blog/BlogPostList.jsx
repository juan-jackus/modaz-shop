// ** React
import { Link } from 'react-router-dom';
// ** Redux Store and Actions
import { getPost } from '@store/actions/blog';
// ** Utils
import { onImageError, kFormatter, formatDate } from '@utils';
// ** Third Party Components
import classnames from 'classnames';
// ** Custom Components
import RenderAvatar from '../users/RenderAvatar';
// ** Styling Components
import { XCircle, Edit, RefreshCw, Eye } from 'react-feather';
import {
  Row,
  Col,
  Card,
  Badge,
  CardImg,
  CardBody,
  CardText,
  FormText,
  CardTitle,
  CustomInput,
} from 'reactstrap';
import '@styles/base/pages/app-ecommerce.scss';

const BlogPostList = (props) => {
  const {
    dispatch,
    allPosts,
    showTrash,
    selectedPosts,
    setActionType,
    postCategories,
    setPostToManage,
    setShowPostModal,
    postSelectionHandler,
  } = props;

  // Get Category and Tag Color
  const getCategory = (category) => {
    let tagColor = 'secondary';
    let label = '';
    for (const postCat of postCategories) {
      // eslint-disable-next-line
      if (postCat.value == category) {
        tagColor = postCat.color;
        label = postCat.label;
        break;
      }
    }
    return { tagColor, label };
  };

  // Render Post Categories Tags
  const renderTags = (categories) => {
    // console.log(categories);
    return categories.map((category, i) => (
      <Badge
        key={i}
        className={classnames('my-25', {
          'mr-50': i !== categories.length - 1,
        })}
        color={getCategory(category).tagColor}
        pill
      >
        {getCategory(category).label}
      </Badge>
    ));
  };

  return (
    <Row>
      {allPosts.map((post, i) => {
        return (
          <Col key={i} sm='6'>
            <Card className='post-card'>
              {post.status && (
                <div className='ribbon'>
                  <span>Published</span>
                </div>
              )}
              <div className='post-checkbox'>
                <CustomInput
                  type='checkbox'
                  id={`post-checkbox${i}`}
                  label=''
                  checked={selectedPosts.some((p) => p.id === post.id)}
                  onChange={(e) =>
                    postSelectionHandler(e.currentTarget.checked, post)
                  }
                />
              </div>
              {/* Image */}
              <Link
                to={`/blog/view/${post.id}`}
                onClick={() => dispatch(getPost(null, post))}
              >
                <CardImg
                  className='background-spinner'
                  src={post.image}
                  alt={post.title}
                  height='200px'
                  onError={onImageError}
                  top
                />
              </Link>
              <CardBody>
                {/* Title */}
                <CardTitle tag='h3'>
                  <Link
                    className='blog-title-truncate text-body-heading'
                    to={`/blog/view/${post.id}`}
                    onClick={() => dispatch(getPost(null, post))}
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                {/* Infos */}
                <div className='d-flex align-items-center'>
                  {post.author && (
                    <div className='d-flex align-items-center'>
                      <RenderAvatar
                        avatar={post.author.avatar}
                        name={post.author.username}
                        size={{ w: '27', h: '27' }}
                        style={{ marginRight: '12px !important' }}
                      />
                      <small className='text-muted mr-25'>by</small>
                      <small className='font-weight-bold'>
                        {post.author.username}
                      </small>
                      <span className='text-muted ml-50 mr-25'>|</span>
                    </div>
                  )}
                  <small className='text-muted'>
                    {formatDate(post.created_at, true)}
                  </small>
                </div>
                <div className='my-1 d-flex flex-wrap '>
                  {/* Post Categories */}
                  {renderTags(post.categories)}
                  {/* Post Read Count */}
                  <div className='ml-auto pl-50'>
                    <FormText>
                      Read Count : {kFormatter(post.readCount)}
                    </FormText>
                  </div>
                </div>
                <CardText className='text-truncate'>{post.text}</CardText>
                <hr className='mb-0' />
                <div className='d-flex align-items-center justify-content-between flex-wrap'>
                  {/* Delete Post Button */}
                  <div
                    className='post-btn post-btn-delete'
                    onClick={() => {
                      dispatch(setPostToManage(post));
                      setActionType('DELETE');
                      setShowPostModal(true);
                    }}
                  >
                    <XCircle className='mr-50' size={14} /> Delete
                  </div>
                  {/* Edit Post Button */}
                  {!showTrash ? (
                    <Link
                      className='post-btn post-btn-edit'
                      to={`/blog/edit/${post.id}`}
                      onClick={() => dispatch(getPost(null, post))}
                    >
                      <Edit className='mr-50' size={14} /> Edit
                    </Link>
                  ) : (
                    <div
                      className='post-btn post-btn-edit'
                      onClick={() => {
                        dispatch(setPostToManage(post));
                        setActionType('RESTORE');
                        setShowPostModal(true);
                      }}
                    >
                      <RefreshCw className='mr-50' size={14} /> Restore
                    </div>
                  )}
                  {/* View Post Button */}
                  <Link
                    className='post-btn post-btn-view'
                    to={`/blog/view/${post.id}`}
                    onClick={() => dispatch(getPost(null, post))}
                  >
                    <Eye className='mr-50' size={14} /> View
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default BlogPostList;
