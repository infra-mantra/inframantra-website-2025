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

    newTitle = `Properties in ${area} | Real Estate in ${area}`;

    newDescription = `Explore the best properties in ${area}. In total, there are more than ${totalProperties} properties for sale in ${area}. Property prices range between ${minPrice} and ${maxPrice}. These listings include 2-5 BHK apartments, villas, duplexes, and penthouses with modern amenities, great connectivity, and top-tier living standards. ${area} is a rapidly developing region that offers comfort, convenience, and premium lifestyle options for homebuyers.`;

    newKeyword = `properties in ${area.toLowerCase()}, real estate in ${area.toLowerCase()}, buy property in ${area.toLowerCase()}, apartments in ${area.toLowerCase()}, flats in ${area.toLowerCase()}, ${area.toLowerCase()} property prices, residential property in ${area.toLowerCase()}, real estate market ${area.toLowerCase()}`;
  }

  // ---------- CITY ----------
  else if (type === "city" && city) {
    area = city;
    parentArea = state;

    newTitle = `Properties in ${area}, ${parentArea} | Real Estate in ${area}`;

    newDescription = `Explore the best properties in ${area}, ${parentArea}. In total, there are more than ${totalProperties} properties for sale in ${area}. The price of these properties ranges from ${minPrice} to ${maxPrice}. These ${area} properties include 2-5 BHK apartments, villas, duplexes, and penthouses loaded with world-class amenities. ${area} is one of the fastest-growing urban hubs offering unmatched connectivity and modern living, ideal for families and professionals seeking high-quality living spaces.`;

    newKeyword = `properties in ${area.toLowerCase()}, real estate in ${area.toLowerCase()}, buy property in ${area.toLowerCase()}, apartments in ${area.toLowerCase()}, flats in ${area.toLowerCase()}, ${parentArea.toLowerCase()} real estate, buy flat in ${area.toLowerCase()}, ${area.toLowerCase()} property prices, luxury property in ${area.toLowerCase()}`;
  }

  // ---------- LOCALITY ----------
  else if (type === "locality" && locality && city) {
    area = locality;
    parentArea = city;

    newTitle = `Properties in ${area}, ${parentArea} | Real Estate in ${area}`;

    newDescription = `Explore the best properties in ${area}, ${parentArea}. There are more than ${totalProperties} properties for sale in ${area}. Prices start from ${minPrice} and go up to ${maxPrice}. These include 2-5 BHK apartments, duplexes, villas, and penthouses designed with premium amenities and superior connectivity. ${area}, ${parentArea} is a rapidly evolving residential hub offering excellent lifestyle advantages, making it ideal for homebuyers seeking luxury and comfort.`;

    newKeyword = `properties in ${area.toLowerCase()}, real estate in ${area.toLowerCase()}, buy property in ${area.toLowerCase()}, flats in ${area.toLowerCase()}, buy apartment in ${area.toLowerCase()}, ${parentArea.toLowerCase()} real estate, ${area.toLowerCase()} property prices`;
  }

  // ---------- SUB LOCALITY ----------
  else if (type === "subLocality" && subLocality && locality && city) {
    area = subLocality;
    parentArea = `${locality}, ${city}`;

    newTitle = `Properties in ${area}, ${parentArea} | Real Estate in ${area}`;

    newDescription = `Explore premium properties in ${area}, ${parentArea}. There are more than ${totalProperties} properties available in this area. Property prices range between ${minPrice} and ${maxPrice}. These listings include 2-5 BHK luxury apartments, duplex homes, villas, and penthouses with top-class amenities. ${area}, ${parentArea} is one of the most sought-after residential pockets offering superior connectivity, modern infrastructure, and high-quality living options.`;

    newKeyword = `properties in ${area.toLowerCase()}, real estate in ${area.toLowerCase()}, buy property in ${area.toLowerCase()}, luxury homes in ${area.toLowerCase()}, residential projects in ${area.toLowerCase()}, ${city.toLowerCase()} real estate, ${area.toLowerCase()} property prices`;
  }

  else if (type === "search") {
    newTitle = `Search Results | Inframantra`;
    newDescription = `Discover the finest properties with Inframantra — your gateway to premium living. Explore an exclusive collection of 2–5 BHK apartments, duplexes, villas, and penthouses, each crafted with world-class design and top-tier amenities. Located in one of the fastest-growing residential destinations, Inframantra offers best properties boasting unmatched connectivity, superior convenience, and a lifestyle perfectly suited for families and professionals seeking luxury, comfort, and long-term value.`;
    newKeyword = `property search, real estate search, buy property, inframantra search results`;
  }

  setTitle(newTitle);
  setDescription(newDescription);
  setKeyword(newKeyword);

}, [
  type,
  name,
  city,
  locality,
  subLocality,
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
  description={description}
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

    {/* DESKTOP LOADING OR CONTENT */}
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
          subLocality={subLocality}
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
