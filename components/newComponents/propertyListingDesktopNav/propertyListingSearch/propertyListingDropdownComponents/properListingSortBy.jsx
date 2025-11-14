import React, { useState } from 'react';
import styles from '../searchBar.module.css';

const SortDropdown = ({ onSortChange, defaultValue = "relevance" }) => {
  const [sortValue, setSortValue] = useState(defaultValue);

  const handleChange = (e) => {
    const newSort = e.target.value;
    setSortValue(newSort);
    onSortChange?.(newSort); // call parent handler
  };

  return (
    <div className={styles.sortContainer}>
      <select
        className={styles.sortDropdown}
        value={sortValue}
        onChange={handleChange}
      >
        <option value="relevance">SORT BY</option>
        <option value="priceLowHigh">Price: Low to High</option>
        <option value="priceHighLow">Price: High to Low</option>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
};

export default SortDropdown;
