// ** React
import { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
// ** Redux Store and Actions
import { useSelector, useDispatch } from 'react-redux';
import {
  addProduct,
  updateProduct,
  removeSelectedProduct,
  setProductToManage,
} from '@src/redux/actions/products';
// ** Form and Validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productSchema } from './SchemaProduct';
// ** Third Party Components
import { toast, Slide } from 'react-toastify';
// ** Utils
import { fileUploadHandler, capitalize } from '@utils';
import { serialize } from 'object-to-formdata';
// ** Custom Components
import ToastContent from '../../users/ToastContent.jsx';
import ProductForm from './ProductForm.jsx';
import Breadcrumbs from '@components/breadcrumbs';

const ProductEdit = () => {
  // ** Variables
  const dispatch = useDispatch(),
    history = useHistory(),
    user = useSelector((state) => state.auth.userData),
    productErrors = useSelector((state) => state.errors.addProduct),
    selectedProduct = useSelector((state) => state.products.selectedProduct),
    productCategories = useSelector(
      (state) => state.products.productCategories
    );
  let productId = null;
  if (selectedProduct) {
    productId = selectedProduct.id;
    if (selectedProduct.gender) {
      selectedProduct.gender = {
        label: _.upperFirst(selectedProduct.gender),
        value: selectedProduct.gender,
      };
    }
    selectedProduct.categories = selectedProduct.categories.map((c) => {
      // eslint-disable-next-line
      return productCategories.find((category) => category.value == c);
    });
  }
  // ** States
  const [imgArray, setImgArray] = useState(selectedProduct?.images || []),
    [previewImgArray, setPreviewImgArray] = useState(imgArray),
    [resetImg, setResetImg] = useState(Date.now()),
    [notEditable, setNotEditable] = useState(selectedProduct !== null),
    [zoomImage, setZoomImage] = useState(null),
    [isSubmitting, setIsSubmitting] = useState(false),
    [rating, setRating] = useState(selectedProduct?.moreInfos?.rating || 0),
    [colorPicker, setColorPicker] = useState(false),
    [colorsArray, setColorsArray] = useState(
      selectedProduct?.moreInfos?.colors || []
    );
  // ** React Hook Form Initialization
  const {
    reset,
    errors,
    control,
    register,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(productSchema),
    defaultValues: selectedProduct || {},
  });

  useEffect(() => {
    return () => dispatch(removeSelectedProduct());
  }, []);

  // ** Set server Errors response
  useEffect(() => {
    if (productErrors) {
      let imgError;
      productErrors.forEach((error) => {
        if (error.param === 'img') imgError = 'img';
        setError(error.param, {
          type: 'manual',
          message: error.msg,
        });
      });

      if (imgError) {
        setTimeout(() => {
          clearErrors('img');
        }, 5000);
      }
      dispatch({
        type: 'CLEAR_ERRORS',
        data: 'addProduct',
      });
    }
  }, [productErrors]);

  const addImgHandler = (img) => {
    const updatedImgArray = [...imgArray];
    updatedImgArray.push(img);
    setImgArray(updatedImgArray);
  };

  const addPreviewImgHandler = (previewImg) => {
    const updatedPreviewImgArray = [...previewImgArray];
    updatedPreviewImgArray.push(previewImg);
    setPreviewImgArray(updatedPreviewImgArray);
  };

  const setProductImgPosition = (prevPos, newPos) => {
    const updatedImgArray = [...imgArray];
    const updatedPreviewImgArray = [...previewImgArray];
    // Swap position
    [updatedImgArray[prevPos], updatedImgArray[newPos]] = [
      updatedImgArray[newPos],
      updatedImgArray[prevPos],
    ];
    [updatedPreviewImgArray[prevPos], updatedPreviewImgArray[newPos]] = [
      updatedPreviewImgArray[newPos],
      updatedPreviewImgArray[prevPos],
    ];
    setImgArray(updatedImgArray);
    setPreviewImgArray(updatedPreviewImgArray);
    setZoomImage(null);
  };

  // ** File Upload Handler
  const onFileChange = (e) => {
    const imgType = 'productImg';
    const imgFile = e.target?.files[0];
    if (imgFile) {
      fileUploadHandler(
        imgFile,
        addImgHandler,
        addPreviewImgHandler,
        setResetImg,
        setError,
        clearErrors,
        imgType
      );
    }
  };

  // ** Show Color Picker Handler
  const handleColorPicker = (val) => {
    if (val !== undefined) {
      setColorPicker(val);
    } else {
      setColorPicker(false);
    }
  };

  // ** Color Change Handler
  const handleColorChange = (color, i) => {
    if (color) {
      setColorsArray((prevColors) => {
        const updatedColors = [...prevColors];
        updatedColors[i] = color.hex;
        return updatedColors;
      });
    } else {
      setColorsArray((prevColorsArray) => {
        const updatedColors = [...prevColorsArray];
        updatedColors.push('#babfc7');
        return updatedColors;
      });
      setColorPicker(colorsArray.length);
    }
  };

  // ** Delete Color Handler
  const handleDeleteColor = (index) => {
    setColorsArray((prevColorsArray) => {
      const updatedColors = [...prevColorsArray];
      updatedColors.splice(index, 1);
      return updatedColors;
    });
  };

  // ** Delete Product Image Handler
  const handleDeleteProductImg = (index) => {
    const updatedImgArray = [...imgArray];
    const updatedPreviewImgArray = [...previewImgArray];
    updatedImgArray.splice(index, 1);
    updatedPreviewImgArray.splice(index, 1);
    setImgArray(updatedImgArray);
    setPreviewImgArray(updatedPreviewImgArray);
    setResetImg(Date.now());
  };

  // ** Form Edit and Reset Handler
  const handleFormEdit = async () => {
    if (notEditable) {
      setNotEditable(false);
    } else {
      reset(selectedProduct);
      setNotEditable(true);
      setColorPicker(false);
      setResetImg(Date.now());
      setImgArray(selectedProduct?.images || []);
      setPreviewImgArray(selectedProduct?.images || []);
      setRating(selectedProduct?.moreInfos?.rating || 0);
      setColorsArray(selectedProduct?.moreInfos?.colors || []);
    }
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    const processData = selectedProduct ? updateProduct : addProduct;
    values.name = capitalize(values.name);
    values.moreInfos.brand = capitalize(values.moreInfos.brand);
    values.moreInfos.colors = colorsArray.join();
    values.moreInfos.rating = rating;
    values.quantity = parseInt(values.quantity);
    values.price = parseFloat(values.price);
    values.gender = values.gender?.value || '';
    values.categories = values.categories.map((category) => category.value);
    delete values.images;
    // Transform values to Form Data
    const productData = serialize(values);
    // Add all Images to Form Data
    imgArray.forEach((img, i) => {
      // Save file image position
      if (typeof img === 'object') {
        productData.append('filePosition[]', i);
        productData.append('productImg', img);
      } else {
        productData.append('imagesUrl[]', img);
      }
    });
    // for (const value of productData.values()) {
    //   console.log(value);
    // }
    const successSubmit = await dispatch(
      processData(productData, productId)
    ).then((res) => {
      setIsSubmitting(false);
      return res;
    });
    const toastValue = successSubmit
      ? {
          type: 'success',
          text: `Product successfully ${
            selectedProduct ? 'modified' : 'added'
          }!`,
        }
      : {
          type: 'error',
          text: `Failed to ${selectedProduct ? 'modify' : 'add'} product!`,
        };
    toast[toastValue.type](ToastContent(toastValue), {
      transition: Slide,
      hideProgressBar: true,
      autoClose: 3000,
      pauseOnHover: true,
    });

    if (successSubmit && !selectedProduct) {
      reset();
      setImgArray([]);
      setPreviewImgArray([]);
      setResetImg(Date.now());
      setColorsArray([]);
      setRating(0);
    } else if (successSubmit) setNotEditable(true);
  };

  return (
    <Fragment>
      <Breadcrumbs
        breadCrumbTitle={selectedProduct ? 'Edit Product' : 'Add Product'}
        breadCrumbParent='Products'
        breadCrumbActive={selectedProduct ? 'Edit' : 'Add'}
      />

      <ProductForm
        user={user}
        errors={errors}
        rating={rating}
        control={control}
        history={history}
        dispatch={dispatch}
        onSubmit={onSubmit}
        imgArray={imgArray}
        resetImg={resetImg}
        register={register}
        zoomImage={zoomImage}
        setRating={setRating}
        colorsArray={colorsArray}
        colorPicker={colorPicker}
        notEditable={notEditable}
        handleSubmit={handleSubmit}
        setZoomImage={setZoomImage}
        onFileChange={onFileChange}
        isSubmitting={isSubmitting}
        handleFormEdit={handleFormEdit}
        selectedProduct={selectedProduct}
        previewImgArray={previewImgArray}
        productCategories={productCategories}
        handleDeleteColor={handleDeleteColor}
        handleColorPicker={handleColorPicker}
        handleColorChange={handleColorChange}
        setProductToManage={setProductToManage}
        setProductImgPosition={setProductImgPosition}
        handleDeleteProductImg={handleDeleteProductImg}
      />
    </Fragment>
  );
};
export default ProductEdit;
