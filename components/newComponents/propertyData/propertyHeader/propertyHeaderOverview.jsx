import React from "react";
import { FaRupeeSign, FaHome, FaRulerCombined, FaCalendarAlt, FaKey } from "react-icons/fa";
// import "../propertyPage.css";

function PropertyHeaderOverview({
  configuration,
  area,
  squarePrice,
  status,
  posession,
}) {
  const propertyOverviewData = [
    {
      title: "Configuration",
      icon: FaHome,
      val: configuration,
    },
    {
      title: "Sq. Feet area",
      icon: FaRulerCombined,
      val: area,
    },
    {
      title: "Sq. Feet price",
      icon: FaRupeeSign,
      val: squarePrice,
    },
    {
      title: "Status",
      icon: FaCalendarAlt,
      val: status,
    },
    {
      title: "Possession",
      icon: FaKey,
      val: posession,
    },
  ];

  return (
    <div className='propertyPageHeaderOverviewSection'>
      {propertyOverviewData.map((data, index) => {
        return (
          <div className='propertyPageHeaderOverviewSectionFlex' key={index}>
            <data.icon style={{ color: "#E7B554", fontSize: "45px" }} />
            <p className='propertyPageHeaderOverviewSectionValues'>
              {data.val}
            </p>
            <p className='propertyPageHeaderOverviewSectionKeys'>
              {data.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default PropertyHeaderOverview;
