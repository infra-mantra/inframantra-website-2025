import React, { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Polyline, useMap, useMapEvent } from "react-leaflet";
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
  FaHome,
} from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { ImRoad } from "react-icons/im";
import { BiSolidBusiness } from "react-icons/bi";
import { renderToStaticMarkup } from "react-dom/server";
// CSS module so this sheet ships with the pages that need it instead of with
// every page via _app.js. The `mp` binding must stay used: Next tree-shakes a
// CSS-module import whose binding is unused and then emits none of its CSS.
// WANT_HASH = false (next.config.js) means mp["x"] resolves to the identical
// unhashed name "x", so the rendered markup is byte-for-byte unchanged.
import mp from "./Map.module.css";

/* ---------- FIT BOUNDS ---------- */
// `bottomPad` keeps the fitted area clear of the info card at the bottom.
const FitBounds = ({ coordinates, bottomPad = 40 }) => {
  const map = useMap();
  useEffect(() => {
    if (!coordinates.length) return;
    map.fitBounds(L.latLngBounds(coordinates), {
      paddingTopLeft: [40, 80], // room for the property name label above its pin
      paddingBottomRight: [40, bottomPad],
    });
  }, [coordinates, bottomPad, map]);
  return null;
};

/* ---------- ROUTE LINE ----------
   Google-Maps-style blue route whose thickness follows the zoom level: thin
   when zoomed out (so it doesn't smother the map), thicker when zoomed in. */
const RouteLine = ({ positions }) => {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvent("zoomend", () => setZoom(map.getZoom()));

  // ~1.5px at zoom 11, ~4.5px at zoom 14, capped at 7px from zoom 16 up
  const weight = Math.min(7, Math.max(1.5, (zoom - 9.5) * 1.1));
  const line = { lineCap: "round", lineJoin: "round" };

  return (
    <>
      {/* darker casing under the bright line */}
      <Polyline positions={positions} pathOptions={{ ...line, color: "#1a56c4", weight: weight + 3, opacity: 0.9 }} />
      <Polyline positions={positions} pathOptions={{ ...line, color: "#4a8cff", weight, opacity: 1 }} />
    </>
  );
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

/* ---------- CREATE CUSTOM MARKER ICON ----------
   Landmark: gold disc with the category icon; a pulsing ring when selected.
   Ripple keyframes live in Map.module.css. */
export const createMarkerIcon = ({ selected = false, type }) => {
  const IconComponent = ICON_MAP[type] || FaMapMarkerAlt;
  const iconHTML = renderToStaticMarkup(<IconComponent />);

  return L.divIcon({
    className: "",
    html: `
      <div class="lm-marker${selected ? " is-selected" : ""}">
        ${selected ? `<span class="lm-ripple"></span><span class="lm-ripple lm-ripple-delay"></span>` : ""}
        <div class="lm-marker-dot">${iconHTML}</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

/* Property: larger dark pin with a gold house, so it never reads as just
   another landmark. */
const createPropertyIcon = () => {
  const iconHTML = renderToStaticMarkup(<FaHome />);
  return L.divIcon({
    className: "",
    html: `
      <div class="lm-property-marker">
        <span class="lm-ripple lm-ripple-gold"></span>
        <div class="lm-property-pin">${iconHTML}</div>
      </div>
    `,
    iconSize: [44, 52],
    iconAnchor: [22, 50],
    popupAnchor: [0, -50],
    tooltipAnchor: [0, -52],
  });
};

/* ---------- MAIN COMPONENT ---------- */
const LandmarkMap = ({ property, landmarks, selected, onSelect, type }) => {
  const propertyIcon = useMemo(() => createPropertyIcon(), []);
  const [route, setRoute] = useState([]);
  const [searchMarker, setSearchMarker] = useState(null);
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
    return (landmarks || [])
      .map((l) => ({ ...l, lat: Number(l?.lat), lng: Number(l?.lng) }))
      .filter((l) => l.lat && l.lng && !isNaN(l.lat) && !isNaN(l.lng));
  }, [landmarks]);

  /* ---------- SAFE SELECTED ---------- */
  const safeSelected = useMemo(() => {
    if (!selected || selected.lat == null || selected.lng == null) return null;
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
    setRoute([]);
    setDuration(null);
    if (!safeProperty || !routeTarget) return;
    let cancelled = false;

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${safeProperty.lng},${safeProperty.lat};${routeTarget.lng},${routeTarget.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (cancelled || !data?.routes?.[0]) return;

        setDuration((data.routes[0].duration / 60).toFixed(1));

        const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRoute(coords);
      } catch (e) {
        console.error("Route error", e);
      }
    };

    fetchRoute();
    return () => {
      cancelled = true;
    };
  }, [safeProperty, routeTarget]);

  const showAllLandmarks = !safeSelected && !searchMarker;
  const showOnlySelectedLandmark = safeSelected && !searchMarker;

  const bounds = useMemo(() => {
    if (!safeProperty) return [];
    const arr = [[safeProperty.lat, safeProperty.lng]];
    if (routeTarget) arr.push([routeTarget.lat, routeTarget.lng]);
    if (showAllLandmarks) safeLandmarks.forEach((l) => arr.push([l.lat, l.lng]));
    route.forEach((r) => arr.push(r));
    return arr;
  }, [safeProperty, routeTarget, safeLandmarks, route, showAllLandmarks]);

  if (!safeProperty) return null;

  const SelectedIcon = ICON_MAP[type] || FaMapMarkerAlt;

  return (
    <div className={mp["lm-map-shell"]}>
      <MapContainer
        center={[safeProperty.lat, safeProperty.lng]}
        zoom={14}
        scrollWheelZoom={false} /* don't hijack page scrolling; use +/- or pinch */
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

        {/* Labels (roads, places, locality names) */}
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" />

        {/* PROPERTY */}
        <Marker position={[safeProperty.lat, safeProperty.lng]} icon={propertyIcon} zIndexOffset={1000}>
          {safeProperty.name && (
            <Tooltip permanent direction="top" className="lm-property-label">
              {safeProperty.name}
            </Tooltip>
          )}
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
        {route.length > 0 && <RouteLine positions={route} />}

        <FitBounds coordinates={bounds} bottomPad={safeSelected ? 100 : 40} />
      </MapContainer>

      {safeSelected && (
        <div className={mp["popUpMark"]} role="status">
          <span className={mp["lm-card-icon"]}>
            <SelectedIcon />
          </span>
          <div className={mp["lm-card-body"]}>
            <strong>{safeSelected.name}</strong>
            <span>
              {selected?.distance}
              {duration ? ` · ~${Math.max(1, Math.round(duration))} min drive` : " · finding route…"}
            </span>
          </div>
          <button
            type="button"
            className={mp["lm-card-close"]}
            onClick={() => onSelect(null)}
            aria-label="Show all landmarks"
            title="Show all"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default LandmarkMap;
