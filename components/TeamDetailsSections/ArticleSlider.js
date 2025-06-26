import React, { useRef, useState } from "react";
import Section from '../UI/Section'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";
import SliderArrows from "../UI/SliderArrows";
import NoImage from "../UI/NoImage";
function ArticleSlider({articles, heading}) {

  return (
    <Section classes="sec-p featured-articles-slider" pageWidth="container" >
        
        <div className="section-head split-head">
            <div className="head">
                <h2>{heading.title}</h2>
                <p>{heading.description}</p>
            </div>
            <div className="arrows">
                <SliderArrows prevClass="partners-left" nextClass="partners-right"/>
            </div>
        </div>

            
        <div className="featured-articles-wrap">
            <Swiper
                slidesPerView={3}
                centeredSlides={true}
                spaceBetween={30}
                loop={true}
                speed={1000}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: true,
                }}
                navigation={{ nextEl: "#partners-right", prevEl: "#partners-left" }}
                className="ft-article-sld"
                modules={[Autoplay, Navigation]}
            >
                {articles.map((item) => (
                    <SwiperSlide key={item.id}>
                        <div className="article-item">
                            <div className="img-wrap">
                                {item.image ?
                                <Image src={item.image} layout="fill" objectFit="cover" alt={item.title}/>
                                : <NoImage/> }
                            </div>
                            <div className="info">
                                <h4>{item.title}</h4>
                                {item.slug !== '' && item.link === '' &&
                                <Link href={`/blog/${item.slug}`}><a className="lrn-btn">Read More <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.281 7h12.032M7.297 1l6.016 6-6.016 6" stroke="#E7B554" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></a></Link> }
                                {item.link !== '' && item.slug !== '' &&
                                <a href={`/blog/${item.slug}`} target="_blank" rel="noreferrer" className="lrn-btn">Read More <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.281 7h12.032M7.297 1l6.016 6-6.016 6" stroke="#E7B554" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></a>}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                
            </Swiper>
        </div>
    </Section>
  )
}

export default ArticleSlider