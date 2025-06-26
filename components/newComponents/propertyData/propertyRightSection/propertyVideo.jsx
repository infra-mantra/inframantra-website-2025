import React from "react";
import ReactPlayer from "react-player";
import PropertyWrapper from "../propertyPageMobile/propertyPageSections/propertyWrapper";
import useMediaQuery from "../../../../utils/useMediaQuery";

function PropertyVideo({ videoUrl }) {
  const isDesktop = useMediaQuery(768);

  return (
    <>
      {isDesktop && (
        <div className='propertyVideoWrapper'>
          <ReactPlayer
            url={videoUrl ||`https://www.youtube.com/watch?v=zEBrU6GEZdk&ab_channel=INFRAMANTRA`}
            width='100%'
            height='100%'
            controls={true}
          />
        </div>
      )}
      {!isDesktop && (
        <PropertyWrapper
          children={
            <div className='aboutProjectWrapper'>
              <h2 className='aboutProjectHeader'>Property Video</h2>
              <div className='propertyVideoWrapper'>
                <ReactPlayer
                  url={videoUrl ||`https://www.youtube.com/watch?v=zEBrU6GEZdk&ab_channel=INFRAMANTRA`}
                  width='100%'
                  height='100%'
                  controls={true}
                />
              </div>
            </div>
          }
        />
      )}
    </>
  );
}

export default PropertyVideo;
