import { useEffect, useState } from "react";
import NoImage from "./NoImage";
import Section from "./Section";

const PageHeader = (props) => {
  const { data } = props;
  const [imageUrl, setImageUrl] = useState(data.image); // Initial image from props

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      // Self-hosted generic architecture banner (not a specific project).
      const mobileImage = "/banner/developers-banner.jpg";
      const desktopImage = "/banner/developers-banner.jpg";

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
