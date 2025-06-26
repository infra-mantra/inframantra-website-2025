import React, { useState } from "react";
import { useRouter } from "next/router";

const SitemapImages = ({ sitemapData }) => {
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); 
  const router = useRouter();

  const handleClick = (item, index) => {
    if (!loading) {
      setLoading(true);
      setActiveIndex(index);

      setTimeout(() => {
        router.push(`/property-listing/city/${item.url}`);
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="grid-container-cities">
      {sitemapData.map((item, index) => (
        <img
          key={index} 
          src={item.imgUrl}
          className={index === 0 ? "main_image" : "item"}
          alt="city_image"
          style={{
            opacity: loading && activeIndex === index ? 0.6 : 1, 
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: "opacity 0.3s ease"
          }}
          onClick={() => handleClick(item, index)}
        />
      ))}
    </div>
  );
};

export default SitemapImages;
