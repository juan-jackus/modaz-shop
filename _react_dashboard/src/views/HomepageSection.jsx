import { useState } from 'react';
import { Button, Alert } from 'reactstrap';
import Breadcrumbs from '@components/breadcrumbs';
import { Settings } from 'react-feather';
import SlideImgModal from './components/modazMainSlider/SlideImgModal.jsx';

import imgbox1 from '@src/assets/images/section/imgbox1.jpg';
import imgbox2 from '@src/assets/images/section/imgbox2.jpg';
import imgbox3 from '@src/assets/images/section/imgbox3.jpg';
import imgbox4 from '@src/assets/images/section/imgbox4.jpg';
import bgParallax from '@src/assets/images/section/bg-parallax.jpg';

const HomepageSection = () => {
  const [showSlideModal, setshowSlideModal] = useState(false);
  return (
    <div id='homepage-section'>
      <Breadcrumbs
        breadCrumbTitle='Homepage Section'
        breadCrumbParent='Modaz Layouts'
        breadCrumbActive='Homepage Section'
      />
      <h3 className='text-center my-2'>Image Box Section</h3>
      <Alert color='primary'>
        <div className='alert-body text-center'>
          <span>Click to the button in image to edit them</span>
        </div>
      </Alert>
      <div className='img-box row justify-content-center '>
        <div className='img-wrapper p-0 mb-1 col-lg-3 col-sm-4 col-auto'>
          <img src={imgbox2} className='img-fluid' alt='for mens' />
          <div className='img-overlay'>
            <Button.Ripple onClick={() => setshowSlideModal(true)}>
              <span style={{ marginRight: '7px' }}>FOR MEN’S</span>{' '}
              <Settings size={17} />
            </Button.Ripple>
          </div>
        </div>
        <div className='mb-1 p-0 mx-1 col-lg-3 col-sm-4 col-auto'>
          <div className='img-wrapper '>
            <img src={imgbox1} className='img-fluid' alt='for kids' />
            <div className='img-overlay'>
              <Button.Ripple onClick={() => setshowSlideModal(true)}>
                <span style={{ marginRight: '7px' }}>FOR KID'S</span>
                <Settings size={17} />
              </Button.Ripple>
            </div>
          </div>
          <div className='img-wrapper mt-1'>
            <img src={imgbox3} className='img-fluid' alt='acs' />
            <div className='img-overlay'>
              <Button.Ripple onClick={() => setshowSlideModal(true)}>
                <span style={{ marginRight: '7px' }}>ACCESSORIES</span>{' '}
                <Settings size={17} />
              </Button.Ripple>
            </div>
          </div>
        </div>

        <div className='img-wrapper col-lg-3 col-sm-4 p-0 mb-1 col-auto'>
          <img src={imgbox4} className='img-fluid' alt='for women' />
          <div className='img-overlay'>
            <Button.Ripple onClick={() => setshowSlideModal(true)}>
              <span style={{ marginRight: '7px' }}>FOR WOMEN</span>{' '}
              <Settings size={17} />
            </Button.Ripple>
          </div>
        </div>
      </div>
      <h3 className='text-center my-2'>Parallax Image Box</h3>
      <section className='mt-2 img-parallax'>
        <img src={bgParallax} className='img-fluid' alt='bg-parallax' />
        <div className='img-overlay flex-column'>
          <h3>NEW TREND 2021</h3>
          <h1>Women‘s Collection</h1>
          <h4>Big Sale of this Week</h4>
          <Button.Ripple onClick={() => setshowSlideModal(true)}>
            <span style={{ marginRight: '7px' }}>SHOP NOW</span>{' '}
            <Settings size={17} />
          </Button.Ripple>
        </div>
      </section>
      <SlideImgModal
        showSlideModal={showSlideModal}
        setshowSlideModal={setshowSlideModal}
      />
    </div>
  );
};

export default HomepageSection;
