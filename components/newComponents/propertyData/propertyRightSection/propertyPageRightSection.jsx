import React, { useState, useRef, useEffect } from "react";
import PropertyVideo from "./propertyVideo";
import PropertyEMICalculator from "./propertyPageSections/propertyEMICalculator";
import SuggestedLocationProperties from "./propertyPageSections/suggestedLocationProperties.jsx";
import PropertyPageFloatingContact from "./propertyPageSections/propertyPageFloatingContact.jsx";
// import expressway from "../../../assets/expressway.jpeg";
// import gurgaon from "../../../assets/gurgaon.jpeg";
// import { useNavigate } from "react-router-dom";
// import "../propertyPage.css";

import { useRouter } from "next/router.js";

function PropertyPageRightDesktop({ name, priceInFigure, leftSection,propertyType ,videoUrl,city,locality }) {
  const [isContactSticky, setIsContactSticky] = useState(false);
  const contactRef = useRef(null);
  const router = useRouter();

  const expressway = 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/expressway.jpeg';
  const gurgaon = 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/gurgaon.jpeg';
  
  const handleSuggestedLocationNavigation = () => {
     router.push(`/property-listing/locality/Dwarka%20Expressway`);
  };

  const handleSuggestedLocationNavigationCity = () => {
     router.push('/property-listing/city/Gurgaon');
  };

 

  useEffect(() => {
    const contactInitialTop = contactRef.current.offsetTop;

    const handleScroll = () => {
      if (window.scrollY >= contactInitialTop) {
        setIsContactSticky(true);
      } else {
        setIsContactSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  if(leftSection === true){

  }

  return (
    <div className='propertyPageRightSectionContainer'>
     <PropertyVideo  videoUrl={videoUrl}/>  
      <SuggestedLocationProperties
        bgdImg={expressway}
        bannerTxt='Find Out What else Gurgaon Is Offering'
        onClick={handleSuggestedLocationNavigation}
      />
      <PropertyEMICalculator initialPrincipal={priceInFigure} />
      <SuggestedLocationProperties
        bgdImg={gurgaon}
        bannerTxt='Find Out What else Gurgaon Is Offering'
        onClick={handleSuggestedLocationNavigationCity}
      />
      <div
        ref={contactRef}
        className={`floatingContactWrapper ${
          isContactSticky ? "contactSticky" : ""
        }`}
        style={{ display: leftSection ? "none" : "block" }}
      >
        <PropertyPageFloatingContact name={name} propertyType={propertyType.title} />
      </div>
    </div>
  );
}

export default PropertyPageRightDesktop;
