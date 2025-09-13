import React, { useState } from 'react';
import style from './ListingFilters.module.css';

export default function ListingFilters({ onFilterChange }) {
  const [expanded, setExpanded] = useState({
    unitType: true,
    configuration: true,
    priceRange: true,
    projectStatus: true
  });

  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedUnitTypes, setSelectedUnitTypes] = useState([]);
  const [selectedConfigurations, setSelectedConfigurations] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 6]); // in Cr

  const toggleSection = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Generic checkbox handler
  const handleCheckboxChange = (value, state, setter, type) => {
    let updated;
    if (state.includes(value)) {
      updated = state.filter((item) => item !== value);
    } else {
      updated = [...state, value];
    }
    setter(updated);
    onFilterChange(type, updated);
  };

  // Price Range Handler
  const handlePriceChange = (index, value) => {
    const updated = [...priceRange];
    updated[index] = value;
    setPriceRange(updated);
    onFilterChange('priceRange', updated);
  };

  // City Selection Handler
  const handleCityClick = (city) => {
    let updated;
    if (selectedCities.includes(city)) {
      updated = selectedCities.filter((c) => c !== city);
    } else {
      updated = [...selectedCities, city];
    }
    setSelectedCities(updated);
    onFilterChange('city', updated);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCities([]);
    setSelectedUnitTypes([]);
    setSelectedConfigurations([]);
    setSelectedStatuses([]);
    setPriceRange([1, 6]);
    
  };

  return (
    <div className={style.containerWrapper}>
      <div className={style.buttonWrapper}>
        <button className={style.filterbtn}>Filters</button>
        <button className={style.resetbtn} onClick={resetFilters}>Reset</button>
      </div>
      <div className={style.hr}></div>

      {/* Location */}
      <div className={style.sectionTitle}>Location</div>
      <div className={style.locationTags}>
        {['Gurgaon', 'Noida', 'Pune', 'Jaipur'].map((city) => (
          <span
            className={`${style.tag} ${selectedCities.includes(city) ? style.activeTag : ''}`}
            key={city}
            onClick={() => handleCityClick(city)}
          >
            {city}
          </span>
        ))}
      </div>

      {/* Unit Type */}
      <div className={style.sectionHeader} onClick={() => toggleSection('unitType')}>
        <span>Unit Type</span>
        <span>{expanded.unitType ? '▾' : '▸'}</span>
      </div>
      {expanded.unitType && (
        <div className={style.checkboxGroup}>
          {['Low Rise Apartment', 'High Rise Apartment', 'Villa', 'Builder Floor', 'Independent Floor', 'Plot', 'Studio Apartment'].map((type, idx) => (
            <label className={style.checkboxItem} key={idx}>
              <input
                type="checkbox"
                checked={selectedUnitTypes.includes(type)}
                onChange={() => handleCheckboxChange(type, selectedUnitTypes, setSelectedUnitTypes, 'unitType')}
              />
              {type}
            </label>
          ))}
        </div>
      )}

      {/* Configuration */}
      <div className={style.sectionHeader} onClick={() => toggleSection('configuration')}>
        <span>Configuration</span>
        <span>{expanded.configuration ? '▾' : '▸'}</span>
      </div>
      {expanded.configuration && (
        <div className={style.checkboxGroup}>
          {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Penthouse'].map((config, idx) => {
            const isBhk = config.includes('BHK');
            const originalCongi=config
            const value = isBhk ? config.replace(' BHK', '') : config; // remove "BHK" if exists
            return (
              <label className={style.checkboxItem} key={idx}>
                <input
                  type="checkbox"
                  checked={selectedConfigurations.includes(value)}
                  onChange={() => handleCheckboxChange(value, selectedConfigurations, setSelectedConfigurations, 'configuration')}
                />
                {originalCongi}
              </label>
            );
          })}
        </div>
      )}

      {/* Price Range */}
      <div className={style.sectionHeader} onClick={() => toggleSection('priceRange')}>
        <span>Price Range</span>
        <span>{expanded.priceRange ? '▾' : '▸'}</span>
      </div>
      {expanded.priceRange && (
        <div className={style.priceRange}>
          <input type="range" min="1" max="10" value={priceRange[0]} onChange={(e) => handlePriceChange(0, Number(e.target.value))} />
          <input type="range" min="1" max="10" value={priceRange[1]} onChange={(e) => handlePriceChange(1, Number(e.target.value))} />
          <div className={style.priceLabels}>
            <span>{priceRange[0]} Cr</span>
            <span>{priceRange[1]} Cr</span>
          </div>
        </div>
      )}

      {/* Project Status */}
      <div className={style.sectionHeader} onClick={() => toggleSection('projectStatus')}>
        <span>Project Status</span>
        <span>{expanded.projectStatus ? '▾' : '▸'}</span>
      </div>
      {expanded.projectStatus && (
        <div className={style.checkboxGroup}>
          {['Near Possession', 'New Launch', 'Ready to move', 'Under Construction'].map((status, idx) => (
            <label className={style.checkboxItem} key={idx}>
              <input
                type="checkbox"
                checked={selectedStatuses.includes(status)}
                onChange={() => handleCheckboxChange(status, selectedStatuses, setSelectedStatuses, 'projectStatus')}
              />
              {status}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
