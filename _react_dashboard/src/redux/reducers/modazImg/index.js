// ** Initial State
const initialState = {
  allSlides: [],
  publishedSlides: [],
  draftedSlides: [],
  selectedSlide: null,
  publishedSlidesCount: 0,
  slidesCount: 0,
  sectionImg: {},
};

const carouselReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_SLIDES':
      return {
        ...state,
        allSlides: action.allSlides,
        publishedSlidesCount: action.publishedSlidesCount,
        draftedSlides: action.draftedSlides,
        publishedSlides: action.publishedSlides,
        slidesCount: action.slidesCount,
      };
    case 'GET_SLIDE':
      return { ...state, selectedSlide: action.selectedSlide };
    case 'REMOVE_SELECTED_SLIDE':
      return { ...state, selectedSlide: null };
    default:
      return state;
  }
};

export default carouselReducer;
