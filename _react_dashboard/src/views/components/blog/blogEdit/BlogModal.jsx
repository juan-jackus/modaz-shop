// ** Styling Components
import {
  Modal,
  Button,
  Spinner,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';

const DeletePostModal = (props) => {
  // ** Props
  const {
    dispatch,
    processing,
    actionType,
    postToManage,
    selectedPosts,
    showPostModal,
    setPostToManage,
    setShowPostModal,
    showPostModalData,
    postdeleteRestoreHandler,
  } = props;
  const actionText = actionType === 'RESTORE' ? 'restoration' : 'deletion';
  const style = actionType === 'RESTORE' ? 'warning' : 'danger';
  // ** Modal Handler
  const closeModalHandler = () => {
    if (postToManage) {
      dispatch(setPostToManage(null));
    }
    setShowPostModal(!showPostModal);
  };

  return (
    <Modal
      isOpen={showPostModal}
      modalClassName={`modal-${style}`}
      toggle={closeModalHandler}
    >
      <ModalHeader toggle={closeModalHandler}></ModalHeader>
      <ModalBody>
        <p className={`text-${style} font-weight-bold`}>
          Confirm {actionText} of{' '}
          {!postToManage && selectedPosts.length > 1 && (
            <span>{selectedPosts.length}</span>
          )}{' '}
          post(s) :
        </p>
        {showPostModalData()}
      </ModalBody>
      <ModalFooter>
        <Button
          color={style}
          disabled={processing}
          onClick={() => postdeleteRestoreHandler()}
        >
          {processing ? (
            <>
              <Spinner size='sm' color='white' />
              <span className='ml-50'>Processing...</span>
            </>
          ) : (
            'Confirm'
          )}
        </Button>
        <Button
          color='secondary'
          disabled={processing}
          onClick={closeModalHandler}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeletePostModal;
