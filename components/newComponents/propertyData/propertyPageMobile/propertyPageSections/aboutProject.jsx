import React, { useState } from "react";
import PropertyWrapper from "./propertyWrapper";
// import "./propertySectionStyles.css";

function AboutProject({ description = [], propertyLogo }) {
  const [readMore, setReadMore] = useState(false);

  const handleReadMoreclick = (e) => {
    e.preventDefault();
    setReadMore((prev) => !prev);
  };

  return (
    <PropertyWrapper
      id='aboutProject'
    >
        <div className='aboutProjectWrapper'>
          <h2 className='aboutProjectHeader'>About Project</h2>
          <div className='aboutProjectDescriptionFlex'>
            <p className='aboutProjectDescription'>{description[0]}</p>
            {propertyLogo && (
              <img
                className='aboutProjectLogo'
                src={propertyLogo}
                alt='projectLogo'
              />
            )}
          </div>
          {readMore && (
            <>
              {description.slice(1).map((content, index) => {
                return (
                  <p className='aboutProjectDescription' key={index}>
                    {content}
                  </p>
                );
              })}
            </>
          )}
          <p className='aboutProjectFooter' onClick={handleReadMoreclick}>
            {readMore ? "Show Less" : "Show More"}
          </p>
        </div>
      </PropertyWrapper>
  );
}

export default AboutProject;
