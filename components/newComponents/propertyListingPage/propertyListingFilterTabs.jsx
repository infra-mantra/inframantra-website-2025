import React, { useEffect, useState } from 'react';

function PropertyListingPageMobileFilterTabs({ title, category, onTabClick, reset, handleReset }) {
  const [tabClicked, setTabClicked] = useState(false);

  const handleTabClick = () => {
    setTabClicked((prev) => !prev);
    onTabClick(category, title);
  };

  useEffect(() => {
    const selectedTab = document.getElementById(`${title}`);
    if (selectedTab) {
      selectedTab.className = tabClicked
        ? 'propertyListingPageMobileFilterTabWrapper filter-tab-clicked'
        : 'propertyListingPageMobileFilterTabWrapper';
    }
  }, [tabClicked, title]);

  useEffect(() => {
    if (reset) {
      setTabClicked(false);
      handleReset();
    }
  }, [reset]);

  return (
    <div
      className="propertyListingPageMobileFilterTabWrapper"
      onClick={handleTabClick}
      id={title}
    >
      {title}
    </div>
  );
}

export default PropertyListingPageMobileFilterTabs;
