import React, { useEffect, useState ,useRef} from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
} from "react-icons/fa";
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

/* ---------- ICON MAPPING (FIXED) ---------- */
const iconMap = {
  "Schools": FaSchool,
  "Bus Stop": FaBus,
  "Hospital": FaHospital,
  "Clinic": FaClinicMedical,
  "Gym": FaDumbbell,
  "Restaurant": FaUtensils,
  "Temple": FaPrayingHands,
  "Clothing": FaTshirt,
  "College": FaUniversity,
  "Food": FaIceCream,
  "Property": FaMapMarkerAlt,
  "Search": FaMapMarkerAlt,
};

/* ---------- CREATE CUSTOM MARKER ICON ---------- */
export const createMarkerIcon = ({ selected = false, type }) => {
  const IconComponent = iconMap[type] || FaMapMarkerAlt; 
  const iconHTML = renderToStaticMarkup(<IconComponent />);

  return L.divIcon({
    className: "",
    html: `
      <div style="
        position:relative;
        width:36px;
        height:36px;
        display:flex;
        align-items:center;
        justify-content:center;
      ">

        ${selected ? `
          <span class="ripple"></span>
          <span class="ripple delay"></span>
        ` : ""}

        <div style="
          width:26px;
          height:26px;
          background:#e7b554;
          border-radius:50%;
          display:flex;
          justify-content:center;
          align-items:center;
          color:#000;
          font-size:17px;
          z-index:3;
          box-shadow: 0 0 0 3px #fff, 0 6px 14px rgba(0,0,0,0.35);
        ">
          ${iconHTML}
        </div>
      </div>

      <style>
        .ripple {
          position: absolute;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid rgba(231, 181, 84, 0.8);
          box-shadow: 0 0 12px rgba(231, 181, 84, 0.6);
          animation: ripple 3s ease-out infinite;
          z-index: 1;
        }

        .ripple.delay {
          animation-delay: 1.5s;
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          60% {
            transform: scale(2.4);
            opacity: 0.35;
          }
          100% {
            transform: scale(3.2);
            opacity: 0;
          }
        }
      </style>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

/* ---------- MAIN COMPONENT ---------- */
const LandmarkMap = ({ property, landmarks, selected, onSelect ,type}) => {
  const [route, setRoute] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMarker, setSearchMarker] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const selectedMarkerRef = useRef(null);

  useEffect(() => {
    if (route.length > 0 && selectedMarkerRef.current) {
      selectedMarkerRef.current.openPopup();
    }
  }, [route]);

  const routeTarget = selected || searchMarker;

  /* ---------- FETCH ROUTE ---------- */
  useEffect(() => {
    if (!routeTarget) return setRoute([]);
    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${property.lng},${property.lat};${routeTarget.lng},${routeTarget.lat}?overview=full&geometries=geojson`;
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
  }, [property, routeTarget]);

  /* ---------- SEARCH ---------- */
  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length < 3) return setSearchResults([]);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&addressdetails=1&q=${encodeURIComponent(val)}`
    );
    const data = await res.json();
    setSearchResults(data.slice(0, 5));
  };

  const selectSearch = (res) => {
    setSearchMarker({ lat: +res.lat, lng: +res.lon, name: res.display_name });
    onSelect(null);
    setSearchResults([]);
    setSearchQuery(res.display_name);
  };

  const showAllLandmarks = !selected && !searchMarker;
  const showOnlySelectedLandmark = selected && !searchMarker;

  const bounds = [
    [property.lat, property.lng],
    ...(routeTarget ? [[routeTarget.lat, routeTarget.lng]] : []),
    ...(showAllLandmarks ? landmarks.map(l => [l.lat, l.lng]) : []),
    ...route,
  ];

  return (
    <div style={{ position: "relative" }}>
      <MapContainer center={[property.lat, property.lng]} zoom={14} style={{ height: 400 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker
          position={[property.lat, property.lng]}
          icon={createMarkerIcon({ selected: true, type: "Property" })}
        >
          <Popup>{property?.name}</Popup>
        </Marker>

        {showAllLandmarks &&
          landmarks.map((l, i) => (
            <Marker
              key={i}
              position={[l.lat, l.lng]}
              icon={createMarkerIcon({ selected: false, type: l.type })}
              eventHandlers={{
                click: () => {
                  onSelect(l);
                  setSearchMarker(null);
                  setSearchQuery("");
                },
              }}
            >
              <Popup>{l?.name}</Popup>
            </Marker>
          ))}

        {showOnlySelectedLandmark && (
          <Marker
            ref={selectedMarkerRef}
            position={[selected.lat, selected.lng]}
            icon={createMarkerIcon({ selected: true, type })}
          >
            <Popup>{selected?.name}</Popup>
          </Marker>
        )}

        {searchMarker && (
          <Marker
            position={[searchMarker.lat, searchMarker.lng]}
            icon={createMarkerIcon({ selected: true, type: "Search" })}
          >
            <Popup>{searchMarker?.name}</Popup>
          </Marker>
        )}

        {route.length > 0 && (
          <>
            <Polyline positions={route} color="#000" weight={4} opacity={0.25} />
            <Polyline positions={route} color="#000" weight={2} opacity={0.95} />
          </>
        )}

        <FitBounds coordinates={bounds} />
      </MapContainer>

      {distance && duration && (
        <div className="popUpMark">
          <strong>{selected?.name}</strong>
          <div>Distance: {distance} km</div>
          <div>Time: ~{duration} min</div>
        </div>
      )}
    </div>
  );
};

export default LandmarkMap;
