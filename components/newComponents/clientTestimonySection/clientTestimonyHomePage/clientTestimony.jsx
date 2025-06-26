import React, {useState, useEffect} from 'react';
// import './clientTestimony.css';


const iconStyle = {
  quoteIcon: {
    transform: 'rotate(180deg)',
    transition: 'transform 0.3s',
    color: '#000',
    marginRight: '10px',
    fontSize: '40px',
  },
  stars: {
    marginTop: '10px',
  },
  starsMobile: {
    color: '#ffff',
  },
  quoteIconMobile: {
    transform: 'rotate(180deg)',
    transition: 'transform 0.3s',
    color: '#000',
    fontSize: '30px',
  },
};

function ClientTestimony({ name, testimony, img }) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 769); // You can adjust the threshold for desktop here
    setIsMobile(window.innerWidth <=768);
  };
  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
  
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);
  const renderStars = () => {
    const starCount = 5;
    let stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(<span key={i} className="star">&#9733;</span>); // Use Unicode star character
    }
    return stars;
  };

  return (
    <div className="clientTestimonyCardWrapper">
      {isDesktop && (
        <>
          <div className="clientTestimonyCardHeader">
            <p className="clientTestimonyName">{name}</p>
            <div className="stars" style={iconStyle.stars}>
              {renderStars()}
            </div>
          </div>
          <div className="clientTestimonyCardContainer">
            <img
              src={img}
              alt="testimonyFace"
              className="clientTestimonyCardFace"
            />
            <div className="clientTestimonyCardTextPseudoFlex"></div>
            <div className="clientTestimonyCardTextFlex">
              <span className="quoteIcon" style={iconStyle.quoteIcon}>&#8220;</span>
              <p className="clientTestimonyCardText">{testimony}</p>
            </div>
          </div>
        </>
      )}
      {!isDesktop && (
        <div className="clientTestimonyCardContainer">
          <img
            src={img}
            alt="testimonyFace"
            className="clientTestimonyCardFace"
          />
          <div className="clientTestimonyCardMobileFlex">
            <div className="starsMobile" style={iconStyle.starsMobile}>
              {renderStars()}
            </div>
            <p className="clientTestimonyName">{name}</p>
            <p className="clientTestimonyCardText">
              <span className="quoteIconMobile" style={iconStyle.quoteIconMobile}>&#8220;</span>
              {testimony}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientTestimony;
