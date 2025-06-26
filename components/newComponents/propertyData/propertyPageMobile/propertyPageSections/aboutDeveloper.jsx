import React, {useEffect, useRef} from 'react';
import PropertyWrapper from './propertyWrapper';
// import './propertySectionStyles.css';

function AboutDeveloper({ developer, leftSection,name }) {
  const developerRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0.5) {
          leftSection(true);
          // console.log('Developer section is within 50% of the viewport');
        }
      },
      {
        root: null,
        threshold: [0.5],
      }
    );

    if (developerRef.current) {
      observer.observe(developerRef.current);
    }

    return () => {
      if (developerRef.current) {
        observer.unobserve(developerRef.current);
      }
    };
  }, [leftSection]);
  
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
              src={developer.developerImg}
              alt={name+" Developer logo"}
            />
            <div className="aboutDeveloperContentFlex">
              <p className="aboutDeveloperContent">{developer.description}</p>
              <div className="aboutDeveloperNumericValues">
                <p>
                  Total Projects :{' '}
                  <span style={{ color: '#e7b554', fontWeight: 900 }}>
                    {developer.totalProperties}
                  </span>
                </p>
                <p>
                  Years Of Experience :{' '}
                  <span style={{ color: '#e7b554', fontWeight: 900 }}>
                    {developer.experienceYears}
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
