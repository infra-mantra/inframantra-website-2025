import Image from "next/image";
import { useState } from "react";

const SelectLocation = (props) => {
  const [locationPopup, setLocationPopup] = useState(true);

  const locationPopupHandler = () => {
    locationPopup ? setLocationPopup(false) : setLocationPopup(true);
  };

  return (
    <>
      {locationPopup && (
        <div className="select-location-popup">
          <div className="select-location-inner">
            <div className="form-head">
              <h3>Select your location</h3>
              <div className="close-btn" onClick={locationPopupHandler}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M11 1L1 11"
                    stroke="#E7B554"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1 1L11 11"
                    stroke="#E7B554"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="row">
              <div
                className="select-location-grid"
                onClick={locationPopupHandler}
              >
                <div className="image">
                  <Image src="/assets/images/delhi.png" layout="fill" />
                </div>
                <p>Delhi</p>
              </div>
              <div
                className="select-location-grid"
                onClick={locationPopupHandler}
              >
                <div className="image">
                  <Image src="/assets/images/noida.png" layout="fill" />
                </div>
                <p>Noida</p>
              </div>
              <div
                className="select-location-grid"
                onClick={locationPopupHandler}
              >
                <div className="image">
                  <Image src="/assets/images/gurgaon.png" layout="fill" />
                </div>
                <p>Gurgaon</p>
              </div>
              <div
                className="select-location-grid"
                onClick={locationPopupHandler}
              >
                <div className="image">
                  <Image src="/assets/images/pune.png" layout="fill" />
                </div>
                <p>Pune</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {locationPopup && (
        <div className="modal-overlay" onClick={locationPopupHandler}></div>
      )}
    </>
  );
};


export default SelectLocation;
