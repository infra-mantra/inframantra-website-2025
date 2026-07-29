import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Same page as the city property-listing page (/property-listing/city/gurgaon) —
// identical structure, filters and sections — but served on its own SEO URL with
// its own title / description / keyword and its own FAQ set. Only those four
// things differ; everything else mirrors the listing page.
//
// Wrapper is imported directly (not lazy) so the custom meta is server-rendered.
// The interactive listing pieces load client-side, exactly like the listing page.
import Wrapper from '../components/UI/Wrapper';

const PropertyListingCard = dynamic(
  () =>
    import(
      '../components/newComponents/propertyListingDesktopNav/propertyListing/propertyListingCard.jsx'
    ),
  { ssr: false }
);
const ListingFilters = dynamic(
  () =>
    import(
      '../components/newComponents/propertyListingDesktopNav/propertyListingSearch/ListingFilters.jsx'
    ),
  { ssr: false }
);
const SearchBar = dynamic(
  () =>
    import(
      '../components/newComponents/propertyListingDesktopNav/propertyListingSearch/searBar.jsx'
    ),
  { ssr: false }
);
const PropertyListingCardMobile = dynamic(
  () =>
    import(
      '../components/newComponents/propertyListingPage/propertyListingCardMobile.jsx'
    ),
  { ssr: false }
);
const CustomBackdrop = dynamic(
  () => import('../components/newComponents/backdrop/backdrop.jsx'),
  { ssr: false }
);
const FaqSection = dynamic(
  () =>
    import(
      '../components/newComponents/propertyListingDesktopNav/Content/faqSection.jsx'
    ),
  { ssr: false }
);
const Content = dynamic(
  () =>
    import(
      '../components/newComponents/propertyListingDesktopNav/Content/aboutSection.jsx'
    ),
  { ssr: false }
);
const PropertyPageFloatingContact = dynamic(
  () =>
    import(
      '../components/newComponents/propertyData/propertyRightSection/propertyPageSections/propertyPageFloatingContact.jsx'
    ),
  { ssr: false }
);
const PremiumProperty = dynamic(
  () =>
    import(
      '../components/newComponents/propertyListingDesktopNav/propertyListing/premiumProperty.jsx'
    ),
  { ssr: false }
);

// ----- The only things that differ from the generic listing page -----
const SEO_TITLE =
  'Luxury Apartments for Sale in Gurgaon | Luxury Residential Projects';
const SEO_DESCRIPTION =
  "Find luxury apartments in Gurgaon offering elegant designs, premium amenities, spacious configurations, and excellent connectivity in the city's most sought-after locations.";
const SEO_KEYWORDS =
  'luxury apartments in gurgaon, luxury apartments for sale in gurgaon, luxury residential projects gurgaon, premium flats in gurgaon, 3 bhk luxury apartments gurgaon, 4 bhk luxury apartments gurgaon, luxury flats golf course road, luxury projects dwarka expressway';

// Custom "top content" for the about section (used verbatim).
const TOP_CONTENT =
  "Explore Luxury Apartments in Gurgaon that offer the perfect blend of elegance, comfort, and modern living. Discover premium residences from leading developers across Gurgaon, featuring spacious 3 BHK, 4 BHK, and 5 BHK apartments with world-class amenities and contemporary designs. At InfraMantra, we have carefully curated the finest luxury apartments for sale in Gurgaon across prime locations, including Golf Course Road, Golf Course Extension Road, Dwarka Expressway, Southern Peripheral Road (SPR), and New Gurgaon. Whether you're looking for a new launch, an under-construction project, or a ready-to-move luxury home, you'll find options that suit your lifestyle, preferences, and investment goals.";

const FAQS = [
  {
    question: 'What are the best luxury apartments in Gurgaon?',
    answer:
      'Some of the best luxury apartments in Gurgaon include Tulip Monsella, DLF The Arbour, Whiteland The Westin Residences, Godrej Miraya, Godrej Samaris, Smartworld One DXP, and Ambience Creacions. These projects offer premium amenities, prime locations, and excellent investment potential.',
  },
  {
    question: 'What is the starting price of luxury apartments in Gurgaon?',
    answer:
      'The starting price of luxury apartments in Gurgaon typically ranges from ₹2 crore to ₹4 crore, while ultra-luxury residences can cost ₹5 crore to ₹25 crore or more, depending on the location, builder, and apartment size.',
  },
  {
    question: 'Which are the best locations to buy luxury apartments in Gurgaon?',
    answer:
      'The most sought-after locations include Golf Course Road, Golf Course Extension Road, Dwarka Expressway, Southern Peripheral Road (SPR), New Gurgaon and Sohna Road. These areas offer excellent connectivity, premium infrastructure, and strong appreciation potential.',
  },
  {
    question: 'Are luxury apartments in Gurgaon a good investment?',
    answer:
      'Yes. Luxury apartments in Gurgaon have witnessed steady demand due to corporate growth, infrastructure development, and the presence of leading developers. They also offer good long-term capital appreciation and attractive rental returns.',
  },
  {
    question: 'Which builders offer luxury apartments in Gurgaon?',
    answer:
      'Leading developers include DLF, Godrej Properties, Tulip Infratech, Whiteland Corporation, Elan Group, Smartworld Developers, M3M India, Sobha, and Signature Global.',
  },
];

// Fixed target — this page always lists Gurgaon (city) properties.
const TYPE = 'city';
const NAME = 'gurgaon';

const LuxuryApartmentsGurgaon = () => {
  const router = useRouter();
  const type = TYPE;
  const name = NAME;

  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);

  const [allPropertyData, setAllPropertyData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true); // start in loading state so the empty "No Properties Found" never flashes before the first fetch

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
  const [readyToMove, setReadyToMove] = useState(0);
  const [highRise, setHighRise] = useState(0);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const contentRef = useRef(null);
  const filterRef = useRef(null);

  // Detect screen size
  useEffect(() => {
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth >= 769);
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  // Smooth scroll to top when filters/search change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [propertyTypeFilter, priceRangeFilter, projectStatusFilter]);

  const handleClose = () => {
    setBackdropOpen(false);
    setSelectedPropertyName('');
  };

  const handleOpen = (propertyName) => {
    setSelectedPropertyName(propertyName);
    setBackdropOpen(true);
  };

  // Apply filters on original data
  const handleFilterChange = (filterType, value) => {
    setLoading(true);
    let filtered = [...allPropertyData];

    if (!Array.isArray(filterType)) {
      filterType = [filterType];
      value = [value];
    }

    for (let i = 0; i < filterType.length; i++) {
      const ft = filterType[i];
      const val = value[i];
      if (!val || val.length === 0) continue;
      filtered = filtered.filter((property) => applySingleFilter(property, ft, val));
    }

    setPropertyData(filtered);
    setTotalProperties(filtered.length);
    setLoading(false);
  };

  function applySingleFilter(property, filterType, value) {
    if (filterType === 'city' && value.length > 0) {
      if (type === 'city' && Array.isArray(value) && name) {
        for (let i = 0; i < value.length; i++) {
          if (value[i] != name) {
            router.push(`/property-listing/city/${value[i]}`);
          }
        }
      }
      return value.includes(property.city?.name);
    }

    if (filterType === 'unitType' && value.length > 0) {
      return property.propertyType?.subType?.some((sub) => value.includes(sub));
    }

    if (filterType === 'configuration' && value.length > 0) {
      return property.configurationForSearch?.some((config) => {
        if (typeof config === 'number') {
          return value.includes(Math.floor(config).toString());
        }
        return value.includes(config);
      });
    }

    if (filterType === 'projectStatus' && value.length > 0) {
      return value.includes(property.status);
    }

    if (filterType === 'priceRange') {
      const [minValue, maxValue] = value;
      const minP = minValue ? minValue * 1e7 : null;
      const maxP = maxValue ? maxValue * 1e7 : null;

      if (minP && maxP) {
        if (minP > maxP) return false;
        return property.priceInFigure >= minP && property.priceInFigure <= maxP;
      }
      if (minP) return property.priceInFigure >= minP;
      if (maxP) return property.priceInFigure <= maxP;
      return true;
    }

    return true;
  }

  const handleSortChange = (sortType) => {
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

  const fetchCityData = async (cityName) => {
    try {
      const response = await axios.get(
        `${process.env.apiUrl1}/property/premium/${cityName}`
      );
      setPremiumProperties(response.data.data || []);
    } catch (err) {
      console.error('Error fetching premium properties:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.apiUrl1}/search?q=${name}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();
        const hits = data.hits || [];

        setAllPropertyData(hits);
        setPropertyData(hits);
        setTotalProperties(hits.length);

        if (hits.length > 0) {
          setCurrentPage(1);

          const firstProperty = hits[0];
          const cityName = firstProperty?.city?.name || '';
          const localityName = firstProperty?.locality?.name || '';
          const subLocalityName = firstProperty?.subLocality?.name || '';
          const stateName = firstProperty?.state?.name || '';

          setCity(cityName);
          setLocality(localityName);
          setSubLocality(subLocalityName);
          setState(stateName);

          if (cityName) fetchCityData(cityName);

          let min = Infinity;
          let max = -Infinity;
          let minStr = '';
          let maxStr = '';
          let highRiseCount = 0;
          let readyToMoveCount = 0;

          for (const property of hits) {
            const price = property.priceInFigure || 0;
            const priceInStr = property.startingPrice || '';

            if (String(property.status || '').trim().toLowerCase() === 'ready to move') {
              readyToMoveCount++;
            }

            const subTypes = property.propertyType?.subType;
            if (Array.isArray(subTypes) && subTypes.includes('High Rise Apartment')) {
              highRiseCount++;
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

          setReadyToMove(readyToMoveCount);
          setHighRise(highRiseCount);
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
  }, [name]);

  const handleCloseFilterToggle = () => setOpenCloseFilter((prev) => !prev);

  return (
    <Wrapper
      title={SEO_TITLE}
      description={SEO_DESCRIPTION}
      keyword={SEO_KEYWORDS}
      type={type}
      name={name}
      selectedItem={[]}
    >
      {isDesktop ? (
        <div
          className="Wrapper"
          style={{ display: 'flex', gap: '1rem', overflow: 'hidden' }}
        >
          {/* LEFT FILTERS */}
          <div className="listingFilters" ref={filterRef} style={{ padding: '1rem' }}>
            <ListingFilters
              onFilterChange={handleFilterChange}
              type={type}
              name={name}
            />
          </div>

          {loading ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px',
                fontWeight: 'bold',
                fontSize: '1.2rem',
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
                type={type}
              />

              <Content
                customContent={TOP_CONTENT}
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
                customFaqs={FAQS}
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
            type={type}
          />

          <ListingFilters
            onFilterChange={handleFilterChange}
            openClosefilter={openClosefilter}
            handleCloseFilterToggle={handleCloseFilterToggle}
            name={name}
            type={type}
          />

          {loading ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              Loading...
            </div>
          ) : (
            <>
              <Content
                customContent={TOP_CONTENT}
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
                customFaqs={FAQS}
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

      {/* BACKDROP */}
      <CustomBackdrop open={backdropOpen} onClose={handleClose}>
        <PropertyPageFloatingContact name={selectedPropertyName} />
      </CustomBackdrop>
    </Wrapper>
  );
};

export default LuxuryApartmentsGurgaon;
