import React, { useState } from 'react';
import {
  cityNames,
  propertyTypeData,
  valuetext,
} from './dropDownMenuConstants';
import styles from './dropDownMenuComponent.module.css';

export const LocationDropDownContent = ({ selectedLocation }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  const handledropDownMenuLocationClick = (e, city) => {
    setSelectedCity(city);
    selectedLocation(city.name);
  };

  return (
    <>
      {cityNames && Array.isArray(cityNames) && (
        <div className={styles.dropDownMenuItems}>
          <div className={styles.dropDownMenuItemsContainer}>
            {cityNames.map((city) => (
              <p
                key={city.name}
                onClick={(e) => handledropDownMenuLocationClick(e, city)}
                className={`${styles.dropDownMenuItemsText} ${
                  selectedCity && selectedCity.name === city.name
                    ? styles.menuItemSelected
                    : ''
                }`}
              >
                {city.name}
              </p>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export const PropertyTypeDropDownContent = ({
  propertyTypeValue,
  selectedPropertyType,
  setSelectedPropertyType,
  checkedUnits,
  setCheckedUnits,
}) => {
  const handlePropertyTypeCheckboxChange = (propertyType) => {
    const newValue = selectedPropertyType === propertyType ? null : propertyType;
    setSelectedPropertyType(newValue);
    propertyTypeValue(newValue);
  };

  const handleUnitCheckboxChange = (propertyTypeName, unitName) => {
    setCheckedUnits((prevChecked) => ({
      ...prevChecked,
      [propertyTypeName]: {
        ...prevChecked[propertyTypeName],
        [unitName]: !prevChecked[propertyTypeName]?.[unitName],
      },
    }));
  };

  return (
    <div className={styles.propertyTypeDropDownContentWrapper}>
      <div className={styles.scrollableContent}>
        {propertyTypeData.map((prop) => (
          <div
            key={prop.name}
            className={styles.propertyTypeDropDownContentFlexContainer}
          >
            <input
              type="checkbox"
              checked={selectedPropertyType === prop.name}
              onChange={() => handlePropertyTypeCheckboxChange(prop.name)}
            />
            <p
              className={styles.propertyTypeDropDownContent}
              onClick={() => handlePropertyTypeCheckboxChange(prop.name)}
            >
              {prop.name}
            </p>
          </div>
        ))}
        <hr style={{ borderTop: '1px dashed #ffc107', width: '100%', marginTop: '-5px' }} />
        {selectedPropertyType &&
          propertyTypeData
            .find((p) => p.name === selectedPropertyType)
            ?.[`${selectedPropertyType.toLowerCase()}UnitTypes`]?.map((unit) => (
              <div
                key={unit.name}
                className={styles.propertyTypeDropDownContentFlexContainer}
              >
                <input
                  type="checkbox"
                  checked={
                    checkedUnits[selectedPropertyType]?.[unit.name] || false
                  }
                  onChange={() =>
                    handleUnitCheckboxChange(selectedPropertyType, unit.name)
                  }
                />
                <p
                  className={styles.propertyTypeDropDownContent}
                  onClick={() =>
                    handleUnitCheckboxChange(selectedPropertyType, unit.name)
                  }
                >
                  {unit.name}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};

export const PriceRangeDropDownContent = ({ priceRange, onChangePriceRange }) => {
  const handleChange = (event) => {
    const newValue = [event.target.valueAsNumber, priceRange[1]];
    if (newValue[0] > newValue[1]) newValue[0] = newValue[1];
    onChangePriceRange(newValue);
  };

  const handleChangeMax = (event) => {
    const newValue = [priceRange[0], event.target.valueAsNumber];
    if (newValue[1] < newValue[0]) newValue[1] = newValue[0];
    onChangePriceRange(newValue);
  };

  return (
    <div className={styles.priceRangeDropDownContentWrapper}>
      <div className="slider-container">
        <div className={styles.labelContainer}>
          <input
            type="range"
            min={10000000}
            max={70000000}
            step={1000000}
            value={priceRange[0]}
            onChange={handleChange}
            className="slider"
            style={{ width: '60%' }}
          />
          <span>LOW {valuetext(priceRange[0])}</span>
        </div>
        <div className={styles.labelContainer}>
          <input
            type="range"
            min={10000000}
            max={70000000}
            step={1000000}
            value={priceRange[1]}
            onChange={handleChangeMax}
            className="slider"
            style={{ width: '60%' }}
          />
          <span>HIGH {valuetext(priceRange[1])}</span>
        </div>
      </div>
    </div>
  );
};
