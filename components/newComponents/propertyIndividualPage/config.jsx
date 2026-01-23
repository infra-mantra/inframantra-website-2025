import React, { useState } from "react";
import ModalView from "./fullViewImage";
import DownloadBrochure from "./downloadBrochure";
import PopUpForm from "../../detailSections/CTA_NEW";

function PropertyCard({ item, onImageClick }) {
  return (
    <div className="property-card">
      <img src={item.floorImg} alt={item.configuration} onClick={() => onImageClick(item.floorImg)} />
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
  const [activeTab, setActiveTab] = useState(floorPlan?.[0]?.configuration);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  const pdfUrl = "/dummy/brochure.pdf";
  const name = "Dummy Project Name";

  const tabs = [...new Set(floorPlan.map(item => item.configuration))];
  const cards = floorPlan.filter(item => item.configuration === activeTab);
   const [popForm, setPopForm] = useState(false);
   const onClickOff = (val) =>setPopForm(val)
   const handleBrochureClick = () => setPopForm(true);


  return (
    <div className="Config-wrapper">
      <h2 className="Header">Signature Daxin Floor Plans & Pricing</h2>

      <ul className="near-location scrollbar-hide">
        {tabs.map(tab => (
          <li key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
            {tab}
          </li>
        ))}
      </ul>

      <div className="cards-grid">
        {cards.map((item, index) => (
          <PropertyCard key={index} item={item} onImageClick={(img) => { setSelectedImage(img); setShowModal(true); }} />
        ))}

        <DownloadBrochure onClick={handleBrochureClick} />
      </div>

      {showModal && <ModalView image={selectedImage} onClose={() => setShowModal(false)} />}

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
