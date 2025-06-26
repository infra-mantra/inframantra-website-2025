// src/pages/propertyListingPage/propertyListingDesktopNav/propertyListingSearch/propertyListingDropdownComponents/propertyListingDropdownComponent.jsx

export const CityChangeDropdown = ({ handleSelectionChange }) => {
    const cityDataSchema = [
      { name: 'Gurgaon' },
      { name: 'Pune' },
      { name: 'Noida' },
      { name: 'Delhi' },
    ];
  
    return (
      <>
        {cityDataSchema.map((city) => (
          <p
            key={city.name}
            onClick={() => {
              handleSelectionChange(city.name);
            }}
          >
            {city.name}
          </p>
        ))}
      </>
    );
  };
  
  export const PropertyTypeDropdown = ({ handleSelectionChange }) => {
    const propertyTypes = [
      { name: 'Residential' },
      { name: 'Commercial' },
      { name: 'Industrial' },
      { name: 'Agricultural' },
    ];
  
    return (
      <>
        {propertyTypes.map((type) => (
          <p key={type.name} onClick={() => handleSelectionChange(type.name)}>
            {type.name}
          </p>
        ))}
      </>
    );
  };
  
  export const PriceRangeDropdown = ({ handleSelectionChange }) => {
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
  
    return (
      <>
        {priceRanges.map((range) => (
          <p
            key={range.label}
            onClick={() => {
              handleSelectionChange(range);
            }}
          >
            {range.label}
          </p>
        ))}
      </>
    );
  };
  
  export const ProjectStatusDropdown = ({ handleSelectionChange }) => {
    const projectStatuses = [
      { name: 'New Launch' },
      { name: 'Under Construction' },
      { name: 'Ready to Move in' },
      { name: 'Near Possession' },
    ];
  
    return (
      <>
        {projectStatuses.map((status) => (
          <p key={status.name} onClick={() => handleSelectionChange(status.name)}>
            {status.name}
          </p>
        ))}
      </>
    );
  };
  