import React, { useState, useEffect, useCallback } from 'react';
import styles from './SearchBar.module.css';
import { debounce } from 'lodash';
import Ajax1 from '../../../helper/Ajax1';
import { IoSearchSharp } from 'react-icons/io5';
import { RoofingOutlined as RoofingOutlinedIcon } from '@mui/icons-material';
import { MapOutlined as MapOutlinedIcon } from '@mui/icons-material';
import { RoomOutlined as RoomOutlinedIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import SortDropdown from './propertyListingDropdownComponents/properListingSortBy';
import { slugify } from '../../../../utils/slugify';
import { colors } from '@mui/material';

function SearchBar({ onSearch, onSortChange , isDesktop , isMobile,handleCloseFilterToggle}) {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('relevance');
  const [desktop, setDesktop] = useState(false);
  
  const [suggested, setSuggestions] = useState([]);
    console.log(isMobile,isDesktop)

  // ✅ Debounced suggestions fetch
  const fetchSuggestions = useCallback(
    debounce(async (value) => {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await Ajax1({
          url: `/suggest`,
          method: 'GET',
          params: { q: value },
        });
        setSuggestions(response?.data?.suggestions || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300),
    []
  );


  const handleSubmit = (e) => {
   
    e.preventDefault();
    if (!searchValue.trim()) return;

    const encodedSearch = slugify(searchValue, { lower: true });
    router.push(`/property-listing/search/${encodedSearch}`);
      setSuggestions([]);
    setSuggestions([]);
    fetchSuggestions.cancel();
  };



  useEffect(() => {
    const handleResize = () => setDesktop(window.innerWidth >= 769);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    fetchSuggestions(value);
  };

  const handleSelect = (option) => {
    const encodedTitle = slugify(option.title.split(',')[0], { lower: true });

    switch (option.type) {
      case 'property':
        router.push(`/property/${option.slug}`);
        break;
      case 'locality':
      case 'subLocality':
      case 'city':
      case 'state':
        router.push(`/property-listing/${option.type}/${encodedTitle}`);
        break;
      default:
        break;
    }

    setSearchValue(option.title);
    setSuggestions([]);
    fetchSuggestions.cancel(); // cancel pending suggestions
  };

  const handleSortChange = (sortValue) => {
    // const newSort = e.target.value;
    setSortValue(sortValue);
    onSortChange?.(sortValue);
  };


  return (
    <div className={styles.listHeader}>
      {/* 🔎 Search Input */}
      <form className={styles.searchBar} onSubmit={handleSubmit}>
      <input
  type="text"
  value={searchValue}
  onChange={handleInputChange}
  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)} // ✅ Correct implementation
  placeholder="Search By Property Name or Location"
/>
        <button type="submit">
          <IoSearchSharp size={20}  />
        
        </button>
       
      </form>
       {isMobile && ( <div class="ftr" onClick={handleCloseFilterToggle}><span style={{color:"rgb(11, 110, 33)"}}>Filters</span><img src="/icons/fiterIconGreen.svg"  class="ftrIcon" / ></div>)} 

      {suggested.length > 0 && searchValue && (
       <ul className={`${styles.listbox} mts`}>
          {suggested.map((option, index) => (
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

     <SortDropdown onSortChange={handleSortChange} defaultValue={sortValue} />
    </div>
  );
}

export default SearchBar;
