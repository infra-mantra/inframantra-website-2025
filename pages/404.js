import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import useMediaQuery from '../utils/useMediaQuery.js';
import Button from '../common/button/button.jsx';


export const config = {
  runtime: 'nodejs',
};

function NotFoundPage() {
  const isDesktop = useMediaQuery(768);
  const router = useRouter();

  return (
    <div className="notFoundPageWrapper">
      {isDesktop ? (
        <div className="notFoundPageDesktopContainer">
          <div className="notFoundPageDesktopLeftContainer">
            <div className="notFoundPageDesktopLeftFlex">
              <h2>404</h2>
              <h4>
                <span style={{ color: '#E4A951' }}>Oops! </span>Seems You've Taken a Wrong Turn.
              </h4>
              <p>
                But don't worry, our expert sales team is here to help you find your perfect home. Let us guide you back on track!
              </p>
              <Button
                btnText="Back To Home"
                width="25vw"
                padding="10px"
                otherStyles={{ fontSize: '30px', fontWeight: '800' }}
                onClick={() => router.push('/')}
              />
            </div>
          </div>
          <div className="notFoundPageDesktopRightContainer">
            <Image
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/home-building.png"
              alt="404 not found"
              width={500}
              height={500}
            />
          </div>
        </div>
      ) : (
        <div className="notFoundPageDesktopContainer">
          <h2>404</h2>
          <h4>
            <span style={{ color: '#E4A951' }}>Oops! </span>Seems You've Taken a Wrong Turn.
          </h4>
          <Image
            src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/home-building.png"
            alt="404 not found"
            width={500}
            height={500}
          />
          <p>
            But don't worry, our expert sales team is here to help you find your perfect home. Let us guide you back on track!
          </p>
          <Button
            btnText="Back To Home"
            width="60vw"
            padding="10px"
            otherStyles={{ fontSize: '20px', fontWeight: '800' }}
            onClick={() => router.push('/')}
          />
        </div>
      )}
    </div>
  );
}

export default NotFoundPage;
