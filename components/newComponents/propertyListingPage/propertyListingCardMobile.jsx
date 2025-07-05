import React, { useState, useEffect, useRef } from "react";
import { FaHome, FaCaretDown } from "react-icons/fa";
import { TfiRulerAlt2 } from "react-icons/tfi";
import { CiClock2 } from "react-icons/ci";
import Link from "next/link";
import PropertyListingSearch from "../propertyListingDesktopNav/propertyListingSearch/propertyListingSearch";
import PropertyListingPageMobileFilter from "./propertyListingFilter";
import { useRouter } from "next/router";
import styles from "./propertyListingCardMobile.module.css";

const propertyListCardStyles = {
  paper: {
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow:
      "rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px",
    width: "100%",
    height: "32vh",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: "10px",
    padding: "2%",
    overflow: "hidden",
    position: "relative",
  },
  locationSelectPaper: {
    height: "max-content",
    width: "max-content",
    position: "absolute",
    top: "24.5%",
    left: "33%",
    borderRadius: "12px",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: "100",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
};

const cities = ["Gurgaon", "Pune", "Ghaziabad", "Noida"];

function PropertyListingCardMobile({ propertyData, onOpenBackdrop, name, type }) {
  const router = useRouter();
  const { city } = router.query;

  const [currentCityDropDown, setCurrentCityDropDown] = useState(false);
  const [selectedCity, setSelectedCity] = useState(city || "Gurgaon");
  const [fetchedProperties, setFetchedProperties] = useState(propertyData || []);
  const [selected, setSelected] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState({
    unitType: [],
    configuration: [],
    status: [],
    priceRange: {
      range: [10000000, 80000000],
      label: "Price",
    },
  });

  const dropdownRef = useRef(null);

  const [state, setState] = useState({
    bottom: false,
  });

  useEffect(() => {
    setFetchedProperties(propertyData);
  }, [propertyData, city]);

  const searchData = propertyData.map((property) => ({
    name: property?.name,
    location: property?.subLocality?.name,
  }));

  function applyPropertyFilters(properties, filters) {
    return properties.filter((property) => {
      const priceInCr = parseFloat(
        property.startingPrice
          .replace("₹", "")
          .replace(" Cr", "")
          .replace(/,/g, "")
      );
      const priceInNumber = priceInCr * 10000000;
      const [minPrice, maxPrice] = filters.priceRange.range;

      const isPriceInRange =
        (minPrice < 10000000 && maxPrice >= 80000000) ||
        (priceInNumber >= minPrice && priceInNumber <= maxPrice);

      const propertyConfigs = property.configuration
        .replace(/\s/g, "")
        .toUpperCase()
        .split(/[/,&]/);

      const isConfigMatch =
        filters.configuration.length === 0 ||
        filters.configuration.some((config) =>
          propertyConfigs.includes(config.replace(/\s/g, "").toUpperCase())
        );

      const isStatusMatch =
        filters.status.length === 0 ||
        filters.status.includes(property.status.trim());

      return isPriceInRange && isConfigMatch && isStatusMatch;
    });
  }

  const toggleDrawer = (open) => () => {
    setState({ bottom: open });
  };

  const handleCityChange = () => {
    setCurrentCityDropDown((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setCurrentCityDropDown(false);
    }
  };

  const handleSortChange = (e) => {
    const sortOption = e.target.value;
    let sortedProperties = [...fetchedProperties];
    if (sortOption === "Low to High") {
      sortedProperties.sort(
        (a, b) => parseFloat(a.priceInFigure) - parseFloat(b.priceInFigure)
      );
    } else if (sortOption === "High to Low") {
      sortedProperties.sort(
        (a, b) => parseFloat(b.priceInFigure) - parseFloat(a.priceInFigure)
      );
    } else if (sortOption === "Newest") {
      sortedProperties.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    setFetchedProperties(sortedProperties);
  };

  useEffect(() => {
    applyFilters(appliedFilters);
  }, [appliedFilters, propertyData]);

  const options = ["Low to High", "High to Low", "Newest"];

  const handleCityNameChange = (city) => {
    const initialFilters = {
      unitType: [],
      configuration: [],
      status: [],
      priceRange: {
        range: [10000000, 80000000],
        label: "Price",
      },
    };
    setAppliedFilters(initialFilters);

    setSelectedCity(city);
    setCurrentCityDropDown(false);

    router.push({
      pathname: "/property-listing/[type]/[name]",
      query: { type: "city", name: city },
    });
  };

  const handleViewMorePropertyClick = (id) => {
    router.push(`/property/${id}`);
  };

  const handleSelected = (data) => {
    const filtered = propertyData.filter(
      (property) =>
        property.name.toLowerCase().includes(data.toLowerCase()) ||
        property.locality.name.toLowerCase().includes(data.toLowerCase()) ||
        property.subLocality.name.toLowerCase().includes(data.toLowerCase())
    );
    setFetchedProperties(filtered);
  };

  const handleResetValues = () => {
    setFetchedProperties(propertyData);
    setAppliedFilters({
      unitType: [],
      configuration: [],
      status: [],
      priceRange: {
        range: [10000000, 80000000],
        label: "Price",
      },
    });
  };

  const handleOnClear = () => {
    setFetchedProperties(propertyData);
    setSelected(null);
  };

  useEffect(() => {
    if (currentCityDropDown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentCityDropDown]);

  const applyFilters = (filters) => {
    const filtered = propertyData.filter((property) => {
      const matchesUnitType =
        filters.unitType.length === 0 ||
        filters.unitType.includes(property.propertyType.title);

      const configNumbers = filters.configuration.map((config) =>
        parseInt(config.match(/\d+/)?.[0])
      );
      const propertyConfigNum = parseInt(property.configuration.match(/\d+/)?.[0]);

      const matchesConfiguration =
        filters.configuration.length === 0 || configNumbers.includes(propertyConfigNum);

      const matchesStatus =
        filters.status.length === 0 ||
        filters.status.some(
          (status) => status.toLowerCase() === property.status.toLowerCase()
        );

      const price = parseInt(property.priceInFigure || "0");
      const matchesPrice =
        price >= filters.priceRange.range[0] &&
        price <= filters.priceRange.range[1];

      return matchesUnitType && matchesConfiguration && matchesStatus && matchesPrice;
    });

    setAppliedFilters(filters);
    setFetchedProperties(filtered);
  };



  return (
    <>
      <div className={styles.propertyListingCardWrapper}>
        <div className={styles.propertyPageListNavWrapper}>
          <PropertyListingSearch searchData={searchData}  onSelected={handleSelected} onClear={handleOnClear}/>
          <div>
            <button
              className={styles.propertyListingFilterBtn}
              onClick={toggleDrawer(true)}
            >
              Filters <img src="/icons/filterIcon.svg" alt="filter icons "/ >
            </button>
            {state.bottom && (
              <div style={{ height: "95vh" }} className={styles.swipable_drawer}>
                <PropertyListingPageMobileFilter
                  toggleDrawer={toggleDrawer(false)}
                  applyFilters={applyFilters}
                  currentFilters={appliedFilters}
                  handleResetValues={handleResetValues}
/>
              </div>
            )}
          </div>
        </div>

        <div className={styles.propertyListPageSectionFlex}>
          <div className={styles.propertyListPageSectionHeaderFlex}>
            <p className={styles.propertyListPageSectionHeaderLocation}>
              Properties In
              <span style={{ color: "#DCAA4C", marginLeft: "6px" }}>
                {selectedCity}
              </span>
              <FaCaretDown
                onClick={handleCityChange}
                style={{ fontSize: "25px", cursor: "pointer" }}
              />
            </p>
            {currentCityDropDown && (
              <div
                ref={dropdownRef}
                style={propertyListCardStyles.locationSelectPaper}
              >
                {cities.map((city) => (
                  <p
                    style={{
                      cursor: "pointer",
                      color: selectedCity === city ? "#DCAA4C" : "#000",
                    }}
                    key={city}
                    onClick={() => handleCityNameChange(city)}
                  >
                    {city}
                  </p>
                ))}
              </div>
            )}
            <div className={styles.propertyListingSelectWrapper}>
            <select className={styles.propertyListingSelect} onChange={handleSortChange}>
                              <option>Sort By</option>
                               {options.map((option, index) => (
                               <option key={index} value={option}>
                                    {option}
                                 </option>
  ))}
</select>
            </div>
          </div>
          {fetchedProperties.length > 0 &&
            fetchedProperties.map((property) => (
              <div key={property.slug} className={styles.propertyListingCardMobile}>
                <div className={styles.propertyListPageMobileImgSection}>
                  <img
                    src={property.imageGallery[0].url}
                    alt={property.title}
                    className={styles.propertyListingImage}
                  />
               
                  {property.exclusive && (
                    <div className={styles.propertyImageChip}>
                      <span className={styles.propertyListPageMobileImageChip}>
                        Exclusive
                      </span>
                    </div>
                  )}
                  {property.featured && (
                    <div className={styles.propertyImageChip}>
                      <span className={styles.propertyListPageMobileImageChip}>
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                <div className={styles.propertyListPageMobileDetailSection}>
                  <div className={styles.propertyListPageMobileDetailHeader}>
                    <div className={styles.propertyListPageMobileDetailLocation}>
                      <h3>{property.name}</h3>
                      <p>
                        {property.subLocality.name},{property.city.name}
                      </p>
                    </div>
                    <div className={styles.propertyListPageMobileDetailLocation}>
                      <p>Starting Price</p>
                      <h3 style={{ color: "#dcaa4c", fontSize: "18px" }}>
                        {property.startingPrice}
                      </h3>
                    </div>
                  </div>
                  <div className={styles.propertyListPageMobileDetailOverview}>
                    <div className={`${styles.propertyListPageMobileDetailOverviewValueFlex} ${styles.FlexValueMobile}`}>
                      <FaHome className={styles.propertyListingPageIcon} />
                      <p>{property.configuration}</p>
                    </div>
                    <div className={`${styles.propertyListPageMobileDetailOverviewValueFlex} ${styles.FlexValueMobile}`}>
                      <TfiRulerAlt2 className={styles.propertyListingPageIcon} />
                      <p>{property.area}</p>
                    </div>
                    <div className={`${styles.propertyListPageMobileDetailOverviewValueFlex} ${styles.FlexValueMobile}`}>
                      <CiClock2 className={styles.propertyListingPageIcon} />
                      <p>{property.possesion}</p>
                    </div>
                  </div>
                  <div className={styles.propertyListPageMobileDetailBtnWrapper}>
                    <button
                      className={styles.searchbutton}
                      style={{ padding: '5px 25px', borderRadius: '5px',height:'30px' }}
                      onClick={() => handleViewMorePropertyClick(property.slug)}
                    >
                      View More
                    </button>
                    <button
                      className={styles.searchbutton}
                      style={{ padding: '5px 25px', borderRadius: '5px', backgroundColor: '#0b6e21', height:'30px' }}
                      onClick={() => onOpenBackdrop(property.name)}
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          
        </div>
      </div>
    </>
  );
}

export default PropertyListingCardMobile;
