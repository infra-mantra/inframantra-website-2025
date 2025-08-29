import BannerVideo from "./bannerVideo/bannerVideo.js";
import SearchOptions from "./searchOptions/searchOptions";
import React from "react";
import style from "./mainBanner.module.css";  

const HeaderSection = () => {
  return (
    <section className={style.homePageheaderContainer}>
      <section className={style.homePageheader}>
         <h1 style={{display: 'none'}}>INFRAMANTRA - Making Realty A Reality For You</h1>
         <BannerVideo />
        <SearchOptions />
      </section>
    </section>
  );
}

export default HeaderSection;
