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
  const actionText = actionType === 'RESTORE' ? 'restauration' : 'suppression';
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
          Confirmer la {actionText}
          {!postToManage && selectedPosts.length > 1 && (
            <span> de {selectedPosts.length} articles :</span>
          )}
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
              <span className='ml-50'>Traitement...</span>
            </>
          ) : (
            'Confirmer'
          )}
        </Button>
        <Button
          color='secondary'
          disabled={processing}
          onClick={closeModalHandler}
        >
          Annuler
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeletePostModal;
