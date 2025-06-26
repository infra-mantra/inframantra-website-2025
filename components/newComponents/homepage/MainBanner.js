import BannerVideo from "./bannerVideo/bannerVideo.js";
import SearchOptions from "./searchOptions/searchOptions";
import React from "react";
  

const HeaderSection = () => {
  return (
    <section className='homePageheaderContainer'>
      <section className='homePageheader'>
         <h1 style={{display: 'none'}}>INFRAMANTRA - Making Realty A Reality For You</h1>
         <BannerVideo />
        <SearchOptions />
      </section>
    </section>
  );
}

export default HeaderSection;
