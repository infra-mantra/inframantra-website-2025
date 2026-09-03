import React from "react";
// CSS module so this sheet ships with the pages that need it instead of with
// every page via _app.js. The `pcard` binding must stay used: Next tree-shakes a
// CSS-module import whose binding is unused and then emits none of its CSS.
// WANT_HASH = false (next.config.js) means pcard["x"] resolves to the identical
// unhashed name "x", so the rendered markup is byte-for-byte unchanged.
import pcard from "./PropertyCard.module.css";

export default function PropertyPriceCard({ propertyData, area }) {
  return (
    <div className={pcard["property-card-h"]}>
      <div className={pcard["price"]}>
        {" "}
        <span className="font-clr">₹ {propertyData.startingPrice}</span>
      </div>

      <ul className={pcard["details"]}>
        <li>
          <span className={pcard["icon"]}>
            {" "}
            <img
              src="/propertyIndividualPage/icons/construction.png"
              alt="Under Construction"
              className="status-icon"
            />
          </span>
          <span>{propertyData.status}</span>
        </li>
        <li>
          <span className={pcard["icon"]}>
            {" "}
            <img
              src="/propertyIndividualPage/icons/locationPoint.png"
              alt="Under Construction"
              className="status-icon"
            />
          </span>
          <span>
            {" "}
            {propertyData?.subLocality?.name} , {propertyData.locality.name}
          </span>
        </li>

        {[
          {
            Key: "Configuration",
            value: `${propertyData.configuration}`,
            image: "/propertyIndividualPage/icons/configration.png ",
          },
          { Key: "", value: `${area}`, image: "/propertyIndividualPage/icons/area.png" },
          {
            Key: "",
            value: `₹ ${propertyData.squarePrice}/Sq.Ft`,
            image: "/propertyIndividualPage/icons/pricePerSqt.png",
          },
          {
            Key: "",
            value: `Possession: ${propertyData.possesion}`,
            image: "/propertyIndividualPage/icons/posseion.png",
          },
        ].map(({ Key, value, image }, index) => (
          <li key={index}>
            <span className={pcard["icon"]}>
              <img src={image} alt={Key} />
            </span>
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
