// pages/property-listing/[type]/[name].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropertyListingCard from '../../../components/newComponents/propertyListingDesktopNav/propertyListing/propertyListingCard.jsx';
import PropertyListingDesktopNav from '../../../components/newComponents/propertyListingDesktopNav/propertyListingDesktopNav.jsx';
import PropertyListingCardMobile from '../../../components/newComponents/propertyListingPage/propertyListingCardMobile.jsx';
import CustomBackdrop from '../../../components/newComponents/backdrop/backdrop.jsx';
import Wrapper from '../../../components/UI/Wrapper';

import PropertyPageFloatingContact from '../../../components/newComponents/propertyData/propertyRightSection/propertyPageSections/propertyPageFloatingContact.jsx';

const PropertyListingPage = ({ propertyData }) => {
  const router = useRouter();
  const { type, name } = router.query;
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  
  
  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 769); // Adjust the threshold for desktop here
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  const [backdropOpen, setBackdropOpen] = useState(false);
  const [selectedPropertyName, setSelectedPropertyName] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(null);
  const [priceRangeFilter, setPriceRangeFilter] = useState([1000000, 800000000]);
  const [projectStatusFilter, setProjectStatusFilter] = useState(null);

  const handleClose = () => {
    setBackdropOpen(false);
    setSelectedPropertyName('');
  };

  const handleOpen = (name) => {
    setSelectedPropertyName(name);
    setBackdropOpen(true);
  };

  const [fetchedData , setFetchedData] = useState([]);
  useEffect(() => {
    setFetchedData(propertyData.data.properties);
    
  })
  const handleFilterChange = (type, value) => {
    if (type === 'propertyType') {
      setPropertyTypeFilter(value);
    } else if (type === 'priceRange') {
      setPriceRangeFilter(value);
    } else if (type === 'projectStatus') {
      setProjectStatusFilter(value);
    }
  };


  return (
    <Wrapper>
      {isDesktop ? (
        <>
          <PropertyListingDesktopNav
            currentCitySearch={name}
            onFilterChange={handleFilterChange}
            propertyTypeFilter={propertyTypeFilter}
            priceRangeFilter={priceRangeFilter}
            projectStatusFilter={projectStatusFilter}
          />
          <PropertyListingCard
            name={decodeURIComponent(name)}
            type={type}
            onOpenBackdrop={handleOpen}
            propertyData={fetchedData} // Pass the fetched property data
            propertyTypeFilter={propertyTypeFilter}
            priceRangeFilter={priceRangeFilter}
            projectStatusFilter={projectStatusFilter}
          />
        </>
      ) : (
        <PropertyListingCardMobile 
         
          propertyData={fetchedData} 
          onOpenBackdrop={handleOpen} 
        />
      )}
      <CustomBackdrop open={backdropOpen} onClose={handleClose}>
        <PropertyPageFloatingContact name={selectedPropertyName} />
      </CustomBackdrop>
    </Wrapper>
  );
};

export async function getStaticPaths() {
  const res = await fetch(`${process.env.apiUrl1}/property/locationData`);
  const properties = await res.json();

  const paths = properties.data.map((property) => ({
    params: { type: property.type, name: property.name },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { type, name } = params;

  const res = await fetch(`${process.env.apiUrl1}/property/location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, name, page: 1, limit: 70 }),
  });
  const data = await res.json();
  return {
    props: {
      propertyData: data,
    },
    revalidate: 10,
  };
}

export default PropertyListingPage;
