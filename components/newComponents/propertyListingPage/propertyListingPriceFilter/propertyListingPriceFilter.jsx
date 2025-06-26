import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import { priceRangeData } from "../propertyListingConstant";
// import "../propertyListingPageMobileFilter.css";

// Convert numeric value to readable format (e.g., Lacs or Cr.)
export const valuetext = (value) => {
  if (value >= 10000000) {
    return `${value / 10000000} Cr.`;
  } else if (value >= 100000) {
    return `${value / 100000} Lacs`;
  } else {
    return `${value}`;
  }
};

const PropertyListingPriceFilter = ({
  priceRange,
  onChangePriceRange,
  reset,
  handleReset,
}) => {
  const [localRange, setLocalRange] = useState(priceRange);

  const handleChange = (event, newValue) => {
    if (newValue[0] > newValue[1]) {
      newValue[0] = newValue[1];
    }
    setLocalRange(newValue);
    onChangePriceRange(newValue);
  };

  useEffect(() => {
    if (reset) {
      const defaultRange = [10000000, 70000000];
      setLocalRange(defaultRange);
      onChangePriceRange(defaultRange);
      handleReset();
    }
  }, [reset, handleReset, onChangePriceRange]);

  return (
    <div className="filtersPriceRangeWrapper">
      <Slider
        getAriaLabel={() => "Indian Rupees Range"}
        value={localRange}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        valueLabelFormat={valuetext}
        step={1000000}
        marks={priceRangeData}
        min={10000000}
        max={70000000}
        size="small"
        sx={{
          color: "#0b6e21",
          "& .MuiSlider-thumb": {
            backgroundColor: "#0b6e21",
          },
          "& .MuiSlider-track": {
            backgroundColor: "#0b6e21",
          },
          "& .MuiSlider-rail": {
            backgroundColor: "#337ab7",
          },
        }}
      />
      <div className="priceRangeText">
        Selected range: ₹{valuetext(localRange[0])} - ₹{valuetext(localRange[1])}
      </div>
    </div>
  );
};

export default PropertyListingPriceFilter;
