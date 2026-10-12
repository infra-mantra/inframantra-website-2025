"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./Banner.module.css";
import { PROJECTS, PHOTO_VERSION } from "./heroProjects";

/*
  Home hero banner: one slide per project (data in ./heroProjects.js).

  Each slide renders two layouts; CSS shows the right one for the screen:
    - Desktop (wider than 1180px): the 3:1 photo with the copy on it   <HeroOverlay>
    - Phones/tablets (1180px and below): a coloured band with logos on
      the left and text on the right, the 6:5 photo below               <HeroPoster>

  Slides change every 5 seconds, with the arrows, or by swiping.
  Holding a finger on the banner pauses it.
*/

const SLIDE_MS = 5000;
const IMG = "/banner/hero";

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path
      d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
      fill="currentColor"
    />
  </svg>
);

// Previous / next button. `className` places it; the look comes from .heroArrow.
export function SlideArrow({ direction, onClick, label, className = "" }) {
  const path = direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6";
  return (
    <button
      type="button"
      className={`${styles.heroArrow} ${className}`}
      aria-label={label}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// "base-d1440.webp 1440w, base-d1920.webp 1920w, ..." for srcSet
const srcSet = (base, size, widths, ext, version = "") =>
  widths.map((w) => `${base}-${size}${w}.${ext}${version} ${w}w`).join(", ");

// The slide photo: the 6:5 phone crop up to 1180px, the 3:1 desktop band above.
// `priority` = the always-on copy of slide 1: loaded first, and given an empty
// alt because the same slide appears again in the rotation.
function HeroPicture({ p, priority }) {
  const base = `${IMG}/${p.key}`;
  const phone = [780, 1170];
  const desktop = [1440, 1920, 2560, 3200];
  return (
    <picture>
      <source
        media="(max-width: 1180px)"
        type="image/avif"
        srcSet={srcSet(base, "m", phone, "avif", PHOTO_VERSION)}
        sizes="100vw"
      />
      <source
        media="(max-width: 1180px)"
        type="image/webp"
        srcSet={srcSet(base, "m", phone, "webp", PHOTO_VERSION)}
        sizes="100vw"
      />
      <source
        type="image/avif"
        srcSet={srcSet(base, "d", desktop, "avif", PHOTO_VERSION)}
        sizes="100vw"
      />
      <img
        src={`${base}-d1920.webp${PHOTO_VERSION}`}
        srcSet={srcSet(base, "d", desktop, "webp", PHOTO_VERSION)}
        sizes="100vw"
        alt={priority ? "" : `${p.name}, ${p.location}`}
        className={styles.heroImg}
        draggable="false"
        width="1920"
        height="640"
        loading={priority ? "eager" : "lazy"}
        fetchpriority={priority ? "high" : "low"}
        decoding={priority ? "sync" : "async"}
      />
    </picture>
  );
}

// Phones/tablets: logos on the left, BHK headline and location on the right.
function HeroPoster({ p }) {
  const { light, logo } = p.mobile;
  const variant = light ? "c" : "w"; // colour logos on pale bands, white on dark
  const [logoW, logoH] = p.logo;
  return (
    <div className={`${styles.hp} ${light ? styles.hpLight : ""}`}>
      <div className={styles.hpBrand}>
        <img
          className={styles.hpLogo}
          src={`${IMG}/${logo || `pl-${p.key}-${variant}`}.webp`}
          alt={`${p.name} logo`}
          width={logoW}
          height={logoH}
          loading="lazy"
          decoding="async"
        />
        <p className={styles.hpBy}>
          <span>by</span>
          <img
            src={`${IMG}/dv-${p.place.dev.k}-${variant}.webp`}
            alt={p.developer}
            width={p.place.dev.w}
            height={p.place.dev.h}
            loading="lazy"
            decoding="async"
          />
        </p>
      </div>
      <div className={styles.hpInfo}>
        <p className={styles.hpHead}>
          <span>{p.place.head}</span>
          {p.place.sub || "Luxury Residences"}
        </p>
        <p className={styles.hpLoc}>
          <PinIcon />
          {p.location}
        </p>
      </div>
    </div>
  );
}

// Developer logo CSS for special cases (see `dev` in heroProjects.js).
function devLogoClass(dev, isDarkTheme) {
  if (dev.v === "box") return styles.hxDevTile; // logo is its own coloured tile
  if (dev.v === "c" && !isDarkTheme) return styles.hxDevGlow; // colour logo on a dark photo
  return undefined;
}

// Desktop: logos and copy placed on the photo (see `place` in heroProjects.js).
function HeroOverlay({ p }) {
  const { place } = p;
  const sub = place.sub || "Luxury Residences";
  const isDarkTheme = place.theme === "dark";
  const inCorner = place.brand === "tl" || place.brand === "tr";
  const devVariant = place.dev.v || (isDarkTheme ? "c" : "w");

  const logos = (
    <>
      <img
        className={styles.hxLogo}
        src={`${IMG}/pl-${p.key}-${place.logo.v}.webp`}
        alt={`${p.name} logo`}
        width={place.logo.w}
        height={place.logo.h}
        loading="lazy"
        decoding="async"
      />
      <p className={styles.hxDev}>
        <span>by</span>
        <img
          src={`${IMG}/dv-${place.dev.k}-${devVariant}.webp`}
          className={devLogoClass(place.dev, isDarkTheme)}
          alt={p.developer}
          width={place.dev.w}
          height={place.dev.h}
          loading="lazy"
          decoding="async"
        />
      </p>
    </>
  );

  const brandClasses = [
    styles.hxBrand,
    place.brand === "tr" ? styles.hxBrandRight : "",
    place.brandStrong ? styles.hxStrong : "",
    isDarkTheme ? styles.hxDark : "",
  ];
  const copyClasses = [
    styles.hxCopy,
    place.info === "right" ? styles.hxRight : "",
    place.brand === "row" ? styles.hxRow : "",
    place.strong ? styles.hxStrong : "",
    isDarkTheme ? styles.hxDark : "",
  ];
  const copyPosition = { "--hx-top": place.top };
  if (place.x) copyPosition["--hx-x"] = place.x;

  return (
    <>
      {inCorner && (
        <div
          className={brandClasses.join(" ")}
          style={place.brandX ? { left: place.brandX } : undefined}
        >
          {logos}
        </div>
      )}
      <div className={copyClasses.join(" ")} style={copyPosition}>
        {!inCorner && <div className={styles.hxStackBrand}>{logos}</div>}
        <div className={styles.hxText}>
          <p className={styles.hxHead}>
            {place.head}
            <span>{sub}</span>
          </p>
          <p className={styles.hxPrice}>
            Price starting at <b>₹{p.price}*</b>
          </p>
          <p className={styles.hxLoc}>
            <PinIcon />
            {p.location}
          </p>
        </div>
      </div>
    </>
  );
}

// Everything inside one slide. Also used by the Featured Project card.
export function HeroSlide({ p, priority = false }) {
  return (
    <>
      <HeroPicture p={p} priority={priority} />
      <HeroPoster p={p} />
      <HeroOverlay p={p} />
    </>
  );
}

// Class names for slide `index`: which one is showing, which is fading out.
export function slideClasses(index, active, prev) {
  return [
    styles.slide,
    index === active ? styles.isActive : "",
    index === prev ? styles.isPrev : "",
    index === active && prev === -1 ? styles.isInstant : "",
  ].join(" ");
}

const BannerVideo = () => {
  // `active` = slide on screen, `prev` = slide fading out underneath it (-1 = none).
  const [{ active, prev }, setSlide] = useState({ active: 0, prev: -1 });

  // Slides 2-8 mount 2s after the page has loaded (or on the first scroll/tap/
  // mouse move, if sooner), so their images never compete with the first photo
  // while the page loads, yet are ready before the first change at 5s.
  const [showSlides, setShowSlides] = useState(false);
  useEffect(() => {
    const reveal = () => setShowSlides(true);
    const events = ["scroll", "mousemove", "touchstart", "keydown", "click"];
    events.forEach((e) => window.addEventListener(e, reveal, { passive: true, once: true }));
    let timer;
    const afterLoad = () => (timer = setTimeout(reveal, 2000));
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    return () => {
      events.forEach((e) => window.removeEventListener(e, reveal));
      window.removeEventListener("load", afterLoad);
      clearTimeout(timer);
    };
  }, []);

  const goTo = (index) => {
    setShowSlides(true);
    setSlide(({ active: current }) => {
      const next = (index + PROJECTS.length) % PROJECTS.length;
      return next === current ? { active: current, prev: -1 } : { active: next, prev: current };
    });
  };

  // Every slide shows for a full 5s, from page load on. The clock stops while
  // the tab is hidden or a finger is held on the banner, and restarts from 5s
  // when the visitor comes back / lets go (changing `restart` re-runs the timer).
  const holding = useRef(false);
  const [restart, setRestart] = useState(0);
  const restartClock = () => setRestart((n) => n + 1);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!document.hidden && !holding.current) goTo(active + 1);
    }, SLIDE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, restart]);
  useEffect(() => {
    const onVisible = () => !document.hidden && restartClock();
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // Swipe left/right on touch screens. A swipe must not also open the project.
  const touch = useRef({ startX: 0, swiped: false });
  const onTouchStart = (e) => {
    touch.current = { startX: e.touches[0].clientX, swiped: false };
    holding.current = true;
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.startX;
    if (Math.abs(dx) > 40) {
      touch.current.swiped = true;
      goTo(active + (dx < 0 ? 1 : -1));
    }
    holding.current = false;
    restartClock(); // a full 5s again after letting go
  };
  const openProject = () => {
    if (touch.current.swiped) {
      touch.current.swiped = false;
      return;
    }
    window.location.href = `/property/${PROJECTS[active].slug}`;
  };

  return (
    <>
      <div className={styles.demoBanner}>
        <div className={styles.slideshow}>
          {/* First slide, painted immediately (the page's main image). */}
          <div className={styles.slideBase} style={{ "--mbg": PROJECTS[0].mobile.bg }}>
            <HeroSlide p={PROJECTS[0]} priority />
          </div>

          {showSlides &&
            PROJECTS.map((p, index) => (
              <div
                key={p.key}
                className={slideClasses(index, active, prev)}
                style={{ "--mbg": p.mobile.bg }}
                aria-hidden={index !== active}
              >
                <HeroSlide p={p} />
              </div>
            ))}
        </div>
      </div>

      {/* Tap/click area over the banner (stops above the search bar). */}
      <div
        className={styles.clickLayer}
        onClick={openProject}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="link"
        aria-label={`Open ${PROJECTS[active].name}`}
      />

      <SlideArrow
        direction="prev"
        label="Previous project"
        className={styles.heroArrowLeft}
        onClick={() => goTo(active - 1)}
      />
      <SlideArrow
        direction="next"
        label="Next project"
        className={styles.heroArrowRight}
        onClick={() => goTo(active + 1)}
      />
    </>
  );
};

export default BannerVideo;
