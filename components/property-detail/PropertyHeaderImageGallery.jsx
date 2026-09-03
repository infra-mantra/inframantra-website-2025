import React, { useState, useEffect, useCallback, useRef } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
// Deep import: `from "lodash"` pulls the whole library (~72 KB) into this
// chunk, and this component is on the property page's critical path.
import debounce from "lodash/debounce";
import Ajax1 from "../lib/ajax1.js";
import { slugify } from "../../utils/slugify.js";
import { useRouter } from "next/router";
// Deep imports: the `@mui/icons-material` barrel re-exports thousands of icons.
import RoofingOutlined from "@mui/icons-material/RoofingOutlined";
import MapOutlined from "@mui/icons-material/MapOutlined";
import RoomOutlined from "@mui/icons-material/RoomOutlined";
import styles from "./SearchBar.module.css"; // make sure path is correct
import Form from "../shared/forms/StickyProperty.jsx";
// CSS module so this sheet ships with the pages that need it instead of with
// every page via _app.js. The `phg` binding must stay used: Next tree-shakes a
// CSS-module import whose binding is unused and then emits none of its CSS.
// WANT_HASH = false (next.config.js) means phg["x"] resolves to the identical
// unhashed name "x", so the rendered markup is byte-for-byte unchanged.
import phg from "./PropertyHeaderImageGallery.module.css";

const toGalleryItems = (items, name) =>
  (items || []).map((img) => ({
    original: img.url,
    thumbnail: img.thumbnail || img.url,
    originalAlt: name,
    thumbnailAlt: name,
  }));

function PropertyHeaderImageGallery({
  imageGallery = [],
  projectName = "DAXIN VISTA",
  propertyData,
  search = true,
}) {
  const router = useRouter();
  const boxRef = useRef(null);
  // Built eagerly from props rather than in an effect. As deferred state this
  // started empty on the server, so the early return below shipped
  // "No images available" as the property page's SSR HTML and the LCP image only
  // appeared after hydration. The effect still syncs later prop changes.
  const [galleryImages, setgalleryImages] = useState(() =>
    toGalleryItems(imageGallery, projectName)
  );

  useEffect(() => {
    setgalleryImages(toGalleryItems(imageGallery, projectName));
  }, [imageGallery, projectName]);

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggested, setSuggestions] = useState([]);

  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // ---- enquiry form state (replace with your own form/component if you have one) ----
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // TODO: wire this to your API / Ajax1 call
    console.log("Enquiry submitted:", form);
  };
  // ----------------------------------------------------------------------------------

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

    setSearchValue();
    setSuggestions([]);
    fetchSuggestions.cancel();
    setIsSearchExpanded(false);
  };

  if (!galleryImages || galleryImages.length === 0) {
    return <div className={phg["propertyPageHeaderImgSection"]}>No images available</div>;
  }

  return (
    <div className={phg["propertyPageHeaderImgSection"]}>
      <div className={phg["left-gradient-overlay"]}></div>

      <div className={phg["orgbg"]}>
        <img
          src={propertyData.propertyLogo[0]}
          alt="Logo"
          className={phg["developer-logo-floating"]}
        />
      </div>
      {search && (
        <div className={phg["top-right-actions"]}>
          {!isSearchExpanded && (
            <div className={phg["collapsed-icons"]}>
              <button
                className={`${phg["icon-btn"]} search-trigger-btn`}
                onClick={() => setIsSearchExpanded(true)}
                aria-label="Open Search"
              >
                <img src="/propertyIndividualPage/search.png" alt="Search" />
              </button>
            </div>
          )}

          {isSearchExpanded && (
            <div className={phg["expanded-search-bar"]} ref={boxRef}>
              <div className={phg["search-input-container-inline"]}>
                <img
                  src="/propertyIndividualPage/search.png"
                  alt=""
                  className={phg["search-icon-inline"]}
                />
                <input
                  type="text"
                  placeholder="Search by project name, location, builder..."
                  className={phg["search-input-inline"]}
                  value={searchValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  autoFocus
                />
              </div>

              <button className={phg["search-button-inline"]} onClick={handleSubmit}>
                Search
              </button>

              <button
                className={phg["close-search-btn"]}
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
      )}

      {/* Desktop: gallery + form side by side. Mobile: gallery only (with bottom thumbnails) */}
      <div className={isDesktop ? "gallery-with-form" : "gallery-only"}>
        <div className="gallery-wrapper">
          <ImageGallery
            key={galleryImages?.[0]?.original}
            items={galleryImages}
            thumbnailPosition="bottom"
            showThumbnails={!isDesktop}
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

        {isDesktop && (
          <aside className="property-side-form">
            <Form name={propertyData.name} />
          </aside>
        )}
      </div>
    </div>
  );
}

export default React.memo(PropertyHeaderImageGallery);
