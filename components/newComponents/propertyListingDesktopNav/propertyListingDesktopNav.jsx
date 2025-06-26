import React from 'react';
import NavDropdown from './navDropdown/navDropdown';
import PropertyListingSearch from './propertyListingSearch/propertyListingSearch';
import ListingNavSortBy from './listingNavSortBy/listingNavSortBy';
import {
  CityChangeDropdown,
  PropertyTypeDropdown,
  PriceRangeDropdown,
  ProjectStatusDropdown,
} from './propertyListingSearch/propertyListingDropdownComponents/propertyListingDropdownComponent.jsx';
import { useRouter } from 'next/router';

function PropertyListingDesktopNav({
  currentCitySearch,
  onFilterChange,
  propertyTypeFilter,
  priceRangeFilter,
  projectStatusFilter,
}) {
  const router = useRouter();

  const priceRanges = [
    { label: 'Less than 1 Cr.', range: [0, 10000000] },
    { label: '1 Cr. to 2 Cr.', range: [10000000, 20000000] },
    { label: '2 Cr. to 3 Cr.', range: [20000000, 30000000] },
    { label: '3 Cr. to 4 Cr.', range: [30000000, 40000000] },
    { label: '4 Cr. to 5 Cr.', range: [40000000, 50000000] },
    { label: '5 Cr. to 6 Cr.', range: [50000000, 60000000] },
    { label: '6 Cr. to 7 Cr.', range: [60000000, 70000000] },
    { label: 'More than 7 Cr.', range: [70000000, Infinity] },
  ];

  const handleCityChange = (newCity) => {
    onFilterChange('city', newCity);
    onFilterChange('propertyType', '');
    onFilterChange('priceRange', [1000000, 800000000]);
    onFilterChange('projectStatus', '');
    router.push(`/property-listing/city/${newCity}`);
  };

  const handlePropertyTypeChange = (newType) => {
    onFilterChange('propertyType', newType);
  };

  const handlePriceRangeChange = (newRange) => {
    onFilterChange('priceRange', newRange.range);
  };

  const handleProjectStatusChange = (status) => {
    onFilterChange('projectStatus', status);
  };

  const getPriceRangeLabel = () => {
    if (
      !priceRangeFilter ||
      (priceRangeFilter[0] === 10000000 && priceRangeFilter[1] === 80000000)
    ) {
      return 'Price Range';
    }

    const range = priceRanges.find(
      (r) =>
        r.range[0] === priceRangeFilter[0] && r.range[1] === priceRangeFilter[1]
    );
    return range ? range.label : 'Price Range';
  };

  const handleClearFilters = () => {
    onFilterChange('city', '');
    onFilterChange('propertyType', '');
    onFilterChange('priceRange', [1000000, 800000000]);
    onFilterChange('projectStatus', '');
  };

  return (
    <div className="propertyListingDesktopNav">
      <NavDropdown
        bgd={true}
        title="City"
        selectedValue={currentCitySearch || 'City'}
        onSelect={handleCityChange}
        width="8vw"
      >
        <CityChangeDropdown handleSelectionChange={handleCityChange} />
      </NavDropdown>
      <PropertyListingSearch location={currentCitySearch} />
      <NavDropdown
        width="11vw"
        title="Property Type"
        selectedValue={propertyTypeFilter || 'Property Type'}
        onSelect={handlePropertyTypeChange}
        marginLeft="2%"
      >
        <PropertyTypeDropdown
          handleSelectionChange={handlePropertyTypeChange}
        />
      </NavDropdown>
      <NavDropdown
        width="10vw"
        title={getPriceRangeLabel()}
        selectedValue={getPriceRangeLabel()}
        onSelect={handlePriceRangeChange}
      >
        <PriceRangeDropdown handleSelectionChange={handlePriceRangeChange} />
      </NavDropdown>
      <NavDropdown
        width="13vw"
        title={projectStatusFilter || 'Project Status'}
        selectedValue={projectStatusFilter || 'Project Status'}
        onSelect={handleProjectStatusChange}
      >
        <ProjectStatusDropdown
          handleSelectionChange={handleProjectStatusChange}
        />
      </NavDropdown>
      <ListingNavSortBy />
      <button onClick={handleClearFilters} className='clear-filters-button'>Clear Filters</button>
    </div>
  );
}

export default PropertyListingDesktopNav;
