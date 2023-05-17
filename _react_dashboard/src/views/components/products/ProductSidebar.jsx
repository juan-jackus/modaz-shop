// ** Third Party Components
import classnames from 'classnames';
// ** Styling Components
import { Card, CardBody, Row, Col, CustomInput, Button } from 'reactstrap';
import '@styles/react/libs/noui-slider/noui-slider.scss';

const productSidebar = ({
  user,
  gender,
  setGender,
  priceRange,
  categories,
  sidebarOpen,
  inCollection,
  freeShipping,
  setPriceRange,
  setRemountKey,
  setCategories,
  setCurrentPage,
  setFreeShipping,
  setInCollection,
  productCategories,
}) => {
  // ** Array of gender options
  const genderOptions = [
    { value: '', label: 'All' },
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
  ];
  // ** Array of Price Range options
  const priceRangeOptions = [
    { value: '', label: 'All' },
    { value: '0,25', label: 'under $25' },
    { value: '25,150', label: '$25 - $150' },
    { value: '150,500', label: '$150 - $500' },
    { value: '500,1000', label: '$500 - $1000' },
    { value: '1000', label: 'above $1000' },
  ];

  // ** Price Range Filter Handler
  const genderFilterHandler = (e) => {
    if (e.currentTarget.checked) {
      setGender(e.currentTarget.value);
      setCurrentPage(1);
    }
  };

  // ** Price Range Filter Handler
  const priceRangeFilterHandler = (e) => {
    if (e.currentTarget.checked) {
      setPriceRange(e.currentTarget.value);
      setCurrentPage(1);
    }
  };

  // ** My Collection Filter
  const inCollectionFilterHandler = (e) => {
    setInCollection(e.currentTarget.checked);
    setCurrentPage(1);
  };

  // ** Filter by Free Shipping Handler
  const freeShippingFilterHandler = (e) => {
    setFreeShipping(e.currentTarget.checked);
    setCurrentPage(1);
  };

  // ** Categorie Filter Handler
  const categoriesFilterHandler = (e) => {
    let categoriesArray = categories;
    const value = e.currentTarget.value;
    const checked = e.currentTarget.checked;
    if (checked && !categoriesArray.includes(value)) {
      categoriesArray.push(value);
    } else {
      // eslint-disable-next-line
      categoriesArray = categoriesArray.filter((c) => c != value);
    }
    setCategories([...categoriesArray]);
    setCurrentPage(1);
  };
  // ** Reset Filter
  const resetFilterHandler = () => {
    setFreeShipping(false);
    setPriceRange('');
    setCategories([]);
    setCurrentPage(1);
    setRemountKey(Date.now());
  };

  return (
    <div className='sidebar-detached sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('sidebar-shop', {
            show: sidebarOpen,
          })}
        >
          <Row>
            <Col sm='12'>
              <h6 className='filter-heading d-none d-lg-block'>Filters</h6>
            </Col>
          </Row>
          <Card>
            <CardBody>
              {/* In Collection Filter */}
              {user.username === 'juan-jackus' && (
                <div className='d-flex my-2'>
                  <h6 className='filter-title my-0 mr-1'>My Collection</h6>
                  <CustomInput
                    type='checkbox'
                    id='inCollection-filter'
                    label=''
                    defaultChecked={inCollection}
                    onChange={inCollectionFilterHandler}
                  />
                </div>
              )}
              {/* Gender Radio */}
              <div>
                <h6 className='filter-title mt-0'>Gender</h6>
                <ul className='list-unstyled gender'>
                  {genderOptions.map((opt, i) => {
                    return (
                      <li key={opt.value}>
                        <CustomInput
                          className='mb-1'
                          type='radio'
                          id={`gender${i}`}
                          name='gender-radio'
                          value={opt.value}
                          label={opt.label}
                          defaultChecked={gender === opt.value}
                          onChange={genderFilterHandler}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
              {/* Free Shipping Filter */}
              <div className='d-flex my-2'>
                <h6 className='filter-title my-0 mr-1'>Free Shipping</h6>
                <CustomInput
                  type='checkbox'
                  id='freeshipping-filter'
                  label=''
                  defaultChecked={freeShipping}
                  onChange={freeShippingFilterHandler}
                />
              </div>
              {/* Price Range Radio */}
              <div>
                <h6 className='filter-title mt-0'>Price Range</h6>
                <ul className='list-unstyled price-range'>
                  {priceRangeOptions.map((pr, i) => {
                    return (
                      <li key={pr.value}>
                        <CustomInput
                          type='radio'
                          id={`price-range${i}`}
                          name='price-range-radio'
                          value={pr.value}
                          label={pr.label}
                          defaultChecked={priceRange === pr.value}
                          onChange={priceRangeFilterHandler}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
              {/* Categories Select */}
              <div>
                <h6 className='filter-title mt-1'>Categories</h6>
                <ul className='list-unstyled brand-list'>
                  {productCategories.map((cat, i) => {
                    return (
                      <li key={cat.value}>
                        <CustomInput
                          type='checkbox'
                          id={`categories-filter${i}`}
                          value={cat.value}
                          label={cat.label}
                          defaultChecked={categories.includes(
                            cat.value.toString()
                          )}
                          onChange={categoriesFilterHandler}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
              {/* Clear Filter Button */}
              <Button.Ripple
                className='w-100 mt-3'
                color='primary'
                outline
                onClick={resetFilterHandler}
              >
                Clear Filter
              </Button.Ripple>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default productSidebar;
