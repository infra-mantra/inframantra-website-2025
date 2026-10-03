import React, { useState, useEffect, useRef } from "react";

import ModalSlider from "./Modal.jsx";
import Propertycard from "./PropertyCard.jsx";
import PopUpForm from "../shared/forms/CTANEW.jsx";

function PropertyHeaderHigh({ propertyData, name }) {
  const [isHighlightModalOpen, setIsHighlightModalOpen] = useState(false);
  const [showAll] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [popForm, setPopForm] = useState(false);
  const onClickOff = (val) => setPopForm(val);
  const handleform = () => setPopForm(true);

  const leftRef = useRef(null);
  const rightRef = useRef(null);

  let areaText = propertyData.area || "";
  if (areaText && !/sq\.?\s*ft/i.test(areaText)) {
    areaText = `${areaText} Sq.Ft.`;
  }

  const highlights = propertyData.keyHighlights || [];
  const descriptions = propertyData.description || [];

  // 5 highlights by default; on wide screens the fit effect below may show fewer
  // (never under 3) when the About text is too short to match their height.
  const [maxVisible, setMaxVisible] = useState(5);
  const visibleHighlights = highlights.slice(0, maxVisible);
  const hiddenCount = highlights.length - maxVisible;

  const aboutText = descriptions[0] || "";

  // Split only on a full stop followed by whitespace, so numbers like "3.5bhk"
  // or "1.5km" aren't broken into "3. 5bhk".
  const sentences = aboutText
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const PREVIEW_SENTENCES = 3;

  // On wide screens the Highlights column is often taller than the overview card
  // + About. Show more of the About text until the two columns roughly line up.
  const [previewFit, setPreviewFit] = useState({
    count: PREVIEW_SENTENCES,
    done: false,
    gen: 0,
  });

  const aboutPreview =
    sentences.length > previewFit.count
      ? sentences.slice(0, previewFit.count).join(" ")
      : aboutText;

  // Show "Read more" if the first paragraph is cut OR there are more paragraphs
  const hasExtraParagraphs = descriptions.length > 1;
  const aboutTruncated = sentences.length > previewFit.count || hasExtraParagraphs;

  // Refit from scratch when the window size changes
  useEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        setMaxVisible(5);
        setPreviewFit((f) => ({
          count: PREVIEW_SENTENCES,
          done: false,
          gen: f.gen + 1,
        }));
      }, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // One sentence per pass: add while the left column is shorter than the
  // highlights column; take the last one back if it made the left clearly taller.
  useEffect(() => {
    if (previewFit.done) return;
    const left = leftRef.current;
    const right = rightRef.current;
    // two columns side by side only above 1100px (stacked below, see CSS)
    if (!left || !right || window.innerWidth <= 1100) return;
    const id = requestAnimationFrame(() => {
      const gap = right.offsetHeight - left.offsetHeight;
      if (gap < -24 && previewFit.count > PREVIEW_SENTENCES) {
        setPreviewFit((f) => ({ ...f, count: f.count - 1, done: true }));
      } else if (gap > 24 && previewFit.count < sentences.length) {
        setPreviewFit((f) => ({ ...f, count: f.count + 1 }));
      } else if (gap > 60 && maxVisible > 3) {
        // About is fully shown and still short: show one highlight fewer
        // (the rest stay behind "Read more (+N)"), then measure again
        setMaxVisible((n) => n - 1);
        setPreviewFit((f) => ({ ...f, gen: f.gen + 1 }));
      } else {
        setPreviewFit((f) => ({ ...f, done: true }));
      }
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewFit, sentences.length]);

  const locationText = [
    propertyData?.subLocality?.name,
    propertyData?.locality?.name,
    propertyData?.city?.name,
  ]
    .filter(Boolean)
    .join(", ");

  const handleRedirect = (lat, lng) => {
    const url = `https://maps.google.com/?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <header className="property-header-high">
        <div className="property-header-main">
          <div className="property-header-title">
            <h1 className="propertyPageHeaderMobilePropertyTitle">{propertyData.name}</h1>
            <p className="property-header-sub">
              {locationText && <span>{locationText}</span>}
              {propertyData?.developer?.name && (
                <span>
                  by <strong>{propertyData.developer.name}</strong>
                </span>
              )}
            </p>
          </div>

          <div className="property-header-images">
            <img
              src={propertyData.propertyLogo[0]}
              alt={`${propertyData.name} logo`}
              className="logo_individual_page"
            />
            <button
              type="button"
              className="property-map-btn"
              aria-label={`View ${propertyData.name} on Google Maps`}
              onClick={() =>
                handleRedirect(propertyData.coordinates.lat, propertyData.coordinates.lng)
              }
            >
              <img
                className="arrow-logo"
                src="/propertyIndividualPage/icons/arrowlogo.png"
                alt=""
              />
              <span className="property-map-btn-label">View on map</span>
            </button>

            <img
              className="property-image"
              src={propertyData.developer.developerImg}
              alt={`${propertyData.developer.name} logo`}
            />
          </div>
        </div>
      </header>

      <div className="property-container">
        <div className="card-container">
          <section id="Overview">
            <div className="card-60" ref={leftRef}>
              <div className="card card-width">
                {/* Price Section */}
                <div className="price-section">
                  <img
                    src="/propertyIndividualPage/icons/tag.png"
                    alt="Price Tag"
                    className="price-tag-icon"
                  />
                  <div className="price-text">
                    Starting at ₹ <span className="font-clr">{propertyData.startingPrice}</span>
                  </div>
                  <div className="yellow-line"></div>
                </div>

                <div className="boldline1"></div>

                {/* Info Section */}
                <div className="info-section">
                  <div className="status-group">
                    <div className="status-item">
                      <img
                        src="/propertyIndividualPage/icons/construction.png"
                        alt="Under Construction"
                        className="status-icon"
                      />
                      <div>
                        <div className="status-label">Project Status</div>
                        <div className="status-value">{propertyData.status}</div>
                      </div>
                    </div>
                    <span className="separator">|</span>
                    <div className="status-item">
                      <div className="status-group">
                        <img
                          src="/propertyIndividualPage/icons/locationPoint.png"
                          alt="Location"
                          className="status-icon"
                        />
                        <div>
                          <div className="status-label">Location</div>
                          <div className="status-value">
                            {propertyData?.subLocality?.name} , {propertyData.locality.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rera-hover-container">
                    <button className="rera-btn">
                      RERA NO.
                      <span className="info-icon">i</span>
                    </button>

                    <div className="rera-hover-box">
                      <h3>RERA INFO</h3>
                      <p>
                        {/* RERA-registered shield */}
                        <svg
                          className="rera-shield"
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z"
                            fill="currentColor"
                          />
                          <path
                            d="m8.5 12 2.4 2.4 4.6-4.8"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Rera No.
                      </p>
                      <p className="rera-number">{propertyData.rera}</p>
                    </div>
                  </div>
                </div>

                <div className="boldline1"></div>

                <div className="units-section">
                  {[
                    {
                      Key: "Configuration",
                      value: `${propertyData.configuration}`,
                      image: "/propertyIndividualPage/icons/configration.png",
                    },
                    {
                      Key: "Area",
                      value: `${areaText}`,
                      image: "/propertyIndividualPage/icons/area.png",
                    },
                    {
                      Key: "Price/Sq.ft",
                      value: `₹ ${propertyData.squarePrice}`,
                      image: "/propertyIndividualPage/icons/pricePerSqt.png",
                    },
                    {
                      Key: "Possession",
                      value: `${propertyData.possesion}`,
                      image: "/propertyIndividualPage/icons/posseion.png",
                    },
                  ].map((config, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="unit-separator">|</span>}

                      <div className="unit-item">
                        <div className="unit-icon">
                          <img src={config.image} alt={`${config.Key} Icon`} />
                        </div>

                        <div className="unit-text-wrapper">
                          <div className="unit-label">{config.Key}</div>
                          <div className="unit-config">{config.value}</div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="dis-none-desktop">
                <Propertycard propertyData={propertyData} area={areaText} />
              </div>

              <section id="About Project">
                <div className="about-container">
                  <div className="about-wrapper">
                    <h2 className="Header">About Project</h2>
                    <div className="about-project">
                      <p className="about-preview p-text">{aboutPreview}</p>
                      {aboutTruncated && (
                        <button
                          type="button"
                          className="read-more-btn"
                          onClick={() => setIsAboutModalOpen(true)}
                          aria-haspopup="dialog"
                        >
                          Read more...
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>

          <section id="Highlights">
            <div className="container-card" ref={rightRef}>
              <div className="card card-width-high">
                <div className="higlight-list ">
                  <h2 className=" Header">Project Highlights</h2>
                  <ul className={`ul-highlight ${showAll ? "expanded" : "clamped"}`}>
                    {visibleHighlights.map((item, index) => (
                      <li key={index} className="p-text d-flex align-items-start">
                        <div>
                          <span className="projectHighlightListBullet"> </span>
                        </div>
                        <span className="highlight-text">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {!showAll && hiddenCount > 0 && (
                    <button
                      type="button"
                      className="read-more-btn"
                      onClick={() => setIsHighlightModalOpen(true)}
                      aria-haspopup="dialog"
                    >
                      Read more (+{hiddenCount})
                    </button>
                  )}
                </div>
              </div>

              <div className="highlight-wrappers cta-w">
                <button
                  style={{ background: "#e7b554" }}
                  className="card-bg card card-ct-wt animation"
                  onClick={handleform}
                >
                  Request More Information or a Callback
                </button>
              </div>
            </div>
          </section>
        </div>

        <ModalSlider
          title="Project Highlights"
          isOpen={isHighlightModalOpen}
          onClose={() => setIsHighlightModalOpen(false)}
          name={name}
        >
          <ul className="ul-highlight full-list">
            {highlights.map((item, index) => (
              <li key={index} className="p-text d-flex align-items-start">
                <div>
                  <span className="projectHighlightListBullet"> </span>
                </div>
                <span className="highlight-text">{item}</span>
              </li>
            ))}
          </ul>
        </ModalSlider>

        <ModalSlider
          title="About Project"
          isOpen={isAboutModalOpen}
          onClose={() => setIsAboutModalOpen(false)}
          name={name}
          id="propertyIndividualHigh"
        >
          <div className="about-full-text">
            {descriptions.map((item, index) => (
              <p key={index} className="about-project p-text">
                {item}
              </p>
            ))}
          </div>
        </ModalSlider>
      </div>

      <PopUpForm
        popUpenable={popForm}
        onClickOff={onClickOff}
        text="TO CONNECT WITH OUR PROPERTY ADVISOR "
        name={name}
        id="propertyIndividualHighlight"
      />
    </>
  );
}

export default PropertyHeaderHigh;