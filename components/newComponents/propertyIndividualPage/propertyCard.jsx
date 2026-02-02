
import React from "react";


export default function PropertyPriceCard({propertyData}) {
  return (
    <div className="property-card-h">
      <div className="price"> <span className="font-clr">{propertyData.startingPrice}</span></div>

      <ul className="details">
        <li>
          <span className="icon"> <img
                      src="https://propertyindividual.inframantra.com/assests/construction.png"
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
    { Key: 'Area', value:  `${propertyData.area}`, image: "/propertyIndividualPage/icons/area.png" },
    { Key: 'Price', value: `₹ ${propertyData.squarePrice}`, image: "/propertyIndividualPage/icons/pricePerSqt.png"  },
    { Key: 'Possession', value: `${propertyData.possesion}`,  image: "/propertyIndividualPage/icons/posseion.png"},
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