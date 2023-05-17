import axios from '../axiosConfig';
import errorsHandler from '../errors';

// ** GET ALL CAROUSEL IMAGE
export const getAllSlides = () => {
  return async (dispatch) => {
    await axios
      .get('/carousel')
      .then(async (res) => {
        // console.log(res.data.allSlides);
        await dispatch({
          type: 'GET_ALL_SLIDES',
          allSlides: res.data.allSlides,
          publishedSlides: res.data.publishedSlides,
          draftedSlides: res.data.draftedSlides,
          publishedSlidesCount: res.data.publishedSlidesCount,
          slidesCount: res.data.slidesCount,
        });
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
  };
};

// ** GET CAROUSEL SLIDE
export const getSlide = (id, slide) => {
  return async (dispatch, getState) => {
    if (slide) {
      return await dispatch({ type: 'GET_SLIDE', selectedSlide: slide });
    }
    const foundCarousel = getState().modazImg.allSlides.find(
      (el) => el.id === id
    );
    if (foundCarousel) {
      await dispatch({
        type: 'GET_SLIDE',
        selectedSlide: foundCarousel,
      });
    }
  };
};

// ** ADD NEW CAROUSEL SLIDE
export const addSlide = (newSlide) => {
  let successSubmit = false;
  return async (dispatch) => {
    await axios
      .post('/carousel', newSlide, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async (res) => {
        successSubmit = true;
        await dispatch(getAllSlides());
      })
      .catch((error) => {
        const action = 'ADD_SLIDE_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};

// ** UPDATE CAROUSEL SLIDE
export const updateSlide = (updatedSlide, carouselId) => {
  return async (dispatch) => {
    let successSubmit = false;
    await axios
      .patch(`/carousel/${carouselId}`, updatedSlide, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async () => {
        successSubmit = true;
        await dispatch(getAllSlides());
      })
      .catch(async (error) => {
        const action = 'ADD_SLIDE_ERRORS';
        errorsHandler(error, action, dispatch);
      });
    return successSubmit;
  };
};

// ** UPDATE CAROUSEL SLIDE ORDER
export const updateSlidesOrder = (slides) => {
  return async (dispatch) => {
    await axios
      .patch(`/carousel/update-order`, { slides })
      .then(async (res) => {
        // console.log(res.data);
        await dispatch(getAllSlides());
      })
      .catch(async (error) => {
        errorsHandler(error, null, dispatch);
      });
  };
};

// ** REMOVE SELECTED CAROUSEL SLIDE
export const removeSelectedSlide = () => {
  return async (dispatch) => {
    await dispatch({
      type: 'REMOVE_SELECTED_SLIDE',
    });
  };
};

// ** DELETE CAROUSEL SLIDE
export const deleteSlide = (carousel) => {
  let successDeletion = false;
  return async (dispatch) => {
    await axios
      .delete('/carousel', { data: { id: carousel.id, imgUrl: carousel.img } })
      .then(async (res) => {
        successDeletion = true;
        await dispatch(getAllSlides());
      })
      .catch((error) => {
        const action = null;
        errorsHandler(error, action, dispatch);
      });
    return successDeletion;
  };
};
