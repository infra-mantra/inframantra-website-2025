import React, { useState } from 'react';
import PropertyListingPageMobileFilterTabs from './propertyListingFilterTabs';
import PropertyListingPriceFilter from './propertyListingPriceFilter/propertyListingPriceFilter';
import {
  unitTypeFilterConstants,
  configuration,
  status,
} from './propertyListingConstant';
import { priceRangeData } from './propertyListingPriceFilter/dropDownMenuConstants';
import { IoClose } from 'react-icons/io5';

function PropertyListingPageMobileFilter({
  toggleDrawer,
  applyFilters,
  currentFilters,
}) {
  const [tempFilters, setTempFilters] = useState(currentFilters);
  const [reset, setReset] = useState(false);
 

  

  const handleChangePriceRange = (newRange) => {
    const startLabel =
      priceRangeData.find((p) => p.value === newRange[0])?.label || '';
    const endLabel =
      priceRangeData.find((p) => p.value === newRange[1])?.label || '';
    const newPriceRange = {
      range: newRange,
      label: `${startLabel} - ${endLabel}`,
    };
    setTempFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: newPriceRange,
    }));
  };

  const handleTabClick = (category, title) => {
    setTempFilters((prevFilters) => {
      const isSelected = prevFilters[category].includes(title);
      return {
        ...prevFilters,
        [category]: isSelected
          ? prevFilters[category].filter((tab) => tab !== title)
          : [...prevFilters[category], title],
      };
    });
  };

  const handleApplyFilters = () => {
    applyFilters(tempFilters);
    toggleDrawer();
  };

  const handleResetFilters = () => {
    setTempFilters({
      unitType: [],
      configuration: [],
      priceRange: { range: [0, 0], label: '' },
      status: [],
    });
    setReset(true);
  };

  const handleReset = () => {
    handleReset();
    setReset(false);
  }

 
  return (
    <div className="propertyListingPageMobileFilterWrapper">
      <div className="propertyListingPageMobileFilterHeader">
        <IoClose className="close-icon" onClick={toggleDrawer} />
        <p className="propertyListingPageMobileFilterHeaderValue">Filters</p>
        <p
          className="propertyListingPageMobileFilterHeaderReset"
          onClick={handleResetFilters}
        >
          Reset
        </p>
        <hr className="propertyListingPageMobileFilterHeaderSwipeBar" />
      </div>

      <div className="propertyListingPageMobileFilterValueWrapper">
        {/* Unit Type */}
        <div className="propertyListingPageMobileFilterUnitType">
          <p className="propertyListingPageMobileFilterUnitTypeHeader">Unit Type</p>
          <div className="propertyListingMobileFilterFlex">
            {unitTypeFilterConstants.map((unitType) => (
              <PropertyListingPageMobileFilterTabs
                key={unitType}
                title={unitType}
                category="unitType"
                onTabClick={handleTabClick}
                isSelected={tempFilters.unitType.includes(unitType)}
                reset={reset}
                handleReset={handleReset}
                
              />
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="propertyListingPageMobileFilterUnitType">
          <p className="propertyListingPageMobileFilterUnitTypeHeader">Configuration</p>
          <div className="propertyListingMobileFilterFlex">
            {configuration.map((config) => (
              <PropertyListingPageMobileFilterTabs
                key={config}
                title={config}
                category="configuration"
                onTabClick={handleTabClick}
                isSelected={tempFilters.configuration.includes(config)}
                reset={reset}
                handleReset={handleReset}
              />
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="propertyListingPageMobileFilterUnitType">
          <p className="propertyListingPageMobileFilterUnitTypeHeader">Price Range</p>
          <div className="propertyListingMobileFilterFlex priceFliterFlex">
            <PropertyListingPriceFilter
              priceRange={tempFilters.priceRange.range}
              onChangePriceRange={handleChangePriceRange}
              reset={reset}
              handleReset={handleReset}
            />
          </div>
        </div>

        {/* Status */}
        <div className="propertyListingPageMobileFilterUnitType">
          <p className="propertyListingPageMobileFilterUnitTypeHeader">Project Status</p>
          <div className="propertyListingMobileFilterFlex">
            {status.map((stat) => (
              <PropertyListingPageMobileFilterTabs
                key={stat}
                title={stat}
                category="status"
                onTabClick={handleTabClick}
                isSelected={tempFilters.status.includes(stat)}
                reset={reset}
                handleReset={handleReset}
              />
            ))}
          </div>
        </div>

        <div className="propertyListingMobileFilterFlex priceFliterFlex mobileFilterBtn">
          <button
            className="applyFilterButton"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyListingPageMobileFilter;
