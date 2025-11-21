import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Ajax1 from '../../helper/Ajax1';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { IoSearchSharp, IoMic, IoMicOff } from 'react-icons/io5';
import { RoofingOutlined as RoofingOutlinedIcon } from '@mui/icons-material';
import { MapOutlined as MapOutlinedIcon } from '@mui/icons-material';
import { RoomOutlined as RoomOutlinedIcon } from '@mui/icons-material';
import { slugify } from '../../../utils/slugify';
import Button from '../button/button';

import styles from './searchAutoComplete.module.css';

function CustomizedHook({ onSearch }) {
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);
  const [listening, setListening] = useState(false);

  const router = useRouter();
  const recognitionRef = useRef(null);

  // --------------------- SPEECH RECOGNITION SETUP ---------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = 
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };

    recognition.onerror = (err) => {
      console.log("Speech error:", err);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      if (inputValue.trim()) handleSearchClick();
    };

    recognitionRef.current = recognition;
  }, [inputValue]);

  const toggleMic = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // --------------------------------------------------------------------

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 769);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSuggestions = debounce(async (value) => {
    if (!value.trim()) return;

    try {
      const response = await Ajax1({
        url: `/suggest`,
        method: 'GET',
        params: { q: value }
      });

      setSuggestions(response?.data?.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    fetchSuggestions(value);
  };

  const handleSearchClick = () => {
    if (inputValue.trim()) {
      router.push(`property-listing/search/${inputValue}`);
    }
  };

  const handleSelect = (option) => {
    let encodedTitle = slugify(option.title.split(',')[0]);

    switch (option.type) {
      case 'property':
        router.push(`/property/${option.slug}`);
        break;
      case 'locality':
      case 'subLocality':
      case 'city':
      case 'state':
        router.push(`property-listing/${option.type}/${encodedTitle}`);
        break;
    }

    setInputValue(option.title);
    setSuggestions([]);
    onSearch(option);
  };

  return (
    <div className={styles.root}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Search By Property Name or Location"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
        />

        {/* ---- SPEECH MIC BUTTON ---- */}
        <div className={styles.micWrapper} >
        <span onClick={toggleMic}>
          {listening ? (
            <IoMicOff size={22} color="red" />
          ) : (
            <IoMic size={22} />
          )}
        </span>
        </div>

        {!isDesktop && (
          <IoSearchSharp
            className={styles.searchIcon}
            onClick={handleSearchClick}
            size={22}
          />
        )}

        {isDesktop && (
          <Button
            width="14%"
            otherStyles={{ height: '50px', fontSize: '22px', borderRadius: '5px' }}
            btnText="Search"
            onClick={handleSearchClick}
          />
        )}
      </div>

      {suggestions.length > 0 && inputValue && (
        <ul className={styles.listbox}>
          {suggestions.map((option, index) => (
            <li key={index} onClick={() => handleSelect(option)}>
              <span>
                {option.type === 'property' && <RoofingOutlinedIcon />}
                {option.type === 'locality' && <MapOutlinedIcon />}
                {option.type === 'subLocality' && <RoomOutlinedIcon />}
                {option.title}
              </span>
              <span className={styles.optionType}>
                {option.type === 'subLocality' ? 'sub-locality' : option.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

CustomizedHook.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default CustomizedHook;
