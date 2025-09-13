import React, { useState, useEffect, useCallback } from 'react';
import styles from './SearchBar.module.css';
import { debounce } from 'lodash';
import Ajax1 from '../../../helper/Ajax1';
import { IoSearchSharp } from 'react-icons/io5';
import { RoofingOutlined as RoofingOutlinedIcon } from '@mui/icons-material';
import { MapOutlined as MapOutlinedIcon } from '@mui/icons-material';
import { RoomOutlined as RoomOutlinedIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { slugify } from '../../../../utils/slugify';

function SearchBar({ onSearch, onSortChange }) {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('relevance');
  const [desktop, setDesktop] = useState(false);
  const [suggested, setSuggestions] = useState([]);

  // ✅ Search API Call
  const fetchData = async (query) => {
    if (!query) return;
    debugger;
    try {
      const res = await fetch(`${process.env.apiUrl1}/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      console.log(data)
      onSearch?.(data.hits || []);
    } catch (err) {
      console.error('Failed to fetch property data:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(searchValue)
    setSuggestions([]);
  };

  // ✅ Handle sort change
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortValue(newSort);
    onSortChange?.(newSort);
  };

  // ✅ Detect Desktop vs Mobile
  useEffect(() => {
    const handleResize = () => setDesktop(window.innerWidth >= 769);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  };

  return (
    <div className={styles.listHeader}>
      {/* 🔎 Search Input */}
      <form className={styles.searchBar} onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder="Search By Property Name or Location"
        />
        <button type="submit">
          <IoSearchSharp size={20} />
        </button>
      </form>

      {/* 💡 Suggestions Dropdown */}
      {suggested.length > 0 && searchValue && (
        <ul className={styles.listbox}>
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

      {/* ⬇️ Sort Dropdown */}
      <select
        className={styles.sortDropdown}
        value={sortValue}
        onChange={handleSortChange}
      >
        <option value="relevance">SORT BY</option>
        <option value="priceLowHigh">Price: Low to High</option>
        <option value="priceHighLow">Price: High to Low</option>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
}

export default SearchBar;
