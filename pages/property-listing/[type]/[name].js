import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { useRouter } from 'next/router';

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

const PropertyListingPage = () => {
  const router = useRouter();
  const { type, name } = router.query;

  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  // ✅ Keep both original and filtered data
  const [allPropertyData, setAllPropertyData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [backdropOpen, setBackdropOpen] = useState(false);
  const [selectedPropertyName, setSelectedPropertyName] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(null);
  const [priceRangeFilter, setPriceRangeFilter] = useState([1000000, 800000000]);
  const [projectStatusFilter, setProjectStatusFilter] = useState(null);

  const contentRef = useRef(null);
  const filterRef = useRef(null);

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
  useEffect(() => {
    if (!filterRef.current || !contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        contentRef.current.style.height = `${entry.contentRect.height}px`;
      }
    });

    observer.observe(filterRef.current);
    return () => observer.disconnect();
  }, []);

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
  const handleFilterChange = (filterType, value) => {
    console.log('Applying Filter:', filterType, value);
    setLoading(true)

    const filtered = (allPropertyData || []).filter((property) => {
      if (filterType === 'city' && value.length > 0) {
        console.log("5555555555",filterType,value)
        return value.includes(property.city?.name);
      }
      if (filterType === 'unitType' && value.length > 0) {
        return property.propertyType?.subType?.some((sub) => value.includes(sub));
      }
      if (filterType === 'configuration' && value.length > 0) {
        return property.configurationForSearch?.some((config) =>
          value.includes(config.toString())
        );
      }
      if (filterType === 'projectStatus' && value.length > 0) {
        return value.includes(property.status);
      }
      if (filterType === 'priceRange' && value.length === 2) {
        return property.price >= value[0] && property.price <= value[1];
      }
      return true;
    });

    setPropertyData(filtered);
    setLoading(false)
  };

  // ✅ Sort function
  const handleSortChange = (sortType) => {
    console.log('Sorting by:', sortType);
    setLoading(true)
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
    setLoading(true)
  };

  // ✅ Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      if (!type || !name) return;
      setLoading(true);
      try {
        const res = await fetch(`${process.env.apiUrl1}/search?q=${name.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setAllPropertyData(data.hits || []);
        setPropertyData(data.hits || []);
      } catch (err) {
        console.error('Failed to fetch property data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, name]);

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
      <Wrapper>
        {isDesktop ? (
          <div
            className="Wrapper"
            style={{
              display: 'flex',
              gap: '1rem',
              overflow: 'hidden',
            }}
          >
            {/* Filter Sidebar */}
            <div className="listingFilters" ref={filterRef} style={{ padding: '1rem' }}>
              <ListingFilters onFilterChange={handleFilterChange} />
            </div>

            {/* Listing Content */}
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
              <SearchBar onSearch={setPropertyData} onSortChange={handleSortChange} />
              <Content />
              <PropertyListingCard
                name={decodeURIComponent(name)}
                type={type}
                onOpenBackdrop={handleOpen}
                propertyData={propertyData}
                propertyTypeFilter={propertyTypeFilter}
                priceRangeFilter={priceRangeFilter}
                projectStatusFilter={projectStatusFilter}
                loading={loading}
              />
              <FaqSection />
            </div>
          </div>
        ) : (
          <PropertyListingCardMobile propertyData={propertyData} onOpenBackdrop={handleOpen} />
        )}

        <CustomBackdrop open={backdropOpen} onClose={handleClose}>
          <PropertyPageFloatingContact name={selectedPropertyName} />
        </CustomBackdrop>
      </Wrapper>
    </Suspense>
  );
};

export default PropertyListingPage;
