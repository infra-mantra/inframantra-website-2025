import React, { useEffect, useRef, useState } from "react";
import RightSlideModal from "./modal";

const TopAmenities = ({ propertyData }) => {
  const gridRef = useRef(null);
  const [itemsPerRow, setItemsPerRow] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const amenities = [...propertyData?.amenities,...propertyData.exclusiveAmenities] || [];

  useEffect(() => {
    if (!gridRef.current) return;

    const grid = gridRef.current;
    const item = grid.querySelector(".amenity-item");
    if (!item) return;

    const calculate = () => {
      const gridWidth = grid.offsetWidth;
      const itemWidth = item.offsetWidth;
      setItemsPerRow(Math.floor(gridWidth / itemWidth));
    };

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [amenities]);

  const maxVisible = itemsPerRow * 2;
  const hasExtra = amenities.length > maxVisible;

  const visibleAmenities = hasExtra
    ? amenities.slice(0, maxVisible - 1)
    : amenities;

  const remainingCount = amenities.length - (maxVisible - 1);

  if (!amenities.length) return null;

  return (
    <div className="amenities-container">
      <h2 className="amenities-title Header">Top Amenities</h2>

      <div ref={gridRef} className="amenities-grid">
        {visibleAmenities.map((amenity) => (
          <div key={amenity._id} className="amenity-item">
            <img
              src={amenity.iconUrl
           ?.replace("amenities", "tempamenities")
                 .replace(/\.svg$/i, ".png")}
              alt={amenity.title}
              className="amenity-icon"
            />
            <div className="amenity-label">{amenity.title}</div>
          </div>
        ))}

        {hasExtra && (
          <div
            className="amenity-item has-more-amenties"
            onClick={() => setIsModalOpen(true)}
          >
            +{remainingCount} more
          </div>
        )}
      </div>

      {/* Modal */}
      <RightSlideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="All Amenities"
      >
        <div className="amenities-grid amenities-grid-w modal-grid">
         {amenities.map((amenity) => {
  const icon =amenity.iconUrl
    ?.replace("amenities", "tempamenities")
      .replace(/\.svg$/i, ".png");

  return (
    <div key={amenity._id} className="amenity-item">
      <img
        src={icon}
        alt={amenity.title}
        className="amenity-icon"
        loading="lazy"
      />
      <div className="amenity-label">{amenity.title}</div>
    </div>
  );
})}

        </div>
      </RightSlideModal>
    </div>
  );
};

export default TopAmenities;
