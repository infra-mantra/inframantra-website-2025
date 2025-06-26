import React, { useState } from 'react';
import PropertyWrapper from './propertyWrapper';
import { FaBuilding, FaShoppingCart , FaHospital, FaGamepad, FaPlane } from 'react-icons/fa';
import { MdSchool,MdOutlineBusinessCenter } from "react-icons/md";
import { LiaHotelSolid } from "react-icons/lia";
import { FaBuildingUser } from "react-icons/fa6";

export const getIcon = (title, selected) => {
  const color = selected ? '#DCAA4C' : '#C5C5C5';
  const size = '1.5em';
  if (title === 'Schools' || title === 'School') {
    return <MdSchool color={color} size={size} />;
  } else if (title === 'Office Spaces' || title === 'Commercial Hubs') {
    return <FaBuilding color={color} size={size} />;
  } else if (
    title === 'Malls' ||
    title === 'Shopping Centers' ||
    title === 'Malls and Shopping Centers' ||
    title === 'Malls and Markets'
  ) {
    return <FaShoppingCart color={color} size={size} />;
  } else if (title === 'Hospitals') {
    return <FaHospital color={color} size={size} />;
  } else if (title === 'Entertainment' || title === 'Entertainment Zone' || title === 'Entertainment zone' || title === 'Entertainment Zones') {
    return <FaGamepad color={color} size={size} />;
  } else if (title === 'Connectivity' || title === 'Transportation Hub') {
    return <FaPlane color={color} size={size} />;
  } else if(title === 'Hotels'){
    return <LiaHotelSolid color={color} size={size} />;
  }
  else if(title === 'Business Hub'){
    return <MdOutlineBusinessCenter color={color} size={size} />;
  }else if(title === 'Societies'){
    return <FaBuildingUser color={color} size={size} />;
  }
   else {
    console.warn(`No matching icon for title: ${title}`);
    return <span style={{ color: '#C5C5C5', fontSize: '1.5em' }}>?</span>;
  }
};

const LocalityGuide = ({ localityGuide = [] }) => {
  const [value, setValue] = useState('0');

  const handleChange = (newValue) => {
    setValue(newValue);
  };
   
  
  return (
    <PropertyWrapper id="localityMap">
      <div className="aboutProjectWrapper">
        <h2 className="aboutProjectHeader">Locality Map And Guide</h2>
        <div className="floorPlanTabsContainer">
          {localityGuide.map((guide, index) => (
            <button
              key={index}
              className={`tab-button ${value === String(index) ? 'active' : ''}`}
              onClick={() => handleChange(String(index))}
            >
              {getIcon(guide.title, value === String(index))}
              <span>{guide.title}</span>
            </button>
          ))}
        </div>
        {localityGuide.map((guide, index) => (
          <div key={index} className={`tab-panel ${value === String(index) ? 'active' : ''}`}>
            <div className="localityGuideDesignContainer">
              {guide.guideList.map((list, idx) => (
                <div key={idx} className="localityGuideValueFlex">
                  <p>{list.name}</p>
                  <p>{list.distance}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PropertyWrapper>
  );
};

export default LocalityGuide;
