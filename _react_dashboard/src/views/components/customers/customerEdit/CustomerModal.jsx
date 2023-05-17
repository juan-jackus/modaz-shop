// ** Styling Components
import {
  Modal,
  Button,
  Spinner,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';

const CustomerModal = ({
  dispatch,
  showCustomerModal,
  processing,
  actionType,
  setShowCustomerModal,
  showCustomerModalData,
  customerToManage,
  setCustomerToManage,
  customerDeleteRestoreHandler,
}) => {
  const actionText = actionType === 'RESTORE' ? 'restauration' : 'supression';
  const style = actionType === 'RESTORE' ? 'warning' : 'danger';
  // ** Close Modal Handler
  const closeModalHandler = () => {
    if (customerToManage) {
      dispatch(setCustomerToManage(null));
    }
    setShowCustomerModal(!showCustomerModal);
  };

  return (
    <Modal
      isOpen={showCustomerModal}
      modalClassName={`modal-${style}`}
      toggle={closeModalHandler}
    >
      <ModalHeader toggle={closeModalHandler}></ModalHeader>
      <ModalBody>
        <p className={`text-${style} font-weight-bold`}>
          Confirmer la {actionText} de :
        </p>
        {showCustomerModalData(
          customerToManage?.selectedRows || customerToManage
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color={style}
          disabled={processing}
          onClick={() =>
            customerDeleteRestoreHandler(customerToManage, actionType, true)
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
          onClick={closeModalHandler}
        >
          Annuler
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CustomerModal;
