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
  const actionText = actionType === 'RESTORE' ? 'restoration' : 'deletion';
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
          Confirm {actionText} of order(s) :
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
              <span className='ml-50'>Processing...</span>
            </>
          ) : (
            'Confirm'
          )}
        </Button>
        <Button
          color='secondary'
          disabled={processing}
          onClick={() => setShowOrderModal(!showOrderModal)}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OrderModal;
