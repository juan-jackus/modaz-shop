// ** Styling Components
import {
  Modal,
  Button,
  Spinner,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';

const OrderModal = ({
  processing,
  actionType,
  orderToManage,
  showOrderModal,
  setShowOrderModal,
  showOderModalData,
  oderDeleteRestoreHandler,
}) => {
  const actionText = actionType === 'RESTORE' ? 'restauration' : 'suppression';
  const style = actionType === 'RESTORE' ? 'warning' : 'danger';
  return (
    <Modal
      isOpen={showOrderModal}
      modalClassName={`modal-${style}`}
      toggle={() => setShowOrderModal(!showOrderModal)}
    >
      <ModalHeader
        toggle={() => setShowOrderModal(!showOrderModal)}
      ></ModalHeader>
      <ModalBody>
        <p className={`text-${style} font-weight-bold`}>
          Confirmer la {actionText} des commandes :
        </p>
        {showOderModalData(orderToManage?.selectedRows || orderToManage)}
      </ModalBody>
      <ModalFooter>
        <Button
          color={style}
          disabled={processing}
          onClick={() =>
            oderDeleteRestoreHandler(orderToManage, actionType, true)
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
          onClick={() => setShowOrderModal(!showOrderModal)}
        >
          Annuler
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OrderModal;
