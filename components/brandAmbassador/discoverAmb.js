import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import "swiper/css";

import style from "../brandAmbassador/discoverAmb.module.css";
const Steps = () => {
  return (
    <div className={style.servicesSection}>
      <div className={`${style.pageWidth} ${style.container}`}>
        <div className={style.sectionHead}>
          <h2>Discover Our Services</h2>
        </div>
      </div>
      <div className={`${style.servicesGridsRow} ${style.tabletView}`}>
        <Swiper
          loop={false}
          speed={1000}
          spaceBetween={30}
          autoplay={{
            delay: 2000,
            disableOnInteraction: true,
          }}
          slidesPerView={1.2}
          breakpoints={{
            768: {
              slidesPerView: 2.5,
            },
            990: {
              slidesPerView: 3,
            },
            1080: {
              slidesPerView: 3.5,
            },
          }}
          modules={[Autoplay]}
        >
          <SwiperSlide>
            <div className={style.serviceGrid}>
              {/* <div className="home-discover-icon">Home Loan</div> */}
              <div className={style.content}>
                <h5>Site Visit</h5>
                <p>
                  {" "}
                  Explore your dream home with our property experts and understand every detail like surroundings, locality, and all the amenities of the project.
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={style.serviceGrid}>
              {/* <div className="home-discover-icon">Home Loan</div> */}
              <div className={style.content}>
                <h5>Consultancy</h5>
                <p>
                  {" "}
                Get valuable insights and personalised advice from our real estate consultants, who will help you out in exploring the best options, and finalise your dream home.
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={style.serviceGrid}>
              {/* <div className="home-discover-icon">Home Loan</div> */}
              <div className={style.content}>
                <h5>Seamless Assistance</h5>
                <p>
                  {" "}
                 From home assistance to key handover, we ensure a seamless and a hassle-free experience, letting you settle into your new home with ease.
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={style.serviceGrid}>
              {/* <div className="home-discover-icon">Home Loan</div> */}
              <div className={style.content}>
                <h5>Resale Services</h5>
                <p>
                  {" "}
               Unlock your property`s value with InfraMantra`s premium resale services offering top-notch marketing, seamless negotiations, and full legal support. Sell faster and smarter with us!
                </p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Steps;

{
  /* <div className="service-grid">
          <div className="home-discover-icon">Home Loan</div>
          <div className="content">
           <p> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum
            repellat at blanditiis expedita nisi. Illum animi atque hic minima
            sint dolorum nam voluptatem facilis eos iure rerum at molestiae
            deleniti impedit aspernatur necessitatibus ipsum, temporibus, quod
            maxime pariatur enim repudiandae?</p>
          </div>
        </div>
        <div className="service-grid">
          <div className="home-discover-icon">Property Buying</div>
          <div className="content">
           <p> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum
            repellat at blanditiis expedita nisi. Illum animi atque hic minima
            sint dolorum nam voluptatem facilis eos iure rerum at molestiae
            deleniti impedit aspernatur necessitatibus ipsum, temporibus, quod
            maxime pariatur enim repudiandae?</p>
          </div>
        </div>
        <div className="service-grid">
          <div className="home-discover-icon">Home Interiors</div>
          <div className="content">
           <p> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum
            repellat at blanditiis expedita nisi. Illum animi atque hic minima
            sint dolorum nam voluptatem facilis eos iure rerum at molestiae
            deleniti impedit aspernatur necessitatibus ipsum, temporibus, quod
            maxime pariatur enim repudiandae?</p>
          </div>
        </div>
        <div className="service-grid">
          <div className="home-discover-icon">Home Management</div>
          <div className="content">
           <p> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum
            repellat at blanditiis expedita nisi. Illum animi atque hic minima
            sint dolorum nam voluptatem facilis eos iure rerum at molestiae
            deleniti impedit aspernatur necessitatibus ipsum, temporibus, quod
            maxime pariatur enim repudiandae?</p>
          </div>
        </div> */
}
