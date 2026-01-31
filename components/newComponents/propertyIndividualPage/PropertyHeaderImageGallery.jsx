import React, { useState, useEffect, useCallback, useRef } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { debounce } from "lodash";
import Ajax1 from "../../helper/Ajax1";
import { slugify } from "../../../utils/slugify";
import { useRouter } from "next/router";
import { RoofingOutlined, MapOutlined, RoomOutlined } from "@mui/icons-material";
import styles from "./searchBar.module.css"; // make sure path is correct

function PropertyHeaderImageGallery({
  imageGallery = [],
  projectName = "DAXIN VISTA",
  propertyData
}) {
  const router = useRouter();
  const boxRef = useRef(null);
  
  const[galleryImages , setgalleryImages] = useState(imageGallery.map((img) => ({
    original: img.url,
    thumbnail: img.thumbnail || img.url,
    originalAlt: projectName,
    thumbnailAlt: projectName,
  })))

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggested, setSuggestions] = useState([]);

  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const fetchSuggestions = useCallback(
    debounce(async (value) => {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await Ajax1({
          url: `/suggest`,
          method: "GET",
          params: { q: value },
        });
        setSuggestions(response?.data?.suggestions || []);
      } catch (err) {
        console.error("Suggestion error:", err);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsDesktop(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    fetchSuggestions(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    fetchSuggestions.cancel();
    setSuggestions([]);
    const encoded = slugify(searchValue, { lower: true });
    router.push(`/property-listing/search/${encoded}`);
    setIsSearchExpanded(false);
  };

  const handleSelect = (option) => {
    const encodedTitle = slugify(option.title.split(",")[0], { lower: true });
    switch (option.type) {
      case "property":
        router.push(`/property/${option.slug}`);
        break;
      case "locality":
      case "subLocality":
      case "city":
      case "state":
        router.push(`/property-listing/${option.type}/${encodedTitle}`);
        break;
      default:
        break;
    }

    setSearchValue(option.title);
    setSuggestions([]);
    fetchSuggestions.cancel();
    setIsSearchExpanded(false);
  };

  if (!imageGallery || imageGallery.length === 0) {
    return <div className="propertyPageHeaderImgSection">No images available</div>;
  }



  return (
    <div className="propertyPageHeaderImgSection">
      <div className="left-gradient-overlay"></div>

      <div className="orgbg">
        <img
          src={propertyData.propertyLogo[0]}
          alt="Logo"
          className="developer-logo-floating"
        />
      </div>

      {isSearchExpanded && (
        <div
          className="search-overlay"
          onClick={() => setIsSearchExpanded(false)}
        />
      )}

      <div className="top-right-actions">
        {!isSearchExpanded && (
          <div className="collapsed-icons">
            <button
              className="icon-btn search-trigger-btn"
              onClick={() => setIsSearchExpanded(true)}
              aria-label="Open Search"
            >
              <img src="/propertyIndividualPage/search.png" alt="Search" />
            </button>
          </div>
        )}

        {isSearchExpanded && (
          <div className="expanded-search-bar" ref={boxRef}>
            <div className="search-input-container-inline">
              <img src="/propertyIndividualPage/search.png" alt="" className="search-icon-inline" />
              <input
                type="text"
                placeholder="Search by project name, location, builder..."
                className="search-input-inline"
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                autoFocus
              />
            </div>

            <button className="search-button-inline" onClick={handleSubmit}>
              Search
            </button>

            <button
              className="close-search-btn"
              onClick={() => setIsSearchExpanded(false)}
            >
              ×
            </button>
          </div>
        )}

        {suggested.length > 0 && searchValue && (
          <ul className={`${styles.listbox} mts`} ref={boxRef}>
            {suggested.map((option, index) => (
              <li key={index} onClick={() => handleSelect(option)}>
                <span>
                  {option.type === "property" && <RoofingOutlined />}
                  {option.type === "locality" && <MapOutlined />}
                  {option.type === "subLocality" && <RoomOutlined />}
                  {option.title}
                </span>
                <span className={styles.optionType}>
                  {option.type === "subLocality" ? "sub-locality" : option.type}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ImageGallery
        items={galleryImages}
        thumbnailPosition={isDesktop ? "right" : "bottom"}
        showPlayButton
        showFullscreenButton
        showNav
        lazyLoad
        additionalClass="property-image-gallery"
        autoPlay
        slideInterval={3000}
        slideDuration={450}
        infinite
      />
    </div>
  );
}

export default React.memo(PropertyHeaderImageGallery);
