import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/swiper-bundle.min.css';
// import 'swiper/swiper.min.css';
import { awardsData } from './aboutUsData';
// import './awardSlider.css';

function AwardsSlider() {
  const settings = {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 30,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    speed: 2000,
    breakpoints: {
      768: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    },
  };

  return (
    <div className="awardSectionWrapper">
      <h2>Awards And Recognitions</h2>
      <div className="awardsSliderContainer">
        <Swiper {...settings}>
          {awardsData.map((award, index) => (
            <SwiperSlide key={index} className="awardSlide">
              <div className="awardPaper">
                <img
                  src={award.img}
                  alt="Certificate of Appreciation"
                  className="awardsSliderImage"
                />
                <h3 className="awardsSliderImageHeader">{award.title}</h3>
                <p className="awardsSliderImageDescription">{award.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default AwardsSlider;
