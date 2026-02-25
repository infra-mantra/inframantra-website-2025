import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  FaSchool,
  FaBus,
  FaClinicMedical,
  FaDumbbell,
  FaUtensils,
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
import { renderToStaticMarkup } from "react-dom/server";

/* ---------- FIT BOUNDS ---------- */
const FitBounds = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    if (!coordinates.length) return;
    map.fitBounds(L.latLngBounds(coordinates), { padding: [40, 40] });
  }, [coordinates, map]);
  return null;
};

/* ---------- ICON MAP ---------- */
const ICON_MAP = {
  Schools: FaSchool,
  "Schools/Colleges": MdSchool,
  "Bus Stop": FaBus,
  Hospitals: FaClinicMedical,
  Clinic: FaClinicMedical,
  "Gym Fitnes": FaDumbbell,
  "Shopping Centers/Malls": FaCartShopping,
  Temple: FaPrayingHands,
  Clothing: FaTshirt,
  "College and Universitie": FaUniversity,
  "Food Other": FaIceCream,
  "Business Hubs": BiSolidBusiness,
  Connectivity: ImRoad,
};

/* ---------- CREATE CUSTOM MARKER ICON ---------- */
export const createMarkerIcon = ({ selected = false, type }) => {
  const IconComponent = ICON_MAP[type] || FaMapMarkerAlt;
  const iconHTML = renderToStaticMarkup(<IconComponent />);

  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
        ${
          selected
            ? `<span class="ripple"></span><span class="ripple delay"></span>`
            : ""
        }
        <div style="
          width:26px;height:26px;background:#e7b554;border-radius:50%;
          display:flex;justify-content:center;align-items:center;
          color:#000;font-size:17px;z-index:3;
          box-shadow: 0 0 0 3px #fff, 0 6px 14px rgba(0,0,0,0.35);
        ">
          ${iconHTML}
        </div>
      </div>
      <style>
        .ripple {
          position:absolute;width:26px;height:26px;border-radius:50%;
          border:2px solid rgba(231,181,84,0.8);
          animation:ripple 3s ease-out infinite;
        }
        .delay { animation-delay:1.5s; }
        @keyframes ripple {
          0% { transform:scale(1); opacity:0.9; }
          60% { transform:scale(2.4); opacity:0.35; }
          100% { transform:scale(3.2); opacity:0; }
        }
      </style>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

/* ---------- MAIN COMPONENT ---------- */
const LandmarkMap = ({ property, landmarks, selected, onSelect, type }) => {
  const [route, setRoute] = useState([]);
  const [searchMarker, setSearchMarker] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const selectedMarkerRef = useRef(null);


  /* ---------- SAFE PROPERTY ---------- */
  const safeProperty = useMemo(() => {
    if (!property) return null;
    const lat = Number(property.lat);
    const lng = Number(property.lng);
    return isNaN(lat) || isNaN(lng) ? null : { ...property, lat, lng };
  }, [property]);

  /* ---------- SAFE LANDMARKS ---------- */
  const safeLandmarks = useMemo(() => {
    return (landmarks || []).filter(
      (l) =>
        typeof l?.lat === "number" &&
        typeof l?.lng === "number" &&
        !isNaN(l.lat) &&
        !isNaN(l.lng)
    );
  }, [landmarks]);

  /* ---------- SAFE SELECTED ---------- */
  const safeSelected = useMemo(() => {
    if (!selected) return null;
    const lat = Number(selected.lat);
    const lng = Number(selected.lng);
    return isNaN(lat) || isNaN(lng) ? null : { ...selected, lat, lng };
  }, [selected]);

  /* ---------- ROUTE TARGET ---------- */
  const routeTarget = useMemo(() => {
    const t = safeSelected || searchMarker;
    if (!t) return null;
    const lat = Number(t.lat);
    const lng = Number(t.lng);
    return isNaN(lat) || isNaN(lng) ? null : { ...t, lat, lng };
  }, [safeSelected, searchMarker]);

  /* ---------- FETCH ROUTE ---------- */
  useEffect(() => {
    if (!safeProperty || !routeTarget) return setRoute([]);

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${safeProperty.lng},${safeProperty.lat};${routeTarget.lng},${routeTarget.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        setDistance((data.routes[0].distance / 1000).toFixed(2));
        setDuration((data.routes[0].duration / 60).toFixed(1));

        const coords = data.routes[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );
        setRoute(coords);
      } catch (e) {
        console.error("Route error", e);
      }
    };

    fetchRoute();
  }, [safeProperty, routeTarget]);

  if (!safeProperty) return null;

  const showAllLandmarks = !safeSelected && !searchMarker;
  const showOnlySelectedLandmark = safeSelected && !searchMarker;

  const bounds = useMemo(() => {
    const arr = [[safeProperty.lat, safeProperty.lng]];
    if (routeTarget) arr.push([routeTarget.lat, routeTarget.lng]);
    if (showAllLandmarks)
      safeLandmarks.forEach((l) => arr.push([l.lat, l.lng]));
    route.forEach((r) => arr.push(r));
    return arr;
  }, [safeProperty, routeTarget, safeLandmarks, route, showAllLandmarks]);

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={[safeProperty.lat, safeProperty.lng]}
        zoom={14}
        style={{ height: 400 }}
      >
         <TileLayer
    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  />

  {/* Labels (roads, places, locality names) */}
  <TileLayer
    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
  />

        {/* PROPERTY */}
        <Marker
          position={[safeProperty.lat, safeProperty.lng]}
          icon={createMarkerIcon({ selected: true, type: "Property" })}
        >
          <Popup>{safeProperty.name}</Popup>
        </Marker>

        {/* LANDMARKS */}
        {showAllLandmarks &&
          safeLandmarks.map((l, i) => (
            <Marker
              key={i}
              position={[l.lat, l.lng]}
              icon={createMarkerIcon({ selected: false, type: l.type })}
              eventHandlers={{
                click: () => {
                  onSelect(l);
                  setSearchMarker(null);
                },
              }}
            >
              <Popup>{l.name}</Popup>
            </Marker>
          ))}

        {/* SELECTED */}
        {showOnlySelectedLandmark && (
          <Marker
            ref={selectedMarkerRef}
            position={[safeSelected.lat, safeSelected.lng]}
            icon={createMarkerIcon({ selected: true, type })}
          >
            <Popup>{safeSelected.name}</Popup>
          </Marker>
        )}

        {/* ROUTE */}
        {route.length > 0 && (
          <>
            <Polyline positions={route} color="#000" weight={4} opacity={0.25} />
            <Polyline positions={route} color="#000" weight={2} opacity={0.95} />
          </>
        )}

        <FitBounds coordinates={bounds} />
      </MapContainer>

      {distance && duration && safeSelected && (
        <div className="popUpMark">
          <strong>{safeSelected.name}</strong>
          <div>Distance: {selected?.distance} km</div>
          <div>Time: ~{duration} min</div>
        </div>
      )}
    </div>
  );
};

export default LandmarkMap;
