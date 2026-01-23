import React, { useState } from 'react';
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./map"), {
  ssr: false,
});

import {
  FaSchool,
  FaBus,
  FaHospital,
  FaClinicMedical,
  FaDumbbell,
  FaUtensils,
  FaPrayingHands,
  FaTshirt,
  FaUniversity,
  FaIceCream,
  FaMapMarkerAlt,
} from 'react-icons/fa';

// 🔁 Icon map based on DB title
const ICON_MAP = {
  Schools: <FaSchool />,
  'Bus Stop': <FaBus />,
  Hospitals: <FaHospital />,
  Clinic: <FaClinicMedical />,
  'Gym Fitnes': <FaDumbbell />,
  Restaurant: <FaUtensils />,
  Temple: <FaPrayingHands />,
  Clothing: <FaTshirt />,
  'College and Universitie': <FaUniversity />,
  'Food Other': <FaIceCream />,
};

const LandMark = ({ propertyData ,propertyInfo }) => {
  const [activeTab, setActiveTab] = useState(
    propertyData?.localityGuide?.[0]?.title || ''
  );
  const [activeLandmark, setActiveLandmark] = useState(null);

  const tabs = propertyData?.localityGuide || [];

  // ✅ Convert DB format → UI format + inject icon
  const rawData = tabs.find(({ title }) => title === activeTab);

  const currentData = rawData
    ? {
        title: rawData.title,
        items: rawData.guideList.map(({ name, distance, lat, lon }) => ({
          name,
          distance,
          lat,
          lng: lon,
          icon: ICON_MAP[rawData.title] || <FaMapMarkerAlt />,
          type: rawData.title, // optional: useful for map
        })),
      }
    : { title: '', items: [] };

  const PROPERTY_LOCATION = {
    name: propertyInfo.name,
    lat: propertyInfo.lat,
    lng: propertyInfo.lon,
  };

  return (
    <div className="pd">
      <h2 className="Header">Nearby Landmarks - {propertyInfo.name}</h2>

      <section className="white-box location-map-section">
        <div className="white-box-body">
          <div className="d-map-box">
            <div className="map">
              <LeafletMap
                property={PROPERTY_LOCATION}
                landmarks={currentData.items}
                selected={activeLandmark}
                onSelect={setActiveLandmark}
                type={activeTab}
              />
            </div>

            <ul className="near-location scrollbar-hide">
              {tabs.map((tab) => (
                <li
                  key={tab.title}
                  className={activeTab === tab.title ? 'active' : ''}
                  onClick={() => {
                    setActiveTab(tab.title);
                    setActiveLandmark(null);
                  }}
                >
                  <span className="tab-icon">
                    {ICON_MAP[tab.title] || <FaMapMarkerAlt />}
                  </span>
                  {tab.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="near-distance-box active">
            <table className="near-distance table-responsive">
              <thead>
                <tr>
                  <th colSpan="2">
                    <strong>{currentData.title} Near By {propertyInfo.name}</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.items.map((item, i) => (
                  <tr key={i} onClick={() => setActiveLandmark(item)}>
                    <td>{item.name}</td>
                    <td>
                      <FaMapMarkerAlt /> {item.distance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LandMark;
