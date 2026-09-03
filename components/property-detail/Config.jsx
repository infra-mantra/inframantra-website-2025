import React, { useState, useEffect } from "react";
import ModalView from "./FullViewImage.jsx";
import DownloadBrochure from "./DownloadBrochure.jsx";
import PopUpForm from "../shared/forms/CTANEW.jsx";
// CSS module so this sheet ships with the pages that need it instead of with
// every page via _app.js. The `cfg` binding must stay used: Next tree-shakes a
// CSS-module import whose binding is unused and then emits none of its CSS.
// WANT_HASH = false (next.config.js) means cfg["x"] resolves to the identical
// unhashed name "x", so the rendered markup is byte-for-byte unchanged.
import cfg from "./Config.module.css";

/* ---------------- PROPERTY CARD ---------------- */

function PropertyCard({ item, onImageClick, name }) {
  return (
    <div className={cfg["property-card"]}>
      <img
        src={item.floorImg}
        alt={item.configuration}
        onClick={() => onImageClick(item.floorImg)}
      />
      <div className={cfg["card-content"]}>
        <h3>{item.price}</h3>
        <hr />
        <div className={cfg["row"]}>
          <span>Super Area</span>
          <span>{item.superArea}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- CONFIG ---------------- */

function Config({ floorPlan = [], pdf, name }) {
  const [activeTab, setActiveTab] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [popForm, setPopForm] = useState(false);

  const pdfUrl = pdf;

  useEffect(() => {
    if (floorPlan.length) {
      setActiveTab(floorPlan[0].configuration);
    }
  }, [floorPlan]);

  const tabs = [...new Set(floorPlan.map((item) => item.configuration))];
  const cards = floorPlan.filter((item) => item.configuration === activeTab);

  const onClickOff = (val) => setPopForm(val);
  const handleBrochureClick = () => setPopForm(true);

  return (
    <div className={cfg["Config-wrapper"]}>
      <h2 className="Header">{name} Floor Plans & Pricing</h2>

      {/* ---------------- TABS ---------------- */}
      <ul className="near-location scrollbar-hide">
        {tabs.map((tab) => (
          <li
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>

      {/* ---------------- CARDS ---------------- */}
      <div className="cards-grid">
        {cards.map((item, index) => (
          <PropertyCard
            key={index}
            item={item}
            name={name}
            onImageClick={(img) => {
              setSelectedImage(img);
              setShowModal(true);
            }}
          />
        ))}

        <DownloadBrochure onClick={handleBrochureClick} />
      </div>

      {/* ---------------- MODAL ---------------- */}
      {showModal && <ModalView image={selectedImage} onClose={() => setShowModal(false)} />}

      {/* ---------------- POPUP FORM ---------------- */}
      <PopUpForm
        popUpenable={popForm}
        onClickOff={onClickOff}
        text="To download brochure"
        pdf={pdfUrl}
        name={name}
        id="propertyIndividualDownloadBroc"
      />
    </div>
  );
}

export default Config;
