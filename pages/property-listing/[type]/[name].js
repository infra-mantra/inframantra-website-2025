import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// import { cityNames } from '../../../components/newComponents/propertyListingPage/propertyListingPriceFilter/dropDownMenuConstants.jsx';

// Lazy load components
const PropertyListingCard = lazy(() =>
  import('../../../components/newComponents/propertyListingDesktopNav/propertyListing/propertyListingCard.jsx')
);
const ListingFilters = lazy(() =>
  import('../../../components/newComponents/propertyListingDesktopNav/propertyListingSearch/ListingFilters.jsx')
);
const SearchBar = lazy(() =>
  import('../../../components/newComponents/propertyListingDesktopNav/propertyListingSearch/searBar.jsx')
);
const PropertyListingCardMobile = lazy(() =>
  import('../../../components/newComponents/propertyListingPage/propertyListingCardMobile.jsx')
);
const CustomBackdrop = lazy(() =>
  import('../../../components/newComponents/backdrop/backdrop.jsx')
);
const Wrapper = lazy(() => import('../../../components/UI/Wrapper'));
const FaqSection = lazy(() =>
  import('../../../components/newComponents/propertyListingDesktopNav/Content/faqSection.jsx')
);
const Content = lazy(() =>
  import('../../../components/newComponents/propertyListingDesktopNav/Content/aboutSection.jsx')
);
const PropertyPageFloatingContact = lazy(() =>
  import('../../../components/newComponents/propertyData/propertyRightSection/propertyPageSections/propertyPageFloatingContact.jsx')
);



const PremiumProperty = lazy(() =>
  import('../../../components/newComponents/propertyListingDesktopNav/propertyListing/premiumProperty.jsx')
);

const PropertyListingPage = () => {
  const router = useRouter();
  const { type, name } = router.query;

  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);

  const [allPropertyData, setAllPropertyData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [backdropOpen, setBackdropOpen] = useState(false);
  const [selectedPropertyName, setSelectedPropertyName] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(null);
  const [priceRangeFilter, setPriceRangeFilter] = useState([1000000, 800000000]);
  const [projectStatusFilter, setProjectStatusFilter] = useState(null);
  const [premiumProperties, setPremiumProperties] = useState([]);
  const [openClosefilter, setOpenCloseFilter] = useState(false);
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [subLocality, setSubLocality] = useState('');
  const [state, setState] = useState('');
  const[readyToMove, setReadyToMove] = useState(0);
  const [highRise,setHighRise] = useState(0);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);


  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keyword, setKeyword] = useState("");

  const contentRef = useRef(null);
  const filterRef = useRef(null);
   const divRef = useRef(null);
  const [height, setHeight] = useState(0);

  // ✅ Detect screen size
  useEffect(() => {
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth >= 769);
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  // ✅ Sync listing content height with filters
 
 

  // ✅ Smooth scroll to top when filters/search change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [type, name, propertyTypeFilter, priceRangeFilter, projectStatusFilter]);

  const handleClose = () => {
    setBackdropOpen(false);
    setSelectedPropertyName('');
  };

  const handleOpen = (name) => {
    setSelectedPropertyName(name);
    setBackdropOpen(true);
  };

  // ✅ Apply filters on original data
const handleFilterChange = (filterType, value, isMobile) => {
  setLoading(true);

  let filtered = [...allPropertyData];

  // If filterType is not array (single change), convert into array
  if (!Array.isArray(filterType)) {
    filterType = [filterType];
    value = [value];
  }

  for (let i = 0; i < filterType.length; i++) {
    const ft = filterType[i];
    const val = value[i];

    if (!val || val.length === 0) continue;

    // apply filter
    filtered = filtered.filter((property) =>
      applySingleFilter(property, ft, val)
    );
  }

  setPropertyData(filtered);
  setTotalProperties(filtered.length);
  setLoading(false);
};

function applySingleFilter(property, filterType, value) {
  
    if (filterType === "city" && value.length > 0) {
     if (type === "city" && Array.isArray(value) && name) {
       for( let i=0; i<value.length;i++){
        if(value[i]!=name){
          router.push(`/property-listing/city/${value[i]}`);
        }
       }
  }
      return value.includes(property.city?.name);
    }

    
    if (filterType === "unitType" && value.length > 0) {
      return property.propertyType?.subType?.some((sub) =>
        value.includes(sub)
      );
    }

     if (filterType === "configuration" && value.length > 0) {
         return property.configurationForSearch?.some((config) => {
        if (typeof config === "number") {
        return value.includes(Math.floor(config).toString());
       }

    // string configs → compare lowercase
        return value.includes(config);
      }); 
       }

  
    if (filterType === "projectStatus" && value.length > 0) {
      return value.includes(property.status);
    }

    
    if (filterType === "priceRange") {
      const [minValue, maxValue] = value;

    
      const minPrice = minValue ? minValue * 1e7 : null;
      const maxPrice = maxValue ? maxValue * 1e7 : null;

      
      if (minPrice && maxPrice) {
        if (minPrice > maxPrice) return false;
        return property.priceInFigure >= minPrice && property.priceInFigure <= maxPrice;
      }

    
      if (minPrice) {
        return property.priceInFigure >= minPrice;
      }

    
      if (maxPrice) {
        return property.priceInFigure <= maxPrice;
      }

   
      return true;
    }

    return true;
  }




  const handleSortChange = (sortType) => {
    // console.log('Sorting by:', sortType);
    setLoading(true);
    setPropertyData((prevData) => {
      const sortedData = [...prevData];

      switch (sortType) {
        case 'priceLowHigh':
          sortedData.sort((a, b) => (a.priceInFigure || 0) - (b.priceInFigure || 0));
          break;
        case 'priceHighLow':
          sortedData.sort((a, b) => (b.priceInFigure || 0) - (a.priceInFigure || 0));
          break;
        case 'newest':
          sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'oldest':
          sortedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        default:
          return prevData;
      }

      return sortedData;
    });
    setLoading(false);
  };

  const fetchCityData = async (city) => {
    try {
      const response = await axios.get(`${process.env.apiUrl1}/property/premium/${city}`);
      setPremiumProperties(response.data.data || []);
    } catch (err) {
      console.error('Error fetching premium properties:', err);
    }
  };
  
 

  useEffect(() => {
    const fetchData = async () => {
      if (!type || !name) return;
      setLoading(true);

      try {
        const res = await fetch(`${process.env.apiUrl1}/search?q=${name}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();
        const hits = data.hits || [];

        // ✅ Store property data
        setAllPropertyData(hits);
        setPropertyData(hits);
        setTotalProperties(hits.length);

        if (hits.length > 0) {
          console.log('Fetched properties:', hits);
          setCurrentPage(1);

          const firstProperty = hits[0];
          const cityName = firstProperty?.city?.name || '';
          const locality = firstProperty?.locality?.name || '';
          const sublocality = firstProperty?.subLocality?.name || '';
          const state = firstProperty?.state?.name || '';

          setCity(cityName);
          setLocality(locality);
          setSubLocality(sublocality);
          setState(state);

          if (cityName) fetchCityData(cityName);

          let min = Infinity;
          let max = -Infinity;
          let minStr = '';
          let maxStr = '';
          let highRise = 0;
          let readyToMove  = 0;


          for (const property of hits) {
            const price = property.priceInFigure || 0;
            const priceInStr = property.startingPrice || '';

            if (String(property.status || '').trim().toLowerCase() === 'ready to move') {
              readyToMove++;
            }

            const subTypes = property.propertyType?.subType;
            if (Array.isArray(subTypes) && subTypes.includes('High Rise Apartment')) {
              highRise++;
            }

            
              if (price < min) {
                min = price;
                minStr = priceInStr;
              }
              if (price > max) {
                max = price;
                maxStr = priceInStr;
              }
            }
          

          setReadyToMove(readyToMove);
          setHighRise(highRise);

          setMinPrice(minStr);
          setMaxPrice(maxStr);
        }
      } catch (err) {
        console.error('Failed to fetch property data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, name]);

 
useEffect(() => {

  let area = '';
  let parentArea = '';
  let newTitle = '';
  let newDescription = '';
  let newKeyword = '';

  if (type === 'city' && city) {
    area = city;
    parentArea = state;
    newTitle = `Properties in ${area} | Real Estate in ${area}`;
    newDescription = `Find “${totalProperties}+” properties for sale in “${area}”, only on Inframantra. Explore a wide range of property options including 2BHK to 5BHK apartments and penthouses.`;
    newKeyword = `InfraMantra, Residential Properties, Commercial Properties, Apartments, Flats, Buy flat in ${area.toLowerCase()}, buy property in ${area.toLowerCase()}, ${area.toLowerCase()} property prices, Apartments for sale in ${area.toLowerCase()}, buy apartment in ${area.toLowerCase()}, buy Properties in ${area.toLowerCase()}, real estate in ${area.toLowerCase()}, best property to buy in ${area.toLowerCase()}, ${area.toLowerCase()} apartment for sale, ${area.toLowerCase()} property prices, buy property in ${area.toLowerCase()}, buy residential property in ${area.toLowerCase()}, Property for purchase in ${area.toLowerCase()}`;
  }

  else if (type === 'locality' && locality && city) {
    area = locality;
    parentArea = city;
    newTitle = `Properties in ${area}, ${parentArea} | Real Estate in ${area}`;
    newDescription = `Find “${totalProperties}+” properties for sale in “${area}, ${parentArea}”, only on Inframantra. Explore a wide range of property options including 2BHK to 5BHK apartments and penthouses.`;
    newKeyword = `InfraMantra, Residential Properties, Commercial Properties, Apartments, Flats, Buy flat in ${area.toLowerCase()}, buy property in ${area.toLowerCase()}, ${parentArea.toLowerCase()} property prices, Apartments for sale in ${area.toLowerCase()}, buy apartment in ${area.toLowerCase()}, buy Properties in ${area.toLowerCase()}, real estate in ${parentArea.toLowerCase()}, best property to buy in ${parentArea.toLowerCase()}, ${parentArea.toLowerCase()} apartment for sale, ${area.toLowerCase()} property prices, buy property in ${area.toLowerCase()}, buy residential property in ${area.toLowerCase()}, Property for purchase in ${area.toLowerCase()}`;
  }

  else if (type === 'subLocality' && subLocality && locality && city) {
    area = subLocality;
    parentArea = `${locality}, ${city}`;
    newTitle = `Properties in ${area}, ${parentArea} | Real Estate in ${area}`;
    newDescription = `Find “${totalProperties}+” properties for sale in “${area}, ${parentArea}”, only on Inframantra. Explore a wide range of property options including 2BHK to 5BHK apartments and penthouses.`;
    newKeyword = `InfraMantra, Residential Properties, Commercial Properties, Apartments, Flats, Buy flat in ${city.toLowerCase()}, buy property in ${area.toLowerCase()}, ${city.toLowerCase()} property prices, Apartments for sale in ${area.toLowerCase()}, buy apartment in ${area.toLowerCase()}, buy Properties in ${area.toLowerCase()}, real estate in ${city.toLowerCase()}, best property to buy in ${city.toLowerCase()}, ${city.toLowerCase()} apartment for sale, ${city.toLowerCase()} property prices, buy property in ${area.toLowerCase()}, buy residential property in ${area.toLowerCase()}, Property for purchase in ${area.toLowerCase()}`;
  }

  else if (type === "search") {
    newTitle = 'Search Results | Inframantra';
    newDescription = `Explore all properties listed under your search results. Find “${totalProperties}+” verified properties on Inframantra including apartments, villas, plots, and more.`;
    newKeyword = `InfraMantra, Real Estate Search, Property Search, Buy properties, Buy apartments, Search results, Properties near me, Search real estate options`;
  }

  setTitle(newTitle);
  setDescription(newDescription);
  setKeyword(newKeyword);

}, [ type , name ]);


  const handleCloseFilterToggle = () => setOpenCloseFilter((prev) => !prev);

  return (
    <Suspense
      fallback={
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="loader-container">
            <div className="spinner" />
          </div>
        </div>
      }
    >
         <Wrapper
  title={title}
  description={description}
  keyword={keyword}
      {...(type === "search" ? { seo: "noindex, follow" } : {})}
>
        {isDesktop ? (
          <div
            className="Wrapper"
            style={{
              display: 'flex',
              gap: '1rem',
              overflow: 'hidden',
            }}
          >
            
            <div className="listingFilters" ref={filterRef} style={{ padding: '1rem' }}>
            <ListingFilters onFilterChange={handleFilterChange}  type={type} ref={divRef} name={name} />
            </div>

            <div
              className="listingScrollbar"
              ref={contentRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                marginTop: '1rem',
                scrollBehavior: 'smooth',
                willChange: 'transform',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
              }}
            >
              <SearchBar
                onSearch={setPropertyData}
                onSortChange={handleSortChange}
                isDesktop={isDesktop}
                isMobile={isMobile}
                name={name}
                type={name}
              />
              <Content
                totalProperties={totalProperties}
                currentPage={currentPage}
                maxPrice={maxPrice}
                minPrice={minPrice}
                type={type}
                name={name}
                state={state}
                city={city}
                />
              <PropertyListingCard
                name={name ? decodeURIComponent(name) : ''}
                type={type}
                onOpenBackdrop={handleOpen}
                propertyData={propertyData}
                propertyTypeFilter={propertyTypeFilter}
                priceRangeFilter={priceRangeFilter}
                projectStatusFilter={projectStatusFilter}
                loading={loading}
                currentPageNumber={setCurrentPage}
            
             
              
              />
                <h2>Featured Properties</h2>
              <PremiumProperty premiumProperties={premiumProperties} />
              <FaqSection
                totalProperties={totalProperties}

                type={type}
                name={name}
                state={state}
                city={city}
                locality={locality}
                subLocality={subLocality}
                highRise={highRise}
                readyToMove={readyToMove}
              />
            </div>
          </div>
        ) : (
          <>
            <SearchBar
              onSearch={setPropertyData}
              onSortChange={handleSortChange}
              isDesktop={isDesktop}
              isMobile={isMobile}
              handleCloseFilterToggle={handleCloseFilterToggle}
              name={name}
              type={name}
              
            />
            <ListingFilters
              onFilterChange={handleFilterChange}
              openClosefilter={openClosefilter}
              handleCloseFilterToggle={handleCloseFilterToggle}
              name={name}
              type={name}
            />
            <Content
               totalProperties={totalProperties}
                currentPage={currentPage}
                maxPrice={maxPrice}
                minPrice={minPrice}
                type={type}
                name={name}
                state={state}
                city={city}
                locality={locality}
                subLocality={subLocality}
                 />
            <PropertyListingCardMobile
              propertyData={propertyData}
              onOpenBackdrop={handleOpen}
              currentPageNumber={setCurrentPage}
            />
            <h2>Featured Properties</h2>
            <PremiumProperty premiumProperties={premiumProperties} />
            <FaqSection
                totalProperties={totalProperties}
                type={type}
                name={name}
                state={state}
                city={city}
                locality={locality}
                subLocality={subLocality}
                 highRise={highRise}
                readyToMove={readyToMove}
            />
          </>
        )}
         <CustomBackdrop open={backdropOpen} onClose={handleClose}>
          <PropertyPageFloatingContact name={selectedPropertyName} />
        </CustomBackdrop>
      </Wrapper>
    </Suspense>
  );
};

export default PropertyListingPage;
