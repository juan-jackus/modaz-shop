// ** React Imports
import { Link } from 'react-router-dom';
// ** Third Party Components
import classnames from 'classnames';
// ** Styling Components
import { AlignLeft, Grid, List, Trash2 } from 'react-feather';
import {
  Col,
  Row,
  Label,
  Button,
  CustomInput,
  ButtonGroup,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from 'reactstrap';

const ProductsHeader = (props) => {
  // ** Props
  const {
    perPage,
    dispatch,
    showTrash,
    activeView,
    setPerPage,
    setUiState,
    sortByValue,
    setActionType,
    totalProducts,
    setCurrentPage,
    setSortByValue,
    setSidebarOpen,
    selectedProducts,
    getTrashedProducts,
    setShowProductModal,
  } = props;

  // ** Sorting options
  const sortByOptions = {
    newest: 'Newest',
    oldest: 'Oldest',
    price_desc: 'Highest Price',
    price_asc: 'Lowest Price',
    rating_desc: 'Rating Up',
    rating_asc: 'Rating Down',
  };
  const trashSortByOptions = {
    trash_desc: 'Recently Deleted',
    trash_asc: 'Oldest Deleted',
  };
  const selectedSortOption = showTrash ? trashSortByOptions : sortByOptions;
  const trashBtnColor = showTrash ? '#fbdddd' : 'inherit';

  // ** Render Sorting dropdown options
  const renderSortToggle = () => {
    return Object.keys(selectedSortOption).map((option, i) => {
      if (option === sortByValue) return null;
      return (
        <DropdownItem
          key={i}
          className='w-100'
          onClick={() => setSortByValue(option)}
        >
          {selectedSortOption[option]}
        </DropdownItem>
      );
    });
  };

  return (
    <Row>
      <Col sm='12' className='d-flex align-items-center'>
        {/* Hamburguer Menu */}
        <button
          className='navbar-toggler sidebar-toggler '
          onClick={() => setSidebarOpen(true)}
        >
          <span className='text d-block d-lg-none mr-1'>
            <AlignLeft /> Filter
          </span>
        </button>
        {/* Delete, Restore & Add Product(s) Button */}
        <div className=' text-nowrap '>
          {selectedProducts.length ? (
            <>
              {/* Delete Button */}
              <Button.Ripple
                color='danger'
                className='mr-1'
                onClick={() => {
                  setActionType('DELETE');
                  setShowProductModal(true);
                }}
              >
                Delete
              </Button.Ripple>
              {/* Restore Button */}
              {showTrash && (
                <Button.Ripple
                  color='warning'
                  onClick={() => {
                    setActionType('RESTORE');
                    setShowProductModal(true);
                  }}
                >
                  Restore
                </Button.Ripple>
              )}
            </>
          ) : (
            // Add Button
            !showTrash && (
              <Button.Ripple
                className='mr-1'
                color='primary'
                tag={Link}
                to='/products/add'
              >
                Add Product
              </Button.Ripple>
            )
          )}
        </div>
        {/* Trash Button */}
        <div className='ml-auto '>
          <Button.Ripple
            color='danger'
            outline
            style={{ backgroundColor: trashBtnColor }}
            onClick={() => getTrashedProducts()}
          >
            <Trash2 className='mr-50' size={15} />
            Trash
          </Button.Ripple>
        </div>
      </Col>
      <Col sm='12'>
        <div className='ecommerce-header-items'>
          <div className='d-flex align-items-center mt-1'>
            <Label for='products-per-page'>Show</Label>
            <CustomInput
              className='form-control mx-50'
              type='select'
              id='products-per-page'
              defaultValue={perPage}
              onChange={(e) => {
                setPerPage(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '5rem',
                padding: '0 0.8rem',
                backgroundPosition:
                  'calc(100% - 3px) 11px, calc(100% - 20px) 13px, 100% 0',
              }}
            >
              <option value='9'>9</option>
              <option value='18'>18</option>
              <option value='27'>27</option>
            </CustomInput>
            <Label for='rows-per-page' className='mr-1'>
              Entries of
            </Label>
            <CustomInput
              className='form-control text-center mr-3'
              type='text'
              id='rows-per-page'
              value={totalProducts}
              readOnly
              style={{ width: '3rem', padding: '0.5rem' }}
            />
          </div>
          <div className='view-options d-flex mt-1'>
            <UncontrolledButtonDropdown className='dropdown-sort'>
              <DropdownToggle
                className='text-capitalize mr-1'
                color='primary'
                outline
                caret
              >
                <span className='small '>sort By : </span>
                {selectedSortOption[sortByValue]}
              </DropdownToggle>
              <DropdownMenu>{renderSortToggle()}</DropdownMenu>
            </UncontrolledButtonDropdown>
            <ButtonGroup className='btn-group-toggle'>
              {/* Grid Button */}
              <Button
                tag='label'
                className={classnames('btn-icon view-btn grid-view-btn', {
                  active: activeView === 'grid',
                })}
                color='primary'
                outline
                onClick={() => dispatch(setUiState({ activeView: 'grid' }))}
              >
                <Grid size={18} />
              </Button>
              {/* List Button */}
              <Button
                tag='label'
                className={classnames('btn-icon view-btn list-view-btn', {
                  active: activeView === 'list',
                })}
                color='primary'
                outline
                onClick={() => dispatch(setUiState({ activeView: 'list' }))}
              >
                <List size={18} />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ProductsHeader;
