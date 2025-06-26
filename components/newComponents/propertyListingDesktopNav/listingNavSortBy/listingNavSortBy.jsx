import React, { useState } from "react";
// import "./listingNavSortBy.css"; // Make sure to create this CSS file

export default function ListingNavSortBy() {
  const [sortOption, setSortOption] = useState("");

  const handleChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <div className="sort-by-container">
      {/* <label htmlFor="sort-by-select" className="sort-by-label">Sort By:</label> */}
      <select
        id="sort-by-select"
        value={sortOption}
        onChange={handleChange}
        className="sort-by-select"
      >
        <option value="" disabled>Sort By:</option>
        {/* <option value="" disabled>Select option</option> */}
        <option value={0}>Price: High To Low</option>
        <option value={1}>Price: Low To High</option>
        <option value={2}>Newest</option>
      </select>
    </div>
  );
}
