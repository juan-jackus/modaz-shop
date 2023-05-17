// ** React Imports
import { Link } from 'react-router-dom';
// ** Utils
import _ from 'lodash';
// ** Styling Components
import { AlignLeft, Search, Trash2 } from 'react-feather';
import {
  Col,
  Row,
  Label,
  Input,
  Button,
  InputGroup,
  CustomInput,
  InputGroupText,
  InputGroupAddon,
} from 'reactstrap';

const BlogHeader = (props) => {
  // ** Props
  const {
    showTrash,
    setPerPage,
    searchTerm,
    totalPosts,
    remountKey,
    selectedPosts,
    setActionType,
    setSearchTerm,
    setCurrentPage,
    setSidebarOpen,
    getTrashedPosts,
    setShowPostModal,
  } = props;

  // ** Handele search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const trashBtnColor = showTrash ? '#fbdddd' : 'inherit';

  return (
    <div className=''>
      <Row>
        <Col sm='12'>
          <div className='d-flex flex-wrap align-items-center mt-1'>
            {/* Hamburguer Menu */}
            <button
              className='navbar-toggler sidebar-toggler mb-1'
              onClick={() => setSidebarOpen(true)}
            >
              <span className='text d-block d-lg-none mr-1'>
                <AlignLeft /> Filtres
              </span>
            </button>
            <div className=' d-flex align-items-center mb-1'>
              <Label for='posts-per-page'>Afficher</Label>
              <CustomInput
                className='form-control mx-50'
                type='select'
                id='posts-per-page'
                defaultValue='6'
                onChange={(e) => setPerPage(e.target.value)}
                style={{
                  width: '5rem',
                  padding: '0 0.8rem',
                  backgroundPosition:
                    'calc(100% - 3px) 11px, calc(100% - 20px) 13px, 100% 0',
                }}
              >
                <option value='6'>6</option>
                <option value='10'>10</option>
                <option value='14'>14</option>
              </CustomInput>
              <Label for='rows-per-page' className='mr-1'>
                Entrés sur
              </Label>
              <CustomInput
                className='form-control text-center mr-3'
                type='text'
                id='rows-per-page'
                value={totalPosts}
                readOnly
                style={{ width: '3rem', padding: '0.5rem' }}
              />
            </div>
            {/* Delete & Add Post Button */}
            <div className=' text-nowrap mb-1'>
              {selectedPosts.length ? (
                <>
                  {/* Delete Button */}
                  <Button.Ripple
                    color='danger'
                    className='mr-1'
                    onClick={() => {
                      setActionType('DELETE');
                      setShowPostModal(true);
                    }}
                  >
                    Supprimer
                  </Button.Ripple>
                  {/* Restore Button */}
                  {showTrash && (
                    <Button.Ripple
                      color='warning'
                      onClick={() => {
                        setActionType('RESTORE');
                        setShowPostModal(true);
                      }}
                    >
                      Restaurer
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
                    to='/blog/add'
                  >
                    Ajouter un article
                  </Button.Ripple>
                )
              )}
            </div>
            {/* Trash Button */}
            <div className='ml-auto mb-1 '>
              <Button.Ripple
                color='danger'
                outline
                style={{ backgroundColor: trashBtnColor }}
                onClick={() => getTrashedPosts()}
              >
                <Trash2 className='mr-50' size={15} />
                Corbeille
              </Button.Ripple>
            </div>
          </div>
        </Col>
        {/* POST SEARCH BAR */}
        <Col sm='12'>
          <div className='blog-searchbar mb-2'>
            <InputGroup className='input-group-merge'>
              <Input
                key={remountKey}
                className='search-post'
                placeholder='Search Post'
                defaultValue={searchTerm}
                onChange={_.debounce(handleSearch, 300)}
              />
              <InputGroupAddon addonType='append'>
                <InputGroupText>
                  <Search className='text-muted' size={14} />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BlogHeader;
