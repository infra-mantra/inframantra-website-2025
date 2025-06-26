import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropertyListingCard from '../../components/newComponents/propertyListingDesktopNav/propertyListing/propertyListingCard.jsx';
import PropertyListingDesktopNav from '../../components/newComponents/propertyListingDesktopNav/propertyListingDesktopNav.jsx';
import PropertyListingCardMobile from '../../components/newComponents/propertyListingPage/propertyListingCardMobile.jsx';
import CustomBackdrop from '../../components/newComponents/backdrop/backdrop.jsx';
import Wrapper from '../../components/UI/Wrapper';
import PropertyPageFloatingContact from '../../components/newComponents/propertyData/propertyRightSection/propertyPageSections/propertyPageFloatingContact.jsx';
// import Ajax1 from '../components/helper/Ajax1';
import Ajax1 from '../../components/helper/Ajax1'; // Adjust the import path as necessary

const PropertyListingPage = ({}) => {
    const router = useRouter();
    const { type } = router.query;
    const name = router.query.name || router.asPath?.split('/').pop() || '';
    const [isDesktop, setIsDesktop] = useState(true);
    const [propertyDataSet, setPropertyDataSet] = useState([]);
    const [selectedPropertyName, setSelectedPropertyName] = useState('');
    const [propertyTypeFilter, setPropertyTypeFilter] = useState(null);
    const [priceRangeFilter, setPriceRangeFilter] = useState([1000000, 800000000]);
    const [projectStatusFilter, setProjectStatusFilter] = useState(null);


  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 768); // Adjust the threshold for desktop here
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);
  useEffect(() => {
    const searchPara = localStorage.getItem('search');
    const searchParams = searchPara ? JSON.parse(searchPara) : {};
    const searchParams1 = localStorage.getItem('SearchNames');
    const searchParams2 = searchParams1 ? JSON.parse(searchParams1) : [];


    const fetchData = async (url, data) => {
      try {
        debugger
        const response = await Ajax1({
          method: 'POST',
          url: url,
          data: data
        });
        setPropertyDataSet(response.data.data.projectList);
      } catch (error) {
        console.error('Error making the POST request:', error);
      }
    };

    if (searchParams2.length > 0) {
      const payload = { names: { names: searchParams2.map(item => item.title) } };
      fetchData('/property/searchName', payload);
    } else {
      fetchData('/property/search', {type:"locality", name:name});
    }
  }, []);

  const [backdropOpen, setBackdropOpen] = useState(false);

  const handleClose = () => {
    setBackdropOpen(false);
    setSelectedPropertyName('');
  };

  const handleOpen = (name) => {
    setSelectedPropertyName(name);
    setBackdropOpen(true);
  };

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
            // name={decodeURIComponent(propertyDataSet[0]?.city?.name)}
            type={type}
            onOpenBackdrop={handleOpen}
            propertyData={propertyDataSet} // Pass the fetched property data
            propertyTypeFilter={propertyTypeFilter}
            priceRangeFilter={priceRangeFilter}
            projectStatusFilter={projectStatusFilter}
          />
        </>
      ) : (
        <PropertyListingCardMobile
          propertyData={propertyDataSet}
          onOpenBackdrop={handleOpen} // Pass handleOpen as prop
         
        />
      )}
      <CustomBackdrop open={backdropOpen} onClose={handleClose}>
        <PropertyPageFloatingContact name={selectedPropertyName} />
      </CustomBackdrop>
    </Wrapper>
  );
};

export default PropertyListingPage;
