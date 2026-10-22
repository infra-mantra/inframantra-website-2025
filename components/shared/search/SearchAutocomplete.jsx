import React, { useEffect, useRef, useState } from "react";
import { useTypewriterHint } from "./useTypewriterHint";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { IoSearchSharp, IoMic, IoMicOutline } from "react-icons/io5";
// react-icons equivalents of the old @mui/icons-material outline icons. That
// barrel dragged @mui/material/SvgIcon + the emotion styling engine (~68 KB)
// onto the home page's critical path for three icons; react-icons is already
// loaded here for the search/mic icons, so these cost nothing extra.
import { MdHistory, MdOutlineRoofing, MdOutlineMap, MdOutlineRoom } from "react-icons/md";
import { slugify } from "../../../utils/slugify.js";
import Button from "../Button.jsx";
import {
  EMPTY_FILTERS,
  buildListingUrl,
  describeFilters,
  filterQuery,
} from "./searchFilterConfig.js";
import { addRecentSearch, clearRecentSearches, getRecentSearches } from "./recentSearches.js";
import { loadCityProjects, matchProjects } from "./cityProjects.js";

import styles from "./SearchAutoComplete.module.css";

// Real-estate vocabulary the speech recognizer should be biased toward.
// When an utterance has several candidate transcripts, we prefer the one
// that contains the most of these words. Add project / locality / builder
// names here to improve voice accuracy over time.
const KNOWN_TERMS = [
  // builders / brands
  "tulip",
  "godrej",
  "dlf",
  "m3m",
  "sobha",
  "emaar",
  "signature",
  "smartworld",
  "experion",
  "whiteland",
  "central park",
  "ireo",
  "bestech",
  "adani",
  "birla",
  // tulip projects
  "melrose",
  "monsella",
  "violet",
  "orange",
  "lemon",
  "white",
  "ivory",
  "ace",
  "purple",
  "yellow",
  "leaf",
  "petals",
  "grand",
  // cities / common localities
  "gurgaon",
  "gurugram",
  "noida",
  "delhi",
  "pune",
  "jaipur",
  "sohna",
  "dwarka expressway",
  "golf course",
  "sector",
  "manesar",
  "faridabad",
];

// Direct fixes for phrases the recognizer frequently mishears. Each entry is
// [pattern, replacement]; matching is case-insensitive. Extend as new
// mis-hearings show up (e.g. "mall rule" -> "melrose").
const VOICE_FIXES = [
  [/\bmall\s*rule\b/gi, "melrose"],
  [/\bmel\s*ro(?:se|s|ws|z)\b/gi, "melrose"],
  [/\bmel\s*rose\b/gi, "melrose"],
  [/\bmon\s*sella\b/gi, "monsella"],
  [/\bgur\s*gaon\b/gi, "gurgaon"],
];

function applyVoiceFixes(text) {
  let fixed = text;
  for (const [pattern, replacement] of VOICE_FIXES) {
    fixed = fixed.replace(pattern, replacement);
  }
  return fixed.replace(/\s+/g, " ").trim();
}

// Count how many known real-estate terms appear in a transcript.
function knownTermScore(text) {
  const lower = text.toLowerCase();
  return KNOWN_TERMS.reduce((score, term) => (lower.includes(term) ? score + 1 : score), 0);
}

// From the recognizer's alternative transcripts, pick the one that best
// matches our vocabulary after applying the correction dictionary.
function pickBestTranscript(alternatives) {
  let best = "";
  let bestScore = -1;
  alternatives.forEach((alt, index) => {
    const corrected = applyVoiceFixes(alt);
    // Score by vocabulary matches; tie-break toward higher-confidence
    // alternatives (lower index), which the API returns first.
    const score = knownTermScore(corrected) * 10 - index;
    if (score > bestScore) {
      bestScore = score;
      best = corrected;
    }
  });
  return best;
}

// Placeholder = a fixed prefix + a rotating hint (see useTypewriterHint.js).
const SEARCH_PREFIX = "Search ";

/*
  Filter picks and a parsed sentence combined: anything the sentence names
  wins, the dropdowns fill in the rest. Both have the EMPTY_FILTERS shape.
*/
const mergeFilters = (panel, typed) => ({
  city: typed.city || panel.city,
  budget: typed.budget || panel.budget,
  bhk: typed.bhk.length ? typed.bhk : panel.bhk,
  status: typed.status.length ? typed.status : panel.status,
  unit: typed.unit.length ? typed.unit : panel.unit,
});

// The sentence parser is only needed once someone types, so it stays out of this chunk.
const loadParser = () => import("./parseSearchSentence.js").then((m) => m.default);

/*
  Typed text + filters → { href, label } for the listing page. Shared with the phone
  search sheet's "Show properties" button.
    ""                      → the filters' own listing (e.g. /property-listing/city/gurgaon?config=3)
    "3 bhk under 2 cr"      → parsed into filters
    "tulip"                 → /property-listing/search/tulip?...filters
*/
export const resolveSearch = async (text, filters) => {
  const typed = text.trim();
  if (!typed) return { href: buildListingUrl(filters), label: describeFilters(filters) };
  const parsed = (await loadParser())(typed);
  return parsed
    ? { href: buildListingUrl(mergeFilters(filters, parsed.filters), parsed.text), label: typed }
    : { href: buildListingUrl(filters, typed), label: typed };
};

// Suggestion type → which group it is listed under.
const GROUPS = [
  { title: "Search", types: ["listing"] },
  { title: "Localities", types: ["city", "state", "locality", "subLocality"] },
  { title: "Projects", types: ["property"] },
  { title: "Developers", types: ["developer", "builder"] },
];
const groupSuggestions = (list) => {
  const groups = GROUPS.map((g) => ({
    title: g.title,
    items: list.filter((o) => g.types.includes(o.type)),
  }));
  const known = GROUPS.flatMap((g) => g.types);
  groups.push({ title: "More", items: list.filter((o) => !known.includes(o.type)) });
  return groups.filter((g) => g.items.length);
};

const TYPE_LABEL = { subLocality: "sub-locality", listing: "view all" };

// Wraps the part of `text` that matches `query` in <mark>.
const Highlight = ({ text, query }) => {
  const q = query.trim();
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className={styles.mark}>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
};

const TypeIcon = ({ type }) => {
  if (type === "property") return <MdOutlineRoofing />;
  if (type === "subLocality") return <MdOutlineRoom />;
  if (type === "listing") return <IoSearchSharp />;
  return <MdOutlineMap />;
};

/*
  The search box with its dropdown (recent + popular when empty, grouped live
  suggestions while typing). Props beyond onSearch are optional:
    filters        — current dropdown selection (EMPTY_FILTERS shape)
    before         — control drawn inside the bar before the input (city picker)
    addon          — controls drawn after the input, before the mic (filter dropdowns)
    quickSearches  — [{ label, href }] "Popular searches" shown when the box is empty
    onInputChange  — told about every change to the typed text
    inline         — phone sheet: dropdown sits in the page flow and is always open
    showButton     — draw the gold Search button (off inside the phone sheet)
    autoFocus      — focus the input on mount (phone sheet)
    toolbar        — drawn between the bar and the dropdown (phone sheet's filter chips)
*/
function CustomizedHook({
  onSearch,
  filters = EMPTY_FILTERS,
  before = null,
  addon = null,
  quickSearches = [],
  onInputChange,
  inline = false,
  showButton = true,
  autoFocus = false,
  toolbar = null,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(inline); // is the dropdown showing?
  const [activeIndex, setActiveIndex] = useState(-1); // keyboard-highlighted option
  const [recent, setRecent] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false); // true while fetching suggestions
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  console.log(filters)

  // Recent searches are read on mount (localStorage only exists in the browser).
  useEffect(() => setRecent(getRecentSearches()), []);
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // The chosen city's projects in ranking order: listed when the box is empty,
  // and matched instantly while typing (before the /suggest API answers).
  const cityLabel = filters.city?.label;
  const [cityProjects, setCityProjects] = useState([]);
  useEffect(() => {
    if (!open || !cityLabel) return undefined;
    let alive = true;
    loadCityProjects(cityLabel).then((list) => alive && setCityProjects(list));
    return () => {
      alive = false;
    };
  }, [open, cityLabel]);

  // Rotating hint in the placeholder (paused while the user types or speaks).
  const typed = useTypewriterHint(Boolean(inputValue) || isListening);

  // Set up the Web Speech API for real-time voice search.
  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    setVoiceSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // stop automatically after a phrase
    recognition.interimResults = true; // stream partial words in real time
    recognition.lang = "en-IN"; // tuned for Indian place/property names
    recognition.maxAlternatives = 5; // get options so we can pick the best

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];

      if (lastResult.isFinal) {
        // Final phrase: choose the alternative that best matches our
        // real-estate vocabulary, then apply mis-hearing corrections.
        const alternatives = Array.from(lastResult).map((alt) => alt.transcript.trim());
        const corrected = pickBestTranscript(alternatives);
        setInputValue(corrected);
        setOpen(true);
        fetchSuggestions(corrected);
        return;
      }

      // Interim: show the running transcript live (light correction only).
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      transcript = applyVoiceFixes(transcript);
      setInputValue(transcript);
      fetchSuggestions(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        /* no-op */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVoiceSearch = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setInputValue("");
    setSuggestions([]);
    try {
      recognition.start();
      setIsListening(true);
    } catch (e) {
      // start() throws if it's already running — ignore.
    }
  };

  // The debounce timer lives in a ref so it survives re-renders, and keeps
  // lodash off the home page's critical path.
  const suggestTimer = useRef(null);

  useEffect(() => () => clearTimeout(suggestTimer.current), []);

  // Read inside the debounced fetch, which would otherwise see stale props.
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchSuggestions = (value) => {
    clearTimeout(suggestTimer.current);

    if (!value.trim()) {
      setSuggestLoading(false);
      setSuggestions([]);
      return;
    }

    suggestTimer.current = setTimeout(async () => {
      try {
        // Ajax1 pulls in axios (~58 KB). Importing it lazily keeps that off the
        // initial load — it's only needed once the user actually types.
        const [{ default: Ajax1 }, parse] = await Promise.all([
          import("../../lib/ajax1.js"),
          loadParser(),
        ]);
        // "3 bhk in gurgaon under 2 cr" → a ready-made listing link shown first.
        const parsed = parse(value);
        const listing = parsed && {
          type: "listing",
          title: parsed.label,
          path: buildListingUrl(mergeFilters(filtersRef.current, parsed.filters), parsed.text),
        };
        let list = [];
        try {
          const response = await Ajax1({
            url: `/search`,
            method: "GET",
            params: { q: value ,  city: filtersRef.current.city?.value || filtersRef.current.city?.label,
    budget: filtersRef.current.budget,
    bhk: filtersRef.current.bhk,
    status: filtersRef.current.status,
    unitType: "High Rise Apartment",},
          });
          list = response?.data?.suggestions || [];
        } catch (error) {
          // A sentence still gets its listing link when the API fails.
          console.error("Error fetching suggestions:", error);
        }
        setSuggestions(listing ? [listing, ...list] : list);
        setActiveIndex(-1);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setSuggestLoading(false); // hide the skeleton once the fetch settles
      }
    }, 300);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setOpen(true);
    setActiveIndex(-1);
    onInputChange?.(value);
    setSuggestLoading(!!value.trim()); // show skeleton immediately (fetch is debounced)
    fetchSuggestions(value);
  };

  // Every navigation goes through here so it is remembered as a recent search.
  const go = (label, href) => {
    addRecentSearch(label, href);
    setOpen(inline);
    router.push(href);
  };

  const handleSearchClick = async () => {
    const { href, label } = await resolveSearch(inputValue, filters);
    go(label, href);
  };

  // A suggestion → its page. Localities keep the dropdown filters as query params.
  const hrefFor = (option) => {
    const slug = slugify(option.title.split(",")[0]);
    switch (option.type) {
      case "property":
        return `/property/${option.slug}`;
      case "locality":
      case "subLocality":
      case "city":
      case "state":
        return `/property-listing/${option.type}/${slug}${filterQuery(filters)}`;
      case "listing":
        return option.path;
      default:
        return buildListingUrl(filters, option.title.split(",")[0]);
    }
  };

  const handleSelect = (option) => {
    if (option.href) {
      // a recent or popular search: already a ready link
      go(option.label, option.href);
      return;
    }
    go(option.title.split(",")[0], hrefFor(option));
    setInputValue(option.title);
    setSuggestions([]);
    setSuggestLoading(false);
    onSearch(option);
  };

  // What the dropdown lists right now, in display order (for arrow-key movement).
  const typing = !!inputValue.trim();
  // While typing: the city's matching projects first (in ranking order), then the
  // API's suggestions without duplicates.
  const localMatches = typing ? matchProjects(cityProjects, inputValue) : [];
  const localSlugs = new Set(localMatches.map((p) => p.slug));
  const merged = [
    ...suggestions.filter((o) => o.type === "listing"),
    ...localMatches,
    ...suggestions.filter((o) => o.type !== "listing" && !localSlugs.has(o.slug)),
  ];
  const groups = typing
    ? groupSuggestions(merged)
    : [
        { title: "Recent searches", kind: "recent", items: recent },
        {
          title: cityLabel ? `Top projects in ${cityLabel}` : "Top projects",
          kind: "projects",
          items: cityProjects.slice(0, 6),
        },
        { title: "Popular searches", kind: "chips", items: quickSearches },
      ].filter((g) => g.items.length);
  const options = groups.flatMap((g) => g.items);
  const showSkeleton = typing && suggestLoading && merged.length === 0;
  const isOpen = open && (options.length > 0 || showSkeleton);
  const listId = inline ? "property-search-list-sheet" : "property-search-list";
  const optionId = (i) => `${listId}-opt-${i}`;

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!options.length) return;
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      // cycles through -1 (back in the box) … last option
      setActiveIndex((i) => {
        const next = i + step;
        if (next >= options.length) return -1;
        return next < -1 ? options.length - 1 : next;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen && options[activeIndex]) handleSelect(options[activeIndex]);
      else handleSearchClick();
    } else if (e.key === "Escape") {
      setOpen(inline);
      setActiveIndex(-1);
    }
  };

  // Keep the index valid: -1 (nothing) … options.length - 1.
  const active = activeIndex >= options.length ? -1 : activeIndex;

  let n = -1; // running option number while rendering the groups
  const renderOption = (option) => {
    n += 1;
    const i = n;
    const key = `${option.href || option.title}-${i}`;
    const common = {
      id: optionId(i),
      role: "option",
      "aria-selected": i === active,
      // mousedown, not click: fires before the input's blur closes the dropdown
      onMouseDown: (e) => e.preventDefault(),
      onClick: () => handleSelect(option),
      onMouseEnter: () => setActiveIndex(i),
    };
    if (option.href) {
      return (
        <li
          key={key}
          {...common}
          className={`${option.kind === "chips" ? styles.chip : styles.row} ${
            i === active ? styles.active : ""
          }`}
        >
          {option.kind !== "chips" && <MdHistory className={styles.rowIcon} aria-hidden="true" />}
          <span className={styles.rowText}>{option.label}</span>
        </li>
      );
    }
    return (
      <li key={key} {...common} className={`${styles.row} ${i === active ? styles.active : ""}`}>
        <span className={styles.rowIcon} aria-hidden="true">
          <TypeIcon type={option.type} />
        </span>
        <span className={styles.rowText}>
          <Highlight text={option.title} query={inputValue} />
          {option.place && (
            <span className={styles.rowSub}>
              {option.place}
              {option.price && <b> · ₹{option.price}</b>}
            </span>
          )}
        </span>
        <span className={styles.optionType}>{TYPE_LABEL[option.type] || option.type}</span>
      </li>
    );
  };

  return (
    <div className={`${styles.root} ${inline ? styles.inline : ""}`}>
      <div className={`${styles.inputWrapper} ${before ? styles.withBefore : ""}`}>
        {before}
        <input
          ref={inputRef}
          type="text"
          id={inline ? "property-search-sheet" : "property-search"}
          name="q"
          role="combobox"
          aria-label="Search properties"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-activedescendant={isOpen && active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          enterKeyHint="search"
          placeholder={`${SEARCH_PREFIX}${typed}`}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          // Options keep focus in the box (mousedown is prevented), so leaving the
          // box — e.g. for a filter dropdown — means the list should close.
          onBlur={() => setOpen(inline)}
          onKeyDown={onKeyDown}
        />

        {addon}

        {voiceSupported && (
          <button
            type="button"
            className={`${styles.micButton} ${isListening ? styles.listening : ""}`}
            onClick={handleVoiceSearch}
            aria-label={isListening ? "Stop voice search" : "Search by voice"}
            title={isListening ? "Listening… click to stop" : "Search by voice"}
          >
            {isListening ? <IoMic size={20} /> : <IoMicOutline size={20} />}
          </button>
        )}

        {showButton && <Button btnText="Search" onClick={handleSearchClick} />}
      </div>

      {toolbar}

      {isOpen && (
        <div className={styles.dropdown}>
          <ul id={listId} role="listbox" aria-label="Search suggestions" className={styles.list}>
            {showSkeleton
              ? [0, 1, 2, 3].map((i) => (
                  <li key={i} className={styles.row} aria-hidden="true">
                    <span className={styles.skelText} />
                    <span className={styles.skelPill} />
                  </li>
                ))
              : groups.map((g) => (
                  <li key={g.title} role="presentation" className={styles.group}>
                    <div className={styles.groupHead} role="presentation">
                      <span>{g.title}</span>
                      {g.kind === "recent" && (
                        <button
                          type="button"
                          className={styles.clearBtn}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            clearRecentSearches();
                            setRecent([]);
                          }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <ul
                      role="group"
                      aria-label={g.title}
                      className={g.kind === "chips" ? styles.chips : styles.rows}
                    >
                      {g.items.map((o) => renderOption({ ...o, kind: g.kind }))}
                    </ul>
                  </li>
                ))}
          </ul>
        </div>
      )}
    </div>
  );
}

CustomizedHook.propTypes = {
  onSearch: PropTypes.func.isRequired,
  filters: PropTypes.object,
  before: PropTypes.node,
  addon: PropTypes.node,
  quickSearches: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, href: PropTypes.string })
  ),
  onInputChange: PropTypes.func,
  inline: PropTypes.bool,
  showButton: PropTypes.bool,
  autoFocus: PropTypes.bool,
  toolbar: PropTypes.node,
};

export default CustomizedHook;
