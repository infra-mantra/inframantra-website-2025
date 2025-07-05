import React, { useState, useEffect } from 'react';
import Button from '../button/button';
import ClientTestimony from './clientTestimonyHomePage/clientTestimony';
import { clientData } from './clientTestimonyData';
import { useRouter } from 'next/router'; // Import useRouter from Next.js
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper';
import styles from './clientTestimonySection.module.css'; // Assuming you have a CSS module for styles

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
    <div className={styles.clientTestimonyWrapper}>
      {isDesktop && (
        <>
          <div className={styles.clientTestimonyHeaderSection}>
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Satisfied%20Customers%201.avif"
              alt="Testimony1"
              className={styles.clientTestimonyUpperSectionImg}
              style={{
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px',
              }}
            />
            <div className={styles.clientTestimonyUpperSectionText}>
              <div className={styles.clientTestimonyUpperSectionHeaderFlex}>
                <p className={styles.clientTestimonyUpperSectionHeader}>Hear From</p>
                <p className={styles.clientTestimonyUpperSectionHeader}>
                  Our
                  <span style={{ color: '#E7B554', marginLeft: '15px' }}>
                    Satisfied
                  </span>
                </p>
                <p className={styles.clientTestimonyUpperSectionHeader}>Customers</p>
              </div>
              <div className={styles.clientTestimonyUpperSectionSubHeaderFlex}>
                <p className={styles.clientTestimonyUpperSectionSubHeader}>
                  Discover why our clients love our
                </p>
                <p className={styles.clientTestimonyUpperSectionSubHeader}>
                  work through their own words.
                </p>
                <p className={styles.clientTestimonyUpperSectionSubHeader}>
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
              className={styles.clientTestimonyUpperSectionImg}
              style={{
                borderTopLeftRadius: '20px',
                borderBottomLeftRadius: '20px',
              }}
            />
          </div>
          <div className={styles.clientTestimonyTestimonySection}>
            <button
              className={styles.testimonyArrowBtn}
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
              className={styles.testimonyArrowBtn}
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
          <div className={styles.clientTestimonyHeaderSection}>
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Satisfied%20Customers%201.avif"
              alt="Testimony1"
              className={styles.clientTestimonyUpperSectionImg}
              style={{
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px',
              }}
            />
            <div className={styles.clientTestimonyHeaderSectionContentWrapper}>
              <p>Hear From</p>
              <p>
                Our <span style={{ color: '#E7B554' }}>Satisfied</span>
              </p>
              <p>Customers</p>
            </div>
          </div>
          <div className={styles.clientTestimonyHeaderSection}>
            <p className={styles.clientTestimonyUpperSectionSubHeader}>
              Discover why our clients love our work through their own words.
              Real feedback from real customers!
            </p>
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/Satisfied%20Customers%202.avif"
              alt="Testimony1"
              className={styles.clientTestimonyUpperSectionImg}
              style={{
                borderTopLeftRadius: '20px',
                borderBottomLeftRadius: '20px',
              }}
            />
          </div>
          <div className={styles.clientTestimonyTestimonySection}>
            {/* <button
              className={styles.testimonyArrowBtn}
              style={{ left: '2%' }}
              onClick={handlePrev}
            >
              &#9664;
            </button> */}

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

            {/* <button
              className={styles.testimonyArrowBtn}
              style={{ right: '2%' }}
              onClick={handleNext}
            >
              &#9654;
            </button> */}
          </div>
          <div className={styles.clientTestimonyBtnMobile}>
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
