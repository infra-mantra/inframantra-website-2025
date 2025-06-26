import React from "react";
import Section from "../UI/Section";

const AmbProfile = () => {
    return (
      <Section classes="home-hero">
        <div className="container">
          <div className="home-container">
            <h1 className="home-text10">Inframantra x Guru Randhawa</h1>
            <span className="home-text11">
               
                <p>
                InfraMantra India Private Limited is proud to announce that we have signed the musical sensation, Mr. Guru Randhawa as our new face. We welcome Mr. Randhawa in the family which is made up of trust and loyalty. Guru’s excellence and forward thinking align with InfraMantra making home buying simple and transparent.
                </p>
                <p>With his vibrant thinking and diverse music Guru has set great bars in the music industry and yet he still strives to punch through the ceiling. This is what attracted us to make Guru our brand ambassador because at InfraMantra we respect great efforts and trust. </p>
            </span>
          </div>
          <div className="home-amb">
          <picture>
            <img
            
              alt="image"
              src="/assets/Untitled-1,1.jpg"
              className="home-image2"
            />
          </picture>
          </div>
        </div>
      </Section>
    );
}

export default AmbProfile;