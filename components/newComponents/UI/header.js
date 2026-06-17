import React, { useState, useEffect } from 'react';
import { MdFavoriteBorder } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MobileMenu from './mobileNavigationComponents';

const leftSideTabs = [
  { title: 'Services', link: '/our-services' },
  { title: 'Testimonials', link: '/testimonials' },
  // { title: 'NRI Properties', link: '/usa-nri' },
];

const rightSideTabs = [
  // { title: 'USA EXPO', link: '/usa-nri-event' },
  { title: 'About Us', link: '/about-us' },
  { title: 'Contact Us', link: '/contact-us' },
];

  
function NavigationBar({ pageBgd, onlyLogo = false, logoUrl }) {
  const [selectedTab, setSelectedTab] = useState(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolledPast90vh, setScrolledPast90vh] = useState(false);

  const router = useRouter();

  const checkScreenWidth = () => {
    const width = window.innerWidth;
    setIsDesktop(width >= 769);
    setIsMobile(width <= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  useEffect(() => {
    const currentPath = router.pathname;
    const allTabs = [...leftSideTabs, ...rightSideTabs];

    const tabIndex = allTabs.findIndex((tab) =>
      currentPath.includes(tab.link)
    );

    setSelectedTab(tabIndex !== -1 ? tabIndex : null);
  }, [router.pathname]);

  useEffect(() => {
    if (!isMobile) return;

    if (router.pathname !== '/') {
      setScrolledPast90vh(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolledPast90vh(scrollY > 1);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [router.pathname, isMobile]);

  const handleTabClick = (link, index) => {
    setSelectedTab(index);
    router.push(link);
  };

  const logoClickHandler = () => {
    setSelectedTab(null);
    router.push('/');
  };

  const handlePropertiesClick = () => {
    router.push('/property-listing/search/property-in-india');
  };

  const propertyTabStyle = router.pathname.includes('property')
    ? { color: '#e7b554' }
    : {};

  const textColor = isMobile
    ? scrolledPast90vh
      ? 'black'
      : 'white'
    : pageBgd
    ? 'black'
    : 'white';

  const navBarStyles = {
    position: isMobile ? 'fixed' : 'relative',
    top: 0,
    width: '100%',
    zIndex: 1000,
    backgroundColor: isMobile
      ? scrolledPast90vh
        ? 'white'
        : 'transparent'
      : 'transparent',
  };

  console.log(onlyLogo,"%%%%%%%%%%")

  // ONLY LOGO MODE
  if (onlyLogo) {
    return (  
      <div
        className="navBarWrapper"
        style={
          isMobile
            ? navBarStyles
            : {
                height: pageBgd ? '' : '10vh',
                position: !pageBgd ? 'absolute' : 'relative',
              }
        }
      >
        <img
          className="navBarLogo"
          src={
            (isMobile && (scrolledPast90vh || pageBgd)) ||
            (!isMobile && pageBgd)
              ? logoUrl
              : logoUrl
          }
          style={{
            marginBottom: !pageBgd ? '12px' : '',
            cursor: 'pointer',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop:"0",
            height:"8vh"
          }}
          alt="Inframantra-logo"
        
          loading="lazy"
          fetchpriority="high"
        />
      </div>
    );
  }

  // FULL NAVBAR

  else{
    
  return (
    <div
      className="navBarWrapper"
      style={
        isMobile
          ? navBarStyles
          : {
              height: pageBgd ? '' : '10vh',
              position: !pageBgd ? 'absolute' : 'relative',
            }
      }
    >
      {/* Left Side */}
      <div
        className="navBarTabsWrapper"
        style={isDesktop ? { color: textColor } : {}}
      >
        {isDesktop && (
          <p
            className="navBarTabs"
            onClick={handlePropertiesClick}
            id="property-listing-tab"
            style={{
              ...propertyTabStyle,
              color: propertyTabStyle.color || textColor,
            }}
          >
            Properties
          </p>
        )}

        {isDesktop ? (
          leftSideTabs.map((tab, index) => (
            <Link
              key={index}
              href={tab.link}
              className={`navBarLink ${
                selectedTab === index ? 'selected' : ''
              }`}
              onClick={() => handleTabClick(tab.link, index)}
            >
              <p
                className="navBarTabs"
                style={{ color: textColor }}
              >
                {tab.title}
              </p>
            </Link>
          ))
        ) : (
          <MobileMenu />
        )}
      </div>

      {/* Center Logo */}
      <img
        className="navBarLogo"
        src={
          (isMobile && (scrolledPast90vh || pageBgd)) ||
          (!isMobile && pageBgd)
            ? 'https://inframantra.blr1.cdn.digitaloceanspaces.com/logos/inframantraLogoBlack(2).webp'
            : 'https://inframantra.blr1.cdn.digitaloceanspaces.com/logos/inframantraLogo(1).webp'
        }
        style={{
          marginBottom: !pageBgd ? '12px' : '',
          cursor: 'pointer',
        }}
        alt="Inframantra-logo"
        onClick={logoClickHandler}
        loading="lazy"
        fetchpriority="high"
      />

      {/* Right Side */}
      <div
        className="navBarTabsWrapper"
        style={{ color: textColor }}
      >
        {isDesktop &&
          rightSideTabs.map((tab, index) => {
            const tabIndex = index + leftSideTabs.length;

            return (
              <Link
                key={tabIndex}
                href={tab.link}
                className={`navBarLink ${
                  selectedTab === tabIndex ? 'selected' : ''
                }`}
                onClick={() => handleTabClick(tab.link, tabIndex)}
              >
                <p
                  className="navBarTabs"
                  style={{ color: textColor }}
                >
                  {tab.title}
                </p>
              </Link>
            );
          })}

        <div className="navBarWishlistIcon">
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
            }}
          >
            <MdFavoriteBorder
              style={{ color: '#DA0707' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
}

export default NavigationBar;