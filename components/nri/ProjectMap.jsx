// ProjectMap.jsx
import { useEffect, useRef, useState } from "react";
import styles from "./ProjectMap.module.css";

// ── Leaflet global overrides (injected once into <head>) ──────────────────────
const LEAFLET_OVERRIDES = `
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;
    margin: 12px !important;
  }
  .leaflet-control-zoom a {
    background: #fff !important;
    color: #333 !important;
    border: none !important;
    font-size: 18px !important;
    font-weight: 300 !important;
    width: 32px !important;
    height: 32px !important;
    line-height: 32px !important;
  }
  .leaflet-control-zoom a:hover { background: #f5f5f5 !important; }
  .leaflet-control-zoom-in  { border-radius: 4px 4px 0 0 !important; border-bottom: 1px solid #e8e8e8 !important; }
  .leaflet-control-zoom-out { border-radius: 0 0 4px 4px !important; }
  .leaflet-control-attribution { display: none !important; }
  .leaflet-popup-content-wrapper {
    border-radius: 10px !important;
    box-shadow: 0 6px 28px rgba(0,0,0,0.18) !important;
    padding: 0 !important;
    overflow: hidden !important;
    border: none !important;
  }
  .leaflet-popup-content { margin: 0 !important; }
  .leaflet-popup-tip { background: #fff !important; box-shadow: none !important; }
  .leaflet-popup-close-button {
    top: 10px !important; right: 10px !important;
    color: #aaa !important; font-size: 20px !important;
    font-weight: 300 !important; z-index: 10 !important;
  }
  .leaflet-popup-close-button:hover { color: #444 !important; }
  .proj-label-icon {
    background: transparent !important;
    border: none !important;
  }
`;

// ── Data ──────────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id: 1, name: "Godrej Sora",       address: "Sector 53, DLF Phase 5, Gurugram",         lat: 28.436814234729656, lng: 77.09768719770094, brand: "godrej", isNew: false },
  { id: 2, name: "Godrej Miraya",     address: "Sector 43, Sushant Lok Phase I, Gurugram", lat: 28.451171319492865, lng: 77.09014162947909, brand: "godrej", isNew: false },
 
  { id: 3, name: "Tulip Monsella",    address: "Golf Course Road, Sector 53, Gurugram",    lat: 28.43466940880153, lng: 77.1034432670051, brand: "tulip",  isNew: false },
  { id: 4, name: "Tulip Melrose",     address: "Sector 70, Gurugram",                      lat:  28.394800850492956, lng: 77.01585311454005, brand: "tulip",  isNew: false },
  { id: 5, name: "Tulip Crimson",     address: "Sector 70, SPR Road, Gurugram",            lat: 28.3975290526242, lng: 77.01590097186407, brand: "tulip",  isNew: false },
   { id: 6, name: "BPTP Downtown 66", address: "Sector 66 , Golf Course Extn Road, Gurugram",  lat:  28.393008421438967, lng: 77.05976718503354, brand: "BPTP Downtown 66", isNew: false },
    { id: 7, name: "DLF Arbour", address: "Sector 63 , Golf Course Extn Road, Gurugram",  lat:  28.397111016419107, lng: 77.08198520018861, brand: "BPTP Downtown 66", isNew: false },
];


const GOLD      = "#dcaa4c";
const GOLD_DARK = "#dcaa4c";

// ── Icon factory — label pin (name on a pill, tail below) ─────────────────────
function makeLabelIcon(L, p, active) {
  const name   = p.name;
  const chars  = name.length;
  const pw     = Math.max(chars * 7.8 + 24, 90);  // pill width
  const ph     = active ? 36 : 30;                  // pill height
  const fs     = active ? 12 : 10.5;
  const bg     = active ? GOLD_DARK : GOLD;
  const tw     = pw + 4;                             // total svg width (a bit wider for shadow)
  const th     = ph + 14;                            // total svg height (pill + tail)

  const html = `
    <div style="position:relative;display:flex;flex-direction:column;align-items:center;width:${tw}px;height:${th}px;">
      <div style="
        background:${bg};
        color:#fff;
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        font-size:${fs}px;
        font-weight:700;
        letter-spacing:0.01em;
        white-space:nowrap;
        padding:0 12px;
        height:${ph}px;
        border-radius:${ph/2}px;
        display:flex;align-items:center;justify-content:center;
        box-shadow:${active
          ? `0 0 0 3px rgba(200,169,110,0.35), 0 4px 16px rgba(0,0,0,0.4)`
          : `0 3px 10px rgba(0,0,0,0.35)`};
        border: 2px solid #fff;
        transition: all 0.2s;
        position:relative;z-index:2;
      ">${name}</div>
      <div style="
        width:0;height:0;
        border-left:7px solid transparent;
        border-right:7px solid transparent;
        border-top:10px solid ${bg};
        margin-top:-1px;
        filter:drop-shadow(0 3px 2px rgba(0,0,0,0.2));
        z-index:1;
      "></div>
    </div>`;

  return L.divIcon({
    className:   "proj-label-icon",
    html,
    iconSize:    [tw, th],
    iconAnchor:  [tw / 2, th],
    popupAnchor: [0, -(th + 6)],
  });
}

// ── Popup HTML ────────────────────────────────────────────────────────────────
function popupHTML(p) {
  const q = encodeURIComponent(`${p.name} ${p.address}`);
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;width:240px;">
      <div style="height:4px;background:${GOLD};"></div>
      <div style="padding:14px 16px 14px;">
        <div style="font-size:15px;font-weight:700;color:#111;margin-bottom:4px;">${p.name}</div>
        <div style="font-size:11.5px;color:#777;line-height:1.5;margin-bottom:12px;">${p.address}</div>
        <div style="height:1px;background:#f0f0f0;margin-bottom:12px;"></div>
        <div style="display:flex;gap:8px;">
          <a href="https://www.google.com/maps/search/?api=1&query=${q}"
            target="_blank" rel="noopener"
            style="flex:1;display:flex;align-items:center;justify-content:center;
              padding:9px 4px;font-size:11px;font-weight:700;letter-spacing:0.04em;
              text-transform:uppercase;text-decoration:none;border-radius:6px;
              background:#d4a64a;color:#fff;">
            Google Maps
          </a>
         
        </div>
      </div>
    </div>`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProjectMap() {
  const mapRef     = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef({});
  const activeRef  = useRef(null);
  const [activeId, setActiveId] = useState(null);

  // Inject Leaflet CSS + overrides once
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id    = "leaflet-css";
      link.rel   = "stylesheet";
      link.href  = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("leaflet-overrides")) {
      const style       = document.createElement("style");
      style.id          = "leaflet-overrides";
      style.innerHTML   = LEAFLET_OVERRIDES;
      document.head.appendChild(style);
    }
  }, []);

  // Init map
  useEffect(() => {
    if (leafletRef.current) return;

    const script  = document.createElement("script");
    script.src    = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => {
      const L = window.L;

      const map = L.map(mapRef.current, {
        zoomControl:      true,
        attributionControl: false,
      }).setView([28.44, 77.05], 12);

      leafletRef.current = { L, map };

      // Satellite base
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 20 }
      ).addTo(map);

      // Road / label overlay
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 20, opacity: 0.9 }
      ).addTo(map);

      // Add markers
      PROJECTS.forEach(p => {
        const m = L.marker([p.lat, p.lng], {
          icon:        makeLabelIcon(L, p, false),
          zIndexOffset: 1000,
        })
          .addTo(map)
          .bindPopup(popupHTML(p), { maxWidth: 270, minWidth: 250, autoPan: true });

        m.on("click", () => handleMarkerClick(p.id, L, map));
        m.on("popupclose", () => {
          if (activeRef.current === p.id) {
            m.setIcon(makeLabelIcon(L, p, false));
            activeRef.current = null;
            setActiveId(null);
          }
        });

        markersRef.current[p.id] = m;
      });

      const bounds = L.latLngBounds(PROJECTS.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds.pad(0.22));
    };

    document.body.appendChild(script);
  }, []);

  function handleMarkerClick(id, L, map) {
    const _L   = L   || leafletRef.current?.L;
    const _map = map || leafletRef.current?.map;
    if (!_L || !_map) return;

    const prev = activeRef.current;
    if (prev && markersRef.current[prev]) {
      markersRef.current[prev].setIcon(
        makeLabelIcon(_L, PROJECTS.find(x => x.id === prev), false)
      );
    }

    const p = PROJECTS.find(x => x.id === id);
    activeRef.current = id;
    setActiveId(id);

    markersRef.current[id].setIcon(makeLabelIcon(_L, p, true));
    markersRef.current[id].openPopup();

    // Zoom in on click
    _map.flyTo([p.lat, p.lng], 15, { animate: true, duration: 0.6 });
  }

  function handleTabClick(id) {
    handleMarkerClick(id);
  }

  return (
    <div>
  <div className={`${styles.wrapperMap} ${styles.containerMap}`}>
      {/* Map */}
      <div className={styles.mapWrap}>
        <div ref={mapRef} className={styles.map} />
      </div>

      {/* Project tabs */}
      <div className={styles.tabBar}>
        {PROJECTS.map(p => {
          const isActive = activeId === p.id;
          return (
            <button
              key={p.id}
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
              onClick={() => handleTabClick(p.id)}
            >
              {p.name}
            </button>
          );
        })}
      </div>
    </div>
    </div>
  );
}
