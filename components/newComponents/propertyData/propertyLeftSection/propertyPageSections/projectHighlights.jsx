import React from "react";
import PropertyWrapper from "./propertyWrapper";
// import "./propertySectionStyles.css";

function ProjectHighlights({ keyHighlights = [] }) {
  return (
    <PropertyWrapper
      id='highlights'
      >
        <div className='aboutProjectWrapper'>
          <h2 className='aboutProjectHeader'>Key Highlights</h2>
          <div className='projectHighlightList'>
            {keyHighlights.map((highlights, index) => {
              return (
                <p className='aboutProjectHighlightPoints' key={index}>
                  <span className='projectHighlightListBullet'>&gt; </span>{" "}
                  {highlights}
                </p>
              );
            })}
          </div>
        </div>
        </PropertyWrapper>
  );
}

export default ProjectHighlights;
