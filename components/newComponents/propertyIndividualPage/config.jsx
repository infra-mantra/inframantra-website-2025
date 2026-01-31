import React, { useState, useEffect } from "react";
import ModalView from "./fullViewImage";
import DownloadBrochure from "./downloadBrochure";
import PopUpForm from "../../detailSections/CTA_NEW";

/* ---------------- PROPERTY CARD ---------------- */

function PropertyCard({ item, onImageClick }) {
  return (
    <div className="property-card">
      <img
        src={item.floorImg}
        alt={item.configuration}
        onClick={() => onImageClick(item.floorImg)}
      />
      <div className="card-content">
        <h3>{item.price}</h3>
        <hr />
        <div className="row">
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

  // ✅ FIX: ensure default tab always works after refresh
  useEffect(() => {
    if (floorPlan.length) {
      setActiveTab(floorPlan[0].configuration);
    }
  }, [floorPlan]);

  const tabs = [...new Set(floorPlan.map(item => item.configuration))];
  const cards = floorPlan.filter(item => item.configuration === activeTab);

  const onClickOff = (val) => setPopForm(val);
  const handleBrochureClick = () => setPopForm(true);

  return (
    <div className="Config-wrapper">
      <h2 className="Header">Signature Daxin Floor Plans & Pricing</h2>

      {/* ---------------- TABS ---------------- */}
      <ul className="near-location scrollbar-hide">
        {tabs.map(tab => (
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
            onImageClick={(img) => {
              setSelectedImage(img);
              setShowModal(true);
            }}
          />
        ))}

        <DownloadBrochure onClick={handleBrochureClick} />
      </div>

      {/* ---------------- MODAL ---------------- */}
      {showModal && (
        <ModalView
          image={selectedImage}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ---------------- POPUP FORM ---------------- */}
      <PopUpForm
        popUpenable={popForm}
        onClickOff={onClickOff}
        text="To download brochure"
        pdf={pdfUrl}
        name={name}
      />
    </div>
  );
}

export default Config;
