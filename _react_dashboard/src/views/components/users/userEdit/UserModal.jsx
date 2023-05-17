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
  const actionText = actionType === 'RESTORE' ? 'restauration' : 'suppression';
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
          Confirmer la {actionText} de :
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
              <span className='ml-50'>Traitement...</span>
            </>
          ) : (
            'Confirmer'
          )}
        </Button>
        <Button
          color='secondary'
          disabled={processing}
          onClick={() => setShowUserModal(!showUserModal)}
        >
          Annuler
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UserModal;
