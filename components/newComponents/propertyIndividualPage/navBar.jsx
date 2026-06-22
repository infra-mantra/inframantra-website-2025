import React, { useEffect, useState } from 'react';


const PropertySectionNavbar = () => {
  const [activeTab, setActiveTab] = useState('Highlights');

  const tabs = [
    'Overview',
    'About Project',
    'Highlights',
    'Amenities',
    'Locality',
    'Plan & Pricing',
    'EMI Calculator',
    'About Developer',
    "FAQ's",
  ];

const handleClick = (tab) => {
  setActiveTab(tab);

  const section = document.getElementById(tab);
  const navbar = document.querySelector(".section-navbar");

  if (section && navbar) {
    const yOffset = -navbar.offsetHeight;
    const y =
      section.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  }
};


  // 🔥 Scroll spy logic
  useEffect(() => {
    const handleScroll = () => {
      let currentTab = activeTab;

      tabs.forEach((tab) => {
        const section = document.getElementById(tab);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            currentTab = tab;
          }
        }
      });

      if (currentTab !== activeTab) {
        setActiveTab(currentTab);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab, tabs]);

  return (
    <div className="section-navbar">
      <ul className="section-tabs">
        {tabs.map((tab) => (
          <li
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => handleClick(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertySectionNavbar;
