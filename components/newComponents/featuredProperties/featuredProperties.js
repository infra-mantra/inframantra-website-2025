import  { useState, useEffect } from 'react';
import {data } from './DummyData.js';

const featuredPropertiesStyles = {
  headerIcon: {
    '@media (max-width:550px)': {
      fontSize: '0.6rem',
    },
  },
};



function FeaturedPropertiesSection() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [featuredProperties, setFeaturedProperties] = useState([]);

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 768); // You can adjust the threshold for desktop here
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const filterData = await Ajax1({ url: `/property/featured-properties` });
        setFeaturedProperties(filterData.data.data.filter((item)=>item.city != "Delhi")); // Assuming `filterData` is an array of featured properties
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);








  // if (!featuredProperties || featuredProperties.length === 0) {
  //   return <div>Loading...</div>; // Or some other loading indicator
  // }


  return (
    <div className="featuredPropertiesSectionWrapper">
      {/* {isDesktop && (
        <div className="featuredPropertiesSectionHeader">
          <h2 className="featuredPropertiesSectionHeaderTitle">
            Premium Listings
          </h2>
          <p className="featuredPropertiesSectionHeaderCityName">
            <span
              style={{ cursor: 'pointer',minWidth:"2rem" }}
              onClick={() => navigate('/property-listing')}
            >
              {currentCityData.city}
            </span>
            <span
              className="featuredPropertiesSectionHeaderCityNameIcon"
              onClick={handleNextCity}
            >
              <IoIosArrowForward sx={featuredPropertiesStyles.headerIcon} />
            </span>
          </p>
        </div>
      )}
      {isDesktop && (
        <CSSTransition
          in={inProp}
          timeout={500}
          classNames="slide"
          key={currentCityIndex}
          onExited={handleExited}
          unmountOnExit
        >
          <CSSTransition
            in={propertyIn}
            timeout={300}
            classNames="fade"
            key={currentIndex}
            unmountOnExit
          >
            <FeaturedProperties
              title={currentProperty?.title}
              location={currentProperty?.location}
              subLocation={currentProperty?.subLocality}
              description={currentProperty?.description}
              secondDescription={currentProperty?.description}
              price={
                currentProperty?.numericInsights.find(
                  (ni) => ni.title === 'Starting Price'
                ).value
              }
              area={
                currentProperty?.numericInsights.find(
                  (ni) => ni.title === 'Sq feet'
                ).value
              }
              configurations={
                currentProperty?.numericInsights.find(
                  (ni) => ni.title === 'Configurations'
                ).value
              }
              imageGallery={currentProperty?.images}
              exclusive={currentProperty?.exclusive}
              id={currentProperty?.slug}
            />
          </CSSTransition>
        </CSSTransition>
      )}
      {!isDesktop && <FeaturedPropertiesMobileSection />}
      {isDesktop && (
        <div className="featuredPropertiesSectionSlider">
          <PaginationSlider
            totalItems={currentCityData.properties.length}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        </div>
      )} */}
    </div>
  );
}

export default FeaturedPropertiesSection;



