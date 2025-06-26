import React, { useEffect, useState } from "react";
import PropertyWrapper from "./propertyWrapper";



function Amenities({ amenities = [], exclusiveAmenities = [] }) {
    const [isDesktop, setIsDesktop] = useState(true);
    const [isMobile, setIsMobile] = useState(true);
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth >= 768); // You can adjust the threshold for desktop here
      setIsMobile(window.innerWidth <=768);
    };
    useEffect(() => {
      checkScreenWidth();
      window.addEventListener('resize', checkScreenWidth);
    
      return () => {
        window.removeEventListener('resize', checkScreenWidth);
      };
    }, []);
  const [premiumAmenities, setPremiumAmenities] = useState(exclusiveAmenities);

  useEffect(() => {
    if (isDesktop) {
      setPremiumAmenities(exclusiveAmenities.slice(0, 5));
    } else {
      setPremiumAmenities(exclusiveAmenities);
    }
  }, [isDesktop, exclusiveAmenities, amenities]);

  return (
    <PropertyWrapper
      id='amenities'
      >
        <div className='aboutProjectWrapper'>
          <h2 className='aboutProjectHeader'>Amenities</h2>
          <div className='exclusiveAmenitiesIconsWrapper'>
            {premiumAmenities.map((amenity) => {
              return (
                <div className='amenitiesIconFlex' key={amenity.title}>
                  <img
                    style={{ width: isDesktop ? "70px" : "45px" }}
                    src={amenity.iconUrl}
                    alt={amenity.title}
                  />
                  <p
                    style={{
                      textAlign: "center",
                      margin: 0,
                      fontSize: isDesktop ? "12px" : "10px",
                    }}
                  >
                    {amenity.title}
                  </p>
                </div>
              );
            })}
          </div>
          <div className='amenitiesIconsWrapper'>
            {amenities.map((amenity) => {
              return (
                <div className='amenitiesIconFlex' key={amenity.title}>
                  <img
                    style={{ width: isDesktop ? "70px" : "45px" }}
                    src={amenity.iconUrl}
                    alt={amenity.title}
                  />
                  <p
                    style={{
                      textAlign: "center",
                      margin: 0,
                      fontSize: isDesktop ? "12px" : "10px",
                    }}
                  >
                    {amenity.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        </PropertyWrapper>
  );
}

export default Amenities;
