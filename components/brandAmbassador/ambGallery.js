import React from "react";
import Section from "../UI/Section";
import style from "./ambGallery.module.css";

const AmbGallery = () => {
  return (
   
    <Section classes={style.ambGallery}>
      <div className={style.ambGalleryHeader}>
         <h2>Director & Brand Ambassador</h2>
      </div>
      <div className={style.ambGalleryContainer}>
        <div className={style.ambPhoto}>
          <picture>
            <img src="https://inframantra.blr1.cdn.digitaloceanspaces.com/brandAmbassador/image.jpg" alt="Team Member 1" />
          </picture>
          <h3>Founder</h3>
        </div>
        <div className={style.ambPhoto}>
          <picture>
            <img src="https://inframantra.blr1.cdn.digitaloceanspaces.com/brandAmbassador/guru-gallery-guru-page.jpg" alt="Team Member 1" />
          </picture>
          <h3>Brand Ambassador</h3>
        </div>
        <div className={style.ambPhoto}>
          <picture>
            <img src="https://inframantra.blr1.cdn.digitaloceanspaces.com/brandAmbassador/garvit-sir-guru-page.jpg" alt="Team Member 1" />
          </picture>
          <h3>Co-Founder </h3>
        </div>
      </div>
    </Section>
  );
};
export default AmbGallery;
