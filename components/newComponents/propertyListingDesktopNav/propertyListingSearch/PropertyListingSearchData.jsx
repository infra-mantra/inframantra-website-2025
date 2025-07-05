import React from "react";
import { FaHome, FaMapMarkerAlt } from "react-icons/fa";
import styles from './PropertyListingSearchData.module.css'

function PropertyListingSearchData({ searchOptionValue, selectedValue, searchData }) {
  const keyword = searchOptionValue.toLowerCase();

  const propertiesSet = new Set();
  const locationsSet = new Set();

  // Filter unique property names matching keyword
  searchData.forEach((item) => {
    if (item.name?.toLowerCase().includes(keyword)) {
      propertiesSet.add(item.name);
    }
    if (item.location?.toLowerCase().includes(keyword)) {
      locationsSet.add(item.location);
    }
  });

  const filteredResultsProperties = Array.from(propertiesSet);
  const filteredResultsLocations = Array.from(locationsSet);

  const hasResults = filteredResultsProperties.length > 0 || filteredResultsLocations.length > 0;

  return (
    <div className={styles.searchDropdown}>
      {hasResults ? (
        <>
          {filteredResultsProperties.map((name, index) => (
            <div
              key={`property-${index}`}
              className={styles.searchDropdownItem}
              onClick={() => selectedValue(name)}
            >
              <div className="propertyLine">
                <FaHome className="icon" />
                <span>{name}</span>
              </div>
            </div>
          ))}

          {filteredResultsLocations.map((location, index) => (
            <div
              key={`location-${index}`}
              className={styles.searchDropdownItem}
              onClick={() => selectedValue(location)}
            >
              <div className={styles.locationLine}>
                <FaMapMarkerAlt className={styyles.icon} />
                <span>{location}</span>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.noResults}>No results found</div>
      )}
    </div>
  );
}

export default PropertyListingSearchData;
