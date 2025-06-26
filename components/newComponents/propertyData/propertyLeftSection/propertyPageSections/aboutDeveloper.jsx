import React, {useEffect, useRef} from 'react';
import PropertyWrapper from './propertyWrapper';
// import './propertySectionStyles.css';

function AboutDeveloper({ developer, leftSection ,name}) {
  const developerRef = useRef(null);
  
  
  return (
    <PropertyWrapper
      id="aboutDeveloper"
      ref={developerRef}
    >
        <div className="aboutProjectWrapper">
          <h2 className="aboutProjectHeader">About Developer</h2>
          <div className="aboutDeveloperContainer">
            <img
              className="aboutDeveloperImg"
              src={developer?.developerImg}
              alt={name+" Developer logo"}
            />
            <div className="aboutDeveloperContentFlex">
              <p className="aboutDeveloperContent">{developer?.description}</p>
              <div className="aboutDeveloperNumericValues">
                <p>
                  Total Projects :{' '}
                  <span style={{ color: '#e7b554', fontWeight: 900 }}>
                    {developer?.totalProperties}
                  </span>
                </p>
                <p>
                  Years Of Experience :{' '}
                  <span style={{ color: '#e7b554', fontWeight: 900 }}>
                    {developer?.experienceYears}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
     </PropertyWrapper>
  );
}

export default AboutDeveloper;
