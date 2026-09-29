import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
// Deep import: `from "lodash"` pulls the whole library (~72 KB) into this
// chunk, and this component is on the property page's critical path.
import debounce from "lodash/debounce";
import Ajax1 from "../lib/ajax1.js";
import { slugify } from "../../utils/slugify.js";
import { useRouter } from "next/router";
// Same outline icons as the home page search.
import { MdOutlineRoofing, MdOutlineMap, MdOutlineRoom } from "react-icons/md";
// Holds the desktop gallery + form layout. The binding must stay used (see the
// note on `phg` below), so the layout class names are read through it.
import styles from "./SearchBar.module.css";
import Form from "../shared/forms/StickyProperty.jsx";
// CSS module so this sheet ships with the pages that need it instead of with
// every page via _app.js. The `phg` binding must stay used: Next tree-shakes a
// CSS-module import whose binding is unused and then emits none of its CSS.
// WANT_HASH = false (next.config.js) means phg["x"] resolves to the identical
// unhashed name "x", so the rendered markup is byte-for-byte unchanged.
import phg from "./PropertyHeaderImageGallery.module.css";

// YouTube video id from watch?v=, youtu.be/, /embed/, /shorts/ or /live/ URLs.
const getYouTubeId = (url) => {
  if (!url) return null;
  const match = String(url).match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
};

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
  // Desktop photo-stack look: "fan" (tilted cards), "deck" (straight cards in
  // the corner) or "glass" (frosted strip of thumbnails).
  stackVariant = "deck",
}) {
  const router = useRouter();
  const boxRef = useRef(null);
  const galleryRef = useRef(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoFrameRef = useRef(null);
  const videoId = getYouTubeId(propertyData?.videoUrl?.[0]);
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
  const [suggestLoading, setSuggestLoading] = useState(false); // skeleton rows while fetching

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
        setSuggestLoading(false);
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
      } finally {
        setSuggestLoading(false);
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
    setSuggestions([]);
    setSuggestLoading(!!value.trim()); // show skeleton immediately (fetch is debounced)
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

  // Desktop: open the gallery in full size, optionally jumping to a given photo.
  const openFullView = (index) => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    if (typeof index === "number") gallery.slideToIndex(index);
    gallery.fullScreen();
  };

  // Walkthrough video popup. The slideshow pauses while it's open.
  const openVideo = () => {
    galleryRef.current?.pause();
    setIsVideoOpen(true);
  };
  const closeVideo = () => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    setIsVideoOpen(false);
    galleryRef.current?.play();
  };
  // Play the popup video full screen (the player's own fullscreen button works too).
  const toggleVideoFullscreen = () => {
    const frame = videoFrameRef.current;
    if (!frame) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else if (frame.requestFullscreen) {
      frame.requestFullscreen().catch(() => {});
    } else if (frame.webkitRequestFullscreen) {
      frame.webkitRequestFullscreen(); // older Safari
    }
  };

  useEffect(() => {
    if (!isVideoOpen) return;
    const onKey = (e) => e.key === "Escape" && !document.fullscreenElement && closeVideo();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoOpen]);

  // Layered deck: the YouTube video (when the property has one) sits in front,
  // followed by a few photos from the gallery.
  const stackItems = [];
  if (videoId) {
    stackItems.push({
      key: `video-${videoId}`,
      isVideo: true,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      thumbnailAlt: `${projectName} walkthrough video`,
    });
  }
  // Fixed photos (2nd, 3rd, …) rather than "next after the current slide", so
  // the stack stays put while the banner auto-plays.
  const photoSlots = Math.min(3 - stackItems.length, galleryImages.length - 1);
  for (let i = 1; i <= photoSlots; i++) {
    const index = i;
    stackItems.push({ ...galleryImages[index], index, key: `${index}-${galleryImages[index].original}` });
  }

  // Overlays drawn through the gallery's custom-controls slot, so they sit
  // inside the visible photo rather than the wider wrapper around it: the left
  // white fade, the project logo on top of it (top-left corner, all sizes) and
  // the photo stack (desktop only).
  const renderPhotoStack = () =>
    isDesktop && stackItems.length > 0 ? (
      <div className={phg["photo-stack"]} data-variant={stackVariant}>
        <div className={phg["photo-stack-deck"]}>
          {stackItems
            .map((item, depth) => ({ item, depth }))
            .reverse()
            .map(({ item, depth }) => (
              <button
                key={item.key}
                type="button"
                className={`${phg["photo-stack-card"]} ${item.isVideo ? phg["photo-stack-video"] : ""}`}
                style={{ "--depth": depth }}
                onClick={() => (item.isVideo ? openVideo() : openFullView(item.index))}
                aria-label={
                  item.isVideo
                    ? `Play ${projectName} walkthrough video`
                    : `View photo ${item.index + 1} in full size`
                }
              >
                <img src={item.thumbnail} alt={item.thumbnailAlt} loading="lazy" />
                {item.isVideo && (
                  <span className={phg["photo-stack-play"]} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
        </div>
      </div>
    ) : null;

  const renderOverlays = () => (
    <>
      <div className={phg["left-gradient-overlay"]} />
      {propertyData?.propertyLogo?.[0] && (
        <div className={phg["orgbg"]}>
          <img
            src={propertyData.propertyLogo[0]}
            alt={`${projectName} logo`}
            className={phg["developer-logo-floating"]}
          />
        </div>
      )}
      {renderPhotoStack()}
    </>
  );

  // Mobile has no photo stack, so the video goes into the slideshow itself as
  // the 2nd slide (the 1st stays the LCP photo): a poster with a play button,
  // and a thumbnail with a play badge in the strip below.
  const videoPoster = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
  const mobileItems =
    !isDesktop && videoId && galleryImages.length > 0
      ? [
          galleryImages[0],
          {
            original: videoPoster,
            thumbnail: videoPoster,
            originalAlt: `${projectName} walkthrough video`,
            thumbnailAlt: `${projectName} walkthrough video`,
            renderItem: () => (
              <button
                type="button"
                className={phg["video-slide"]}
                onClick={openVideo}
                aria-label={`Play ${projectName} walkthrough video`}
              >
                <img src={videoPoster} alt={`${projectName} walkthrough video`} />
                <span className={phg["video-slide-play"]} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="26" height="26">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                </span>
              </button>
            ),
            renderThumbInner: () => (
              <span className={phg["video-thumb"]}>
                <img src={videoPoster} alt={`${projectName} walkthrough video`} />
                <span className={phg["video-thumb-play"]} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="12" height="12">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                </span>
              </span>
            ),
          },
          ...galleryImages.slice(1),
        ]
      : galleryImages;

  if (!galleryImages || galleryImages.length === 0) {
    return <div className={phg["propertyPageHeaderImgSection"]}>No images available</div>;
  }

  return (
    <div className={phg["propertyPageHeaderImgSection"]}>

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
                <svg
                  className={phg["search-icon-inline"]}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
                  <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  aria-label="Search properties"
                  placeholder="Search project, location or builder"
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
                type="button"
                className={phg["close-search-btn"]}
                onClick={() => setIsSearchExpanded(false)}
                aria-label="Close search"
              >
                ×
              </button>
            </div>
          )}

          {searchValue && (suggested.length > 0 || suggestLoading) && (
            <ul className={phg["search-suggest"]} ref={boxRef}>
              {suggested.length > 0
                ? suggested.map((option, index) => (
                    <li key={index} onClick={() => handleSelect(option)}>
                      <span className={phg["search-suggest-title"]}>
                        {option.type === "property" && <MdOutlineRoofing />}
                        {option.type === "locality" && <MdOutlineMap />}
                        {option.type === "subLocality" && <MdOutlineRoom />}
                        <span>{option.title}</span>
                      </span>
                      <span className={phg["search-suggest-type"]}>
                        {option.type === "subLocality" ? "sub-locality" : option.type}
                      </span>
                    </li>
                  ))
                : [0, 1, 2, 3].map((i) => (
                    <li key={i} className={phg["search-suggest-skel"]} aria-hidden="true">
                      <span className={phg["skel-text"]} />
                      <span className={phg["skel-pill"]} />
                    </li>
                  ))}
            </ul>
          )}
        </div>
      )}

      {/* Desktop: gallery + form side by side. Mobile: gallery only (with bottom thumbnails) */}
      <div className={isDesktop ? styles["gallery-with-form"] : styles["gallery-only"]}>
        <div className={styles["gallery-wrapper"]}>
          <ImageGallery
            ref={galleryRef}
            key={galleryImages?.[0]?.original}
            items={mobileItems}
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
            renderCustomControls={renderOverlays}
          />
        </div>

        {isVideoOpen &&
          videoId &&
          createPortal(
            <div
              className={phg["video-modal"]}
              role="dialog"
              aria-modal="true"
              aria-label={`${projectName} walkthrough video`}
              onClick={closeVideo}
            >
              <div
                className={phg["video-modal-frame"]}
                ref={videoFrameRef}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={phg["video-modal-actions"]}>
                  <button
                    type="button"
                    className={phg["video-modal-btn"]}
                    onClick={toggleVideoFullscreen}
                    aria-label="Play video full screen"
                    title="Full screen"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path
                        d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={phg["video-modal-btn"]}
                    onClick={closeVideo}
                    aria-label="Close video"
                    title="Close"
                  >
                    ×
                  </button>
                </div>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                  title={`${projectName} walkthrough video`}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>,
            document.body
        )}

        {isDesktop && (
          <aside className={styles["property-side-form"]}>
            <Form name={propertyData.name} />
          </aside>
        )}
      </div>
    </div>
  );
}

export default React.memo(PropertyHeaderImageGallery);
