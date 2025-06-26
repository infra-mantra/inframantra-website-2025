import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import { Grid, Navigation, Autoplay, Pagination } from "swiper";
import Ajax1 from "../../helper/Ajax1";
import Link from "next/link";

const DeveloperSlider = () => {
    const [developer, setDeveloper] = useState(null);

    useEffect(() => {
        const getDeveloper = setTimeout(function () {
            (async () => {
                const getData = await Ajax1({
                    url: `/developer`,
                });
                setDeveloper(getData.data.data.developers);
            })();
        }, 100);
      
 

        return () => {
            clearInterval(getDeveloper);
        };
    }, []);

    return (
        <div className="developerSlideWrapper">
            <div className="brandAmbassadorWrapper">
            <h4 style={{marginTop:"156px"}}>TOP REAL ESTATE DEVELOPERS</h4>
            </div>
           

            {/* First Swiper */}
            <div className="featured-blogs-container blog-container ">
                <div className="blog-container">
                    <Swiper
                        slidesPerView="auto"
                        breakpoints={{
                            240: {
                              slidesPerView: 2,
                            },
                            768: {
                              slidesPerView: 3.2,
                            },
                            1080: {
                              slidesPerView: 5,
                              spaceBetween: 30,
                            },
                          }}
                        centeredSlides={true}
                        spaceBetween={0}
                        loop={true}
                        speed={1000}
                        autoplay={{
                            delay: 1500,
                        }}
                        className="ft-media-sld"
                        modules={[Autoplay, Pagination]}
                    >
                        {developer && developer.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="ft-media-item developerSection">
                                    <picture>
                                        <img
                                            src={item.developerImg}
                                            layout="fill"
                                            objectFit="cover"
                                            alt="ft image"
                                        />
                                    </picture>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

         
        </div>
    );
}

export default DeveloperSlider;
