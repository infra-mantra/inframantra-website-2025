import React, { useState, useEffect } from 'react';
import Button from '../button/button';
import ClientTestimony from './clientTestimonyHomePage/clientTestimony';
import { clientData } from './clientTestimonyData';
import { useRouter } from 'next/router'; // Import useRouter from Next.js
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper';

import "swiper/css";
import 'swiper/swiper-bundle.css';

function ClientTestimonySection() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 769);
    setIsMobile(window.innerWidth <= 769);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
  
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  const [currentTestimonyIndex, setCurrentTestimonyIndex] = useState(0);
  const [transition, setTransition] = useState(false);
  const router = useRouter(); // Use useRouter

  const handleNext = () => {
    setTransition(true);
    setTimeout(() => {
      setCurrentTestimonyIndex(
        (prevIndex) => (prevIndex + 1) % clientData.length
      );
      setTransition(false);
    }, 500);
  };

  const handlePrev = () => {
    setTransition(true);
    setTimeout(() => {
      setCurrentTestimonyIndex(
        (prevIndex) => (prevIndex - 1 + clientData.length) % clientData.length
      );
      setTransition(false);
    }, 500);
  };

  const navigateUrl = () => {
    router.push('/testimonials'); // Use router to navigate
  };

  return (
    <div className="clientTestimonyWrapper">
      {isDesktop && (
        <>
          <div className="clientTestimonyHeaderSection">
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Satisfied%20Customers%201.avif"
              alt="Testimony1"
              className="clientTestimonyUpperSectionImg"
              style={{
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px',
              }}
            />
            <div className="clientTestimonyUpperSectionText">
              <div className="clientTestimonyUpperSectionHeaderFlex">
                <p className="clientTestimonyUpperSectionHeader">Hear From</p>
                <p className="clientTestimonyUpperSectionHeader">
                  Our
                  <span style={{ color: '#E7B554', marginLeft: '15px' }}>
                    Satisfied
                  </span>
                </p>
                <p className="clientTestimonyUpperSectionHeader">Customers</p>
              </div>
              <div className="clientTestimonyUpperSectionSubHeaderFlex">
                <p className="clientTestimonyUpperSectionSubHeader">
                  Discover why our clients love our
                </p>
                <p className="clientTestimonyUpperSectionSubHeader">
                  work through their own words.
                </p>
                <p className="clientTestimonyUpperSectionSubHeader">
                  Real feedback from real customers!
                </p>
              </div>
              <Button
                btnText="READ MORE"
                width="50%"
                padding="2%"
                fontWeight="900"
                onClick={navigateUrl} // Updated to use navigateUrl
                otherStyles={{ marginBottom: '25px', fontSize: '20px' }}
              />
            </div>
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Satisfied%20Customers%202.avif"
              alt="Testimony1"
              className="clientTestimonyUpperSectionImg"
              style={{
                borderTopLeftRadius: '20px',
                borderBottomLeftRadius: '20px',
              }}
            />
          </div>
          <div className="clientTestimonyTestimonySection">
            <button
              className="testimonyArrowBtn"
              style={{ left: '3%' }}
              onClick={handlePrev}
            >
              &#9664;
            </button>

            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 3000 }}
              pagination={{ clickable: true }}
              navigation={true}
              modules={[Navigation, Autoplay]}
              className="mySwiper"
            >
              {clientData.map((testimony, index) => (
                <SwiperSlide key={index}>
                  <ClientTestimony
                    img={testimony.image}
                    name={testimony.name}
                    testimony={testimony.description}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className="testimonyArrowBtn"
              style={{ right: '3%' }}
              onClick={handleNext}
            >
              &#9654;
            </button>
          </div>
        </>
      )}

      {!isDesktop && (
        <>
          <div className="clientTestimonyHeaderSection">
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Satisfied%20Customers%201.avif"
              alt="Testimony1"
              className="clientTestimonyUpperSectionImg"
              style={{
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px',
              }}
            />
            <div className="clientTestimonyHeaderSectionContentWrapper">
              <p>Hear From</p>
              <p>
                Our <span style={{ color: '#E7B554' }}>Satisfied</span>
              </p>
              <p>Customers</p>
            </div>
          </div>
          <div className="clientTestimonyHeaderSection">
            <p className="clientTestimonyUpperSectionSubHeader">
              Discover why our clients love our work through their own words.
              Real feedback from real customers!
            </p>
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Satisfied%20Customers%202.avif"
              alt="Testimony1"
              className="clientTestimonyUpperSectionImg"
              style={{
                borderTopLeftRadius: '20px',
                borderBottomLeftRadius: '20px',
              }}
            />
          </div>
          <div className="clientTestimonyTestimonySection">
            <button
              className="testimonyArrowBtn"
              style={{ left: '2%' }}
              onClick={handlePrev}
            >
              &#9664;
            </button>

            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 3000 }}
              pagination={{ clickable: true }}
              navigation={true}
              modules={[Navigation, Autoplay]}
              className="mySwiper"
            >
              {clientData.map((testimony, index) => (
                <SwiperSlide key={index}>
                  <ClientTestimony
                    img={testimony.image}
                    name={testimony.name}
                    testimony={testimony.description}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className="testimonyArrowBtn"
              style={{ right: '2%' }}
              onClick={handleNext}
            >
              &#9654;
            </button>
          </div>
          <div className="clientTestimonyBtnMobile">
            <Button
              btnText="READ MORE"
              width="50%"
              padding="1.5%"
              fontWeight="900"
              otherStyles={{
                marginBottom: '20px',
                maxWidth: '60%',
                fontSize: '12px',
              }}
              onClick={navigateUrl} // Updated to use navigateUrl
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ClientTestimonySection;
