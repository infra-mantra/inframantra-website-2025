import React from 'react';
// import './brandAmbassador.css';

function BrandAmbassador() {
  return (
    <div className="brandAmbassadorWrapper">
      <h4>MEET OUR BRAND AMBASSADOR</h4>
      <div className="brandAmbassadorContentWrapper">
        <div className="brandAmbassadorImageWrapper">
          <img
            src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/guruContactPage.png"
            alt=""
          />
          <p className="brandAmbassadorName">Guru Randhawa</p>
          <p className="brandAmbassadorSubHeader">Musical Superstar</p>
        </div>
        <div className="brandAmbassadorDescriptionWrapper">
          <p>
            InfraMantra is proud to announce that we have signed the musical
            sensation, Mr. Guru Randhawa as our new face. We welcome Mr.
            Randhawa in the family with trust and loyalty in its core. Guru’s
            excellence and forward thinking aligns with InfraMantra visions and goals, which is to make
            home buying simple and transparent.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BrandAmbassador;
