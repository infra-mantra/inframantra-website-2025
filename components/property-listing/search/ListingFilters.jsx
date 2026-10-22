import React, { useState, useEffect, useRef } from "react";
import style from "./ListingFilters.module.css";
import { useRouter } from "next/router";
import LocationFilter from "./LocationFilter.jsx";
export default function ListingFilters({
  onFilterChange,
  openClosefilter,
  handleCloseFilterToggle,
  // On /property-listing/configuration/<slug> the page is already scoped to that
  // configuration, so its tick should show even though the URL carries no
  // ?config=. "2" for 2-bhk, "Penthouse" for penthouse; undefined elsewhere.
  defaultConfiguration,
  // Cities in the current listing with counts ([{ name, count }]) — the "Cities"
  // filter narrows the listing in place
  cityOptions = [],
  // When the page changes filters itself (applied-filter chips), it bumps
  // syncKey and the sidebar re-reads its ticks from syncFilters.
  syncFilters,
  syncKey = 0,
  // multi-select places (see LocationFilter) and the live result count
  placeSelection,
  onPlacesChange,
  totalProperties,
  // server-fetched /location-tree states, passed through to LocationFilter (CLS)
  locationTree = null,
}) {
  // ---------------- STATES ----------------
  const [expanded, setExpanded] = useState({
    location: true,
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
    // On a direct load of a static page, router.query holds only the path params
    // until isReady flips; the ?querystring is merged in after hydration. Seeding
    // before that read ?config= as empty, and the page default then filled the gap,
    // so /2-bhk?config=3 ticked 2 BHK. Client-side navigations are ready at once.
    if (!router.isReady) return;
    const q = router.query;
    const csv = (v) =>
      typeof v === "string" && v.trim()
        ? v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
    setSelectedUnitTypes(csv(q.unit));
    // An explicit ?config= wins; otherwise the page's own configuration is the
    // selection. Without this, the footer's 2 BHK link showed 2 BHK results with
    // nothing ticked, and the first click on another tick dropped 2 BHK entirely.
    const fromUrl = csv(q.config);
    setSelectedConfigurations(
      fromUrl.length ? fromUrl : defaultConfiguration ? [defaultConfiguration] : []
    );
    setSelectedStatuses(csv(q.status));
    const min = q.min ? Number(q.min) : null;
    const max = q.max ? Number(q.max) : null;
    setPriceRange([min, max]);
    setMinInput(q.min ? String(q.min) : "");
    setMaxInput(q.max ? String(q.max) : "");
    setInputError("");
    setSelectedCities(csv(q.city));
  }, [name, defaultConfiguration, router.isReady]);

  useEffect(() => {
    if (!syncKey || !syncFilters) return;
    setSelectedCities(syncFilters.city || []);
    setSelectedUnitTypes(syncFilters.unitType || []);
    setSelectedConfigurations(syncFilters.configuration || []);
    setSelectedStatuses(syncFilters.status || []);
    const [min, max] = syncFilters.priceRange || [null, null];
    setPriceRange([min ?? null, max ?? null]);
    setMinInput(min ? String(min) : "");
    setMaxInput(max ? String(max) : "");
    setInputError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncKey]);

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
    // On a configuration page the page's own layout may be unticked: the listing
    // page then moves to whatever is picked (another configuration page, or all
    // properties), so the selection is passed through as-is.
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
    setSelectedConfigurations(defaultConfiguration ? [defaultConfiguration] : []);
    setSelectedStatuses([]);
    setPriceRange([null, null]);

    // CLEAR INPUT BOXES
    setMinInput("");
    setMaxInput("");
    setInputError("");

    // Notify parent
    notifyAllFilters(
      {
        configuration: defaultConfiguration ? [defaultConfiguration] : [],
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

  // Case-insensitive, so an older ?city=gurgaon URL still ticks "Gurgaon"
  const isCityTicked = (c) => selectedCities.some((x) => x.toLowerCase() === c.toLowerCase());
  const toggleCity = (c) => {
    const updated = isCityTicked(c)
      ? selectedCities.filter((x) => x.toLowerCase() !== c.toLowerCase())
      : [...selectedCities, c];
    updateAndMaybeNotify(setSelectedCities, updated, "city");
  };
  const showCities = cityOptions.length > 1 || selectedCities.length > 0;

  // ---------- at-a-glance sidebar ----------
  const UNIT_TYPES = ["Low Rise Apartment", "High Rise Apartment", "Villa"];
  const CONFIGS = [
    ["1", "1 BHK"],
    ["2", "2 BHK"],
    ["3", "3 BHK"],
    ["4", "4 BHK"],
    ["5", "5 BHK"],
    ["Penthouse", "Penthouse"],
  ];
  const STATUSES = ["New Launch", "Under Construction", "Near Possession", "Ready to Move In"];
  const BUDGETS = [
    ["1 – 2 Cr", 1, 2],
    ["2 – 5 Cr", 2, 5],
    ["5 – 10 Cr", 5, 10],
    ["10 Cr +", 10, null],
  ];
  const [minP, maxP] = priceRange;
  let priceText = "";
  if (minP && maxP) priceText = `₹${minP} – ${maxP} Cr`;
  else if (minP) priceText = `₹${minP} Cr +`;
  else if (maxP) priceText = `Up to ₹${maxP} Cr`;
  const isBudget = (lo, hi) => (minP ?? null) === lo && (maxP ?? null) === hi;
  const setBudget = (next) => {
    setPriceRange(next);
    setMinInput(next[0] ? String(next[0]) : "");
    setMaxInput(next[1] ? String(next[1]) : "");
    if (!isMobile) notifyAllFilters({ priceRange: next });
  };
  const pickBudget = (lo, hi) => setBudget(isBudget(lo, hi) ? [null, null] : [lo, hi]);
  const cfgLabel = (v) => CONFIGS.find((c) => c[0] === v)?.[1] || v;

  // Applied chips at the top (a configuration page's own layout is not listed)
  const applied = [
    ...selectedCities.map((v) => ({ k: "city", v, label: v })),
    ...selectedConfigurations
      .filter((v) => v !== defaultConfiguration)
      .map((v) => ({ k: "configuration", v, label: cfgLabel(v) })),
    ...(priceText ? [{ k: "price", v: "price", label: priceText }] : []),
    ...selectedStatuses.map((v) => ({ k: "projectStatus", v, label: v })),
    ...selectedUnitTypes.map((v) => ({ k: "unitType", v, label: v })),
  ];
  const removeApplied = (a) => {
    if (a.k === "price") return setBudget([null, null]);
    const map = {
      city: [selectedCities, setSelectedCities],
      configuration: [selectedConfigurations, setSelectedConfigurations],
      projectStatus: [selectedStatuses, setSelectedStatuses],
      unitType: [selectedUnitTypes, setSelectedUnitTypes],
    };
    const [state, setter] = map[a.k];
    return handleTagClick(a.v, state, setter, a.k);
  };

  // Plain render helper (not a component) so sections keep their DOM between renders
  const section = (id, title, summary, children) => (
    <section className={style.lfgSection} key={id}>
      <button
        type="button"
        className={style.lfgHead}
        aria-expanded={!!expanded[id]}
        onClick={() => toggleSection(id)}
      >
        <span className={style.lfgTitle}>{title}</span>
        {!expanded[id] && summary ? <span className={style.lfgSummary}>{summary}</span> : null}
        <svg
          className={`${style.lfgChev} ${expanded[id] ? style.lfgChevOpen : ""}`}
          viewBox="0 0 24 24"
          width="14"
          height="14"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {expanded[id] && <div className={style.lfgBody}>{children}</div>}
    </section>
  );

  const chip = (key, label, on, onClick, count, disabled) => (
    <button
      key={key}
      type="button"
      className={`${style.lfgChip} ${on ? style.lfgChipOn : ""}`}
      aria-pressed={on}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
      {count !== undefined && <span className={style.lfgCount}>{count}</span>}
    </button>
  );

  const body = (
    <>
      {applied.length > 0 && (
        <div className={style.lfgApplied}>
          {applied.map((a) => (
            <button
              key={`${a.k}-${a.v}`}
              type="button"
              className={style.lfgAppliedChip}
              onClick={() => removeApplied(a)}
              aria-label={`Remove ${a.label}`}
            >
              {a.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}

      {section(
        "location",
        "Location",
        "",
        <LocationFilter
          refineCities={selectedCities}
          onRefineCity={(city) => handleTagClick(city, selectedCities, setSelectedCities, "city")}
          onNavigate={isMobile ? handleCloseFilterToggle : undefined}
          selection={placeSelection}
          onSelectionChange={onPlacesChange}
          initialStates={locationTree}
        />
      )}

      {showCities &&
        section(
          "city",
          "Cities in results",
          selectedCities.join(", "),
          <div className={style.lfgChips}>
            {cityOptions.map((c) =>
              chip(
                c.name,
                c.name,
                isCityTicked(c.name),
                () => toggleCity(c.name),
                c.count,
                !c.count
              )
            )}
          </div>
        )}

      {section(
        "configuration",
        "BHK",
        selectedConfigurations.map(cfgLabel).join(", "),
        <div className={style.lfgChips}>
          {CONFIGS.map(([value, label]) =>
            chip(value, label, selectedConfigurations.includes(value), () =>
              handleTagClick(
                value,
                selectedConfigurations,
                setSelectedConfigurations,
                "configuration"
              )
            )
          )}
        </div>
      )}

      {section(
        "priceRange",
        "Budget",
        priceText,
        <>
          <div className={style.lfgChips}>
            {BUDGETS.map(([label, lo, hi]) =>
              chip(label, label, isBudget(lo, hi), () => pickBudget(lo, hi))
            )}
          </div>
          <div className={style.lfgPrice}>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Min ₹ Cr"
              aria-label="Minimum price in crore"
              value={minInput}
              onChange={(e) => handlePriceInputChange(e, "min")}
            />
            <span aria-hidden="true">–</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Max ₹ Cr"
              aria-label="Maximum price in crore"
              value={maxInput}
              onChange={(e) => handlePriceInputChange(e, "max")}
            />
          </div>
          {inputError && <span className={style.errorText}>{inputError}</span>}
        </>
      )}

      {section(
        "projectStatus",
        "Status",
        selectedStatuses.join(", "),
        <div className={style.lfgChips}>
          {STATUSES.map((st) =>
            chip(st, st, selectedStatuses.includes(st), () =>
              handleTagClick(st, selectedStatuses, setSelectedStatuses, "projectStatus")
            )
          )}
        </div>
      )}

      {section(
        "unitType",
        "Property type",
        selectedUnitTypes.join(", "),
        <div className={style.lfgChips}>
          {UNIT_TYPES.map((t) =>
            chip(t, t, selectedUnitTypes.includes(t), () =>
              handleTagClick(t, selectedUnitTypes, setSelectedUnitTypes, "unitType")
            )
          )}
        </div>
      )}
    </>
  );

  if (isMobile) {
    if (!openClosefilter) return null;
    return (
      <div className={style.lfgSheetWrap} role="dialog" aria-modal="true" aria-label="Filters">
        <button
          type="button"
          className={style.lfgScrim}
          aria-label="Close filters"
          onClick={handleCloseFilterToggle}
        />
        <div className={style.lfgSheet}>
          <div className={style.lfgSheetHead}>
            <span className={style.lfgHeading}>Filters</span>
            {applied.length > 0 && (
              <button type="button" className={style.lfgReset} onClick={resetFilters}>
                Clear all
              </button>
            )}
            <button
              type="button"
              className={style.lfgClose}
              onClick={handleCloseFilterToggle}
              aria-label="Close filters"
            >
              ×
            </button>
          </div>
          <div className={style.lfgSheetBody}>{body}</div>
          <div className={style.lfgSheetFoot}>
            <button type="button" className={style.lfgApply} onClick={applyFilters}>
              {typeof totalProperties === "number"
                ? `Show ${totalProperties} ${totalProperties === 1 ? "property" : "properties"}`
                : "Show properties"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.lfgRoot}>
      <div className={style.lfgTop}>
        <span className={style.lfgHeading}>Filters</span>
        {applied.length > 0 && (
          <button type="button" className={style.lfgReset} onClick={resetFilters}>
            Clear all
          </button>
        )}
      </div>
      {body}
    </div>
  );
}
