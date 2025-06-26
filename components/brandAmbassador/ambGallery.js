import React from "react";
import Section from "../UI/Section";

const AmbGallery = () => {
  return (
   
    <Section classes="amb-gallery">
      <div className="amb-gallery-header">
         <h2>Director & Brand Ambassador</h2>
      </div>
      <div className="amb-gallery-container">
        <div className="amb-photo">
          <picture>
            <img src="/assets/guru/image.jpg" alt="Team Member 1" />
          </picture>
          <h3>Founder</h3>
        </div>
        <div className="amb-photo">
          <picture>
            <img src="/assets/guru/guru-gallery-guru-page.jpg" alt="Team Member 1" />
          </picture>
          <h3>Brand Ambassador</h3>
        </div>
        <div className="amb-photo">
          <picture>
            <img src="assets/guru/garvit-sir-guru-page.jpg" alt="Team Member 1" />
          </picture>
          <h3>Co-Founder </h3>
        </div>
      </div>
    </Section>
  );
};
export default AmbGallery;
