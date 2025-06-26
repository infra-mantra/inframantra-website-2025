import React from 'react';
import { AiOutlineCalendar, AiOutlineHome, AiOutlineEnvironment } from 'react-icons/ai';
import { FaRupeeSign, FaRulerCombined } from 'react-icons/fa';
import { calculateEMI } from '../../UI/calculateEmi';
// import '../propertyPage.css';

function PropertyPageMobileHeaderDetails({
  rera,
  name,
  locality,
  subLocality,
  displayLocality,
  city,
  startingPrice,
  priceInFigure,
  configuration,
  area,
  squarePrice,
  status,
  posession,
  exclusive,
  featured,
  tagLine,
}) {
  const emiValue = calculateEMI(priceInFigure, 10, 30);
  return (
    <>
      <p className="propertyPageHeaderMobilePropertyTitle">{name}</p>
      <div className="propertyPageHeaderMobileLocation">
        <AiOutlineEnvironment style={{ color: '#DCAA4C' }} />
        <p style={{ fontWeight: '300' }}>
          {subLocality?.name}, {locality?.name}, {city?.name}
        </p>
      </div>
      <p className="propertyPageHeaderPriceTitle">
        Starting at
        <span style={{ color: '#DCAA4C' }}>
          {' '}
          <span>&#8377; {startingPrice}</span>{' '}
        </span>{' '}
        | EMI @
        <span style={{ color: '#DCAA4C' }}>
          {' '}
          <span>&#8377;</span> {emiValue}/month
        </span>
      </p>
      <div className="propertyPageHeaderMobilePropertyTagLine">
        <p>{tagLine}</p>
      </div>
      <div className="propertyPageHeaderOverviewSection">
        <div className="propertyPageHeaderOverviewSectionFlex">
          <AiOutlineHome style={{ color: '#E7B554', fontSize: '25px' }} />
          <p className="propertyPageHeaderOverviewSectionValues">
            {configuration}
          </p>
          <p className="propertyPageHeaderOverviewSectionKeys">Configuration</p>
        </div>
        <div className="propertyPageHeaderOverviewSectionFlex">
          <FaRulerCombined style={{ color: '#E7B554', fontSize: '25px' }} />
          <p className="propertyPageHeaderOverviewSectionValues">{area}</p>
          <p className="propertyPageHeaderOverviewSectionKeys">Sq. Feet area</p>
        </div>
        <div className="propertyPageHeaderOverviewSectionFlex">
          <FaRupeeSign style={{ color: '#E7B554', fontSize: '25px' }} />
          <p className="propertyPageHeaderOverviewSectionValues">
            {squarePrice}
          </p>
          <p className="propertyPageHeaderOverviewSectionKeys">
            Sq. Feet price
          </p>
        </div>
        <div className="propertyPageHeaderOverviewSectionFlex">
          <AiOutlineCalendar style={{ color: '#E7B554', fontSize: '25px' }} />
          <p className="propertyPageHeaderOverviewSectionValues">{status}</p>
          <p className="propertyPageHeaderOverviewSectionKeys">Status</p>
        </div>
      </div>
    </>
  );
}

export default PropertyPageMobileHeaderDetails;
