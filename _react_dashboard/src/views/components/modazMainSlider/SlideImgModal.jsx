import { useState, useEffect } from 'react';
// ** Redux Store and Actions
import { useDispatch, useSelector } from 'react-redux';
import {
  addSlide,
  updateSlide,
  deleteSlide,
  removeSelectedSlide,
} from '@store/actions/carousel';
// ** Form and Validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { carouselImgSchema } from './CarouselImgSchema';
// ** Third Party Components
import _ from 'lodash';
import { toast, Slide } from 'react-toastify';
// ** Utils
import { fileUploadHandler } from '@utils';
// ** Custom Components
import ModalForm from './ModalForm';
import ToastContent from '../users/ToastContent';
// ** Styling Components
import { Modal, Button, Spinner, ModalBody, ModalHeader } from 'reactstrap';

const SlideImgModal = ({ showSlideModal, setshowSlideModal }) => {
  const dispatch = useDispatch();
  const selectedSlide = useSelector((state) => state.modazImg.selectedSlide);
  // console.log(selectedSlide);
  if (selectedSlide) {
    // eslint-disable-next-line
    selectedSlide.status = selectedSlide.status == true ? 'true' : 'false';
  }
  const publishedSlidesCount = useSelector(
    (state) => state.modazImg.publishedSlidesCount
  );
  const carouselErrors = useSelector((state) => state.errors.addSlide);
  // ** States
  const [img, setImg] = useState(selectedSlide?.img || ''),
    [previewImg, setPreviewImg] = useState(selectedSlide?.img || ''),
    [resetImg, setResetImg] = useState(Date.now()),
    [isSubmitting, setIsSubmitting] = useState(false),
    [loadingImg, setLoadingImg] = useState(false),
    [confirmDeletion, setConfirmDeletion] = useState(false);

  // ** React Hook Form Initialization
  const { reset, errors, register, setError, clearErrors, handleSubmit } =
    useForm({
      mode: 'onBlur',
      resolver: yupResolver(carouselImgSchema),
      defaultValues: selectedSlide || {},
    });

  // ** Remove selected Carousel on unMount
  useEffect(() => {
    return () => {
      dispatch(removeSelectedSlide());
    };
  }, []);

  // ** Set server Errors response
  useEffect(() => {
    if (carouselErrors) {
      carouselErrors.forEach((error) => {
        setError(error.param, {
          type: 'manual',
          message: error.msg,
        });
      });
      dispatch({
        type: 'CLEAR_ERRORS',
        data: 'addSlide',
      });
    }
  }, [carouselErrors]);

  // ** File Upload Handler
  const onFileChange = (e) => {
    const imgField = 'carouselImg';
    const imgFile = e.target?.files[0];
    if (imgFile) {
      fileUploadHandler(
        imgFile,
        setImg,
        setPreviewImg,
        setResetImg,
        setError,
        clearErrors,
        imgField,
        setLoadingImg
      );
    }
  };

  const deleteCarouselHandler = async () => {
    setIsSubmitting(true);
    const successDeletion = await dispatch(deleteSlide(selectedSlide)).then(
      (res) => res
    );
    setshowSlideModal(!showSlideModal);
    const toastValue = successDeletion
      ? {
          type: 'success',
          text: 'Success deletion of carousel',
        }
      : {
          type: 'error',
          text: 'Failed to delete carousel',
        };
    toast[toastValue.type](ToastContent(toastValue), {
      transition: Slide,
      hideProgressBar: false,
      autoClose: 3000,
      pauseOnHover: true,
    });
  };

  const onSubmit = async (values) => {
    // Return if no image uploaded
    if (!img) {
      setError('img', {
        type: 'matches',
        message: 'Image is required',
      });
      setTimeout(() => {
        clearErrors('img');
      }, 3500);
      return;
    }

    setIsSubmitting(true);
    const param = selectedSlide?.id || null;
    const processData = selectedSlide ? updateSlide : addSlide;
    values.img = img;
    values.link = `/${values.category}?textSearch=${encodeURI(values.title)}`;

    const carouselData = new FormData();
    for (const key in values) {
      carouselData.append(key, values[key] || '');
    }

    const successSubmit = await dispatch(processData(carouselData, param)).then(
      (res) => {
        setIsSubmitting(false);
        return res;
      }
    );

    let toastValue = {
      type: 'error',
      text: 'Creation/Modification of Carousel failed',
    };

    if (successSubmit) {
      toastValue = {
        type: 'success',
        text: 'Carousel added/modified',
      };
      // Close Modal when limit of slide
      if (selectedSlide || publishedSlidesCount + 1 >= 6) {
        setshowSlideModal(!showSlideModal);
      } else {
        setImg('');
        setPreviewImg('');
        setResetImg(Date.now());
        reset();
      }
    }
    toast[toastValue.type](ToastContent(toastValue), {
      transition: Slide,
      hideProgressBar: true,
      autoClose: 3000,
      pauseOnHover: true,
    });
  };

  return (
    <Modal
      isOpen={showSlideModal}
      toggle={() => setshowSlideModal(!showSlideModal)}
      className='modal-dialog-centered'
      fade={false}
    >
      <ModalHeader toggle={() => setshowSlideModal(!showSlideModal)}>
        {selectedSlide ? 'Edit Slide' : 'Add Slide'}
      </ModalHeader>
      {confirmDeletion ? (
        //  Deletion Message
        <ModalBody>
          <p className='text-danger font-weight-bold'>Confirm deletion ?</p>
          <div className='d-flex '>
            <Button.Ripple
              className='ml-auto mr-1'
              color='danger'
              disabled={isSubmitting}
              onClick={() => deleteCarouselHandler()}
            >
              {isSubmitting ? (
                <>
                  <Spinner size='sm' color='white' />
                  <span className='ml-50'>Deleting...</span>
                </>
              ) : (
                'Yes'
              )}
            </Button.Ripple>
            <Button.Ripple
              color='secondary'
              disabled={isSubmitting}
              onClick={() => setshowSlideModal(!showSlideModal)}
            >
              No
            </Button.Ripple>
          </div>
        </ModalBody>
      ) : (
        // Add & Update Form
        <ModalForm
          img={img}
          setImg={setImg}
          errors={errors}
          onSubmit={onSubmit}
          resetImg={resetImg}
          register={register}
          previewImg={previewImg}
          loadingImg={loadingImg}
          setResetImg={setResetImg}
          onFileChange={onFileChange}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          confirmDeletion={confirmDeletion}
          selectedSlide={selectedSlide}
          setshowSlideModal={setshowSlideModal}
          setConfirmDeletion={setConfirmDeletion}
          publishedSlidesCount={publishedSlidesCount}
        />
      )}
    </Modal>
  );
};

export default SlideImgModal;
