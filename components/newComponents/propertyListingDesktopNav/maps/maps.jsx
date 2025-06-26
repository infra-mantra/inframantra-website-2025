import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const SetViewOnChange = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const CustomMarker = ({ point, onHover, onLeave }) => {
  const customIcon = new L.DivIcon({
    className: 'custom-marker-icon',
    html: '<div class="custom-marker"></div>',
  });

  return (
    <Marker
      position={[point.lat, point.lng]}
      icon={customIcon}
      eventHandlers={{
        mouseover: () => onHover(point),
        mouseout: () => onLeave(),
      }}
    />
  );
};

const PropertyPopup = ({ property, onMouseEnter, onMouseLeave }) => (
  <div 
    className="property-popup" 
    onMouseEnter={onMouseEnter} // Keep the popup open
    onMouseLeave={onMouseLeave} // Close the popup on mouse leave
  >
    <img src={property.image} alt={property.name} className="property-image" />
    <div className="property-details">
      <h4>{property.name}</h4>
      <p>{property.location}</p>
      <p>{property.price}</p>
    </div>
  </div>
);

function Mapho({ center, zoom, points }) {
  const mapRef = useRef(null);
  const [hoveredProperty, setHoveredProperty] = useState(null);

  const handleMouseEnter = (property) => {
    setHoveredProperty(property); // Keep the property hovered
  };

  const handleMouseLeave = () => {
    setHoveredProperty(null); // Close the popup when leaving
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
      whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
    >
      <SetViewOnChange center={center} zoom={zoom} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {points.map((point) => (
        <CustomMarker
          key={point.key}
          point={point}
          onHover={(property) => handleMouseEnter(property)}
          onLeave={() => handleMouseLeave()}
        />
      ))}
      {hoveredProperty && (
        <Popup position={[hoveredProperty.lat, hoveredProperty.lng]}>
          <PropertyPopup 
            property={hoveredProperty} 
            onMouseEnter={() => handleMouseEnter(hoveredProperty)} // Keep the popup open
            onMouseLeave={handleMouseLeave} // Close the popup when mouse leaves
          />
        </Popup>
      )}
    </MapContainer>
  );
}

Mapho.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  zoom: PropTypes.number.isRequired,
  points: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Mapho;
