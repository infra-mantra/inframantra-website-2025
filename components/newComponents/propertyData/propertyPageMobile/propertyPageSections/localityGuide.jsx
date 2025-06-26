import React, { useState } from 'react';
import PropertyWrapper from './propertyWrapper';
import { FaSchool, FaBuilding, FaHospital, FaShoppingCart, FaGamepad, FaBus } from 'react-icons/fa';

// Map titles to corresponding icons for cleaner logic
const iconMap = {
  Schools: FaSchool,
  'Office Spaces': FaBuilding,
  'Commercial Hubs': FaBuilding,
  Malls: FaShoppingCart,
  'Shopping Centers': FaShoppingCart,
  'Malls and Shopping Centers': FaShoppingCart,
  'Malls and Markets': FaShoppingCart,
  Hospitals: FaHospital,
  Entertainment: FaGamepad,
  'Entertainment Zone': FaGamepad,
  Connectivity: FaBus,  // Replaced FaPlane with FaBus for more relevance
};

// Generate icon dynamically based on title
const getIcon = (title, selected) => {
  const IconComponent = iconMap[title] || null;
  const color = selected ? '#DCAA4C' : '#C5C5C5';
  const size = '1.5em';

  return IconComponent ? <IconComponent color={color} size={size} /> : <span>?</span>;
};

function LocalityGuide({ localityGuide = [] }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (index) => {
    setActiveTab(index);
  };

  return (
    <PropertyWrapper id="localityMap">
      <div className="aboutProjectWrapper">
        <h2 className="aboutProjectHeader">Locality Map And Guide</h2>

        {/* Tabs */}
        <div className="floorPlanTabsContainer">
          {localityGuide.map((guide, index) => (
            <button
              key={index}
              className={`tab-button ${activeTab === index ? 'active' : ''}`}
              onClick={() => handleChange(index)}
            >
              {getIcon(guide.title, activeTab === index)}
              <span>{guide.title}</span>
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="tab-content">
          {localityGuide.map((guide, index) => (
            <div
              key={index}
              className={`tab-panel ${activeTab === index ? 'active' : 'hidden'}`}
            >
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
      </div>
    </PropertyWrapper>
  );
}

export default LocalityGuide;
