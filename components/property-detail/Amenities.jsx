import React, { useEffect, useRef, useState } from "react";
import RightSlideModal from "./Modal.jsx";
// Imported as a CSS module so this stylesheet ships with the property page
// chunk instead of with every page from _app.js. The `s` binding MUST stay in
// use: Next tree-shakes a CSS-module import whose binding is unused and then
// emits none of the CSS. next.config.js sets WANT_HASH = false, so `s['x']`
// resolves to the identical unhashed name `x` and the rendered markup is
// unchanged. Class names owned by other sheets (Header, modal-grid) stay literal.
import s from "./Amenities.module.css";

const TopAmenities = ({ propertyData }) => {
  const gridRef = useRef(null);
  const [itemsPerRow, setItemsPerRow] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const amenities = [...propertyData?.amenities, ...propertyData.exclusiveAmenities] || [];

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

  const visibleAmenities = hasExtra ? amenities.slice(0, maxVisible - 1) : amenities;

  const remainingCount = amenities.length - (maxVisible - 1);

  if (!amenities.length) return null;

  return (
    <div className={s["amenities-container"]}>
      <h2 className={`${s["amenities-title"]} Header`}>Top Amenities</h2>

      <div ref={gridRef} className={s["amenities-grid"]}>
        {visibleAmenities.map((amenity) => (
          <div key={amenity._id} className={s["amenity-item"]}>
            {/* The amenities grid sits well below the fold, but these icons loaded
                eagerly - ~290 KB of PNGs competing for bandwidth with the gallery
                hero, which is the LCP element. loading="lazy" only defers images
                outside the viewport (an in-view one still loads immediately), so
                nothing moves and nothing looks different. */}
            <img
              src={amenity.iconUrl
                ?.replace("amenities", "tempamenities")
                .replace(/\.svg$/i, ".png")}
              alt={amenity.title}
              className="amenity-icon"
              loading="lazy"
              decoding="async"
            />
            <div className="amenity-label">{amenity.title}</div>
          </div>
        ))}

        {hasExtra && (
          <div
            className={`${s["amenity-item"]} ${s["has-more-amenties"]}`}
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
        <div className={`${s["amenities-grid"]} ${s["amenities-grid-w"]} modal-grid`}>
          {amenities.map((amenity) => {
            const icon = amenity.iconUrl
              ?.replace("amenities", "tempamenities")
              .replace(/\.svg$/i, ".png");

            return (
              <div key={amenity._id} className={s["amenity-item"]}>
                <img src={icon} alt={amenity.title} className="amenity-icon" loading="lazy" />
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
