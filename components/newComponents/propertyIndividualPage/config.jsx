import React, { useState } from "react";
import ModalView from "./fullViewImage";
import DownloadBrochure from "./downloadBrochure";

function PropertyCard({ item, onImageClick }) {
  return (
    <div className="property-card">
      <img
        src={item.floorImg}
        alt={item.configuration}
        onClick={() => onImageClick(item.floorImg)}
        style={{ cursor: "pointer" }}
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

function Config({ floorPlan }) {
  const [activeTab, setActiveTab] = useState(floorPlan?.[0]?.configuration || null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const tabs = [...new Set(floorPlan.map(item => item.configuration))];
  const cards = floorPlan.filter(item => item.configuration === activeTab);

  const openModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <div className="Config-wrapper">
      <h2 className="Header">Signature Daxin Floor Plans & Pricing</h2>

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

      <div className="cards-grid">
        {cards.map((item, index) => (
          <PropertyCard
            key={index}
            item={item}
            onImageClick={openModal}
          />
        ))}
        <DownloadBrochure />
      </div>

      {showModal && (
        <ModalView image={selectedImage} onClose={closeModal} />
      )}
    </div>
  );
}

export default Config;
