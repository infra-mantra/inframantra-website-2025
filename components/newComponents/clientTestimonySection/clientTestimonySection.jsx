import React from 'react';
import Button from '../button/button';
import ClientTestimony from './clientTestimonyHomePage/clientTestimony';
import { clientData } from './clientTestimonyData';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper';
import styles from './clientTestimonySection.module.css';

import "swiper/css";
import "swiper/css/navigation";

function ClientTestimonySection() {
  const router = useRouter();

  const navigateUrl = () => {
    router.push('/testimonials');
  };

  return (
    <div className={styles.clientTestimonyWrapper}>
      <div className={styles.testimonialHeadingTextContainer}>
        <h2 className={styles.testimonialHeadingText}>
          Trusted by Homebuyers{" "}  
        </h2>
        <p style={{ color: "#000000ff" }}>
          Real experiences from people who found their dream homes with us.
        </p>
      </div>

      <div className={styles.clientTestimonyTestimonySection}>
        {/* Custom Prev Button */}
        <button className={`swiper-button-prev ${styles.testimonyArrowBtn}`}>
          &#9664;
        </button>

        <Swiper
          spaceBetween={30}
          loop={true}
          autoplay={{ delay: 3000 }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Autoplay, Navigation]}
          className="mySwiper"
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 20 },   // mobile
            768: { slidesPerView: 3, spaceBetween: 30 }, // desktop
          }}
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

        {/* Custom Next Button */}
        <button className={`swiper-button-next ${styles.testimonyArrowBtn}`}>
      
        </button>
      </div>

      <a className={styles.exploreMoreLink} href={`/testimonials`}>
        Explore Media blogs and more
      </a>
    </div>
  );
}

export default ClientTestimonySection;
