import React from "react";
import { useRouter } from "next/router";
import AboutDeveloper from "./propertyPageSections/aboutDeveloper";
import AboutProject from "./propertyPageSections/aboutProject";
import ProjectHighlights from "./propertyPageSections/projectHighlights";
import PropertyEMICalculator from "../propertyRightSection/propertyPageSections/propertyEMICalculator";
import PropertyVideo from "../propertyRightSection/propertyVideo";
import Amenities from "./propertyPageSections/amenities";
import FloorPlan from "./propertyPageSections/floorPlan";
import LocalityGuide from "./propertyPageSections/localityGuide";
import PropertyImageGallery from "./propertyPageSections/propertyImageGallery";
import PropertyBrochure from "./propertyPageSections/propertyBrochure";
import SuggestedLocationProperties from "../propertyRightSection/propertyPageSections/suggestedLocationProperties";
import PropertyPageFloatingContact from "../propertyRightSection/propertyPageSections/propertyPageFloatingContact";
// import SimilarProperties from "./propertyPageSections/similarProperties";
// import "../propertyPage.css";


function PropertyPageMobile({
  description,
  propertyLogo,
  keyHighlights,
  amenities,
  exclusiveAmenities,
  floorPlan,
  priceInFigure,
  localityGuide,
  imageGallery,
  developer,
  name,
  brochure,
  leftSection,
  videoUrl,
  city,
  locality
}) {

  const handleSuggestedLocationNavigation = () => {
    router.push('/property-listing/locality/Dwarka%20Expressway');
 };
  const router = useRouter();

 const handleSuggestedLocationNavigationCity = () => {
    router.push('/property-listing/city/Gurgaon');
 };

 const expressway = 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/expressway.jpeg';
    const gurgaon = 'https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/gurgaon.jpeg';
  return (
    <>
      <div className='propertyPageLeftSectionContainer'>
        <AboutProject description={description} propertyLogo={propertyLogo} />
        <ProjectHighlights keyHighlights={keyHighlights} />
        <Amenities
          amenities={amenities}
          exclusiveAmenities={exclusiveAmenities}
        />
        <PropertyVideo videoUrl={videoUrl}/>
        <FloorPlan floorPlan={floorPlan} name={name} />
        <PropertyEMICalculator initialPrincipal={priceInFigure} />
        <LocalityGuide localityGuide={localityGuide} />
        <PropertyBrochure pdfUrl={brochure[0]} name={name}/>
        <PropertyImageGallery imageGallery={imageGallery} leftSection={leftSection} name={name}/>
        <AboutDeveloper developer={developer} leftSection={leftSection} name={name} />
        <SuggestedLocationProperties
          bgdImg={expressway}
          bannerTxt='Explore other Properties on Dwarka Expressway'
          handleClick={handleSuggestedLocationNavigation}
        />
        <SuggestedLocationProperties
          bgdImg={gurgaon}
          bannerTxt='Find Out What else Gurgaon Is Offering'
          handleClick={handleSuggestedLocationNavigationCity}
        />
        <PropertyPageFloatingContact name={name} />
        {/* <SimilarProperties />  */}
      </div>
    </>
  );
}

export default PropertyPageMobile;
