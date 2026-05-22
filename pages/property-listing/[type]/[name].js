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
  const [loading, setLoading] = useState(false);

  const [backdropOpen, setBackdropOpen] = useState(false);
  const [selectedPropertyName, setSelectedPropertyName] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(null);
  const [priceRangeFilter, setPriceRangeFilter] = useState([1000000, 800000000]);
  const [projectStatusFilter, setProjectStatusFilter] = useState(null);
  const [premiumProperties, setPremiumProperties] = useState([]);
  const [openClosefilter, setOpenCloseFilter] = useState(false);
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [sublocality, setSubLocality] = useState('');
  const [state, setState] = useState('');
  const[readyToMove, setReadyToMove] = useState(0);
  const [highRise,setHighRise] = useState(0);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);


  const [title, setTitle] = useState("");
  const [metadescription, setMetaDescription] = useState("");
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
          console.log(data)

        // ✅ Store property data
        setAllPropertyData(hits);
        setPropertyData(hits);
        setTotalProperties(hits.length);

        if (hits.length > 0) {
          // console.log('Fetched properties:', hits);
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
          setLoading(false);
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
  if (!type || !name) return;

  let area = "";
  let parentArea = "";
  let newTitle = "";
  let newDescription = "";
  let newKeyword = "";

  // ---------- STATE ----------
  if (type === "state" && state) {
    area = state;

    newTitle = ` Properties in ${area} | Real Estate in ${area}`;
    newDescription =` Find ${totalProperties}+ properties for sale on ${area}, ${state}, only on Inframantra. Explore a wide range of ${area} Property options including 2BHK to 5BHK apartments and penthouses.`
    newKeyword = `Properties in ${city}, ${state}, Properties,  Property for sale in ${city}, ${state}`;
  }

  // ---------- CITY ----------
  else if (type === "city" && city) {
    area = city;
    parentArea = state;
    newTitle = `Properties in ${area}, ${parentArea} | Real Estate in ${area}`;
    newDescription =` Find ${totalProperties}+ properties for sale on ${area}, ${state}, only on Inframantra. Explore a wide range of ${area} Property options including 2BHK to 5BHK apartments and penthouses.`
    newKeyword = `Properties in ${city}, ${state}, Properties,  Property for sale in ${city}, ${state}`;
  
  }

  // ---------- LOCALITY ----------
  else if (type === "locality" && locality && city) {
    area = locality;
    parentArea = city;
    newTitle = `Properties in ${area}, ${parentArea} | Real Estate in ${area}`;
    newDescription =` Find ${totalProperties}+ properties for sale on ${area}, ${parentArea}, only on Inframantra. Explore a wide range of ${area} Property options including 2BHK to 5BHK apartments and penthouses.`
    newKeyword = `Properties in ${area}, ${parentArea}, Properties,  Property for sale in ${area}, ${parentArea}`;
  }

  // ---------- SUB LOCALITY ----------
  else if (type === "subLocality" && sublocality && locality && city) {
    area = sublocality;
    parentArea = `${locality}, ${city}`;
    newTitle = `Properties in ${area}, ${parentArea} | Real Estate in ${area}`;
    newDescription =` Find ${totalProperties}+ properties for sale on ${area}, ${parentArea}, only on Inframantra. Explore a wide range of ${area} Property options including 2BHK to 5BHK apartments and penthouses.`
    newKeyword = `Properties in ${area}, ${parentArea}, Properties,  Property for sale in ${area}, ${parentArea}`;
  }

  else if (type === "search") {
    newTitle = `Search Results | Inframantra`;
    newDescription = `Explore premium 2–5 BHK apartments, villas, and penthouses with Inframantra. Enjoy world-class amenities, great connectivity, and luxury living for modern families.`;
    newKeyword = `property search, real estate search, buy property, inframantra search results`;
  }

  setTitle(newTitle);
  setMetaDescription(newDescription);
  setKeyword(newKeyword);

}, [
  type,
  name,
  city,
  locality,
  sublocality,
  state,
  totalProperties,  
]);


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
  description={metadescription}
  keyword={keyword}
      {...(type === "search" ? { seo: "noindex, follow" } : {})}
      type={type}
      name={name}
>
  {isDesktop ? (
  <div
    className="Wrapper"
    style={{
      display: "flex",
      gap: "1rem",
      overflow: "hidden",
    }}
  >
    {/* LEFT FILTERS */}
    <div
      className="listingFilters"
      ref={filterRef}
      style={{ padding: "1rem" }}
    >
      <ListingFilters
        onFilterChange={handleFilterChange}
        type={type}
        ref={divRef}
        name={name}
      />
    </div>

    {loading ? (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    ) : (
      <div
        className="listingScrollbar"
        ref={contentRef}
        style={{
          flex: 1,
          overflowY: "auto",
          marginTop: "1rem",
          scrollBehavior: "smooth",
          willChange: "transform",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        <SearchBar
          onSearch={setPropertyData}
          onSortChange={handleSortChange}
          isDesktop={isDesktop}
          isMobile={isMobile}
          name={name}
          type={type}
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
          sublocality={sublocality}
          locality={locality}
        />

        <PropertyListingCard
          name={name ? decodeURIComponent(name) : ""}
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
          subLocality={sublocality}
          highRise={highRise}
          readyToMove={readyToMove}
        />
      </div>
    )}
  </div>
) : (
  /* ---------------- MOBILE VIEW ---------------- */
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

    {loading ? (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    ) : (
      <>
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
          sublocality={sublocality}
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
          subLocality={sublocality}
          highRise={highRise}
          readyToMove={readyToMove}
        />
      </>
    )}
  </>
)}


{/* BACKDROP ALWAYS OUTSIDE */}
<CustomBackdrop open={backdropOpen} onClose={handleClose}>
  <PropertyPageFloatingContact name={selectedPropertyName} />
</CustomBackdrop>

      </Wrapper>
    </Suspense>
  );
};

export default PropertyListingPage;
