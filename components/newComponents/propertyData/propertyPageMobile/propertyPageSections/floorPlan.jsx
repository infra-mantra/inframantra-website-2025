import React, { useState } from 'react';
import PropertyWrapper from './propertyWrapper';
// import './propertySectionStyles.css';

function FloorPlan({ floorPlan = [] }) {
  const defaultTabValue = floorPlan.length > 0 ? String(floorPlan[0].configuration) : '1';
  const [value, setValue] = useState(defaultTabValue);
  const [modalImage, setModalImage] = useState(null);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const openModal = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <PropertyWrapper id="floorPlan">
      <div className="aboutProjectWrapper">
        <h2 className="aboutProjectHeader">Floor Plans And Price List</h2>
        <div className="floorPlanTabsContainer">
          {floorPlan.map((floor) => (
            <button
              key={floor.configuration}
              className={`tab-button ${value === String(floor.configuration) ? 'active' : ''}`}
              onClick={() => handleChange(String(floor.configuration))}
            >
              {floor.configuration.replace(/\s+/g, '')}
            </button>
          ))}
        </div>
        {floorPlan.map((floor) => (
          <div
            key={floor.configuration}
            className={`tab-panel ${value === String(floor.configuration) ? 'active' : ''}`}
          >
            <div className="floorPlanDesignContainer">
              <img
                src={floor.floorImg}
                alt={name+"floor plan "}
                className="floorPlanDesignImg toZoom"
                onClick={() => openModal(floor.floorImg)}
              />
              <div className="floorPlanDesignValuesContainer">
                <div className="floorPlanDesignValuesFlex">
                  <p>Price</p>
                  <p>{floor.price}</p>
                </div>
                {floor.superArea && (
                  <div className="floorPlanDesignValuesFlex">
                    <p>Super Area</p>
                    <p>{floor.superArea}</p>
                  </div>
                )}
                {floor.carpetArea && (
                  <div className="floorPlanDesignValuesFlex">
                    <p>Carpet Area</p>
                    <p>{floor.carpetArea}</p>
                  </div>
                )}
                <div className="floorPlanDesignValuesFlex">
                  <p>Configuration</p>
                  <p>{floor.configuration.replace(/\s+/g, '')}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {modalImage && (
          <div className="modal" onClick={closeModal}>
            <span className="close" onClick={closeModal}>&times;</span>
            <img className="modal-content" src={modalImage} alt="Zoomed Floor Plan" />
          </div>
        )}
      </div>
    </PropertyWrapper>
  );
}

export default FloorPlan;