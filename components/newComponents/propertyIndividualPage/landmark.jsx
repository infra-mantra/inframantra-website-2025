import React, { useState } from 'react';
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./map"), {
  ssr: false,
});

import {
  FaSchool,
  FaBus,
  FaClinicMedical,
  FaDumbbell,
  FaPrayingHands,
  FaTshirt,
  FaUniversity,
  FaIceCream,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { MdSchool } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { ImRoad } from "react-icons/im";
import { BiSolidBusiness } from "react-icons/bi";


const ICON_MAP = {
  Schools: <FaSchool />,
  'Schools/Colleges':<MdSchool />,
  'Bus Stop': <FaBus />,
  'Hospitals': <FaClinicMedical />,
  Clinic: <FaClinicMedical />,
  'Gym Fitnes': <FaDumbbell />,
  "Shopping Centers/Malls": <FaCartShopping />,
  Temple: <FaPrayingHands />,
  Clothing: <FaTshirt />,
  'College and Universitie': <FaUniversity />,
  'Food Other': <FaIceCream />,
  'Business Hubs':<BiSolidBusiness/>,
  'Connectivity':<ImRoad/>
  
};

async function findClosestGuide(property, guideList) {
    let closestGuide = null;
    let minDistance = Infinity;

    for (let i = 0; i < guideList.length; i++) {
        const guide = guideList[i];

        if (guide.lat && guide.lon) {
            const url = `https://router.project-osrm.org/route/v1/driving/${property.lat},${property.lng};${guide.lon},${guide.lat}?overview=full&geometries=geojson`;

            try {
                const res = await fetch(url);
                const data = await res.json();

                const distance = (data.routes[0].distance / 1000).toFixed(2); // km
                const duration = (data.routes[0].duration / 60).toFixed(1); // minutes

                // Store distance and duration in guide object
                guide.distance = distance;
                guide.duration = duration;

                console.log(`Guide ${i} - Distance: ${distance} km, Duration: ${duration} min`);

                // Check if this guide is the closest
                if (distance < minDistance) {
                    minDistance = distance;
                    closestGuide = guide;
                }

            } catch (error) {
                console.error(`Error fetching route for guide ${i}:`, error);
            }
        }
    }

    if (closestGuide) {
        console.log("Closest Guide:", closestGuide);
        return closestGuide;
    } else {
        console.log("No valid guides found.");
        return null;
    }
}

// Example usage




const LandMark = ({ propertyData ,propertyInfo }) => {
  const [activeTab, setActiveTab] = useState(
    propertyData?.localityGuide?.[0]?.title || ''
  );
  const [activeLandmark, setActiveLandmark] = useState(null);

  const tabs = propertyData?.localityGuide || [];
 const PROPERTY_LOCATION = {
    name: propertyInfo.name,
    lat: propertyInfo.lat,
    lng: propertyInfo.lon,
  };


 
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
          type: rawData.title, 
        })),
      }
    : { title: '', items: [] };

 

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
