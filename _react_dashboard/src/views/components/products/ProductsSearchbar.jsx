// ** Style Components
import { Search } from 'react-feather';
import {
  Col,
  Row,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
} from 'reactstrap';

const ProductsSearchbar = ({ searchTerm, setSearchTerm, setCurrentPage }) => {
  // ** Handele search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className='ecommerce-searchbar'>
      <Row className='mt-1'>
        <Col sm='12'>
          <InputGroup className='input-group-merge'>
            <Input
              className='search-product'
              placeholder='Rechercher un produit'
              defaultValue={searchTerm}
              onChange={_.debounce(handleSearch, 300)}
            />
            <InputGroupAddon addonType='append'>
              <InputGroupText>
                <Search className='text-muted' size={14} />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>
    </div>
  );
};

export default ProductsSearchbar;
