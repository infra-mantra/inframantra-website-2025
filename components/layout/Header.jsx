import React, { useState, useEffect } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useShortlist } from "../shared/shortlist/shortlistStore";
import Link from "next/link";
import { useRouter } from "next/router";
import MobileMenu from "./MobileNavigationComponents.jsx";

const leftSideTabs = [
  { title: "Services", link: "/our-services" },
  { title: "Testimonials", link: "/testimonials" },
  // { title: 'NRI Properties', link: '/usa-nri' },
];

const rightSideTabs = [
  // { title: 'USA EXPO', link: '/usa-nri-event' },
  { title: "About Us", link: "/about-us" },
  { title: "Contact Us", link: "/contact-us" },
];

function NavigationBar({ pageBgd, onlyLogo = false, logoUrl }) {
  const [selectedTab, setSelectedTab] = useState(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const likedCount = useShortlist().length; // ♥ count in the header
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
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  useEffect(() => {
    const currentPath = router.pathname;
    const allTabs = [...leftSideTabs, ...rightSideTabs];

    const tabIndex = allTabs.findIndex((tab) => currentPath.includes(tab.link));

    setSelectedTab(tabIndex !== -1 ? tabIndex : null);
  }, [router.pathname]);

  useEffect(() => {
    if (!isMobile) return;

    if (router.pathname !== "/") {
      setScrolledPast90vh(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolledPast90vh(scrollY > 1);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [router.pathname, isMobile]);

  const handleTabClick = (link, index) => {
    setSelectedTab(index);
    router.push(link);
  };

  const logoClickHandler = () => {
    setSelectedTab(null);
    router.push("/");
  };

  const handlePropertiesClick = () => {
    router.push("/property-listing/search/property-in-india");
  };

  const propertyTabStyle = router.pathname.includes("property") ? { color: "#e7b554" } : {};

  // Home page: the bar is its OWN band above the banner (dark, brand-navy), not
  // laid over the photo — the banner image starts below it, so nothing covers
  // the towers. It stays pinned while the page scrolls, turning light once past
  // the hero so it reads over the white sections.
  const homeGlass = !pageBgd;
  // Desktop home: the bar is pinned; once the page scrolls off the banner it
  // turns light glass with dark text so it stays readable over white sections.
  const [deskScrolled, setDeskScrolled] = useState(false);
  useEffect(() => {
    if (!homeGlass || isMobile) return;
    const onScroll = () => setDeskScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [homeGlass, isMobile]);
  const lightGlass = homeGlass && !isMobile && deskScrolled;
  // Laid OVER the banner photo: fully transparent (no blur, no tint), with only
  // a soft dark shade at the very top so the white logo/menu stay readable.
  const glassStyle = {
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0) 100%)",
  };
  // phones, once scrolled past the banner: a solid dark bar so the menu stays readable
  const mobileScrolledStyle = { background: "rgba(14, 14, 18, 0.94)" };
  // over the photo: white text/logo; once scrolled past the hero on desktop the
  // bar turns light, so it flips to dark
  const textColor = lightGlass ? "#141414" : homeGlass ? "white" : pageBgd ? "black" : "white";

  const navBarStyles = {
    position: isMobile ? "fixed" : "relative",
    top: 0,
    width: "100%",
    zIndex: 1000,
    // home keeps the dark glass band at every scroll position; other pages keep
    // the old transparent -> white behaviour. The spread must come AFTER this
    // line or `backgroundColor` wins and the band goes transparent.
    backgroundColor: isMobile ? (scrolledPast90vh ? "white" : "transparent") : "transparent",
    ...(homeGlass && isMobile
      ? {
          ...(scrolledPast90vh ? mobileScrolledStyle : glassStyle),
          height: "8vh",
          alignItems: "center",
        }
      : {}),
  };

  // ONLY LOGO MODE
  if (onlyLogo) {
    return (
      <div
        className="navBarWrapper"
        style={
          isMobile
            ? navBarStyles
            : {
                height: pageBgd ? undefined : "10vh",
                position: !pageBgd ? "absolute" : "relative",
              }
        }
      >
        <img
          className="navBarLogo"
          src={
            (isMobile && (scrolledPast90vh || pageBgd)) || (!isMobile && pageBgd)
              ? logoUrl
              : logoUrl
          }
          style={{
            marginBottom: !pageBgd ? "12px" : undefined,
            cursor: "pointer",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "0",
            height: "8vh",
          }}
          alt="Inframantra-logo"

          loading="lazy"
          fetchpriority="high"
        />
      </div>
    );
  }

  // FULL NAVBAR
  else {
    return (
      <div
        className="navBarWrapper"
        style={
          isMobile
            ? navBarStyles
            : {
                height: pageBgd ? undefined : "10vh",
                // laid over the banner photo
                position: homeGlass ? "fixed" : "relative",
                top: 0,
                left: 0,
                zIndex: 1000,
                transition: "background 0.3s ease, box-shadow 0.3s ease",
                ...(homeGlass ? glassStyle : {}),
                ...(lightGlass
                  ? {
                      background: "rgba(255, 255, 255, 0.86)",
                      borderBottom: "1px solid rgba(17, 17, 17, 0.06)",
                      boxShadow: "0 6px 22px rgba(17, 17, 17, 0.08)",
                    }
                  : {}),
              }
        }
      >
        {/* Left Side */}
        <div className="navBarTabsWrapper" style={{ color: textColor }}>
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
                className={`navBarLink ${selectedTab === index ? "selected" : ""}`}
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

        {/* Center Logo — self-hosted, pre-compressed (6-7 KB vs ~50 KB), with an
          explicit aspect ratio so it reserves space and doesn't cause CLS. */}
        <img
          className="navBarLogo"
          width={310}
          height={62}
          src={
            lightGlass ||
            (!homeGlass && isMobile && (scrolledPast90vh || pageBgd)) ||
            (!isMobile && pageBgd)
              ? "/logos/nav-black.webp"
              : "/logos/nav-white.webp"
          }
          style={{
            marginBottom: !pageBgd ? "12px" : undefined,
            cursor: "pointer",
          }}
          alt="Inframantra-logo"
          onClick={logoClickHandler}
          loading="eager"
          fetchpriority="high"
        />

        {/* Right Side */}
        <div className="navBarTabsWrapper" style={{ color: textColor }}>
          {isDesktop &&
            rightSideTabs.map((tab, index) => {
              const tabIndex = index + leftSideTabs.length;

              return (
                <Link
                  key={tabIndex}
                  href={tab.link}
                  className={`navBarLink ${selectedTab === tabIndex ? "selected" : ""}`}
                  onClick={() => handleTabClick(tab.link, tabIndex)}
                >
                  <p className="navBarTabs" style={{ color: textColor }}>
                    {tab.title}
                  </p>
                </Link>
              );
            })}

          {/* ♥ Shortlist: right-most, opens the liked properties (count badge when any) */}
          {
            <Link href="/shortlist" passHref legacyBehavior>
              <a
                className="navBarShortlist"
                aria-label={`Shortlist${likedCount ? ` (${likedCount} saved)` : ""}`}
                title="Your shortlist"
                style={{ color: textColor }}
              >
                {likedCount ? (
                  <MdFavorite aria-hidden="true" />
                ) : (
                  <MdFavoriteBorder aria-hidden="true" />
                )}
                {likedCount > 0 && <span className="navBarShortlistCount">{likedCount}</span>}
              </a>
            </Link>
          }
        </div>
      </div>
    );
  }
}

export default NavigationBar;
