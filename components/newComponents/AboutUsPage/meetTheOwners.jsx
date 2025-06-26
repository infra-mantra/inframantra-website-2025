import React from 'react';
// import './aboutUsPage.css';

function MeetOwners() {
  return (
    <div className="meetOwnersWrapper">
      <h2>The Minds Behind INFRAMANTRA</h2>
      <div className="meetOwnersContentFlex">
        <div className="meetOwnersContentImgWrapper">
          {/* className="meetOwnersContentImg" */}
          <div className='meetOwnersContentImg'>
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutUsPage/shiwangSolo.avif"
              alt="Shiwang Suraj"
            />
            <span></span>
          </div>
        </div>
        <div className="meetOwnersContentDescriptionFlex">
          <h4 className="meetOwnersContentHeader">Shiwang Suraj</h4>
          <p className="meetOwnersContentSubHeader">Founder & Director</p>
          <p className="meetOwnersContentDescription">
            <span
              style={{ color: '#0B8C27', fontSize: '20px', fontWeight: '800' }}
            >
              Shiwang Suraj
            </span>
            , with a career of over 10 years across industries, Shiwang Suraj
            has served many reputed Companies by applying his constructive
            approach in sales, operations and marketing field. He started his
            entrepreneurial journey as the Co-founder of Zapplon in the year
            2015, with the aim of bringing a new dimension to the transport
            industry, thereby providing value to companies through this
            function. His entrepreneurial spirit shone brightly once more in
            2017 when he founded yet another successful venture, InfraMantra
            India Pvt Ltd, specializing in the real estate market.
          </p>
        </div>
      </div>
      <div className="meetOwnersContentFlex secondOwnerContent">
        <div className="meetOwnersContentDescriptionFlex secondSectionDescriptionFlex">
          <h4 className="meetOwnersContentHeader" style={{ marginLeft: '15%' }}>
            Garvit Tiwari
          </h4>
          <p className="meetOwnersContentSubHeader">Co-Founder & Director</p>
          <p className="meetOwnersContentDescription">
            <span
              style={{ color: '#0B8C27', fontSize: '20px', fontWeight: '800' }}
            >
              Garvit Tiwari
            </span>
            , With over 14 years of experience across banking & finance
            industries and a Gold medal in IT, Garvit has significantly
            contributed to several renowned companies through his expertise in
            finance, marketing, and IT. He has worked with major banks,
            including HDFC Bank, IndusInd Bank, Yes Bank, and Kotak Bank,
            enhancing their corporate banking, wealth, and division management.
            In 2017, Garvit embarked on an entrepreneurial journey, co-founding
            InfraMantra India Pvt Ltd, a successful company specializing in the
            real estate market.
          </p>
        </div>
        <div className="meetOwnersContentImgWrapper">
          <div className="meetOwnersContentImg secondSectionImg">
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/aboutUsPage/garvitSolo.avif"
              alt="Garvit Tiwari"
            />
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetOwners;
