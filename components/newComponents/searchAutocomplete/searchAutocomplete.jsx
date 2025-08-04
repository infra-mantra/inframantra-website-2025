      import React, { useEffect, useState } from 'react';
      import PropTypes from 'prop-types';
      import { useDispatch, useSelector } from 'react-redux';
      import Ajax1 from '../../helper/Ajax1';
      import { MdRoofing } from "react-icons/md";
      import { FaRegMap } from "react-icons/fa";
      import { FaLocationDot } from "react-icons/fa6";
      import { IoMdSearch } from "react-icons/io";
      import { debounce } from "lodash";

      import { IoSearchSharp } from "react-icons/io5";
      import styles from './searchAutoComplete.module.css';

      // Dummy icons
      const RoofingOutlinedIcon = () => <span role="img" aria-label="roof" ><MdRoofing/></span>;
      const MapOutlinedIcon = () => <span role="img" aria-label="map"><FaRegMap/></span>;
      const RoomOutlinedIcon = () => <span role="img" aria-label="location"><FaLocationDot/></span>;
      const CloseIcon = ({ onClick }) => <span role="img" aria-label="close" onClick={onClick}>❌</span>;


      function Tag(props) {
        const { label, onDelete, ...other } = props;
        return (
          <div {...other} className='inputSelection'>
            <span>{label}</span>
            <CloseIcon onClick={onDelete} />
          </div>
        );
      }

      Tag.propTypes = {
        label: PropTypes.string.isRequired,
        onDelete: PropTypes.func.isRequired,
      };

      export default function CustomizedHook({ listing = false, onSearch, location = '', handleSearch }) {
        // const dispatch = useDispatch();

        const [searchData, setSearchData] = useState({});
        const [searchOptionsData, setSearchOptionsData] = useState('');
        const [searchOptionsAvailable, setSearchOptionsAvailable] = useState([]);
        const [showCount, setShowCount] = useState(200);
        const [selectedOptions, setSelectedOptions] = useState([]);
        const [inputValue, setInputValue] = useState('');
        const [isDesktop, setIsDesktop] = useState(true);
        const [isMobile, setIsMobile] = useState(true);
        const checkScreenWidth = () => {
          setIsDesktop(window.innerWidth >= 769); 
          setIsMobile(window.innerWidth <=768);
        };
        useEffect(() => {
          checkScreenWidth();
          window.addEventListener('resize', checkScreenWidth);
        
          return () => {
            window.removeEventListener('resize', checkScreenWidth);
          };
        }, []);
        const handleRef = (instance) => {
          if (instance && selectedOptions.length) {
            instance.scroll({
              left: instance.scrollWidth,
              behavior: 'smooth',
            });
          }
        };

        useEffect(() => {
          onSearch(selectedOptions);
        }, [selectedOptions, onSearch]);






        const debouncedFetchData = debounce(async (inputValue) => {
          if (!inputValue.trim()) return; // Prevent unnecessary API calls
          try {
            const filterData = await Ajax1({ 
              url: `/property/getSearch`, 
              method: 'GET',
              data: { searchQuery: inputValue } 
            });

            // console.log(filterData.data.data)
            setSearchData(filterData.data.data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }, 300); // 300ms debounce delay

      
        
        const handleInputChange = (e) => {
        
          const value = e.target.value;
          setInputValue(e.target.value);
          debouncedFetchData(value);
        };
        
        useEffect(() => {
          return () => debouncedFetchData.cancel(); // Clean up pending requests
        }, []);






        useEffect(() => {
          if (selectedOptions.length > 0) {
            localStorage.setItem('SearchNames', JSON.stringify(selectedOptions.map(option => ({
              title: option.title,
              type: option.type
            }))));
          } else {
            localStorage.removeItem('SearchNames');
          }
          onSearch(selectedOptions);
        }, [selectedOptions, onSearch]);

       

        useEffect(() => {
          if (searchData && searchData ) {
            // Filter out repeated localities and sublocalities
            const allOptions = searchData;
            const uniqueOptions = {};

            Object.keys(allOptions).forEach((city) => {
              uniqueOptions[city] = allOptions[city].filter((option, index, self) => {
                const isLocalityOrSubLocality = option.type === 'locality' || option.type === 'subLocality';
                const isUnique = self.findIndex(o => o.title === option.title && o.type === option.type) === index;
            
                if (option.title.includes("Sobha")) {
                }
            
                return isLocalityOrSubLocality ? isUnique : true;
              });
            });

            setSearchOptionsData(uniqueOptions);
          }
        }, [searchData]);

        useEffect(() => {
          if (location !== 'Location' && searchOptionsData[location]) {
            setSearchOptionsAvailable(searchOptionsData[location].slice(0, showCount));
          } else {
            setSearchOptionsAvailable([].concat(...Object.values(searchOptionsData)).slice(0, showCount));
          }
        }, [location, searchOptionsData, showCount]);

        const handleSelect = (option) => {
        
          setSelectedOptions([...selectedOptions, option]);
          
          setInputValue('');
      
          
          async function fetchData() {
            try {
              const selectedNames = [...selectedOptions, option].map(opt => opt.title);
              const filterData = await Ajax1({
                url: `/property/searchName`,
                method: 'POST',
                data: { names: { names: selectedNames } } 
              });
              setSearchOptionsAvailable([].concat(...Object.values(filterData)).slice(0, showCount));
            //  console.log(searchData)
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          }

          fetchData();
      
        };


        const handleDelete = (option) => {
          setSelectedOptions(selectedOptions.filter(opt => opt.title !== option.title));
          setInputValue('');
          
          // Recalculate suggestions
          if (location !== 'Location' && searchOptionsData[location]) {
            setSearchOptionsAvailable(searchOptionsData[location].slice(0, showCount));
          } else {
            setSearchOptionsAvailable([].concat(...Object.values(searchOptionsData)).slice(0, showCount));
          }
        };

      

        return (
          <div className={styles.root}>
            <div className={styles.inputWrapper} ref={handleRef}>
              {selectedOptions.map((option, index) => (
                <Tag key={index} label={option.title} onDelete={() => handleDelete(option)} />
              ))}
              <input
                type="text"
                placeholder={selectedOptions.length === 0 ? 'Search By Property Name or Location' : ''}
                value={inputValue}
                onChange={handleInputChange}
              />
              {!isDesktop && <IoSearchSharp className={styles.searchIcon} onClick={handleSearch} />}
            </div>
            {searchOptionsAvailable.length > 0 && inputValue && (
              <ul className={styles.listbox}>
                {searchOptionsAvailable
                  .filter(option => option?.title?.toLowerCase()?.includes(inputValue?.toLowerCase()))
                  .map((option, index) => (
                    <li key={index} onClick={() => handleSelect(option)}>
                      <span>
                        {option.type === 'property' && <RoofingOutlinedIcon />}
                        {option.type === 'locality' && <MapOutlinedIcon />}
                        {option.type === 'subLocality' && <RoomOutlinedIcon />}
                        {option.title}
                      </span>
                      <span className={styles.optionType}>{option.type === 'subLocality' ? 'sub-locality' : option.type}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        );
      }

