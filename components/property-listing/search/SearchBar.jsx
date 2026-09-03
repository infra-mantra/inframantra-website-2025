import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./SearchBar.module.css";
// Deep import: `from 'lodash'` pulls the whole library (~72 KB) into this chunk.
import debounce from "lodash/debounce";
import Ajax1 from "../../lib/ajax1.js";
import { IoSearchSharp } from "react-icons/io5";
// Deep imports: the `@mui/icons-material` barrel re-exports thousands of icons.
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import { useRouter } from "next/router";
import SortDropdown from "./PropertyListingSortBy.jsx";
import { slugify } from "../../../utils/slugify.js";

// Placeholder = a fixed prefix + one rotating term. Only the term is typed/erased,
// so the sentence "Search properties by …" stays put while the last word changes.
const SEARCH_PREFIX = "Search properties by ";
const SEARCH_TERMS = ["name", "developer", "city", "state", "locality", "sub-locality"];

function SearchBar({
  onSearch,
  onSortChange,
  isDesktop,
  isMobile,
  handleCloseFilterToggle,
  type,
  name,
}) {
  const router = useRouter();
  const boxRef = useRef(null);

  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("relevance");
  const [desktop, setDesktop] = useState(false);

  const [suggested, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false); // true while fetching suggestions
  const [phIndex, setPhIndex] = useState(0);
  const [typed, setTyped] = useState("");

  // Typewriter placeholder: type a hint out, hold, erase, then move to the next.
  // Pauses whenever the user has typed something so it never fights their input.
  useEffect(() => {
    if (searchValue) return;
    const term = SEARCH_TERMS[phIndex];
    let charIndex = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      if (!deleting) {
        charIndex++;
        setTyped(term.slice(0, charIndex));
        if (charIndex === term.length) {
          deleting = true;
          timer = setTimeout(tick, 1500); // hold the full term
          return;
        }
        timer = setTimeout(tick, 90);
      } else {
        charIndex--;
        setTyped(term.slice(0, charIndex));
        if (charIndex === 0) {
          setPhIndex((i) => (i + 1) % SEARCH_TERMS.length);
          return; // phIndex change re-runs this effect with the next term
        }
        timer = setTimeout(tick, 45);
      }
    };

    timer = setTimeout(tick, 350);
    return () => clearTimeout(timer);
  }, [phIndex, searchValue]);

  // ✅ Debounced suggestions fetch
  const fetchSuggestions = useCallback(
    debounce(async (value) => {
      if (!value.trim()) {
        setSuggestions([]);
        setSuggestLoading(false);
        return;
      }
      try {
        const response = await Ajax1({
          url: `/suggest`,
          method: "GET",
          params: { q: value },
        });
        setSuggestions(response?.data?.suggestions || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setSuggestLoading(false); // hide the skeleton once the fetch settles
      }
    }, 300),
    []
  );

  useEffect(() => {
    setSearchValue("");
  }, [name, type]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setSuggestions([]); // hide suggestions
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    setSuggestions([]);
    setSuggestions([]);
    fetchSuggestions.cancel();
    const encodedSearch = slugify(searchValue, { lower: true });
    router.push(`/property-listing/search/${encodedSearch}`);
  };

  useEffect(() => {
    const handleResize = () => setDesktop(window.innerWidth >= 769);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    // Show the skeleton straight away (the fetch itself is debounced by 300ms).
    setSuggestLoading(!!value.trim());
    fetchSuggestions(value);
  };

  const handleSelect = (option) => {
    const encodedTitle = slugify(option.title.split(",")[0], { lower: true });

    switch (option.type) {
      case "property":
        router.push(`/property/${option.slug}`);
        break;
      case "locality":
      case "subLocality":
      case "city":
      case "state":
        router.push(`/property-listing/${option.type}/${encodedTitle}`);
        break;
      default:
        break;
    }

    setSearchValue(option.title);
    setSuggestions([]);
    setSuggestLoading(false);
    fetchSuggestions.cancel(); // cancel pending suggestions
  };

  const handleSortChange = (sortValue) => {
    // const newSort = e.target.value;
    setSortValue(sortValue);
    onSortChange?.(sortValue);
  };

  return (
    <div className={styles.listHeader}>
      {/* Search field + its suggestions dropdown share one relative wrapper so the
          dropdown can sit directly below the input. */}
      <div className={styles.searchFieldWrap}>
        <form className={styles.searchBar} onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            placeholder={`${SEARCH_PREFIX}${typed}|`}
          />
          <button type="submit">
            <IoSearchSharp size={20} />
          </button>
        </form>

        {searchValue && suggested.length > 0 && (
          <ul className={styles.listbox} ref={boxRef}>
            {suggested.map((option, index) => (
              <li key={index} onClick={() => handleSelect(option)}>
                <span>
                  {option.type === "property" && <RoofingOutlinedIcon />}
                  {option.type === "locality" && <MapOutlinedIcon />}
                  {option.type === "subLocality" && <RoomOutlinedIcon />}
                  {option.title}
                </span>
                <span className={styles.optionType}>
                  {option.type === "subLocality" ? "sub-locality" : option.type}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* While suggestions are loading (and none are shown yet) → skeleton rows. */}
        {searchValue && suggestLoading && suggested.length === 0 && (
          <ul className={styles.listbox}>
            {[0, 1, 2, 3].map((i) => (
              <li key={i}>
                <span className={styles.skelText} />
                <span className={styles.skelPill} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {isMobile && (
        <button type="button" className={styles.ftr} onClick={handleCloseFilterToggle}>
          <img src="/icons/fiterIconGreen.svg" className={styles.ftrIcon} alt="" />
          <span>Filters</span>
        </button>
      )}

      {/* On mobile the SORT BY sits next to the heading (see AboutSection); here it's desktop-only */}
      {!isMobile && <SortDropdown onSortChange={handleSortChange} defaultValue={sortValue} />}
    </div>
  );
}

export default SearchBar;
