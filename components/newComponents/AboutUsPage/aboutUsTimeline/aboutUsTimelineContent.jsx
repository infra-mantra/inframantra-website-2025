import React, { useState, useEffect } from 'react';
// import './aboutUsTimeline.css';
import { journeyData } from '../aboutUsData';

const imagePaperSection = {
  firstPaper: {
    height: '40vh',
    width: '25vw',
    position: 'absolute',
    left: '5%',
    top: '15%',
    borderRadius: '10px',
    transform: 'rotate(-4deg)',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  secondPaper: {
    height: '40vh',
    width: '25vw',
    position: 'absolute',
    left: '20%',
    top: '40%',
    borderRadius: '10px',
    transform: 'rotate(4deg)',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
};

function AboutUsTimelineContent({ currentStep }) {
  const [content, setContent] = useState(journeyData[0]);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('fade-out');
    const timeout = setTimeout(() => {
      setContent(journeyData[currentStep]);
      setAnimationClass('fade-in');
    }, 300);
    return () => clearTimeout(timeout);
  }, [currentStep]);

  return (
    <div className={`aboutUsTimelineContentWrapper ${animationClass}`}>
      <h2>{content.header}</h2>
      <div className="aboutUsTimelineContentSectionFlex">
        <div className="aboutUsTimelineContentImgSection">
          <div  className='aboutUsTimelineContentImgSectionFirstImage'>
            <img
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                borderRadius: '10px',
              }}
              src={content.firstImg}
              alt="timeline1"
            />
          </div>
          <div className='aboutUsTimelineContentImgSectionSecondImage'>
            <img
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                borderRadius: '10px',
              }}
              src={content.secondImg}
              alt="timeline2"
            />
          </div>
        </div>
        <div className="aboutUsTimelineContentDescriptionSection">
          <p>{content.content}</p>
          <p className='aboutUsTimelineContentDescriptionSectionYear'>{content.year}</p>
        </div>
      </div>
    </div>
  );
}

export default AboutUsTimelineContent;
