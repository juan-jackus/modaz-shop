// ** Styling Components
import {
  Modal,
  Button,
  Spinner,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';

const UserModal = ({
  processing,
  actionType,
  userToManage,
  showUserModal,
  setShowUserModal,
  showUserModalData,
  userDeleteRestoreHandler,
}) => {
  const actionText = actionType === 'RESTORE' ? 'restoration' : 'deletion';
  const style = actionType === 'RESTORE' ? 'warning' : 'danger';
  return (
    <Modal
      isOpen={showUserModal}
      modalClassName={`modal-${style}`}
      toggle={() => setShowUserModal(!showUserModal)}
    >
      <ModalHeader
        toggle={() => setShowUserModal(!showUserModal)}
      ></ModalHeader>
      <ModalBody>
        <p className={`text-${style} font-weight-bold`}>
          Confirm {actionText} of user(s) :
        </p>
        {showUserModalData(userToManage?.selectedRows || userToManage)}
      </ModalBody>
      <ModalFooter>
        <Button
          color={style}
          disabled={processing}
          onClick={() =>
            userDeleteRestoreHandler(userToManage, actionType, true)
          }
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
          onClick={() => setShowUserModal(!showUserModal)}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UserModal;
