import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import "swiper/css";

const Steps = () => {
  return (
    <div className="infra-section services-section">
      <div className="page-width container">
        <div className="section-head">
          <h2>Discover Our Services</h2>
        </div>
      </div>
      <div className="services-grids-row tablet-v">
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
            <div className="service-grid">
              {/* <div className="home-discover-icon">Home Loan</div> */}
              <div className="content">
                <h5>Home Loan</h5>
                <p>
                  {" "}
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum
                  repellat at blanditiis expedita nisi. Illum animi atque hic
                  minima sint dolorum nam voluptatem facilis eos iure rerum at
                  molestiae deleniti impedit aspernatur necessitatibus ipsum,
                  temporibus, quod maxime pariatur enim repudiandae?
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="service-grid">
              {/* <div className="home-discover-icon">Home Loan</div> */}
              <div className="content">
                <h5>Property Buying</h5>
                <p>
                  {" "}
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum
                  repellat at blanditiis expedita nisi. Illum animi atque hic
                  minima sint dolorum nam voluptatem facilis eos iure rerum at
                  molestiae deleniti impedit aspernatur necessitatibus ipsum,
                  temporibus, quod maxime pariatur enim repudiandae?
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="service-grid">
              {/* <div className="home-discover-icon">Home Loan</div> */}
              <div className="content">
                <h5>Home Interior</h5>
                <p>
                  {" "}
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum
                  repellat at blanditiis expedita nisi. Illum animi atque hic
                  minima sint dolorum nam voluptatem facilis eos iure rerum at
                  molestiae deleniti impedit aspernatur necessitatibus ipsum,
                  temporibus, quod maxime pariatur enim repudiandae?
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="service-grid">
              {/* <div className="home-discover-icon">Home Loan</div> */}
              <div className="content">
                <h5>Home Management</h5>
                <p>
                  {" "}
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum
                  repellat at blanditiis expedita nisi. Illum animi atque hic
                  minima sint dolorum nam voluptatem facilis eos iure rerum at
                  molestiae deleniti impedit aspernatur necessitatibus ipsum,
                  temporibus, quod maxime pariatur enim repudiandae?
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
