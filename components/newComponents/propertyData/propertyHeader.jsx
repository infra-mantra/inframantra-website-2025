import React from "react";
import PropertyHeaderImageGallery from "./propertyHeader/propertyHeaderImageGallery.jsx";
import PropertyHeaderContact from "./propertyHeader/propertyHeaderContact";
import PropertyHeaderDetails from "./propertyHeader/propertyHeaderDetails";
import PropertyHeaderOverview from "./propertyHeader/propertyHeaderOverview";

function PropertyHeader({
  imageGallery,
  rera,
  name,
  locality,
  subLocality,
  displayLocality,
  city,
  startingPrice,
  priceInFigure,
  configuration,
  area,
  squarePrice,
  status,
  posession,
  exclusive,
  featured,
  propertyType
  
}) {
  return (
    <div className='propertyPageHeaderSection' id='overview'>
      <div className='propertyPageFirstSection'>
        <PropertyHeaderImageGallery imageGallery={imageGallery} name={name} />
        <PropertyHeaderContact name={name}/>
      </div>
      <PropertyHeaderDetails
        rera={rera}
        name={name}
        locality={locality?.name}
        subLocality={subLocality?.name}
        displayLocality={displayLocality}
        city={city?.name}
        startingPrice={startingPrice}
        priceInFigure={priceInFigure}
        exclusive={exclusive}
        featured={featured}
        propertyType={propertyType?.title}
       
      />
      <PropertyHeaderOverview
        configuration={configuration}
        area={area}
        squarePrice={squarePrice}
        status={status}
        posession={posession}
      />
    </div>
  );
}

export default PropertyHeader;
