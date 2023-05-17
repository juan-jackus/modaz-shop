// ** Utils
import _ from 'lodash';
// ** Styling Components
import { Search } from 'react-feather';
import {
  Media,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
} from 'reactstrap';

const BlogDetailsSidebar = (props) => {
  // props
  const { posts, params, getPostsData, getPost, dispatch } = props;

  const recentPosts = posts.slice(0, 8);

  // ** Handele search input
  const handleSearch = (e) => {
    const searchText = e.target.value;
    dispatch(getPostsData({ ...params, q: searchText }));
  };

  // ** Debounce input search
  const debouncePostSearch = _.debounce(handleSearch, 500);

  const renderRecentPosts = () => {
    return recentPosts.map((post, i) => (
      <Media key={i} className='mb-2 d-flex align-items-center'>
        <div
          className='mr-2 cursor-pointer'
          onClick={() => dispatch(getPost(null, post))}
        >
          <img
            className='rounded'
            src={post.image}
            alt={post.title}
            width='100'
            height='70'
          />
        </div>
        <Media body>
          <h6
            className='blog-recent-post-title cursor-pointer'
            onClick={() => dispatch(getPost(null, post))}
          >
            <span className='text-body-heading'>{post.title}</span>
          </h6>
          <div className='text-muted mb-0'>
            {new Date(post.created_at).toLocaleDateString('en-GB', {
              // weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </Media>
      </Media>
    ));
  };

  return (
    <div className='sidebar-detached sidebar-right'>
      <div className='sidebar'>
        <div className='blog-sidebar right-sidebar my-2 my-lg-0'>
          <div className='right-sidebar-content'>
            <div className='blog-searchbar'>
              <InputGroup className='input-group-merge'>
                <Input
                  className='search-post'
                  placeholder='Search Post here'
                  onChange={debouncePostSearch}
                />
                <InputGroupAddon addonType='append'>
                  <InputGroupText>
                    <Search size={14} />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className='blog-recent-posts mt-3'>
              <h6 className='section-label'>Recent Posts</h6>
              <div className='mt-75'>{renderRecentPosts()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsSidebar;
