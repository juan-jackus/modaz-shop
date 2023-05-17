// ** React
import { useState, useEffect } from 'react';
// ** Redux Store and Actions
import { useDispatch } from 'react-redux';
import { getSlide } from '@store/actions/carousel';
// ** Utils
import { onImageError } from '@utils';
// ** Styling Components
import { Settings } from 'react-feather';
import {
  Button,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from 'reactstrap';

const ModazMainCarousel = ({ publishedSlides, setshowSlideModal }) => {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(0);

  useEffect(() => {}, [publishedSlides]);

  const onExiting = () => {
    setAnimating(true);
  };

  const onExited = () => {
    setAnimating(false);
  };

  const next = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === publishedSlides.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === 0 ? publishedSlides.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };
  // Render every Carousel slide
  const renderSlides = () =>
    publishedSlides.map((slide, i) => {
      const textColor = slide.textColor === 'white' ? 'white' : 'black';
      let titlePosition = 'align-items-end',
        iconPosition = 'settings-icon-right';
      if (slide.position === 'l') {
        titlePosition = 'align-items-start';
        iconPosition = 'settings-icon-left';
      }
      return (
        <CarouselItem onExiting={onExiting} onExited={onExited} key={slide.id}>
          <div
            className={iconPosition}
            onClick={() => {
              dispatch(getSlide(_, slide));
              setshowSlideModal(true);
            }}
          >
            <span className='carousel-caption-wrapper'>Slide {i + 1}</span>
            <Settings size={30} color='white' />
          </div>

          <img
            src={slide.img}
            className='img-fluid background-spinner'
            onError={onImageError}
          />
          <div className={`carousel-title  ${titlePosition}`}>
            <div className='titles'>
              <h1 style={{ color: textColor }}>{slide.text1}</h1>
              <h1 style={{ color: textColor }}>{slide.text2}</h1>
              <h1 style={{ color: textColor }}>{slide.text3}</h1>
            </div>
            <Button style={{ borderRadius: 0 }}>{slide.linkText}</Button>
          </div>
        </CarouselItem>
      );
    });

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
      keyboard={false}
      className='homepage-carousel'
      interval={3000}
      pause={'hover'}
    >
      <CarouselIndicators
        items={publishedSlides}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      />
      {renderSlides()}
      <CarouselControl
        direction='prev'
        directionText='Previous'
        onClickHandler={previous}
      />
      <CarouselControl
        direction='next'
        directionText='Next'
        onClickHandler={next}
      />
    </Carousel>
  );
};

export default ModazMainCarousel;
