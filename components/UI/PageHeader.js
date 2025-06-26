import { useEffect, useState } from "react";
import NoImage from "./NoImage";
import Section from "./Section";

const PageHeader = (props) => {
  const { data } = props;
  const [imageUrl, setImageUrl] = useState(data.image); // Initial image from props

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      const mobileImage = "https://inframantra.blr1.cdn.digitaloceanspaces.com/developer/bannerImages/website%20%20developers2.2.avif";
      const  desktopImage = "https://inframantra.blr1.cdn.digitaloceanspaces.com/developer/bannerImages/website%20%20developers2.1.avif";

      setImageUrl(screenWidth >= 768 ? desktopImage : mobileImage);
    };

    // Initial call and event listener setup
    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, [data.image]);

  return (
    <Section classes="page-header">
      {imageUrl ? (
        <picture className="header-banner">
          <img
            src={imageUrl}
            className="page-header-img"
            alt="Banner"
            width="100%"
            height="auto"
            style={{ objectFit: "cover" }}
          />
        </picture>
      ) : (
        <NoImage />
      )}
      <div className="page-banner-content">
        <div className="page-width">
          <h1>{data.title}</h1>
          {data.date && <p className="date">{data.date}</p>}
        </div>
      </div>
    </Section>
  );
};

export default PageHeader;
