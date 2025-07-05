import React, { useEffect, useState, useRef } from 'react';
// import './navDropdown.css';
import styles from './navDropdown.module.css'

function NavDropdown({
  bgd = false,
  title,
  selectedValue,
  onSelect,
  children,
  width,
  marginLeft,
}) {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [currentVal, setCurrentVal] = useState(title || 'Select');
  const wrapperRef = useRef(null);

  const handleNavDropdownClick = () => {
    setOpenDropDown((prev) => !prev);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleSelectionChange = (newValue) => {
    setCurrentVal(newValue);
    if (onSelect) {
      onSelect(newValue);
    }
    setOpenDropDown(false);
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpenDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedValue) {
      setCurrentVal(selectedValue);
    }
  }, [selectedValue]);

  return (
    <div
      className={styles.navDropdownWrapper}
      onClick={handleNavDropdownClick}
      style={{
        backgroundColor: bgd ? '#E7B554' : '#FFF',
        color: bgd ? '#ffff' : '#000',
        width: width,
        marginLeft: marginLeft,
      }}
      ref={wrapperRef}
    >
      {typeof currentVal === 'string' ? currentVal : 'Select'}{' '}
      {openDropDown && (
        <div
          className={styles.listingNavDropdownContentWrapper}
          onClick={stopPropagation}
        >
          {React.cloneElement(children, { handleSelectionChange })}
        </div>
      )}
    </div>
  );
}

export default NavDropdown;
