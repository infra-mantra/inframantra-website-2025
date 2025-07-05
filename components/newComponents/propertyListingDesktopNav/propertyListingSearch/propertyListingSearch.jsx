import React, { useState, useEffect, useRef } from "react";
import { FaTimes } from 'react-icons/fa';
import PropertyListingSearchData from "./PropertyListingSearchData";
import styles from './propertyListingSearch.module.css'

function PropertyListingSearch({ searchData , onSelected , onClear}) {
  const [searchSelectionBox, setSearchSelectionBox] = useState(false);
  const [searchOptionValue, setSearchOptionValue] = useState("");
  const [selectedValueText, setSelectedValueText] = useState("");
  const wrapperRef = useRef(null);

  const handleSearchDropdownOpen = () => {
    if (!selectedValueText) {
      setSearchSelectionBox(true);
    }
  };

  const handlePropertyListSearchChange = (e) => {
    const value = e.target.value;
    if (!selectedValueText) {
      setSearchOptionValue(value);
      setSearchSelectionBox(value.length > 0); 
    }
  };

  const handleSelectedValue = (val) => {
    onSelected(val)
    setSelectedValueText(val);
    setSearchSelectionBox(false);
    setSearchOptionValue("");
  };

  const handleClearSelectedValue = () => {
    onClear('');
    setSelectedValueText("");
    setSearchOptionValue("");
    onSelected("");
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSearchSelectionBox(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.propertyListingSearcContainer} ref={wrapperRef}>
      <input
        className={`${styles.propertyListingSearchWrapper} ${selectedValueText ? "disabled" : ""}`}
        placeholder='Search by property or locality'
        onClick={handleSearchDropdownOpen}
        onChange={handlePropertyListSearchChange}
        value={searchOptionValue}
        readOnly={!!selectedValueText}
      />
      {selectedValueText && (
        <SelectedTextBox
          selectedOption={selectedValueText}
          onClear={handleClearSelectedValue}
        />
      )}
      {searchSelectionBox && searchOptionValue.length > 0 && (
        <PropertyListingSearchData
          searchOptionValue={searchOptionValue}
          selectedValue={(val) => handleSelectedValue(val)}
          searchData={searchData}
        />
      )}
    </div>
  );
}

export default PropertyListingSearch;

const SelectedTextBox = ({ selectedOption = "", onClear }) => {
  return (
    <div className={styles.selectedTextBoxWrapper}>
      <p>{selectedOption}</p>
      <FaTimes onClick={onClear} />
    </div>
  );
};
