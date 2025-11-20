import React, { useState, useEffect } from "react";
import style from "./ListingFilters.module.css";
export default function ListingFilters({
  onFilterChange,
  openClosefilter,
  handleCloseFilterToggle,
}) {
  // ---------------- STATES ----------------
  const [expanded, setExpanded] = useState({
    city: true,
    unitType: true,
    configuration: true,
    projectStatus: true,
    priceRange: true,
  });

  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedUnitTypes, setSelectedUnitTypes] = useState([]);
  const [selectedConfigurations, setSelectedConfigurations] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [priceRange, setPriceRange] = useState([null, null]);
    const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [inputError, setInputError] = useState("");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 // 🔥 Unified toggle function for all sections
const toggleSection = (key) => {
  setExpanded((prev) => ({
    ...prev,
    [key]: !prev[key],
  }));
};

  // ----------------------------------------------------
  // 🔥 FIX: Always send **latest** filter values
  // ----------------------------------------------------
  const notifyAllFilters = (override = {}) => {
    const payload = [
      override.city ?? selectedCities,
      override.unitType ?? selectedUnitTypes,
      override.configuration ?? selectedConfigurations,
      override.projectStatus ?? selectedStatuses,
      override.priceRange ?? priceRange,
    ];

    onFilterChange?.(
      ["city", "unitType", "configuration", "projectStatus", "priceRange"],
        payload
    );

  };

  // 🔥 FIX: Ensures newValue is passed, not old state
  const updateAndMaybeNotify = (setter, newValue, type) => {
    setter(newValue);

    if (!isMobile) {
      notifyAllFilters({ [type]: newValue });
    }
  };

  // ----------------------------------------------------
  // 🔥 CHECKBOX & TAG CLICK HANDLER
  // ----------------------------------------------------
  const handleCheckboxChange = (value, state, setter, type) => {
    const updated = state.includes(value)
      ? state.filter((item) => item !== value)
      : [...state, value];

    updateAndMaybeNotify(setter, updated, type);
  };

  const handleTagClick = (value, state, setter, type) => {
    const updated = state.includes(value)
      ? state.filter((item) => item !== value)
      : [...state, value];

    updateAndMaybeNotify(setter, updated, type);
  };

  // ----------------------------------------------------
  // 🔥 PRICE INPUT CHANGE (desktop auto-apply)
  // ----------------------------------------------------
 const handlePriceChange = (index, newValue) => {
  const updated = [...priceRange];   // [min, max]
 // Allow empty input → set null
  updated[index] = newValue !== "" ? Number(newValue) : null;
  const [min, max] = updated;
   // ---- Compare only when both values are not null ----
  if (min !== null && max !== null) {
    // If min becomes larger than max → fix max
    if (min > max) {
      updated[1] = min;
    }
   // If max becomes smaller than min → fix min
    if (max < min) {
      updated[0] = max;
    }
  }

  setPriceRange(updated);

  if (!isMobile) {
    notifyAllFilters({ priceRange: updated });
  }
};


  // ----------------------------------------------------
  // 🔥 VALIDATE PRICE (mobile)
  // ----------------------------------------------------
  const validateAndApplyInputPrice = () => {
    const [min, max] = priceRange;

    if (min && max && min > max) {
      alert("Minimum price cannot be greater than maximum price!");
      return;
    }

    notifyAllFilters({ priceRange });
  };

  // ----------------------------------------------------
  // 🔥 APPLY (mobile)
  // ----------------------------------------------------
  const applyFilters = () => {
    notifyAllFilters();
    handleCloseFilterToggle?.();
  };

  // ----------------------------------------------------
  // 🔥 RESET ALL FILTERS
  // ----------------------------------------------------
  const resetFilters = () => {
  setSelectedCities([]);
  setSelectedUnitTypes([]);
  setSelectedConfigurations([]);
  setSelectedStatuses([]);
  setPriceRange([null, null]);

  // CLEAR INPUT BOXES
  setMinInput("");
  setMaxInput("");
  setInputError("");

// Notify parent
  setTimeout(() => notifyAllFilters({
    priceRange: [null, null], // FIX: send default values
  }), 0);
};





const handlePriceInputChange = (e, type) => {
  const raw = e.target.value.trim();

  // Allow empty input
  if (raw === "") {
    if (type === "min") setMinInput("");
    else setMaxInput("");

    return; 
  }

  // ❌ If not a valid number → IGNORE the update (prevents NaN)
  if (!/^\d+$/g.test(raw)) {
    return; 
  }

  const value = Number(raw);

  let updatedRange = [...priceRange]; // [min, max]

  if (type === "min") {
    setMinInput(value);
    updatedRange[0] = value;

    if (updatedRange[1] !== null && value > updatedRange[1]) {
      updatedRange[1] = value;
      setMaxInput(value);
    }

  } else {
    setMaxInput(value);
    updatedRange[1] = value;

    if (updatedRange[0] !== null && value < updatedRange[0]) {
      updatedRange[0] = value;
      setMinInput(value);
    }
  }

  setPriceRange(updatedRange);

  if (!isMobile) {
    notifyAllFilters({ priceRange: updatedRange });
  }
};




  
const getTrackBackground = () => {
  const minPercent = ((priceRange[0] ?? 1) - 1) * 20; 
  const maxPercent = ((priceRange[1] ?? 10) - 1) * 20;

  return `linear-gradient(
    to right,
    #ddd ${minPercent}%,
    #0b6e21 ${minPercent}%,
    #0b6e21 ${maxPercent}%,
    #ddd ${maxPercent}%
  )`;
};

 
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
        
        <button className={style.resetButton} onClick={resetFilters}>
          Reset
        </button>
          <button className={style.resetButton} onClick={applyFilters}>
          APPLY
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
            "Villa"
          
           
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
              value={(priceRange[0] ?? 1) }
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className={style.thumb}
            />
            <input
              type="range"
              min="1"
              max="6"
              step="0.1"
              value={(priceRange[1] ?? 10) }
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className={style.thumb}
            />
            <div
              className={style.sliderTrack}
              style={{ background: getTrackBackground() }}
            ></div>
          </div>

          <div className={style.priceLabels}>
           <span>{(priceRange[0] ?? 1) + " Cr"}</span>
           <span>{(priceRange[1] ?? 10) + " Cr"}</span>
          </div>

          <div className={style.priceInputs}>
            <input
              type="text"
              placeholder="Min Amount in Cr.*"
              value={minInput}
              onChange={(e) => handlePriceInputChange(e, "min")}
            />
            <span className={style.dash}>—</span>
            <input
              type="text"
              placeholder="Max Amount in Cr.*"
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
             "New Launch",
             "Under Construction",
            "Near Possession",
            "Ready to Move In",
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
    <div className={style.containerWrapper} >
      <div className={style.buttonWrapper}>
        <button className={style.filterbtn}>Filters</button>
     <button className={`${style.resetButton}`} onClick={resetFilters}>
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
            "Villa"
          
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
              value={(priceRange[0] ?? 1) }
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className={style.thumb}
            />
            <input
              type="range"
              min="1"
              max="6"
              step="0.1"
              value={(priceRange[1] ?? 10) }
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className={style.thumb}
            />
            <div className={style.sliderTrack} style={{ background: getTrackBackground() }} />
          </div>

          <div className={style.priceLabels}>
<span>{(priceRange[0] ?? 1) + " Cr"}</span>
<span>{(priceRange[1] ?? 10) + " Cr"}</span>
          </div>

          <div className={style.priceInputs}>
            <input
              type="text"
              placeholder="Min Amount in Cr.*"
              value={minInput}
              onChange={(e) => handlePriceInputChange(e, "min")}
            />
            <span className={style.dash}>—</span>
            <input
              type="text"
              placeholder="Max Amount in Cr.*"
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
            "New Launch",
             "Under Construction",
            "Near Possession",
            "Ready to Move In",
           
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
