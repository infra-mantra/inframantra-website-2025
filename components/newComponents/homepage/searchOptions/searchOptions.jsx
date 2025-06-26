  import { useState, useEffect } from 'react';
  import { useRouter } from 'next/router';
  import { useDispatch, useSelector } from 'react-redux';
  import DropDownMenu from '../../dropdownMenu/dropDownMenu';
  import CustomizedHook from '../../searchAutocomplete/searchAutocomplete';
  import Button from '../../button/button';
  import {
    LocationDropDownContent,
    PropertyTypeDropDownContent,
    PriceRangeDropDownContent,
  } from './dropDownMenuComponents';
  import { priceRangeData } from './dropDownMenuConstants';
  import styles from './searchOptions.module.css'; // Assuming you have a CSS module for styling
  import  {MdLocationOn}  from "react-icons/md";

  import Ajax1 from '../../../helper/Ajax1';
  import { FaHome } from 'react-icons/fa';
  import { FaTag } from "react-icons/fa6";
  import { BsBorderRight } from 'react-icons/bs';
  import { use } from 'react';


  const SearchOptions = () => {
   
    const [location, setLocation] = useState('Location');
    const [selectedPropertyType, setSelectedPropertyType] = useState('Property');
    const [checkedUnits, setCheckedUnits] = useState({});
    const [priceRange, setPriceRange] = useState({
      range: [10000000, 40000000],
      label: 'Price',
    });
    const [isPropertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
    const [autocompleteSelections, setAutocompleteSelections] = useState([]);
    const router = useRouter();
    
    const [isDesktop, setIsDesktop] = useState(true);
    const [isMobile, setIsMobile] = useState(true);
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth >= 769); // You can adjust the threshold for desktop here
      setIsMobile(window.innerWidth <=768);
    };
    useEffect(() => {
      checkScreenWidth();
      window.addEventListener('resize', checkScreenWidth);
    
      return () => {
        window.removeEventListener('resize', checkScreenWidth);
      };
    }, []);
    const togglePropertyDropdown = () => {
      setPropertyDropdownOpen(!isPropertyDropdownOpen);
    };

    const handlePropertyTypeValue = (propertyType) => {
      setSelectedPropertyType(propertyType);
    };

    const formatPrice = (value) => {
      if (value >= 10000000) {
        return `${(value / 10000000).toFixed(1)}`; // Crore (10 million)
      }
      if (value >= 100000) {
        return `${(value / 100000).toFixed(1)} L`; // Lakh (100 thousand)
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)} K`; // Thousand
      }
      return value.toString(); // Return value if it's less than 1000
    };


  
      const handleChangePriceRange = (newRange) => {  
        const formattedStartLabel = formatPrice(priceRange.range[0]);
        const formattedEndLabel = formatPrice(priceRange.range[1]);
        setPriceRange((prev) => ({
          range: newRange,
          label: `${formattedStartLabel} - ${formattedEndLabel} Cr.`,
        }));
      
      };
    


    const [fetchingProperty, setFetchingProperty] = useState(false);

    const propertyData = async () => {
      if (autocompleteSelections.length === 1 && autocompleteSelections[0].title) {
      const data = await Ajax1({
        url: `/property/name/${autocompleteSelections[0].title}`,
      });
      setFetchingProperty(data.data.data)
    }

    }
    const propertyDataProps = async (value) => {
      const data = await Ajax1({
        url: `/property/name/${value}`,
      });
      return data.data.data;

    }
    useEffect(()=>{
     
      propertyData();
    },[autocompleteSelections])
    // console.log(autocompleteSelections);

    const buildSearchParams = () => {
      const searchParams = {};

      if (location !== 'Location') {
        searchParams.city = location;
      }

      if (selectedPropertyType !== 'Property') {
        if (selectedPropertyType) {
          searchParams.propertyType = { title: selectedPropertyType };
        } else {
          setSelectedPropertyType('Property');
        }
      }

      const subTypes = Object.keys(checkedUnits).flatMap(type =>
        Object.keys(checkedUnits[type]).filter(subType => checkedUnits[type][subType])
      );

      if (subTypes.length > 0) {
        searchParams.subType = subTypes;
      }

      if (priceRange.range) {
        searchParams.priceRange = priceRange.range;
      }

      searchParams.limit = 10; // or any logic to handle limit
      searchParams.page = 1; // or any logic to handle page

      if(searchParams.length > 0 && searchParams.city === 'Location' && searchParams.propertyType === 'Property') {
        localStorage.setItem('searchParams', JSON.stringify(searchParams));
      }

      return searchParams;
    };

    const search = buildSearchParams();
    if( location !== 'Location' && selectedPropertyType !== 'Property') {
      localStorage.setItem('search', JSON.stringify(search));
    }



    const selections = autocompleteSelections.map((selection) => ({
      title: selection.title,
      type: selection.type,
    }));
    

    const handleSearch =async () => {
      
      if (location !== 'Location' && selectedPropertyType !== 'Property') {
        router.push({
          pathname: '/listing',
        });
      } else if (autocompleteSelections.length > 0) {
        if (autocompleteSelections[0].type === 'property' && autocompleteSelections.length === 1) {
          if (fetchingProperty && fetchingProperty._id) {
            router.push(`/property/${fetchingProperty.slug}`);
          } 
        } else {
          router.push({
            pathname: '/listing',
          });
        }
      } else {
        if (location !== 'Location') {
          router.push(`/property-listing/city/${location}`);
        }
      }
    };
  

    return (
      <>
        {isDesktop ? (
          <div className={styles.searchOptionsWrapper}>
            <div className={styles.searchOptionsFlexContainer}>
              <DropDownMenu
                icon={<MdLocationOn/>}
                selectTitle={location}
                dropDownContent={
                  <LocationDropDownContent
                    selectedLocation={(val) => setLocation(val)}
                  />
                }
              />
              <CustomizedHook
                onSearch={setAutocompleteSelections}
                location={location}
                handleSearch={handleSearch}
              />
              <DropDownMenu
                icon={<FaHome />}
                selectTitle={selectedPropertyType !== 'Property' ? selectedPropertyType : 'Property'}
                toggleDropdown={togglePropertyDropdown}
                dropDownContent={
                  <PropertyTypeDropDownContent
                    propertyTypeValue={handlePropertyTypeValue}
                    selectedPropertyType={selectedPropertyType}
                    setSelectedPropertyType={setSelectedPropertyType}
                    checkedUnits={checkedUnits}
                    setCheckedUnits={setCheckedUnits}
                    isDropdownOpen={isPropertyDropdownOpen}
                  />
                }
              />
              <DropDownMenu
                icon={<FaTag />}
                selectTitle={priceRange.label}
                dropDownContent={
                  <PriceRangeDropDownContent
                    priceRange={priceRange.range}
                    onChangePriceRange={handleChangePriceRange}
                  />
                }
              />
              <Button
                width="14%"
                otherStyles={{ height: '50px', fontSize: '22px', borderRadius: '5px' }}
                onClick={handleSearch}
              />
            </div>
          </div>
        ) : (
          <div className={styles.searchOptionsWrapper}>
            <CustomizedHook
              onSearch={setAutocompleteSelections}
              location={location}
              handleSearch={handleSearch}

            />
            <div className={styles.searchOptionsMobileFlexContainer}>
              <DropDownMenu
                icon={<MdLocationOn />}
                selectTitle={location}
                dropDownContent={
                  <LocationDropDownContent
                    selectedLocation={(val) => setLocation(val)}
                  />
                }
              />
              <DropDownMenu
                icon={<FaHome />}
                selectTitle={selectedPropertyType !== 'Property' ? selectedPropertyType : 'Property'}
                toggleDropdown={togglePropertyDropdown}
                dropDownContent={
                  <PropertyTypeDropDownContent
                    propertyTypeValue={handlePropertyTypeValue}
                    selectedPropertyType={selectedPropertyType}
                    setSelectedPropertyType={setSelectedPropertyType}
                    checkedUnits={checkedUnits}
                    setCheckedUnits={setCheckedUnits}
                    isDropdownOpen={isPropertyDropdownOpen}
                  />
                }
              />
              <DropDownMenu
                icon={<FaTag />}
                selectTitle={priceRange.label}
                dropDownContent={
                  <PriceRangeDropDownContent
                    priceRange={priceRange.range}
                    onChangePriceRange={handleChangePriceRange}
                  />
                }
              />
            </div>
          </div>
        )}
      </>
    );
  };

  export default SearchOptions;
