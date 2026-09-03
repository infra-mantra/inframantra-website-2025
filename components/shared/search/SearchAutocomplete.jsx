import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { IoSearchSharp, IoMic, IoMicOutline } from "react-icons/io5";
// react-icons equivalents of the old @mui/icons-material outline icons. That
// barrel dragged @mui/material/SvgIcon + the emotion styling engine (~68 KB)
// onto the home page's critical path for three icons; react-icons is already
// loaded here for the search/mic icons, so these cost nothing extra.
import { MdOutlineRoofing, MdOutlineMap, MdOutlineRoom } from "react-icons/md";
import { slugify } from "../../../utils/slugify.js";
import Button from "../Button.jsx";

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

// Placeholder = a fixed prefix + one rotating term (kept in sync with the listing
// search bar). Only the term is typed/erased, so "Search properties by …" stays put.
const SEARCH_PREFIX = "Search properties by ";
const SEARCH_TERMS = ["name", "developer", "city", "state", "locality", "sub-locality"];

function CustomizedHook({ onSearch }) {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false); // true while fetching suggestions
  const [inputValue, setInputValue] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [phIndex, setPhIndex] = useState(0);
  const [typed, setTyped] = useState("");
  // Once every term has been shown the placeholder stops moving. A landing page
  // that animates forever never reaches visual completeness, which is exactly
  // what Speed Index measures — and six terms is all it takes to teach someone
  // what they can search by.
  const [typingSettled, setTypingSettled] = useState(false);
  const recognitionRef = useRef(null);
  const router = useRouter();

  // Typewriter placeholder: type a hint, hold, erase, next. Pauses while the user
  // is typing or a voice search is active so it never fights real input.
  useEffect(() => {
    if (inputValue || isListening || typingSettled) return;
    const term = SEARCH_TERMS[phIndex];
    let charIndex = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      if (!deleting) {
        charIndex++;
        setTyped(term.slice(0, charIndex));
        if (charIndex === term.length) {
          if (phIndex === SEARCH_TERMS.length - 1) {
            // Last term: rest here, fully typed, rather than erasing and looping.
            setTypingSettled(true);
            return;
          }
          deleting = true;
          timer = setTimeout(tick, 1500);
          return;
        }
        timer = setTimeout(tick, 90);
      } else {
        charIndex--;
        setTyped(term.slice(0, charIndex));
        if (charIndex === 0) {
          setPhIndex((i) => (i + 1) % SEARCH_TERMS.length);
          return;
        }
        timer = setTimeout(tick, 45);
      }
    };

    timer = setTimeout(tick, 350);
    return () => clearTimeout(timer);
  }, [phIndex, inputValue, isListening, typingSettled]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 769);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // The debounce timer lives in a ref so it survives re-renders. This used to be
  // `debounce(...)` evaluated in the component body, which built a brand-new
  // debounced function on every keystroke's re-render — so nothing was ever
  // actually debounced and each character fired its own /suggest request. Doing
  // it by hand also keeps lodash (~68 KB) off the home page's critical path.
  const suggestTimer = useRef(null);

  useEffect(() => () => clearTimeout(suggestTimer.current), []);

  const fetchSuggestions = (value) => {
    clearTimeout(suggestTimer.current);

    if (!value.trim()) {
      setSuggestLoading(false);
      return;
    }

    suggestTimer.current = setTimeout(async () => {
      try {
        // Ajax1 pulls in axios (~58 KB). Importing it lazily keeps that off the
        // initial load — it's only needed once the user actually types.
        const { default: Ajax1 } = await import("../../lib/ajax1.js");
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
    }, 300);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSuggestLoading(!!value.trim()); // show skeleton immediately (fetch is debounced)
    fetchSuggestions(value);
  };

  const handleSearchClick = () => {
    if (inputValue.trim()) {
      router.push(`property-listing/search/${inputValue}`);
    }
  };

  const handleSelect = (option) => {
    let encodedTitle = slugify(option.title.split(",")[0]);

    switch (option.type) {
      case "property":
        router.push(`/property/${option.slug}`);
        break;
      case "locality":
      case "subLocality":
      case "city":
      case "state":
        router.push(`property-listing/${option.type}/${encodedTitle}`);
        break;
    }

    setInputValue(option.title);
    setSuggestions([]);
    setSuggestLoading(false);
    onSearch(option);
  };

  return (
    <div className={styles.root}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          id="property-search"
          name="q"
          aria-label="Search properties"
          autoComplete="off"
          placeholder={`${SEARCH_PREFIX}${typed}|`}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
        />

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

        {!isDesktop && (
          <IoSearchSharp className={styles.searchIcon} onClick={handleSearchClick} size={22} />
        )}

        {isDesktop && (
          <Button
            width="14%"
            otherStyles={{ height: "50px", fontSize: "22px", borderRadius: "5px" }}
            btnText="Search"
            onClick={handleSearchClick}
          />
        )}
      </div>

      {inputValue && suggestions.length > 0 && (
        <ul className={styles.listbox}>
          {suggestions.map((option, index) => (
            <li key={index} onClick={() => handleSelect(option)}>
              <span>
                {option.type === "property" && <MdOutlineRoofing />}
                {option.type === "locality" && <MdOutlineMap />}
                {option.type === "subLocality" && <MdOutlineRoom />}
                {option.title}
              </span>
              <span className={styles.optionType}>
                {option.type === "subLocality" ? "sub-locality" : option.type}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* While suggestions are loading (and none shown yet) → skeleton rows. */}
      {inputValue && suggestLoading && suggestions.length === 0 && (
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
  );
}

CustomizedHook.propTypes = {
  onSearch: PropTypes.func.isRequired,
  // `handleSearch` used to be declared required here, but the component never
  // accepted it — the signature destructures only `onSearch`, and searching is
  // handled internally by handleSearchClick(). No caller passed it, so React
  // logged "prop `handleSearch` is marked as required ... but its value is
  // `undefined`" on every homepage render. Search itself was never broken.
};

export default CustomizedHook;
