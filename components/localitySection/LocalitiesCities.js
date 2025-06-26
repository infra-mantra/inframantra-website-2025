import React, { useState } from 'react';
import { useRouter } from 'next/router';

function LocalityCom({ locality, cityName, index, activeLocalities, handleActiveLocality, navigation = true }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleViewProperties = () => {
    if (loading) return;

    setLoading(true);

    // Save selected locality into localStorage and navigate to /listing
    setTimeout(() => {
      const localStorageData = [{ title: locality.name, type: "locality" }];
      localStorage.setItem("SearchNames", JSON.stringify(localStorageData));
      router.push('/listing');
    }, 500);
  };

  const handleViewLocalities = () => {
    if (loading) return;
    handleActiveLocality(index);
  };

  return (
    <div
      className={`city_item_cities ${activeLocalities === index ? "active" : ""}`}
      style={{
        opacity: loading ? 0.6 : 1,
        cursor: loading ? 'not-allowed' : 'pointer'
      }}
    >
      <img
        src={locality.imgUrl || "/assets/images/city_images/image3.png"}
        className="city_img_cities"
        alt={locality.name}
        onClick={navigation ? handleViewProperties : undefined}
        style={{
          pointerEvents: loading ? 'none' : 'auto'
        }}
      />

      <div className="city_text_cities">
        <h4 className="locality_name">
          {locality.name}
        </h4>

        <div className="city_btns">
          <button
            className="city_btn_l"
            disabled={loading}
            onClick={handleViewLocalities}
          >
            View Localities
          </button>

          <button
            className="city_btn_p"
            disabled={loading}
            onClick={handleViewProperties}
          >
            {loading ? 'Loading...' : 'View Properties'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocalityCom;
