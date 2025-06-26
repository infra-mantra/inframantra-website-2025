import React, {useEffect, useRef} from "react";
import AboutProject from "./propertyPageSections/aboutProject";
import AboutDeveloper from "./propertyPageSections/aboutDeveloper.jsx";
import Amenities from "./propertyPageSections/amenities";
import FloorPlan from "./propertyPageSections/floorPlan";
import LocalityGuide from "./propertyPageSections/localityGuide";
import PropertyImageGallery from "./propertyPageSections/propertyImageGallery";
import PropertyBrochure from "./propertyPageSections/propertyBrochure";
import ProjectHighlights from "./propertyPageSections/projectHighlights";



import dynamic from "next/dynamic.js";
// import SimilarProperties from "./propertyPageSections/similarProperties";


// const PropertyBrochure = dynamic(() => import('./propertyPageSections/propertyBrochure'), {
//   ssr: false, // This will prevent server-side rendering of this component
// });




function PropertyPageLeftDesktop({
  description,
  propertyLogo,
  keyHighlights,
  exclusiveAmenities,
  amenities,
  floorPlan,
  localityGuide,
  brochure,
  imageGallery,
  developer,
  leftSection,
  name
}) {
  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'aboutDeveloper') {
            leftSection(true);
          } else if (entry.target.id === 'imageGallery') {
            leftSection(false);
          }
        }
      });
    };
    

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0.5,
    });

    const sections = document.querySelectorAll('#aboutDeveloper, #imageGallery');
       sections.forEach((section) => {
      observer.observe(section);
    });

    
    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [leftSection]);
  // console.log(brochure);

  return (
    <div className='propertyPageLeftSectionContainer'>
      <AboutProject description={description}  propertyLogo={propertyLogo} />
      <ProjectHighlights keyHighlights={keyHighlights} />
      <Amenities
        exclusiveAmenities={exclusiveAmenities}
        amenities={amenities}
      />
      <FloorPlan floorPlan={floorPlan} name={name} />
      <LocalityGuide localityGuide={localityGuide} />
      <PropertyBrochure 
             pdfUrl={brochure && brochure.length > 0 ? brochure[0] : null} 
              leftSection={leftSection} name={name} 
/>



      <PropertyImageGallery imageGallery={imageGallery} leftSection={leftSection} name={name}/>
      <AboutDeveloper developer={developer}  leftSection={leftSection} name={name}/>
      {/* <SimilarProperties />  */}
    </div>
  );
}

export default PropertyPageLeftDesktop;
