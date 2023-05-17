// ** React
import { Fragment, useState, useEffect } from 'react';
// ** Redux Store and Actions
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  deletePost,
  restorePost,
  getPostsData,
  setPostToManage,
  deleteMultiplePost,
  restoreMultiplePost,
} from '@store/actions/blog';
// ** Third Party Components
import { toast, Slide } from 'react-toastify';
import classnames from 'classnames';
// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs';
import BlogHeader from './components/blog/BlogHeader';
import BlogPostList from './components/blog/BlogPostList';
import ToastContent from './components/users/ToastContent';
import FilterSidebar from './components/blog/BlogFilterSidebar';
import BlogModal from './components/blog/blogEdit/BlogModal';
import BlogPagination from './components/blog/BlogPagination';
// ** Styling Components
import { Card, CardTitle, CustomInput, Spinner } from 'reactstrap';
import '@styles/base/pages/app-ecommerce.scss';

const Blog = () => {
  // ** Vars
  const dispatch = useDispatch();
  const { state } = useLocation();
  const store = useSelector((state) => state.blog);
  const {
    posts,
    params,
    totalPosts,
    totalPages,
    postToManage,
    postCategories,
  } = store;
  // ** State
  const [searchTerm, setSearchTerm] = useState(params.q || ''),
    [currentPage, setCurrentPage] = useState(params.page || 1),
    [perPage, setPerPage] = useState(params.perPage || 6),
    [sortByValue, setSortByValue] = useState(params.sortBy || 'newest'),
    [categories, setCategories] = useState(params.categories || []),
    [status, setStatus] = useState(params.status || ''),
    [showTrash, setShowTrash] = useState(params.trash || false),
    [selectedPosts, setSelectedPosts] = useState([]),
    [sidebarOpen, setSidebarOpen] = useState(false),
    [showPostModal, setShowPostModal] = useState(!!postToManage),
    [actionType, setActionType] = useState(state?.actionType || null),
    [processing, setProcessing] = useState(false),
    [remountKey, setRemountKey] = useState(0),
    [loadingData, setLoadingData] = useState(false);

  // ** Get All Posts
  useEffect(async () => {
    setLoadingData(true);
    await dispatch(
      getPostsData({
        q: searchTerm,
        page: currentPage,
        perPage,
        sortBy: sortByValue,
        categories,
        status,
        trash: showTrash,
      })
    );
    setLoadingData(false);
  }, [
    searchTerm,
    currentPage,
    perPage,
    sortByValue,
    categories,
    status,
    showTrash,
  ]);
  // ** All Post selection handler
  const postSelectionHandler = (checked, post) => {
    if (checked) {
      setSelectedPosts((prevState) => {
        const updatedSelectedPosts = [...prevState];
        updatedSelectedPosts.push(post);
        return updatedSelectedPosts;
      });
    } else {
      setSelectedPosts((prevState) => {
        const updatedSelectedPosts = prevState.filter((p) => p.id !== post.id);
        return updatedSelectedPosts;
      });
    }
  };
  // ** All Post selection handler
  const selectAllPostsHandler = (e) => {
    const checked = e.currentTarget.checked;
    if (checked) {
      setSelectedPosts(store.posts);
    } else {
      setSelectedPosts([]);
    }
  };
  // ** Trashed Post
  const getTrashedPosts = () => {
    const trash = !showTrash;
    const sortBy = trash ? 'trash_desc' : 'newest';
    setCurrentPage(1);
    setShowTrash(trash);
    setSortByValue(sortBy);
    setSelectedPosts([]);
    setShowTrash(!showTrash);
  };
  // ** Show Post(s) to delete in deletion Modal
  const showPostModalData = () => {
    if (postToManage) {
      return (
        <ul>
          <li>{postToManage.title}</li>
        </ul>
      );
    } else if (selectedPosts.length) {
      return (
        <ul style={{ maxHeight: '300px', overflow: 'auto' }}>
          {selectedPosts.map((p, i) => (
            <li key={i}>{p.title}</li>
          ))}
        </ul>
      );
    }
  };
  // ** Post(s) deletion Handler
  const postdeleteRestoreHandler = async () => {
    setProcessing(true);
    let toastValue;
    const action = {
      single: deletePost,
      mutiple: deleteMultiplePost,
      text: 'deletion',
    };
    // eslint-disable-next-line
    if (actionType == 'RESTORE') {
      action.single = restorePost;
      action.mutiple = restoreMultiplePost;
      action.text = 'restore';
    }
    if (postToManage) {
      const successDeletion = await dispatch(
        action.single(postToManage, showTrash)
      ).then((res) => res);
      dispatch(setPostToManage(null));
      toastValue = successDeletion
        ? {
            type: 'success',
            text: `Success deletion of : ${postToManage.title}`,
          }
        : {
            type: 'error',
            text: `Failed to delete : ${postToManage.title}`,
          };
    } else if (selectedPosts.length) {
      // If there is many Posts to delete
      const successDeletion = await dispatch(
        action.mutiple(selectedPosts, showTrash)
      ).then((res) => res);
      // Check if all deletion are successfull
      toastValue =
        successDeletion === selectedPosts.length
          ? {
              type: 'success',
              text: `Success ${action.text} of ${selectedPosts.length} post(s)`,
            }
          : {
              type: 'error',
              text: `Failed to ${action.text} ${
                selectedPosts.length - successDeletion
              } post(s)`,
            };
    }
    setProcessing(false);
    setShowPostModal(!showPostModal);
    dispatch(setPostToManage(null));
    if (toastValue.type === 'success' && !postToManage) {
      setSelectedPosts([]);
    }
    toast[toastValue.type](ToastContent(toastValue, showPostModalData), {
      transition: Slide,
      autoClose: 5000,
      pauseOnHover: true,
      // hideProgressBar: true,
    });
  };

  return (
    <Fragment>
      <Breadcrumbs
        breadCrumbTitle='Post List'
        breadCrumbParent='Blog'
        breadCrumbActive='posts'
      />
      <div id='blog' className=' container'>
        <div className='content-detached content-left'>
          <div className='content-body'>
            {/* Header */}
            <BlogHeader
              showTrash={showTrash}
              setPerPage={setPerPage}
              searchTerm={searchTerm}
              totalPosts={totalPosts}
              remountKey={remountKey}
              selectedPosts={selectedPosts}
              setActionType={setActionType}
              setSearchTerm={setSearchTerm}
              setCurrentPage={setCurrentPage}
              setSidebarOpen={setSidebarOpen}
              getTrashedPosts={getTrashedPosts}
              setShowPostModal={setShowPostModal}
            />
            {/* Loarder */}
            {loadingData && (
              <div className=' p-3 d-flex justify-content-center '>
                <Spinner id='datable-loader' />
              </div>
            )}
            <div className={classnames({ 'd-none': loadingData })}>
              {/* Select All Product Toggler */}
              <div className='mb-2'>
                <CustomInput
                  type='checkbox'
                  id='toogle-selection'
                  label='Select all posts per page '
                  checked={
                    selectedPosts.length === params.perPage ||
                    selectedPosts.length === posts.length
                  }
                  onChange={selectAllPostsHandler}
                >
                  <span className='ml-1'>
                    {`(${selectedPosts.length}/${store.posts.length})`}
                  </span>
                </CustomInput>
              </div>
              {/* Post List */}
              <div className='blog-list-wrapper'>
                {totalPosts ? (
                  <BlogPostList
                    allPosts={posts}
                    dispatch={dispatch}
                    showTrash={showTrash}
                    totalPosts={totalPosts}
                    selectedPosts={selectedPosts}
                    setActionType={setActionType}
                    postCategories={postCategories}
                    setPostToManage={setPostToManage}
                    setShowPostModal={setShowPostModal}
                    postSelectionHandler={postSelectionHandler}
                  />
                ) : (
                  <Card style={{ height: '190px' }}>
                    <CardTitle className='text-center mt-5 pt-2' tag='h4'>
                      No Post!
                    </CardTitle>
                  </Card>
                )}
                {/* Pagination */}
                <BlogPagination
                  allPosts={posts}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Filter Sidebar */}
        <FilterSidebar
          status={status}
          showTrash={showTrash}
          setStatus={setStatus}
          remountKey={remountKey}
          categories={categories}
          sidebarOpen={sidebarOpen}
          sortByValue={sortByValue}
          setCategories={setCategories}
          setRemountKey={setRemountKey}
          setSortByValue={setSortByValue}
          setCurrentPage={setCurrentPage}
          postCategories={postCategories}
        />
        {showPostModal && (
          <BlogModal
            dispatch={dispatch}
            actionType={actionType}
            processing={processing}
            postToManage={postToManage}
            selectedPosts={selectedPosts}
            showPostModal={showPostModal}
            setPostToManage={setPostToManage}
            setShowPostModal={setShowPostModal}
            showPostModalData={showPostModalData}
            postdeleteRestoreHandler={postdeleteRestoreHandler}
          />
        )}
        {/* Sidebar Overlay */}
        <div
          className={classnames('body-content-overlay', {
            show: sidebarOpen,
          })}
          onClick={() => setSidebarOpen(false)}
        ></div>
      </div>
    </Fragment>
  );
};

export default Blog;
