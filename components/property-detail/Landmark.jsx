import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./Map.jsx"), {
  ssr: false,
  // Grey placeholder while the map library loads (no library/JS added here).
  loading: () => (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "320px",
        borderRadius: "12px",
        background: "#e6e8ea",
      }}
    />
  ),
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
} from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { ImRoad } from "react-icons/im";
import { BiSolidBusiness } from "react-icons/bi";
// CSS module so this sheet ships with the pages that need it instead of with
// every page via _app.js. The `lm` binding must stay used: Next tree-shakes a
// CSS-module import whose binding is unused and then emits none of its CSS.
// WANT_HASH = false (next.config.js) means lm["x"] resolves to the identical
// unhashed name "x", so the rendered markup is byte-for-byte unchanged.
import lm from "./Landmark.module.css";

const ICON_MAP = {
  Schools: <FaSchool />,
  "Schools/Colleges": <MdSchool />,
  "Bus Stop": <FaBus />,
  Hospitals: <FaClinicMedical />,
  Clinic: <FaClinicMedical />,
  "Gym Fitnes": <FaDumbbell />,
  "Shopping Centers/Malls": <FaCartShopping />,
  Temple: <FaPrayingHands />,
  Clothing: <FaTshirt />,
  "College and Universitie": <FaUniversity />,
  "Food Other": <FaIceCream />,
  "Business Hubs": <BiSolidBusiness />,
  Connectivity: <ImRoad />,
};

const LandMark = ({ propertyData, propertyInfo, name }) => {
  const [activeTab, setActiveTab] = useState("");
  const [activeLandmark, setActiveLandmark] = useState(null);

  const tabs = propertyData?.localityGuide || [];

  useEffect(() => {
    if (tabs.length) {
      setActiveTab(tabs[0].title);
    }
  }, [name]);

  const rawData = tabs.find(({ title }) => title === activeTab);

  const currentData = rawData
    ? {
        title: rawData.title,
        items: rawData.guideList.map(({ name, distance, lat, lon }) => ({
          name,
          distance,
          lat,
          lng: lon,
          hasLocation: lat != null && lon != null,
          icon: ICON_MAP[rawData.title] || <FaMapMarkerAlt />,
          type: rawData.title,
        })),
      }
    : { title: "", items: [] };

  const PROPERTY_LOCATION = {
    name: propertyInfo?.name,
    lat: propertyInfo?.lat,
    lng: propertyInfo?.lon,
  };

  return (
    <div className="pd">
      <h2 className="Header">Nearby Landmarks - {propertyInfo.name}</h2>

      <section className={`${lm["white-box"]} ${lm["location-map-section"]}`}>
        <div className={lm["white-box-body"]}>
          <div className={lm["d-map-box"]}>
            <div className={lm["map"]}>
              <LeafletMap
                property={PROPERTY_LOCATION}
                landmarks={currentData.items}
                selected={activeLandmark}
                onSelect={setActiveLandmark}
                type={activeTab}
              />
            </div>

            <ul className={`${lm["near-location"]} ${lm["scrollbar-hide"]}`}>
              {tabs.map((tab) => (
                <li
                  key={tab.title}
                  className={activeTab === tab.title ? "active" : ""}
                  onClick={() => {
                    setActiveTab(tab.title);
                    setActiveLandmark(null);
                  }}
                >
                  <span className="tab-icon">{ICON_MAP[tab.title] || <FaMapMarkerAlt />}</span>
                  {tab.title}
                </li>
              ))}
            </ul>
          </div>

          <div className={`${lm["near-distance-box"]} ${lm["active"]}`}>
            <table className={`${lm["near-distance"]} ${lm["table-responsive"]}`}>
              <thead>
                <tr>
                  <th colSpan="2">
                    <strong>
                      {currentData.title} Nearby {propertyInfo.name}
                    </strong>
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
