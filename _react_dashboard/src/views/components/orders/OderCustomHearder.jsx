// ** Styling Components
import { Trash2 } from 'react-feather';
import { Label, Button, CustomInput } from 'reactstrap';

// ** Table Custom Header
const OrderCustomHeader = ({
  totalOrder,
  showTrash,
  rowsPerPage,
  selectedRows,
  toggleSidebar,
  setRowsPerPage,
  getTrashedOrders,
  oderDeleteRestoreHandler,
}) => {
  const trashBtnColor = showTrash ? '#fbdddd' : 'inherit';
  return (
    <div className='invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75'>
      <div className='d-flex align-items-center my-1'>
        <Label for='rows-per-page'>Afficher</Label>
        <CustomInput
          className='form-control mx-50'
          type='select'
          id='rows-per-page'
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(e.currentTarget.value)}
          style={{
            width: '5rem',
            padding: '0 0.8rem',
            backgroundPosition:
              'calc(100% - 3px) 11px, calc(100% - 20px) 13px, 100% 0',
          }}
        >
          <option value='10'>10</option>
          <option value='25'>25</option>
          <option value='50'>50</option>
        </CustomInput>
        <Label for='rows-per-page' className='mr-1'>
          Entrés sur
        </Label>
        <CustomInput
          className='form-control text-center mr-3'
          type='text'
          id='rows-per-page'
          value={totalOrder}
          readOnly
          style={{ width: '3rem', padding: '0.5rem' }}
        />
        {selectedRows?.selectedCount > 0 ? (
          <>
            {/* Delete Button */}
            <Button.Ripple
              color='danger'
              className='mr-1'
              onClick={() => oderDeleteRestoreHandler(selectedRows)}
            >
              Supprimer
            </Button.Ripple>
            {/* Restore Button */}
            {showTrash && (
              <Button.Ripple
                color='warning'
                onClick={() =>
                  oderDeleteRestoreHandler(selectedRows, 'RESTORE')
                }
              >
                Restaurer
              </Button.Ripple>
            )}
          </>
        ) : (
          // Add Button
          !showTrash && (
            <div className='text-nowrap mr-1'>
              <Button.Ripple color='primary' onClick={() => toggleSidebar()}>
                Ajouter une commande
              </Button.Ripple>
            </div>
          )
        )}
        <div className='ml-auto text-nowrap'>
          <Button.Ripple
            color='danger'
            outline
            style={{ backgroundColor: trashBtnColor }}
            onClick={() => getTrashedOrders()}
          >
            <Trash2 className='mr-50' size={15} />
            Corbeille
          </Button.Ripple>
        </div>
      </div>
    </div>
  );
};

export default OrderCustomHeader;
