// PropertyPriceCard.jsx
import React from "react";


export default function PropertyPriceCard() {
  return (
    <div className="property-card-h">
      <div className="price"> <span className="font-clr">₹ 3.15 Cr.</span></div>

      <ul className="details">
        <li>
          <span className="icon"> <img
                      src="https://propertyindividual.inframantra.com/assests/construction.png"
                      alt="Under Construction"
                      className="status-icon"
                    /></span>
          <span>Under Construction</span>
        </li>
        <li>
          <span className="icon"> <img
                         src='/propertyIndividualPage/icons/locationPoint.png'
                         alt="Under Construction"
                         className="status-icon"
                    /></span>
          <span>Sector - 89A, Dwarka Expressway</span>
        </li>
    
  {[
    {
      Key: 'Configuration',
      value: '1/2/3 BHK',
      image: '/propertyIndividualPage/icons/configration.png ',
    },
    { Key: 'Area', value: '2180-3463 Sq.Ft', image: "/propertyIndividualPage/icons/area.png" },
    { Key: 'Price', value: '₹13,500 Per Sq.Ft', image: "/propertyIndividualPage/icons/pricePerSqt.png"  },
    { Key: 'Possession', value: 'Dec-2030',  image: "/propertyIndividualPage/icons/posseion.png"},
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