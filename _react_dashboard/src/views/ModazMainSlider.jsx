// ** React
import { useState, useEffect } from 'react';
// ** Redux Store and Actions
import { useSelector, useDispatch } from 'react-redux';
import { getAllSlides, getSlide } from '@store/actions/carousel';
import { onImageError } from '@utils';
// ** Third Party Components
import classnames from 'classnames';
// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs';
import SlideImgModal from './components/modazMainSlider/SlideImgModal';
import DragAndDropCards from './components/modazMainSlider/DragAndDropCards';
import ModazMainCarousel from './components/modazMainSlider/ModazMainCarousel';
// ** Styling Components
import { Alert, Row, Col, Button, FormText, Spinner } from 'reactstrap';

const ModazHomePage = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const modazImgStore = useSelector((state) => state.modazImg);
  const { allSlides, publishedSlides, draftedSlides, slidesCount } =
    modazImgStore;
  const [showSlideModal, setshowSlideModal] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  // ** Get All Slide
  useEffect(async () => {
    setLoadingData(true);
    await dispatch(getAllSlides());
    setLoadingData(false);
  }, []);

  useEffect(() => {}, [allSlides]);

  return (
    <div id='modaz-homepage'>
      <Breadcrumbs
        breadCrumbTitle="Carrousel de la page d'accueil de Modaz Shop"
        breadCrumbActive='Modaz carousel'
      />
      <div className='container'>
        {/* Loarder */}
        {loadingData && (
          <div className=' mt-5 p-3 d-flex justify-content-center '>
            <Spinner id='datable-loader' />
          </div>
        )}
        <Row className={classnames({ 'd-none': loadingData })}>
          <Col lg='9' className='mb-2'>
            {publishedSlides.length ? (
              <div className='mb-3'>
                <Alert color='primary text-center d-block  '>
                  <div className='alert-body'>
                    Cliquez sur l'icône de la roue dans la diapositive pour
                    modifier l'image.
                  </div>
                </Alert>
                <ModazMainCarousel
                  publishedSlides={publishedSlides}
                  setshowSlideModal={setshowSlideModal}
                />
              </div>
            ) : (
              <div className='no-carousel-img mb-3'>
                <h4>Il n'y a pas d'image dans le carrousel !</h4>
              </div>
            )}
            {/* Add Slide Button */}
            <Col md='6' lg='6' className='mx-auto'>
              <Button.Ripple
                className='w-100'
                color='primary'
                onClick={() => setshowSlideModal(!showSlideModal)}
                disabled={slidesCount >= 10}
              >
                AJOUTER UNE DIAPOSITIVE
              </Button.Ripple>
            </Col>
          </Col>
          <Col lg='3' className='mb-2 '>
            <Alert color='primary text-center'>
              <div className='alert-body'>
                <span className=''>
                  Faire glisser les images pour réorganiser les diapositives{' '}
                </span>
                <br />
                <span className='d-none d-sm-block '>
                  cliquer pour modifier
                </span>
              </div>
            </Alert>
            <FormText className='text-center mb-1'>
              Nombre maximum de diapositives publiées : (5)
            </FormText>
            {/* Show all Slide & Reorder Slide */}
            <DragAndDropCards
              publishedSlides={publishedSlides}
              setshowSlideModal={setshowSlideModal}
            />
            {/* Drafted Slides */}
            {draftedSlides.length > 0 && (
              <p className=' text-center '>Diapositives non publiées</p>
            )}
            <Row>
              {draftedSlides.map((slide, i) => {
                return (
                  <Col
                    className='drafted-slide py-1 border  '
                    lg='6'
                    xs='6'
                    md='4'
                    key={i}
                    onClick={() => {
                      dispatch(getSlide(_, slide));
                      setshowSlideModal(true);
                    }}
                  >
                    <img src={slide.img} onError={onImageError} alt='' />
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </div>
      {/* Slide Modal */}
      {showSlideModal && (
        <SlideImgModal
          showSlideModal={showSlideModal}
          setshowSlideModal={setshowSlideModal}
        />
      )}
    </div>
  );
};

export default ModazHomePage;
