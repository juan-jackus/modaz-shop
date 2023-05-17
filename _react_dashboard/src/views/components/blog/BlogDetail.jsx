// ** React
import { useEffect, Fragment } from 'react';
import { useHistory, Link, Redirect } from 'react-router-dom';
// ** Redux Store and Actions
import { useSelector, useDispatch } from 'react-redux';
import {
  getPost,
  getPostsData,
  setPostToManage,
  removeSelectedPost,
} from '@store/actions/blog';
// ** Utils
import { onImageError, kFormatter } from '@utils';
// ** Third Party Components
import classnames from 'classnames';
// ** Custom Components
import RenderAvatar from '../users/RenderAvatar';
import Sidebar from './BlogDetailsSidebar.jsx';
import Breadcrumbs from '@components/breadcrumbs';
// ** Styling Components
import {
  Card,
  Media,
  Badge,
  Button,
  CardImg,
  CardText,
  FormText,
  CardBody,
  CardTitle,
} from 'reactstrap';

const BlogDetails = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const history = useHistory();
  const store = useSelector((state) => state.blog);
  const { selectedPost, params, posts, postCategories } = store;
  let redirectToEdit = false;
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
    return categories.map((category, i) => (
      <Badge
        key={i}
        className={classnames({
          'mr-50': i !== categories.length - 1,
        })}
        color={getCategory(category).tagColor}
        pill
      >
        {getCategory(category).label}
      </Badge>
    ));
  };
  // ** Remove Selected Post On Unmount and !redirectToEdit
  useEffect(() => {
    return () => {
      if (!redirectToEdit) {
        dispatch(removeSelectedPost());
      }
    };
  }, []);

  return !selectedPost ? (
    <Redirect to='/blog' />
  ) : (
    <Fragment>
      <Breadcrumbs
        breadCrumbTitle="Details de l'article"
        breadCrumbParent='Blog'
        breadCrumbActive='Details'
      />
      <div className='blog-wrapper container'>
        <div className='content-detached content-left'>
          <div className='content-body'>
            <Card className='mb-3' style={{ overflow: 'hidden' }}>
              <CardImg
                src={selectedPost.image}
                className='img-fluid'
                onError={onImageError}
                top
              />
              <CardBody>
                <CardTitle tag='h4'>
                  <div>{selectedPost.title}</div>
                  <div>
                    <FormText>
                      {new Date(selectedPost.created_at).toLocaleDateString(
                        'fr-GB',
                        {
                          day: 'numeric',
                          weekday: 'long',
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </FormText>
                  </div>
                </CardTitle>
                <div className='d-flex flex-wrap mb-2'>
                  {/* Post Categories */}
                  <div className=' mb-1'>
                    <FormText>Catégories</FormText>
                    <div className=' py-25'>
                      {renderTags(selectedPost.categories)}
                    </div>
                  </div>
                  <div className='d-flex ml-auto mb-1'>
                    {/* Post Read Count */}
                    <div>
                      <FormText>Nombre de Lecture</FormText>
                      <div className=' text-center font-italic py-25 text-muted'>
                        {kFormatter(selectedPost.readCount)}
                      </div>
                    </div>
                    {/* Separator */}
                    <div className='mx-1'>|</div>
                    {/* Post Status */}
                    <div>
                      <FormText>Statut</FormText>
                      <div className=' text-capitalize font-italic py-25 text-muted'>
                        {selectedPost.status ? 'Publié' : 'Brouillon'}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedPost.htmlText,
                  }}
                ></div>
                {selectedPost.author && (
                  <>
                    <hr className='my-2' />
                    <h6>Auteur</h6>
                    <Media>
                      <RenderAvatar
                        avatar={selectedPost.author.avatar}
                        name={selectedPost.author.username}
                      />

                      <Media body>
                        {selectedPost.author.fullName && (
                          <CardText className='mb-25'>
                            <small className='text-muted mr-25'>Nom : </small>
                            <span className='font-weight-bold'>
                              {selectedPost.author.fullName}
                            </span>
                          </CardText>
                        )}
                        <CardText className='mb-25'>
                          <small className='text-muted mr-25'>
                            Nom d'utilisateur :{' '}
                          </small>
                          <span className='font-weight-bold'>
                            {selectedPost.author.username}
                          </span>
                        </CardText>
                        {selectedPost.author.email && (
                          <CardText>
                            <small className='text-muted mr-25'>Email : </small>
                            <span className='font-weight-bold'>
                              {selectedPost.author.email}
                            </span>
                          </CardText>
                        )}
                      </Media>
                    </Media>
                  </>
                )}
                <hr className='my-2' />
                {/* Buttons */}
                <div className='d-sm-flex'>
                  {/* Edit Post Button */}
                  {!params.trash ? (
                    <Button.Ripple
                      color='warning'
                      className='mb-1 mr-1 text-nowrap'
                      type='button'
                      outline
                      onClick={() => {
                        redirectToEdit = true;
                        history.push(`/blog/edit/${selectedPost.id}`);
                      }}
                    >
                      Editer l'article
                    </Button.Ripple>
                  ) : (
                    <Button.Ripple
                      color='warning'
                      className='mb-1 mr-1 text-nowrap'
                      type='button'
                      outline
                      onClick={() => {
                        dispatch(setPostToManage(selectedPost));
                        history.replace({
                          pathname: '/blog',
                          state: { actionType: 'RESTORE' },
                        });
                        // history.goBack();
                      }}
                    >
                      Restaurer L'article
                    </Button.Ripple>
                  )}
                  {/* Delete Post Button */}
                  <Button.Ripple
                    color='danger'
                    className='mb-1 mr-1 text-nowrap'
                    type='button'
                    outline
                    onClick={() => {
                      dispatch(setPostToManage(selectedPost));
                      history.replace({
                        pathname: '/blog',
                        state: { actionType: 'DELETE' },
                      });
                      // history.goBack();
                    }}
                  >
                    Supprimer l'article
                  </Button.Ripple>
                  {/* Go Back Button */}
                  <Button.Ripple
                    color='secondary'
                    className='mb-1 mr-1 ml-auto'
                    type='button'
                    outline
                    onClick={() => history.goBack()}
                  >
                    Retour
                  </Button.Ripple>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
        <Sidebar
          posts={posts}
          params={params}
          dispatch={dispatch}
          getPostsData={getPostsData}
          getPost={getPost}
        />
      </div>
    </Fragment>
  );
};

export default BlogDetails;
