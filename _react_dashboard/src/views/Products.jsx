// ** React Imports
import { useState, useEffect, Fragment } from 'react';
// ** Redux Store and Actions
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUiState,
  getProduct,
  deleteProduct,
  restoreProduct,
  getProductsData,
  setProductToManage,
  deleteMultipleProduct,
  restoreMultipleProduct,
} from '@store/actions/products';
// ** Third Party Components
import _ from 'lodash';
import { toast, Slide } from 'react-toastify';
import classnames from 'classnames';
// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs';
import Sidebar from './components/products/ProductSidebar';
import ToastContent from './components/users/ToastContent';
import ProductCards from './components/products/ProductCards';
import ProductsHeader from './components/products/ProductsHeader';
import ProductsSearchbar from './components/products/ProductsSearchbar';
import ProductsPagination from './components/products/ProductsPagination';
import ProductModal from './components/products/productEdit/ProductModal';
// ** Styling Components
import { CustomInput, Container, Spinner } from 'reactstrap';
import '@styles/base/pages/app-ecommerce.scss';

const ProductsPage = () => {
  // ** Vars
  const dispatch = useDispatch();
  const { state } = useLocation();
  const user = useSelector((state) => state.auth.userData);
  const store = useSelector((state) => state.products);
  const { activeView = 'grid' } = store.uiState;
  const {
    params,
    products,
    totalPages,
    totalProducts,
    productToManage,
    productCategories,
  } = store;

  // ** States
  const [searchTerm, setSearchTerm] = useState(params.q || ''),
    [currentPage, setCurrentPage] = useState(params.page || 1),
    [perPage, setPerPage] = useState(params.perPage || 9),
    [sortByValue, setSortByValue] = useState(params.sortBy || 'newest'),
    [gender, setGender] = useState(params.gender || ''),
    [categories, setCategories] = useState(params.categories || []),
    [priceRange, setPriceRange] = useState(params.priceRange || ''),
    [inCollection, setInCollection] = useState(params.inCollection || false),
    [freeShipping, setFreeShipping] = useState(params.freeShipping || false),
    [showTrash, setShowTrash] = useState(params.trash || false),
    [selectedProducts, setSelectedProducts] = useState([]),
    [sidebarOpen, setSidebarOpen] = useState(false),
    [showProductModal, setShowProductModal] = useState(!!productToManage),
    [actionType, setActionType] = useState(state?.actionType || null),
    [processing, setProcessing] = useState(false),
    [remountKey, setRemountKey] = useState(0),
    [loadingData, setLoadingData] = useState(false);

  // ** Get All products
  useEffect(async () => {
    setLoadingData(true);
    await dispatch(
      getProductsData({
        q: searchTerm,
        page: currentPage,
        perPage,
        sortBy: sortByValue,
        gender,
        categories,
        priceRange,
        inCollection,
        freeShipping,
        trash: showTrash,
      })
    );
    setLoadingData(false);
  }, [
    searchTerm,
    currentPage,
    perPage,
    sortByValue,
    gender,
    categories,
    priceRange,
    inCollection,
    freeShipping,
    showTrash,
  ]);

  // ** Product selection handler
  const productSelectionHandler = (checked, product) => {
    if (checked) {
      setSelectedProducts((prevState) => {
        const updatedSelectedProducts = [...prevState];
        updatedSelectedProducts.push(product);
        return updatedSelectedProducts;
      });
    } else {
      setSelectedProducts((prevState) => {
        const updatedSelectedProducts = prevState.filter(
          (p) => p.id !== product.id
        );
        return updatedSelectedProducts;
      });
    }
  };
  // ** All Product selection handler
  const selectAllProductHandler = (e) => {
    const checked = e.currentTarget.checked;
    if (checked) {
      setSelectedProducts(products);
    } else {
      setSelectedProducts([]);
    }
  };
  // ** Trashed Product
  const getTrashedProducts = async () => {
    const trash = !showTrash;
    const sortBy = trash ? 'trash_desc' : 'newest';
    setCurrentPage(1);
    setShowTrash(trash);
    setSortByValue(sortBy);
    setSelectedProducts([]);
    setShowTrash(!showTrash);
  };
  // ** Show Product(s) to delete in deletion Modal
  const showProductModalData = () => {
    if (productToManage) {
      return (
        <ul>
          <li>{productToManage.name}</li>
        </ul>
      );
    } else if (selectedProducts.length) {
      return (
        <ul style={{ maxHeight: '300px', overflow: 'auto' }}>
          {selectedProducts.map((p, i) => (
            <li key={i}>{p.name}</li>
          ))}
        </ul>
      );
    }
  };
  // ** Product(s) deletion Handler
  const productDeleteRestoreHandler = async () => {
    setProcessing(true);
    let toastValue;
    const action = {
      single: deleteProduct,
      mutiple: deleteMultipleProduct,
      text: 'deletion',
    };
    // eslint-disable-next-line
    if (actionType == 'RESTORE') {
      action.single = restoreProduct;
      action.mutiple = restoreMultipleProduct;
      action.text = 'restore';
    }
    if (productToManage) {
      const successDeletion = await dispatch(
        action.single(productToManage, showTrash)
      ).then((res) => res);
      toastValue = successDeletion
        ? {
            type: 'success',
            text: `Success deletion of : ${productToManage.name}`,
          }
        : {
            type: 'error',
            text: `Failed to delete : ${productToManage.name}`,
          };
    } else if (selectedProducts.length) {
      // If there is many Products to delete
      const successDeletion = await dispatch(
        action.mutiple(selectedProducts, showTrash)
      ).then((res) => res);
      // Check if all deletion are successfull
      toastValue =
        successDeletion === selectedProducts.length
          ? {
              type: 'success',
              text: `Success ${action.text} of ${selectedProducts.length} product(s)`,
            }
          : {
              type: 'error',
              text: `Failed to ${action.text} ${
                selectedProducts.length - successDeletion
              } Product(s)`,
            };
    }
    setProcessing(false);
    setShowProductModal(!showProductModal);
    dispatch(setProductToManage(null));
    if (toastValue.type === 'success' && !productToManage) {
      setSelectedProducts([]);
    }
    toast[toastValue.type](ToastContent(toastValue, showProductModalData), {
      transition: Slide,
      autoClose: 5000,
      pauseOnHover: true,
      // hideProgressBar: true,
    });
  };

  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle='Products' breadCrumbActive='products' />
      <Container>
        <div className='content-detached content-right'>
          <div className='content-body'>
            <ProductsHeader
              dispatch={dispatch}
              perPage={perPage}
              showTrash={showTrash}
              setPerPage={setPerPage}
              sortByValue={sortByValue}
              activeView={activeView}
              setUiState={setUiState}
              setActionType={setActionType}
              totalProducts={totalProducts}
              setCurrentPage={setCurrentPage}
              setSortByValue={setSortByValue}
              setSidebarOpen={setSidebarOpen}
              selectedProducts={selectedProducts}
              getTrashedProducts={getTrashedProducts}
              setShowProductModal={setShowProductModal}
            />
            <div
              className={classnames('body-content-overlay', {
                show: sidebarOpen,
              })}
              onClick={() => setSidebarOpen(false)}
            ></div>
            <ProductsSearchbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setCurrentPage={setCurrentPage}
            />
            {/* Loarder */}
            {loadingData && (
              <div className=' p-3 d-flex justify-content-center '>
                <Spinner id='datable-loader' />
              </div>
            )}
            <div className={classnames({ 'd-none': loadingData })}>
              {/* Select All Product Toggler */}
              <div className='mt-2'>
                <CustomInput
                  type='checkbox'
                  id='toogle-selection'
                  label='Toogle selection of all products'
                  checked={
                    selectedProducts.length === perPage ||
                    selectedProducts.length === store.products.length
                  }
                  onChange={selectAllProductHandler}
                >
                  <span className='ml-1'>
                    {`(${selectedProducts.length}/${store.products.length})`}
                  </span>
                </CustomInput>
              </div>

              {store.totalProducts ? (
                <Fragment>
                  <ProductCards
                    dispatch={dispatch}
                    products={products}
                    showTrash={showTrash}
                    getProduct={getProduct}
                    activeView={activeView}
                    setActionType={setActionType}
                    selectedProducts={selectedProducts}
                    setProductToManage={setProductToManage}
                    setShowProductModal={setShowProductModal}
                    productSelectionHandler={productSelectionHandler}
                  />
                  <ProductsPagination
                    products={products}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                </Fragment>
              ) : (
                <div className='d-flex justify-content-center mt-2'>
                  <p>No Results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Sidebar
          user={user}
          gender={gender}
          key={remountKey}
          setGender={setGender}
          priceRange={priceRange}
          categories={categories}
          sidebarOpen={sidebarOpen}
          inCollection={inCollection}
          freeShipping={freeShipping}
          setCategories={setCategories}
          setRemountKey={setRemountKey}
          setPriceRange={setPriceRange}
          setCurrentPage={setCurrentPage}
          setInCollection={setInCollection}
          setFreeShipping={setFreeShipping}
          productCategories={productCategories}
        />
      </Container>
      {showProductModal && (
        <ProductModal
          dispatch={dispatch}
          actionType={actionType}
          processing={processing}
          productToManage={productToManage}
          selectedProducts={selectedProducts}
          setProductToManage={setProductToManage}
          showProductModal={showProductModal}
          showProductModalData={showProductModalData}
          setShowProductModal={setShowProductModal}
          productDeleteRestoreHandler={productDeleteRestoreHandler}
        />
      )}
    </Fragment>
  );
};

export default ProductsPage;
