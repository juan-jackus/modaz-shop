import { useState, useEffect } from 'react';
// ** Redux Store and Actions
import { useDispatch } from 'react-redux';
import { updateSlidesOrder, getSlide } from '@store/actions/carousel';
import { onImageError } from '@utils';

import { ReactSortable } from 'react-sortablejs';
import { Col } from 'reactstrap';

const DndCards = ({ publishedSlides, setshowSlideModal }) => {
  const dispatch = useDispatch();
  const [cardsArr, setCardsArr] = useState([]);

  useEffect(() => {
    setCardsArr(publishedSlides);
  }, [publishedSlides]);

  const onSort = (evt) => {
    dispatch(updateSlidesOrder(cardsArr));
  };

  return (
    <ReactSortable
      className='row sortable-carousel-img mb-2'
      list={cardsArr}
      setList={setCardsArr}
      onSort={onSort}
    >
      {cardsArr.map((slide, i) => {
        return (
          <Col
            className='draggable py-1 border  '
            lg='6'
            xs='6'
            md='4'
            key={i}
            onClick={() => {
              // Remove 'Chosen' field
              const slideCopie = { ...slide };
              delete slideCopie.chosen;
              dispatch(getSlide(_, slideCopie));
              setshowSlideModal(true);
            }}
          >
            <img src={slide.img} onError={onImageError} alt='' />
            <p className='sotable-img-overlay'>{i + 1}</p>
          </Col>
        );
      })}
    </ReactSortable>
  );
};

export default DndCards;
