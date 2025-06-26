import React from 'react';
import similarImg from '../../assets/featured.jpg';
import './similarPropertyCard.css';

function SimilarPropertyCard() {
  return (
    <div className="similarPropertyCardWrapper">
      <div className="similarPropertyCardImg">
        <img src={similarImg} alt="similarImg" />
      </div>
      <div className="similarPropertyCardDetailContainer">
        <div className="similarPropertyCardDetailContainerFlex">
          <h3>Tulip Monsella</h3>
          <p>Sector 56, Gurgaon</p>
        </div>
        <p className="similarPropertyCardDetailPrice">
          Price : <span style={{ color: '#DCAA4C' }}>5.5 Cr.</span>
        </p>
      </div>
    </div>
  );
}

export default SimilarPropertyCard;
