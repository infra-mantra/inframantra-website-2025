import React, { useState, useEffect , useRef } from "react";
import style from "./ListingFilters.module.css";

export default function ListingFilters({
  onFilterChange,
  openClosefilter,
  handleCloseFilterToggle,
  ref
}) {
  const [expanded, setExpanded] = useState({
    unitType: true,
    configuration: true,
    priceRange: true,
    projectStatus: true,
  });

  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedUnitTypes, setSelectedUnitTypes] = useState([]);
  const [selectedConfigurations, setSelectedConfigurations] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 6]);
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSection = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleCheckboxChange = (value, state, setter, type) => {
    const updated = state.includes(value)
      ? state.filter((item) => item !== value)
      : [...state, value];
    setter(updated);
    onFilterChange?.(type, updated);
  };

  const handleTagClick = (value, state, setter, type) => {
    const updated = state.includes(value)
      ? state.filter((item) => item !== value)
      : [...state, value];
    setter(updated);
    onFilterChange?.(type, updated);
  };

  const handlePriceChange = (index, value) => {
    const updated = [...priceRange];
    updated[index] = parseFloat(value);
    if (updated[0] <= updated[1]) {
      setPriceRange(updated);
      onFilterChange?.("priceRange", updated);
      setMinInput("");
      setMaxInput("");
      setInputError("");
    }
  };

  const validateAndApplyInputPrice = (min, max) => {
    if (isNaN(min) || isNaN(max)) {
      setInputError("Please enter valid numbers");
      return false;
    }

    if (min <= 0 || max <= 0) {
      setInputError("Amount must be a positive number");
      return false;
    }

    if (min > max) {
      setInputError("Min amount cannot be greater than max amount");
      return false;
    }

    setInputError("");
    setPriceRange([min, max]);
    onFilterChange?.("priceRange", [min, max]);
    return true;
  };

  const handlePriceInputChange = (e, type) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    if (type === "min") {
      setMinInput(value);
      const min = parseFloat(value);
      const max = parseFloat(maxInput) || priceRange[1];
      validateAndApplyInputPrice(min, max);
    } else {
      setMaxInput(value);
      const max = parseFloat(value);
      const min = parseFloat(minInput) || priceRange[0];
      validateAndApplyInputPrice(min, max);
    }
  };

  const getTrackBackground = () => {
    const min = ((priceRange[0] - 1) / 5) * 100;
    const max = ((priceRange[1] - 1) / 5) * 100;
    return `linear-gradient(to right, #e5e5e5 ${min}%, #0b6e21 ${min}%, #0b6e21 ${max}%, #e5e5e5 ${max}%)`;
  };

  const resetFilters = () => {
    setSelectedCities([]);
    setSelectedUnitTypes([]);
    setSelectedConfigurations([]);
    setSelectedStatuses([]);
    setPriceRange([1, 6]);
    setMinInput("");
    setMaxInput("");
    setInputError("");
    onFilterChange?.("city", []);
    onFilterChange?.("unitType", []);
    onFilterChange?.("configuration", []);
    onFilterChange?.("projectStatus", []);
    onFilterChange?.("priceRange", [1, 6]);
  };

  // Mobile render (entire mobile tree)
 
if (isMobile) {
  // ✅ Only show the mobile drawer if it's open
  if (!openClosefilter) return (  <div
      className={`${style.containerWrapper} ${style.mobileDrawer} ${
        openClosefilter ? style.open : style.cls
      }`}
      style={{ width: openClosefilter ? '100%' : '0' }}
    ></div>);

  return (
    <div
      className={`${style.containerWrapper} ${style.mobileDrawer} ${
        openClosefilter ? style.open : style.cls
      }`}
      style={{ width: openClosefilter ? '100%' : '0' }}
    >
      {/* Header */}
      <div className={style.mobileHeader}>
        <span className={style.mobileTitle}>FILTERS</span>
        <button className={style.resetMobileBtn} onClick={resetFilters}>
          Reset
        </button>
        <button className={style.closeBtn} onClick={handleCloseFilterToggle}>
          ✖
        </button>
      </div>

      <div className={style.hr}></div>

      {/* Location */}
      <div className={style.sectionTitle}>Location</div>
      <div className={style.locationTags}>
        {["Gurgaon", "Noida", "Pune", "Jaipur"].map((city) => (
          <span
            key={city}
            className={`${style.tag} ${
              selectedCities.includes(city) ? style.active1 : ""
            }`}
            onClick={() =>
              handleTagClick(city, selectedCities, setSelectedCities, "city")
            }
          >
            {city}
          </span>
        ))}
      </div>

      {/* Unit Type */}
      <div
        className={style.sectionHeader}
        onClick={() => toggleSection("unitType")}
      >
        <span>UNIT TYPE</span>
        <span
          className={`${style.arrowIcon} ${
            expanded.unitType ? style.rotateDown : style.rotateUp
          }`}
        >
          ▼
        </span>
      </div>
      {expanded.unitType && (
        <div className={style.locationTags}>
          {[
            "Low Rise Apartment",
            "High Rise Apartment",
            "Villa",
            "Builder Floor",
            "Independent Floor",
            "Plot",
            "Studio Apartment",
          ].map((type) => (
            <span
              key={type}
              className={`${style.tag} ${
                selectedUnitTypes.includes(type) ? style.active1 : ""
              }`}
              onClick={() =>
                handleTagClick(
                  type,
                  selectedUnitTypes,
                  setSelectedUnitTypes,
                  "unitType"
                )
              }
            >
              {type}
            </span>
          ))}
        </div>
      )}

      {/* Configuration */}
      <div
        className={style.sectionHeader}
        onClick={() => toggleSection("configuration")}
      >
        <span>CONFIGURATION</span>
        <span
          className={`${style.arrowIcon} ${
            expanded.configuration ? style.rotateDown : style.rotateUp
          }`}
        >
          ▼
        </span>
      </div>
      {expanded.configuration && (
        <div className={style.locationTags}>
          {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "Penthouse"].map(
            (config) => {
              const isBhk = config.includes("BHK");
              const value = isBhk ? config.replace(" BHK", "") : config;
              return (
                <span
                  key={config}
                  className={`${style.tag} ${
                    selectedConfigurations.includes(value) ? style.active1 : ""
                  }`}
                  onClick={() =>
                    handleTagClick(
                      value,
                      selectedConfigurations,
                      setSelectedConfigurations,
                      "configuration"
                    )
                  }
                >
                  {config}
                </span>
              );
            }
          )}
        </div>
      )}

      {/* Price Range */}
      <div
        className={style.sectionHeader}
        onClick={() => toggleSection("priceRange")}
      >
        <span>PRICE RANGE</span>
        <span
          className={`${style.arrowIcon} ${
            expanded.priceRange ? style.rotateDown : style.rotateUp
          }`}
        >
          ▼
        </span>
      </div>
      {expanded.priceRange && (
        <div className={style.priceRangeContainer}>
          <div className={style.sliderWrapper}>
            <input
              type="range"
              min="1"
              max="6"
              step="0.1"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className={style.thumb}
            />
            <input
              type="range"
              min="1"
              max="6"
              step="0.1"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className={style.thumb}
            />
            <div
              className={style.sliderTrack}
              style={{ background: getTrackBackground() }}
            ></div>
          </div>

          <div className={style.priceLabels}>
            <span>{priceRange[0]} Cr</span>
            <span>{priceRange[1]} Cr</span>
          </div>

          <div className={style.priceInputs}>
            <input
              type="text"
              placeholder="Min Amount"
              value={minInput}
              onChange={(e) => handlePriceInputChange(e, "min")}
            />
            <span className={style.dash}>—</span>
            <input
              type="text"
              placeholder="Max Amount"
              value={maxInput}
              onChange={(e) => handlePriceInputChange(e, "max")}
            />
          </div>

          {inputError && (
            <span className={style.errorText}>{inputError}</span>
          )}
        </div>
      )}

      {/* Project Status */}
      <div
        className={style.sectionHeader}
        onClick={() => toggleSection("projectStatus")}
      >
        <span>PROJECT STATUS</span>
        <span
          className={`${style.arrowIcon} ${
            expanded.projectStatus ? style.rotateDown : style.rotateUp
          }`}
        >
          ▼
        </span>
      </div>
      {expanded.projectStatus && (
        <div className={style.locationTags}>
          {[
            "Near Possession",
            "New Launch",
            "Ready to move",
            "Under Construction",
          ].map((status) => (
            <span
              key={status}
              className={`${style.tag} ${
                selectedStatuses.includes(status) ? style.active1 : ""
              }`}
              onClick={() =>
                handleTagClick(
                  status,
                  selectedStatuses,
                  setSelectedStatuses,
                  "projectStatus"
                )
              }
            >
              {status}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

  if(!isMobile){
    return (
    <div className={style.containerWrapper} ref={ref}>
      <div className={style.buttonWrapper}>
        <button className={style.filterbtn}>Filters</button>
     <button className={`${style.resetMobileBtn} ${style.resetButton}`} onClick={resetFilters}>
  Reset
</button>

      </div>

      <div className={style.hr}></div>

      {/* Location */}
      <div className={style.sectionTitle}>Location</div>
      <div className={style.locationTags}>
        {["Gurgaon", "Noida", "Pune", "Jaipur"].map((city) => (
          <span
            key={city}
            className={`${style.tag} ${selectedCities.includes(city) ? style.active1 : ""}`}
            onClick={() =>
              handleTagClick(city, selectedCities, setSelectedCities, "city")
            }
          >
            {city}
          </span>
        ))}
      </div>

      {/* Unit Type */}
      <div
        className={style.sectionHeader}
        onClick={() => toggleSection("unitType")}
      >
        <span>UNIT TYPE</span>
        <span className={`${style.arrowIcon} ${expanded.unitType ? style.rotateDown : style.rotateUp}`}>
          ▼
        </span>
      </div>
      {expanded.unitType && (
        <div className={style.checkboxGroup}>
          {[
            "Low Rise Apartment",
            "High Rise Apartment",
            "Villa",
            "Builder Floor",
            "Independent Floor",
            "Plot",
            "Studio Apartment",
          ].map((type) => (
            <label className={style.checkboxItem} key={type}>
              <input
                type="checkbox"
                checked={selectedUnitTypes.includes(type)}
                onChange={() =>
                  handleCheckboxChange(type, selectedUnitTypes, setSelectedUnitTypes, "unitType")
                }
              />
              {type}
            </label>
          ))}
        </div>
      )}

      {/* Configuration */}
      <div
        className={style.sectionHeader}
        onClick={() => toggleSection("configuration")}
      >
        <span>CONFIGURATION</span>
        <span className={`${style.arrowIcon} ${expanded.configuration ? style.rotateDown : style.rotateUp}`}>
          ▼
        </span>
      </div>
      {expanded.configuration && (
        <div className={style.checkboxGroup}>
          {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "Penthouse"].map(
            (config) => {
              const isBhk = config.includes("BHK");
              const value = isBhk ? config.replace(" BHK", "") : config;
              return (
                <label className={style.checkboxItem} key={config}>
                  <input
                    type="checkbox"
                    checked={selectedConfigurations.includes(value)}
                    onChange={() =>
                      handleCheckboxChange(value, selectedConfigurations, setSelectedConfigurations, "configuration")
                    }
                  />
                  {config}
                </label>
              );
            }
          )}
        </div>
      )}

      {/* Price Range */}
      <div
        className={style.sectionHeader}
        onClick={() => toggleSection("priceRange")}
      >
        <span>PRICE RANGE</span>
        <span className={`${style.arrowIcon} ${expanded.priceRange ? style.rotateDown : style.rotateUp}`}>
          ▼
        </span>
      </div>
      {expanded.priceRange && (
        <div className={style.priceRangeContainer}>
          <div className={style.sliderWrapper}>
            <input
              type="range"
              min="1"
              max="6"
              step="0.1"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className={style.thumb}
            />
            <input
              type="range"
              min="1"
              max="6"
              step="0.1"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className={style.thumb}
            />
            <div className={style.sliderTrack} style={{ background: getTrackBackground() }} />
          </div>

          <div className={style.priceLabels}>
            <span>{priceRange[0]} Cr</span>
            <span>{priceRange[1]} Cr</span>
          </div>

          <div className={style.priceInputs}>
            <input
              type="text"
              placeholder="Min Amount"
              value={minInput}
              onChange={(e) => handlePriceInputChange(e, "min")}
            />
            <span className={style.dash}>—</span>
            <input
              type="text"
              placeholder="Max Amount"
              value={maxInput}
              onChange={(e) => handlePriceInputChange(e, "max")}
            />
          </div>

          {inputError && <span className={style.errorText}>{inputError}</span>}
        </div>
      )}

      {/* Project Status */}
      <div
        className={style.sectionHeader}
        onClick={() => toggleSection("projectStatus")}
      >
        <span>PROJECT STATUS</span>
        <span className={`${style.arrowIcon} ${expanded.projectStatus ? style.rotateDown : style.rotateUp}`}>
          ▼
        </span>
      </div>
      {expanded.projectStatus && (
        <div className={style.checkboxGroup}>
          {[
            "Near Possession",
            "New Launch",
            "Ready to move",
            "Under Construction",
          ].map((status) => (
            <label className={style.checkboxItem} key={status}>
              <input
                type="checkbox"
                checked={selectedStatuses.includes(status)}
                onChange={() =>
                  handleCheckboxChange(status, selectedStatuses, setSelectedStatuses, "projectStatus")
                }
              />
              {status}
            </label>
          ))}
        </div>
      )}
    </div>
  );
  }

}
