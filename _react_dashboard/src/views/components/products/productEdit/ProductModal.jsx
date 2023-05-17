// ** Styling Components
import {
  Modal,
  Button,
  Spinner,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';

const ProductModal = (props) => {
  // ** Props
  const {
    dispatch,
    processing,
    actionType,
    productToManage,
    selectedProducts,
    showProductModal,
    setProductToManage,
    setShowProductModal,
    showProductModalData,
    productDeleteRestoreHandler,
  } = props;
  const actionText = actionType === 'RESTORE' ? 'restauration' : 'suppression';
  const style = actionType === 'RESTORE' ? 'warning' : 'danger';
  // ** Close Modal Handler
  const closeModalHandler = () => {
    if (productToManage) {
      dispatch(setProductToManage(null));
    }
    setShowProductModal(!showProductModal);
  };

  return (
    <Modal
      isOpen={showProductModal}
      modalClassName={`modal-${style}`}
      toggle={closeModalHandler}
    >
      <ModalHeader toggle={closeModalHandler}></ModalHeader>
      <ModalBody>
        <p className={`text-${style} font-weight-bold`}>
          Confirmer la {actionText}
          {!productToManage && selectedProducts.length > 1 && (
            <span> de {selectedProducts.length} produits</span>
          )}{' '}
          :
        </p>
        {showProductModalData()}
      </ModalBody>
      <ModalFooter>
        <Button
          color={style}
          disabled={processing}
          onClick={() => productDeleteRestoreHandler()}
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

export default ProductModal;
