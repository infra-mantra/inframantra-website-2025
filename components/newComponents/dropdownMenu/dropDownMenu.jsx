import React, { useState, useEffect, useRef } from "react";
import styles from './DropDownMenu.module.css'; // CSS module

function DropDownMenu({
  icon: Icon,
  selectTitle,
  dropDownContent,
  toggleDropdown = () => {},
}) {
  const [showDropDownMenuItems, setShowDropDownMenuItems] = useState(false);
  const dropDownRef = useRef(null);

  const dropDownClickHandler = () => {
    setShowDropDownMenuItems((prev) => !prev);
    toggleDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        if (showDropDownMenuItems) toggleDropdown();
        setShowDropDownMenuItems(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropDownRef, showDropDownMenuItems, toggleDropdown]);

  return (
    <div className={styles.dropDownMenuWrapper} ref={dropDownRef}>
      <div onClick={dropDownClickHandler} className={styles.dropDownMenuFlexContainer}>
        <span className={styles.dropDownMenuIcon}>{Icon}</span>
        <p className={styles.dropDownMenuSelectText}>{selectTitle}</p>
      </div>
      {showDropDownMenuItems && dropDownContent}
    </div>
  );
}

export default DropDownMenu;
