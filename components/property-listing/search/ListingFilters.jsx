import React, { useState, useEffect, useRef } from "react";
import style from "./ListingFilters.module.css";
import { useRouter } from "next/router";
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
  const router = useRouter();
  let { type, name } = router.query;
  // console.log(type,name)
  useEffect(() => {
    // Initialize the filter UI FROM THE URL so shared/bookmarked links show the right selections.
    // LOCAL state only — no parent notify — the listing page reads the same URL and does the fetch
    // (notifying here would trigger a second identical fetch: the "loading twice" flash).
    const q = router.query;
    const csv = (v) =>
      typeof v === "string" && v.trim()
        ? v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
    setSelectedUnitTypes(csv(q.unit));
    setSelectedConfigurations(csv(q.config));
    setSelectedStatuses(csv(q.status));
    const min = q.min ? Number(q.min) : null;
    const max = q.max ? Number(q.max) : null;
    setPriceRange([min, max]);
    setMinInput(q.min ? String(q.min) : "");
    setMaxInput(q.max ? String(q.max) : "");
    setInputError("");
    setSelectedCities(type === "city" ? [name] : []);
  }, [name]);

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
  const notifyAllFilters = (override = {}, reset = false) => {
    if (reset) {
      const payload = [
        override.city ?? [],
        override.unitType ?? [],
        override.configuration ?? [],
        override.projectStatus ?? [],
        override.priceRange ?? [null, null],
      ];
      onFilterChange?.(
        ["city", "unitType", "configuration", "projectStatus", "priceRange"],
        payload
      );
      return;
    }
    const payload = [
      override.city ?? selectedCities,
      override.unitType ?? selectedUnitTypes,
      override.configuration ?? selectedConfigurations,
      override.projectStatus ?? selectedStatuses,
      override.priceRange ?? priceRange,
    ];

    onFilterChange?.(["city", "unitType", "configuration", "projectStatus", "priceRange"], payload);
  };

  // The price slider fires onChange on EVERY pixel of drag, and the price inputs on every
  // keystroke. Applying on each of those spammed the parent with fetches + URL replaces +
  // scroll-to-top, making the results crawl upward. Debounce so we apply ONCE the user settles.
  const priceNotifyTimer = useRef(null);
  const notifyPriceDebounced = (updatedRange) => {
    if (priceNotifyTimer.current) clearTimeout(priceNotifyTimer.current);
    priceNotifyTimer.current = setTimeout(() => {
      notifyAllFilters({ priceRange: updatedRange });
    }, 400);
  };
  useEffect(
    () => () => {
      if (priceNotifyTimer.current) clearTimeout(priceNotifyTimer.current);
    },
    []
  );

  // 🔥 FIX: Ensures newValue is passed, not old state
  const updateAndMaybeNotify = (setter, newValue, type) => {
    setter(newValue);

    if (!isMobile) {
      notifyAllFilters({ [type]: newValue });
    }
  };

  // ----------------------------------------------------
  // 🔥 CHECKBOX & TAG CLICK HANDLER
  // ----------------------------------------------------s
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
    const updated = [...priceRange]; // [min, max]
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
      notifyPriceDebounced(updated);
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
    notifyAllFilters(
      {
        priceRange: [null, null], // FIX: send default values
      },
      true
    );
  };

  const handlePriceInputChange = (e, type) => {
    let raw = e.target.value.trim();

    // Allow empty
    if (raw === "") {
      if (type === "min") setMinInput("");
      else setMaxInput("");
      return;
    }

    // Allow leading dot → convert to "0.x"
    if (raw.startsWith(".")) {
      raw = "0" + raw;
    }

    // Reject input that contains invalid characters
    // Allowed: digits + max one dot
    if (!/^\d*\.?\d*$/.test(raw)) {
      return;
    }

    // Reject only "." → not a valid number
    if (raw === ".") {
      return;
    }

    const value = Number(raw);
    let updatedRange = [...priceRange];

    if (type === "min") {
      setMinInput(raw);
      updatedRange[0] = value;

      if (updatedRange[1] !== null && value > updatedRange[1]) {
        updatedRange[1] = value;
        setMaxInput(raw);
      }
    } else {
      setMaxInput(raw);
      updatedRange[1] = value;

      if (updatedRange[0] !== null && value < updatedRange[0]) {
        updatedRange[0] = value;
        setMinInput(raw);
      }
    }

    setPriceRange(updatedRange);

    if (!isMobile) {
      notifyPriceDebounced(updatedRange);
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
    if (!openClosefilter)
      return (
        <div
          className={`${style.containerWrapper} ${style.mobileDrawer} ${
            openClosefilter ? style.open : style.cls
          }`}
          style={{ width: openClosefilter ? "100%" : "0" }}
        ></div>
      );

    return (
      <div
        className={`${style.containerWrapper} ${style.mobileDrawer} ${
          openClosefilter ? style.open : style.cls
        }`}
        style={{ width: openClosefilter ? "100%" : "0" }}
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
        <div
          className={style.sectionTitle}
          style={{ display: "flex", alignItems: "center", gap: "7px" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#0b6e21" aria-hidden="true">
            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
          </svg>
          Location
        </div>
        <div className={style.locationTags}>
          {["Gurgaon", "Mohali", "Noida", "Pune", "Jaipur"].map((city) => (
            <span
              key={city}
              className={`${style.tag} ${selectedCities.includes(city) ? style.active1 : ""}`}
              onClick={() => handleTagClick(city, selectedCities, setSelectedCities, "city")}
            >
              {city}
            </span>
          ))}
        </div>

        {/* Unit Type */}
        <div className={style.sectionHeader} onClick={() => toggleSection("unitType")}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 21V10l8-6 8 6v11h-5v-6H9v6H4z" />
            </svg>
            UNIT TYPE
          </span>
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
            {["Low Rise Apartment", "High Rise Apartment", "Villa"].map((type) => (
              <span
                key={type}
                className={`${style.tag} ${selectedUnitTypes.includes(type) ? style.active1 : ""}`}
                onClick={() =>
                  handleTagClick(type, selectedUnitTypes, setSelectedUnitTypes, "unitType")
                }
              >
                {type}
              </span>
            ))}
          </div>
        )}

        {/* Configuration */}
        <div className={style.sectionHeader} onClick={() => toggleSection("configuration")}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h8v8H3v-8zm10 3h8v5h-8v-5z" />
            </svg>
            CONFIGURATION
          </span>
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
            {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "Penthouse"].map((config) => {
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
            })}
          </div>
        )}

        {/* Price Range */}
        <div className={style.sectionHeader} onClick={() => toggleSection("priceRange")}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21.4 11.6l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .6 1.4l9 9a2 2 0 0 0 2.8 0l7-7a2 2 0 0 0 0-2.8zM6.5 8A1.5 1.5 0 1 1 6.5 5a1.5 1.5 0 0 1 0 3z" />
            </svg>
            PRICE RANGE
          </span>
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
                value={priceRange[0] ?? 1}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className={style.thumb}
              />
              <input
                type="range"
                min="1"
                max="6"
                step="0.1"
                value={priceRange[1] ?? 10}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className={style.thumb}
              />
              <div className={style.sliderTrack} style={{ background: getTrackBackground() }}></div>
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
        <div className={style.sectionHeader} onClick={() => toggleSection("projectStatus")}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 11h-4v-2h2V7h2v6z" />
            </svg>
            PROJECT STATUS
          </span>
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
            {["New Launch", "Under Construction", "Near Possession", "Ready to Move In"].map(
              (status) => (
                <span
                  key={status}
                  className={`${style.tag} ${
                    selectedStatuses.includes(status) ? style.active1 : ""
                  }`}
                  onClick={() =>
                    handleTagClick(status, selectedStatuses, setSelectedStatuses, "projectStatus")
                  }
                >
                  {status}
                </span>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  if (!isMobile) {
    return (
      <div className={style.containerWrapper}>
        <div className={style.buttonWrapper}>
          <span className={style.filterbtn}>Filters</span>
          <button className={`${style.resetButton}`} onClick={resetFilters}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.73 10.19h-2.08A6 6 0 1 1 12 6c1.57 0 2.99.62 4.05 1.6L13 11h7V4l-2.35 2.35z" />
            </svg>
            Reset
          </button>
        </div>

        <div className={style.hr}></div>

        {/* Location */}
        <div
          className={style.sectionTitle}
          style={{ display: "flex", alignItems: "center", gap: "7px" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#0b6e21" aria-hidden="true">
            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
          </svg>
          Location
        </div>
        <div className={style.locationTags}>
          {["Gurgaon", "Mohali", "Noida", "Pune", "Jaipur"].map((city) => (
            <span
              key={city}
              className={`${style.tag} ${selectedCities.includes(city) ? style.active1 : ""}`}
              onClick={() => handleTagClick(city, selectedCities, setSelectedCities, "city")}
            >
              {city}
            </span>
          ))}
        </div>

        {/* Unit Type */}
        <div className={style.sectionHeader} onClick={() => toggleSection("unitType")}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 21V10l8-6 8 6v11h-5v-6H9v6H4z" />
            </svg>
            UNIT TYPE
          </span>
          <span
            className={`${style.arrowIcon} ${expanded.unitType ? style.rotateDown : style.rotateUp}`}
          >
            ▼
          </span>
        </div>
        {expanded.unitType && (
          <div className={style.checkboxGroup}>
            {["Low Rise Apartment", "High Rise Apartment", "Villa"].map((type) => (
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
        <div className={style.sectionHeader} onClick={() => toggleSection("configuration")}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h8v8H3v-8zm10 3h8v5h-8v-5z" />
            </svg>
            CONFIGURATION
          </span>
          <span
            className={`${style.arrowIcon} ${expanded.configuration ? style.rotateDown : style.rotateUp}`}
          >
            ▼
          </span>
        </div>
        {expanded.configuration && (
          <div className={style.checkboxGroup}>
            {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "Penthouse"].map((config) => {
              const isBhk = config.includes("BHK");
              const value = isBhk ? config.replace(" BHK", "") : config;
              return (
                <label className={style.checkboxItem} key={config}>
                  <input
                    type="checkbox"
                    checked={selectedConfigurations.includes(value)}
                    onChange={() =>
                      handleCheckboxChange(
                        value,
                        selectedConfigurations,
                        setSelectedConfigurations,
                        "configuration"
                      )
                    }
                  />
                  {config}
                </label>
              );
            })}
          </div>
        )}

        {/* Price Range */}
        <div className={style.sectionHeader} onClick={() => toggleSection("priceRange")}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21.4 11.6l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .6 1.4l9 9a2 2 0 0 0 2.8 0l7-7a2 2 0 0 0 0-2.8zM6.5 8A1.5 1.5 0 1 1 6.5 5a1.5 1.5 0 0 1 0 3z" />
            </svg>
            PRICE RANGE
          </span>
          <span
            className={`${style.arrowIcon} ${expanded.priceRange ? style.rotateDown : style.rotateUp}`}
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
                value={priceRange[0] ?? 1}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className={style.thumb}
              />
              <input
                type="range"
                min="1"
                max="6"
                step="0.1"
                value={priceRange[1] ?? 10}
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
        <div className={style.sectionHeader} onClick={() => toggleSection("projectStatus")}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 11h-4v-2h2V7h2v6z" />
            </svg>
            PROJECT STATUS
          </span>
          <span
            className={`${style.arrowIcon} ${expanded.projectStatus ? style.rotateDown : style.rotateUp}`}
          >
            ▼
          </span>
        </div>
        {expanded.projectStatus && (
          <div className={style.checkboxGroup}>
            {["New Launch", "Under Construction", "Near Possession", "Ready to Move In"].map(
              (status) => (
                <label className={style.checkboxItem} key={status}>
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={() =>
                      handleCheckboxChange(
                        status,
                        selectedStatuses,
                        setSelectedStatuses,
                        "projectStatus"
                      )
                    }
                  />
                  {status}
                </label>
              )
            )}
          </div>
        )}
      </div>
    );
  }
}
