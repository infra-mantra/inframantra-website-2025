import React, { useState, useEffect } from 'react';
import FeaturedPropertiesMobile from './featuredPropertiesMobile/featuredPropertiesMobile.jsx';
// import './featuredPropertiesMobile.css';
// import '../featuredPropertiesSection.css';
// import { getFeaturedProperties } from '../../../../reduxSlices/propertySlice';
// import { useSelector, useDispatch } from 'react-redux';
import Ajax1 from '../../helper/Ajax1.js';

import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const featuredPropertiesMobileStyles = {
  arrowForward: {
    position: 'absolute',
    color: '#e7b554',
    right: '2%',
    fontSize: '50px',
    width: '70px',
    cursor: 'pointer',
  },
  arrowBack: {
    position: 'absolute',
    color: '#e7b554',
    left: '6%',
    fontSize: '50px',
    width: '70px',
    cursor: 'pointer',
  },
  arrowBackProperty: {
    position: 'absolute',
    color: '#e7b554',
    width: '40px',
    left: '0%',
    top: '53.5%',
    height: '40px',
    zIndex: 100,
    cursor: 'pointer',
  },
  arrowForwardProperty: {
    position: 'absolute',
    color: '#e7b554',
    width: '40px',
    right: '1%',
    top: '53.5%',
    height: '40px',
    zIndex: 100,
    cursor: 'pointer',
  },
};

function FeaturedPropertiesMobileSection() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [cityTransition, setCityTransition] = useState('');
  const [propertyTransition, setPropertyTransition] = useState('');
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
        // console.log(filterData,"feature properties")
        setFeaturedProperties(filterData.data.data); // Assuming `filterData` is an array of featured properties
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  // console.log("Featured Properties from Mobile", featuredProperties);

  useEffect(() => {
    if (featuredProperties && featuredProperties.length > 0) {
      setCurrentCityIndex(0); // Set initial city index
      setCurrentPropertyIndex(0); // Set initial property index
    }
  }, [featuredProperties]);

  const handleNextCity = () => {
    setCityTransition('city-slide-exit');
    setTimeout(() => {
      setCurrentCityIndex(
        (prevCityIndex) => (prevCityIndex + 1) % featuredProperties.length
      );
      setCurrentPropertyIndex(0);
      setCityTransition('city-slide-enter');
    }, 500);
  };

  const handlePrevCity = () => {
    setCityTransition('city-slide-exit');
    setTimeout(() => {
      setCurrentCityIndex(
        (prevCityIndex) => (prevCityIndex - 1 + featuredProperties.length) % featuredProperties.length
      );
      setCurrentPropertyIndex(0);
      setCityTransition('city-slide-enter');
    }, 500);
  };

  const handleNextProperty = () => {
    setPropertyTransition('property-slide-exit');
    setTimeout(() => {
      setCurrentPropertyIndex((prevPropertyIndex) => {
        const propertiesLength = featuredProperties[currentCityIndex].properties.length;
        return (prevPropertyIndex + 2) % propertiesLength;
      });
      setPropertyTransition('property-slide-enter');
    }, 500);
  };

  const handlePrevProperty = () => {
    setPropertyTransition('property-slide-exit');
    setTimeout(() => {
      setCurrentPropertyIndex((prevPropertyIndex) => {
        const propertiesLength = featuredProperties[currentCityIndex].properties.length;
        return (prevPropertyIndex - 2 + propertiesLength) % propertiesLength;
      });
      setPropertyTransition('property-slide-enter');
    }, 500);
  };

  if (!featuredProperties || featuredProperties.length === 0) {
    return <div>Loading...</div>; // Display a loading indicator while data is being fetched
  }

  const currentCity = featuredProperties[currentCityIndex];

  return (
    <div className="featuredPropertiesMobileSectionContainer">
      <h4 className="featuredPropertiesMobileNewHeader">
        Inframantra Premium Listings
      </h4>
      <div className="featuredPropertiesMobileSectionContainerCityNavigation">
        <div
          style={featuredPropertiesMobileStyles.arrowBack}
          onClick={handlePrevCity}
        >
          <IoMdArrowDropleft />
        </div>
        <h2 className={cityTransition}>{currentCity.city}</h2>
        <div
          style={featuredPropertiesMobileStyles.arrowForward}
          onClick={handleNextCity}
        >
          <IoMdArrowDropright/>
        </div>
      </div>
      <div className="featureedPropertiesMobilePaperContainer">
        <div
          style={featuredPropertiesMobileStyles.arrowBackProperty}
          onClick={handlePrevProperty}
        >
          <MdKeyboardArrowLeft style={{fontSize:'3rem'}}/>
        </div>
        <div
          className={`featureedPropertiesMobilePaperContainerPropertyWrapper ${propertyTransition}`}
        >
          {currentCity.properties
            .slice(currentPropertyIndex, currentPropertyIndex + 2)
            .map((property) => (
              <FeaturedPropertiesMobile key={property.id} property={property} />
            ))}
        </div>
        <div
          style={featuredPropertiesMobileStyles.arrowForwardProperty}
          onClick={handleNextProperty}
        >
          <MdKeyboardArrowRight style={{fontSize:'3rem'}}/>
        </div>
      </div>
    </div>
  );
}

export default FeaturedPropertiesMobileSection;
