import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom } from 'swiper';
import 'swiper/swiper-bundle.css';
import PropertyWrapper from './propertyWrapper';

function FloorPlan({ floorPlan = [] ,name}) {
  const defaultTabValue = floorPlan.length > 0 ? String(floorPlan[0].configuration) : '1';
  const [value, setValue] = useState(defaultTabValue);
  const [modalImage, setModalImage] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const openModal = (imgSrc) => {
    setModalImage(imgSrc);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <>
    <PropertyWrapper id="floorPlan">
      <div className="aboutProjectWrapper">
        <h2 className="aboutProjectHeader">Floor Plans And Price Lists</h2>
        <div className="floorPlanTabsContainer">
          {floorPlan.map((floor) => (
            <button
              key={floor.configuration}
              className={`tab-button ${value === String(floor.configuration) ? 'active' : ''}`}
              onClick={() => handleChange(null, String(floor.configuration))}
            >
              {floor.configuration}
            </button>
          ))}
        </div>
        {floorPlan.map((floor) => (
          <div
            key={floor.configuration}
            className={`tab-panel ${value === String(floor.configuration) ? 'active' : ''}`}
          >
            <div className="floorPlanDesignContainer">
              
                  <div className="swiper-zoom-container">
                    <img
                      src={floor.floorImg}
                      alt={name+"floor plan "}
                      className="floorPlanDesignImg toZoom"
                      onClick={() => openModal(floor.floorImg)}
                    />
                  </div>
                
              <div className="floorPlanDesignValuesContainer">
                {Object.entries(floor).map(([key, value]) => (
                  key !== 'floorImg' && (
                    <div key={key} className="floorPlanDesignValuesFlex">
                      <p>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</p>
                      <p>{value}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
     
    </PropertyWrapper>
     {modalImage && (
      <div className="modal" onClick={closeModal}>
        <span className="close" onClick={closeModal}>&times;</span>
        <img className="modal-content" src={modalImage} alt="Zoomed Floor Plan" />
   
      </div>
    )}
   </>
  );
}

export default FloorPlan;