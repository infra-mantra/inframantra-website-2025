import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { calculateEMI } from '../../UI/calculateEmi';
// import "../propertyPage.css";


const RERA_APPROVED_IMG = "https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/reraApproved.png";
const EXCLUSIVE_PROPERTY_TAG_IMG = "https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/exclusivePropertyTag.png";
const FEATURED_PROPERTY_TAG_IMG = "https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/featuredPropertyTag.png";

function PropertyHeaderDetails({
  rera,
  name,
  locality,
  subLocality,
  displayLocality,
  city,
  startingPrice,
  priceInFigure,
  exclusive,
  featured,
  propertyType
}) {
  const emiValue = calculateEMI(priceInFigure, 10, 30);
 

  const reraApproved = RERA_APPROVED_IMG;
  const exclusivePropertyTag = EXCLUSIVE_PROPERTY_TAG_IMG;
  const featuredPropertyTag = FEATURED_PROPERTY_TAG_IMG;

  return (
    <div className='propertyPageHeaderTitleSection'>
      <div className='propertyPageHeaderTitleFlexContainer'>
        <h1 className='propertyPageHeaderTitle'>{name}</h1>
        <div className='propertyPageTagsContainer'>
          <div className='tooltip'>
            <img
              style={{ margin: 0, width: "9vw" }}
              src={reraApproved}
              alt='reraApproved'
            />
            <span className='tooltiptext'>{rera}</span>
          </div>
          {exclusive && (
            <img
              style={{ margin: 0, width: "8vw" }}
              src={exclusivePropertyTag}
              alt='exclusivePropertyTag'
            />
          )}
          {featured && (
            <img
              style={{ margin: 0, width: "7.5vw" }}
              src={featuredPropertyTag}
              alt='featuredPropertyTag'
            />
          )}
        </div>
      </div>
      <h4 className='propertyPageHeaderSubTitle'>
        {subLocality}, { locality + ","} {city}
      </h4>
      <p className='propertyPageHeaderPriceTitle'>
       { propertyType=="Commercial"?"Starting Investment":"Starting at"}
        <span style={{ color: "#DCAA4C" }}>
          {" "}
          <span>&#8377; {startingPrice}</span>{" "}
        </span>{" "}
        { propertyType=="Commercial"?"| Lease Guarantee :":"| EMI @"}
        
        <span style={{ color: "#DCAA4C" }}>
          {" "}
          { propertyType === 'Commercial' 
  ? '18 Years' 
  : <>
      <span>&#8377;</span>{emiValue}/month*
    </>
}

        </span>   
      </p>
    </div>
  );
}

export default PropertyHeaderDetails;
