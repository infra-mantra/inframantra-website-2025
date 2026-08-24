import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import axios from 'axios';
import PropertyCardSkeleton, { FeaturedSkeleton, FaqSkeleton, ContentSkeleton, ListingPageSkeleton } from '../../../components/newComponents/propertyListingDesktopNav/propertyListing/PropertyCardSkeleton';
// import { cityNames } from '../../../components/newComponents/propertyListingPage/propertyListingPriceFilter/dropDownMenuConstants.jsx';
// Lazy load components
const PropertyListingCard = dynamic(() =>
  import('../../../components/newComponents/propertyListingDesktopNav/propertyListing/propertyListingCard.jsx')
);
const ListingFilters = dynamic(() =>
  import('../../../components/newComponents/propertyListingDesktopNav/propertyListingSearch/ListingFilters.jsx')
);
const SearchBar = dynamic(() =>
  import('../../../components/newComponents/propertyListingDesktopNav/propertyListingSearch/searBar.jsx')
);
const PropertyListingCardMobile = dynamic(() =>
  import('../../../components/newComponents/propertyListingPage/propertyListingCardMobile.jsx')
);
const CustomBackdrop = dynamic(() =>
  import('../../../components/newComponents/backdrop/backdrop.jsx')
);
const Wrapper = dynamic(() => import('../../../components/UI/Wrapper'));
const FaqSection = dynamic(() =>
  import('../../../components/newComponents/propertyListingDesktopNav/Content/faqSection.jsx')
);
const Content = dynamic(() =>
  import('../../../components/newComponents/propertyListingDesktopNav/Content/aboutSection.jsx')
);
const PropertyPageFloatingContact = dynamic(() =>
  import('../../../components/newComponents/propertyData/propertyRightSection/propertyPageSections/propertyPageFloatingContact.jsx')
);
const PremiumProperty = dynamic(() =>
  import('../../../components/newComponents/propertyListingDesktopNav/propertyListing/premiumProperty.jsx')
);

const PAGE_SIZE = 10; // results per page (kept in sync with the backend `limit`)

const PropertyListingPage = () => {
  const router = useRouter();
  const { type, name } = router.query;
  const nameLc = (typeof name === 'string' ? name : '').toLowerCase(); // city/search term is always lowercase

  const [isDesktop, setIsDesktop] = useState(true);
  // Desktop-first defaults so the desktop branch renders with the correct (row,
  // sticky-filter) layout on first paint — avoids the "mobile layout flashes on
  // desktop until refresh" mislayout on client-side navigation. The effect below
  // corrects to mobile when the viewport is actually narrow.
  const [isMobile, setIsMobile] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true); // start in loading state so the empty "No Properties Found" never flashes before the first fetch

  const [backdropOpen, setBackdropOpen] = useState(false);
  const [selectedPropertyName, setSelectedPropertyName] = useState('');
  // filters + sort + page now drive backend fetches (no client-side filtering/slicing)
  const [filters, setFilters] = useState({ status: [], unitType: [], configuration: [], priceRange: [null, null] });
  const [sort, setSort] = useState('relevance');
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
  const lastQueryRef = useRef(''); // guards against duplicate consecutive list fetches (double loading)
  const initKeyRef = useRef(''); // ensures the per-location initial load runs exactly once

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

  // ✅ Warm the content chunks while the first fetch is still in flight. These sections
  // are lazy AND hidden behind `loading` (skeletons show instead), so their chunks would
  // otherwise download only when `loading` flips to false — at which point they re-suspend
  // and the page skeleton flashes a SECOND time. Preloading here keeps the load to one pass.
  useEffect(() => {
    import('../../../components/newComponents/propertyListingDesktopNav/Content/aboutSection.jsx');
    import('../../../components/newComponents/propertyListingDesktopNav/propertyListing/propertyListingCard.jsx');
    import('../../../components/newComponents/propertyListingPage/propertyListingCardMobile.jsx');
    import('../../../components/newComponents/propertyListingDesktopNav/propertyListing/premiumProperty.jsx');
    import('../../../components/newComponents/propertyListingDesktopNav/Content/faqSection.jsx');
  }, []);

  // ✅ Sync listing content height with filters
 
 

  // ✅ Smooth scroll to top when filters/search change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [type, name, currentPage, filters, sort]);

  const handleClose = () => {
    setBackdropOpen(false);
    setSelectedPropertyName('');
  };

  const handleOpen = (name) => {
    setSelectedPropertyName(name);
    setBackdropOpen(true);
  };

  // Build the /search query string (filters + pagination + sort) sent to the backend
  const buildSearchQuery = (nameVal, pageVal, f, sortVal) => {
    const p = new URLSearchParams();
    p.set('q', nameVal);
    p.set('page', pageVal);
    p.set('limit', PAGE_SIZE);
    if (sortVal && sortVal !== 'relevance') p.set('sort', sortVal);
    if (f.status?.length) p.set('status', f.status.join(','));
    if (f.configuration?.length) p.set('configuration', f.configuration.join(','));
    if (f.unitType?.length) p.set('unitType', f.unitType.join(','));
    const [min, max] = f.priceRange || [];
    if (min) p.set('minPrice', Math.round(Number(min) * 1e7));
    if (max) p.set('maxPrice', Math.round(Number(max) * 1e7));
    return p.toString();
  };

  // ---- URL <-> filter/sort/page state (shareable, bookmarkable URLs) ----
  const parseUrlState = (query) => {
    const csv = (v) => (typeof v === 'string' && v.trim() ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);
    const num = (v) => (v !== undefined && v !== '' && !isNaN(Number(v)) ? Number(v) : null);
    return {
      filters: {
        status: csv(query.status),
        unitType: csv(query.unit),
        configuration: csv(query.config),
        priceRange: [num(query.min), num(query.max)],
      },
      sort: typeof query.sort === 'string' && query.sort ? query.sort : 'relevance',
      page: query.page && !isNaN(Number(query.page)) ? Math.max(1, Number(query.page)) : 1,
    };
  };

  // Reflect the current filters/sort/page in the URL (shallow → no reload) so it can be shared
  const syncUrl = (f, sortVal, pageVal) => {
    const q = { type, name: nameLc };
    if (f.status?.length) q.status = f.status.join(',');
    if (f.unitType?.length) q.unit = f.unitType.join(',');
    if (f.configuration?.length) q.config = f.configuration.join(',');
    const [min, max] = f.priceRange || [];
    if (min) q.min = min;
    if (max) q.max = max;
    if (sortVal && sortVal !== 'relevance') q.sort = sortVal;
    if (pageVal && pageVal > 1) q.page = pageVal;
    router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true, scroll: false });
  };

  // ✅ Fetch ONE page of results — filtering + pagination + sorting all happen on the backend
  const fetchList = async (nameVal, pageVal, f, sortVal) => {
    if (!nameVal) return;
    const qs = buildSearchQuery(nameVal, pageVal, f, sortVal);
    // Skip a duplicate identical fetch (e.g. ListingFilters' reset-on-mount firing right after the
    // initial load) so the UI doesn't flash Loading → results → Loading again.
    if (qs === lastQueryRef.current) return;
    lastQueryRef.current = qs;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.apiUrl1}/search?${qs}`);
      const data = await res.json();
      let hits = data.hits || [];
      // Safety net: if the backend hasn't been updated yet and ignored pagination
      // (returns more than one page), slice down to the requested page client-side.
      if (hits.length > PAGE_SIZE) {
        hits = hits.slice((pageVal - 1) * PAGE_SIZE, pageVal * PAGE_SIZE);
      }
      setPropertyData(hits);
      setTotalProperties(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setPropertyData([]);
      setTotalProperties(0);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Area-level info (city/state names + price range + counts) — fetched once per location
  const fetchStats = async (nameVal) => {
    if (!nameVal) return;
    try {
      const res = await fetch(`${process.env.apiUrl1}/search?q=${encodeURIComponent(nameVal)}&stats=1&limit=1`);
      const data = await res.json();
      const first = data.hits?.[0];
      if (first) {
        const cityName = first.city?.name || '';
        setCity(cityName);
        setLocality(first.locality?.name || '');
        setSubLocality(first.subLocality?.name || '');
        setState(first.state?.name || '');
        if (cityName) fetchCityData(cityName);
      }
      if (data.stats) {
        setMinPrice(data.stats.minPrice || '');
        setMaxPrice(data.stats.maxPrice || '');
        setReadyToMove(data.stats.readyToMove || 0);
        setHighRise(data.stats.highRise || 0);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // ✅ Filters changed → back to page 1 and re-fetch from the backend
  const handleFilterChange = (filterTypes, values) => {
    const map = {};
    if (Array.isArray(filterTypes)) {
      filterTypes.forEach((t, i) => { map[t] = values[i]; });
    } else {
      map[filterTypes] = values;
    }

    // Selecting a different city navigates to that city's listing (lowercase URL)
    const otherCity = (map.city || []).find((c) => c && c.toLowerCase() !== nameLc);
    if (otherCity) {
      router.push(`/property-listing/city/${otherCity.toLowerCase()}`);
      return;
    }

    const nextFilters = {
      status: map.projectStatus ?? filters.status,
      unitType: map.unitType ?? filters.unitType,
      configuration: map.configuration ?? filters.configuration,
      priceRange: map.priceRange ?? filters.priceRange,
    };
    setFilters(nextFilters);
    setCurrentPage(1);
    syncUrl(nextFilters, sort, 1);
    fetchList(nameLc, 1, nextFilters, sort);
  };

  const handlePageChange = (pageVal) => {
    setCurrentPage(pageVal);
    syncUrl(filters, sort, pageVal);
    fetchList(nameLc, pageVal, filters, sort);
  };

  // ✅ Sort changed → back to page 1 and re-fetch (sorting happens on the backend)
  const handleSortChange = (sortType) => {
    setSort(sortType);
    setCurrentPage(1);
    syncUrl(filters, sortType, 1);
    fetchList(nameLc, 1, filters, sortType);
  };

  const fetchCityData = async (city) => {
    try {
      const response = await axios.get(`${process.env.apiUrl1}/property/premium/${city}`);
      setPremiumProperties(response.data.data || []);
    } catch (err) {
      console.error('Error fetching premium properties:', err);
    }
  };
  
 

  // ✅ Normalize city URLs to lowercase (cosmetic; the backend lowercases the query anyway)
  useEffect(() => {
    if (type === 'city' && name && name !== nameLc) {
      router.replace({ pathname: router.pathname, query: { ...router.query, name: nameLc } }, undefined, { shallow: true, scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, name]);

  // ✅ Load: read filters/sort/page from the URL, fetch area stats once, then fetch that page
  useEffect(() => {
    if (!type || !nameLc) return;

    // Run the initial load exactly once per location. Without this guard, React
    // StrictMode (and Fast Refresh) re-invoke this effect and it fetches twice,
    // which flashed the skeleton on/off ("loading multiple times").
    const key = `${type}|${nameLc}`;
    if (initKeyRef.current === key) return;
    initKeyRef.current = key;

    const { filters: f, sort: s, page: pg } = parseUrlState(router.query);
    setFilters(f);
    setSort(s);
    setCurrentPage(pg);
    lastQueryRef.current = ''; // new location → always fetch fresh (never dedupe the first load)
    fetchStats(nameLc);
    fetchList(nameLc, pg, f, s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, nameLc]);

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
      flexDirection: isMobile ? "column" : "row",
      gap: "1rem",
      alignItems: "flex-start",
      maxWidth: "1280px",
      margin: "0 auto",
    }}
  >
    {/* LEFT FILTERS */}
    <div
      className="listingFilters"
      ref={filterRef}
      style={{
        padding: "1rem",
        width: isMobile ? "100%" : "30%",
        flexShrink: 0,
        position: isMobile ? "static" : "sticky",
        top: "1rem",
        alignSelf: "flex-start",
        maxHeight: isMobile ? "none" : "calc(100vh - 2rem)",
        overflowY: isMobile ? "visible" : "auto",
      }}
    >
      <ListingFilters
        onFilterChange={handleFilterChange}
        type={type}
        name={name}
      />
    </div>

      <div
        className="listingScrollbar"
        ref={contentRef}
        style={{
          flex: 1,
          minWidth: 0,
          marginTop: "1rem",
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

        {loading ? (
          <ContentSkeleton />
        ) : (
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
        )}

        {loading ? (
          <PropertyCardSkeleton count={4} />
        ) : (
          <PropertyListingCard
            name={name ? decodeURIComponent(name) : ""}
            type={type}
            onOpenBackdrop={handleOpen}
            propertyData={propertyData}
            totalProperties={totalProperties}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}

        {loading ? (
          <FeaturedSkeleton count={4} />
        ) : (
          <>
            <h2
              style={{
                fontFamily: "'Lexend Deca', sans-serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#1a1a1a",
                letterSpacing: "0.02em",
                lineHeight: 1.3,
                textTransform: "uppercase",
                margin: "1.5rem 0 1.25rem",
              }}
            >
              Featured Properties
            </h2>
            <PremiumProperty premiumProperties={premiumProperties} />
          </>
        )}

        {loading ? (
          <FaqSkeleton count={5} />
        ) : (
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
        )}
      </div>
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
          <ContentSkeleton />
        ) : (
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
            isMobile={isMobile}
            onSortChange={handleSortChange}
          />
        )}

        {loading ? (
          <PropertyCardSkeleton count={4} />
        ) : (
          <PropertyListingCardMobile
            propertyData={propertyData}
            onOpenBackdrop={handleOpen}
            totalProperties={totalProperties}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}

        {loading ? (
          <FeaturedSkeleton count={4} />
        ) : (
          <>
            <h2
              style={{
                fontFamily: "'Lexend Deca', sans-serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#1a1a1a",
                letterSpacing: "0.02em",
                lineHeight: 1.3,
                textTransform: "uppercase",
                margin: "1.5rem 0 1.25rem",
              }}
            >
              Featured Properties
            </h2>
            <PremiumProperty premiumProperties={premiumProperties} />
          </>
        )}

        {loading ? (
          <FaqSkeleton count={5} />
        ) : (
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
        )}
  </>
)}


{/* BACKDROP ALWAYS OUTSIDE */}
<CustomBackdrop open={backdropOpen} onClose={handleClose}>
  <PropertyPageFloatingContact name={selectedPropertyName} />
</CustomBackdrop>

      </Wrapper>
  );
};

export default PropertyListingPage;
