import React, { useState, useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import ModalSlider from "./modal";
import Propertycard from "./propertyCard";


function PropertyHeaderHigh({ propertyData }) {
  const [isHighlightModalOpen, setIsHighlightModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const highlightRef = useRef(null);
  const leftRef = useRef(null);


  const highlights = propertyData.keyHighlights

  const maxVisible = 5;
  const visibleHighlights = highlights.slice(0, maxVisible);
  const hiddenCount = highlights.length - maxVisible;

  const aboutText = propertyData.description[0];

  const sentences = aboutText
    .split(".")
    .map((s) => s.trim())
    .filter(Boolean);
  const PREVIEW_SENTENCES = 3;
  const aboutPreview =
    sentences.length > PREVIEW_SENTENCES
      ? sentences.slice(0, PREVIEW_SENTENCES).join(". ") + "."
      : aboutText;

  const handleRedirect = (lat, lng) => {
    const url = `https://maps.google.com/?q=${lat},${lng}`;
    window.open(url, "_blank");
  };


  return (
    <>
      <header className="property-header-high">
        <div className="property-header-title ">
          <h1 className="propertyPageHeaderMobilePropertyTitle">
            {propertyData.name}
          </h1>
        </div>

        <div className="property-header-images">
          <img
            className="arrow-logo"
            src="https://propertyindividual.inframantra.com/assests/arrowlogo.png"
            alt="Arrow Logo"
            onClick={() =>
              handleRedirect(propertyData.coordinates.lat, propertyData.coordinates.lng)}
          />
          <img
            className="property-image"
            src={propertyData.developer.developerImg}
            alt="Signature Global Daxin Vistas"
          />
        </div>
      </header>
      <div className="property-container">
        {/* Header Section */}

        <div className="card-container">
          <div className="card-60" ref={leftRef}>
            <div className="card card-width">
              {/* Price Section */}
              <div className="price-section">
                <img
                  src="https://propertyindividual.inframantra.com/assests/tag.png"
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
                      src="https://propertyindividual.inframantra.com/assests/construction.png"
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
                        alt="Under Construction"
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
                      <FontAwesomeIcon
                        icon={faBell}
                        className="bell-pendulum"
                      />{" "}
                      Rera No. - {propertyData.rera}
                    </p>
                  </div>
                </div>
              </div>

              <div className="boldline1"></div>

              {/* Units */}
              <div className="units-section">
                {[
                  {
                    Key: "Configuration",
                    value: `${propertyData.configuration}`,
                    image: '/propertyIndividualPage/icons/configration.png ',
                  },
                  { Key: "Area", value: `${propertyData.area}`, image: "/propertyIndividualPage/icons/area.png" },
                  { Key: "Price/Sq.ft", value: `₹ ${propertyData.squarePrice}`, image: "/propertyIndividualPage/icons/pricePerSqt.png" },
                  { Key: "Possession", value: `${propertyData.possesion}`, image: "/propertyIndividualPage/icons/posseion.png" },
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
              <Propertycard />
            </div>

            <div className="about-container">
              <div className="about-wrapper">
                <h2 className="Header">About Project</h2>
                <div className="about-project">
                  <p className="about-preview p-text">
                    {aboutPreview}
                    {
                      <button
                        className="read-more-btn"
                        onClick={() => setIsAboutModalOpen(true)}
                      >
                        Read more...
                      </button>
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="container-card">
            <div className="card card-width-high">
              <div className="higlight-list ">
                <h2 className=" Header">Project Highlights</h2>
                <ul
                  className={`ul-highlight ${showAll ? "expanded" : "clamped"}`}
                >
             {visibleHighlights.map((item, index) => (
  <li key={index} className="p-text d-flex align-items-start">
    <span className="projectHighlightListBullet">{" "}</span>
    <span className="highlight-text">{item}</span>
  </li>
))}
                </ul>

                {!showAll && hiddenCount > 0 && (
                  <button
                    className="read-more-btn"
                    onClick={() => setIsHighlightModalOpen(true)}
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
              >
                Request More Information or a Callback
              </button>
            </div>
          </div>
        </div>

        <ModalSlider
          title="Project Highlights"
          isOpen={isHighlightModalOpen}
          onClose={() => setIsHighlightModalOpen(false)}
        >
          <ul className="ul-highlight full-list">
            {highlights.map((item, index) => (
             <li key={index} className="p-text d-flex align-items-start">
    <span className="projectHighlightListBullet">{" "}</span>
    <span className="highlight-text">{item}</span>
  </li>
            ))}
          </ul>
        </ModalSlider>
        <ModalSlider
          title="About Project"
          isOpen={isAboutModalOpen}
          onClose={() => setIsAboutModalOpen(false)}
        >
          <div className="about-full-text">
            <p className="about-project p-text">{aboutText}</p>
          </div>
        </ModalSlider>
      </div>
    </>
  );
}

export default PropertyHeaderHigh;
