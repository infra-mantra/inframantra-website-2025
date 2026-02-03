
import React from "react";


export default function PropertyPriceCard({propertyData,area}) {

  return (
    <div className="property-card-h">
      <div className="price"> <span className="font-clr">₹{" "}{propertyData.startingPrice}</span></div>

      <ul className="details">
        <li>
          <span className="icon"> <img
                      src="/propertyIndividualPage/icons/construction.png"
                      alt="Under Construction"
                      className="status-icon"
                    /></span>
          <span>{propertyData.status}</span>
        </li>
        <li>
          <span className="icon"> <img
                         src='/propertyIndividualPage/icons/locationPoint.png'
                         alt="Under Construction"
                         className="status-icon"
                    /></span>
          <span> {propertyData?.subLocality?.name} ,{" "}
                          {propertyData.locality.name}</span>
        </li>

       
    
  {[
    {
      Key: 'Configuration',
      value: `${propertyData.configuration}`,
      image: '/propertyIndividualPage/icons/configration.png ',
    },
    { Key: '', value:  `${area}`, image: "/propertyIndividualPage/icons/area.png" },
    { Key: '', value: `₹ ${propertyData.squarePrice}/Sq.Ft`, image: "/propertyIndividualPage/icons/pricePerSqt.png"  },
    { Key: '', value: `Possession: ${propertyData.possesion}`,  image: "/propertyIndividualPage/icons/posseion.png"},
  ].map(({ Key, value, image }, index) => (
   
        <li key={index}>
      <span className="icon">
        <img
          src={image}
          alt={Key}
         
        />
      </span>
      <span>{value}</span>
       </li>
    
  ))}     
      </ul>
    </div>
  );
}