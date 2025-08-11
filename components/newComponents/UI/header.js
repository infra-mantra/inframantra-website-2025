import React, { useState, useEffect } from 'react';
import { MdFavoriteBorder } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MobileMenu from './mobileNavigationComponents';

const leftSideTabs = [
  { title: 'Services', link: '/our-services' },
  { title: 'Testimonials', link: '/testimonials' },
];

const rightSideTabs = [
  { title: 'About Us', link: '/about-us' },
  { title: 'Contact Us', link: '/contact-us' },
];

function NavigationBar({ pageBgd }) {
  const [selectedTab, setSelectedTab] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolledPast90vh, setScrolledPast90vh] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const router = useRouter();

  const checkScreenWidth = () => {
    const width = window.innerWidth;
    setIsDesktop(width >= 769);
    setIsMobile(width <= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  useEffect(() => {
    const currentPath = router.pathname;
    const allTabs = [...leftSideTabs, ...rightSideTabs];
    const tabIndex = allTabs.findIndex((tab) => currentPath.includes(tab.link));
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
      const triggerPoint = 1;
      setScrolledPast90vh(scrollY > triggerPoint);
      setScrollPosition(scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router.pathname, isMobile]);

  const handleTabClick = (link, index) => {
    setSelectedTab(index);
    router.push(link);
  };

  const logoClickHandler = () => {
    setSelectedTab(null);
    router.push('/');
  };

  const toggleDrawer = (open) => (event) => {
    if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  const handlePropertiesClick = () => {
    router.push('/property-listing/city/Gurgaon');
  };

  const propertyTabStyle = router.pathname.includes('property') ? { color: '#e7b554' } : {};

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

  return (
    <div
      className="navBarWrapper"
      style={isMobile ? navBarStyles : { height: pageBgd ? '' : '10vh', position: !pageBgd ? 'absolute' : 'relative' }}
    >

      <div className="navBarTabsWrapper" style={isDesktop ? { color: textColor } : {}}>
        {isDesktop && (
          <p
            className="navBarTabs"
            onClick={handlePropertiesClick}
            id="property-listing-tab"
            style={{ ...propertyTabStyle, color: textColor }}
          >
            Properties
          </p>
        )}
        {isDesktop ? (
          leftSideTabs.map((tab, index) => (
            <Link
              key={index}
              href={tab.link}
              className={`navBarLink ${selectedTab === index ? 'selected' : ''}`}
              onClick={() => handleTabClick(tab.link, index)}
            >
              <p className="navBarTabs" style={{ color: textColor }}>
                {tab.title}
              </p>
            </Link>
          ))
        ) : (
          <MobileMenu />
        )}
      </div>

        {/* Logo */}
      <img
        className="navBarLogo"
        src={
          (isMobile && (scrolledPast90vh || pageBgd)) || (!isMobile && pageBgd)
            ? 'https://inframantra.blr1.cdn.digitaloceanspaces.com/logos/inframantraLogoBlack(2).webp'
            : 'https://inframantra.blr1.cdn.digitaloceanspaces.com/logos/inframantraLogo(1).webp'
        }
        style={{ marginBottom: !pageBgd ? '12px' : '', cursor: 'pointer' }}
        alt="Inframantra-logo"
        onClick={logoClickHandler}
        loading="lazy"
        fetchpriority="high"
        
      />

      <div className="navBarTabsWrapper" style={{ color: textColor }}>
        {isDesktop &&
          rightSideTabs.map((tab, index) => {
            const tabIndex = index + leftSideTabs.length;
            return (
              <Link
                key={tabIndex}
                href={tab.link}
                className={`navBarLink ${selectedTab === tabIndex ? 'selected' : ''}`}
                onClick={() => handleTabClick(tab.link, tabIndex)}
              >
                <p className="navBarTabs" style={{ color: textColor }}>
                  {tab.title}
                </p>
              </Link>
            );
          })}
        <div
          onClick={() => setDrawerOpen(false)}
          className="navBarWishlistIcon"
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <MdFavoriteBorder style={{ color: '#DA0707' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationBar;
