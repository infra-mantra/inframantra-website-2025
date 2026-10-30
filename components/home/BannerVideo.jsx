"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./Banner.module.css";
import skel from "./BannerSkeleton.module.css";
import { PROJECTS, PHOTO_VERSION } from "./heroProjects";

/*
  Home hero banner: one slide per project (data in ./heroProjects.js).

  Each slide renders two layouts; CSS shows the right one for the screen:
    - Desktop (wider than 1180px): the 3:1 photo with the copy on it   <HeroOverlay>
    - Phones/tablets (1180px and below): a coloured band with logos on
      the left and text on the right, the 6:5 photo below               <HeroPoster>

  Slides change every 5 seconds, with the arrows, or by swiping.
  Holding a finger on the banner pauses it.

  Skeleton: a shimmer placeholder (<BannerSkeleton>) covers the banner until
  the first photo has loaded, then fades out.
*/

const SLIDE_MS = 5000;
const SKELETON_MAX_MS = 6000; // never leave the skeleton up longer than this
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

// Shimmer placeholder drawn over the banner while the first photo loads.
// Sits inside .slideshow (which must be position: relative/absolute).
function BannerSkeleton({ hidden }) {
  return (
    <div
      className={`${skel.skeleton} ${hidden ? skel.skeletonHidden : ""}`}
      aria-hidden="true"
    >
      <span className={`${skel.block} ${skel.logo}`} />
      <span className={`${skel.block} ${skel.dev}`} />
      <span className={`${skel.block} ${skel.head}`} />
      <span className={`${skel.block} ${skel.sub}`} />
      <span className={`${skel.block} ${skel.price}`} />
      <span className={`${skel.block} ${skel.loc}`} />
    </div>
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
      {/* <source
        media="(max-width: 1180px)"
        type="image/avif"
        srcSet={srcSet(base, "m", phone, "avif", PHOTO_VERSION)}
        sizes="100vw"
      /> */}
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
// Wrapped text keeps its box at full width, so a centred block with a wrapped
// location looks shifted left. This shrinks the text box to its widest visible
// line (re-measured when the window is resized), so the pair truly centres.
function useFitToText() {
  const ref = useRef(null);
  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const fit = () => {
      box.style.width = "";
      // the text lines themselves (element boxes are always full width)
      const lines = [];
      const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const range = document.createRange();
        range.selectNodeContents(walker.currentNode);
        lines.push(...range.getClientRects());
      }
      if (!lines.length) return;
      const left = box.getBoundingClientRect().left;
      const right = Math.max(...lines.map((r) => r.right));
      box.style.width = `${Math.ceil(right - left)}px`;
    };
    fit();
    document.fonts?.ready.then(fit); // re-measure once the web fonts are in
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return ref;
}

function HeroPoster({ p }) {
  const infoRef = useFitToText();
  const { light, logo, dev, chip } = p.mobile;
  const variant = light ? "c" : "w"; // colour logos on pale bands, white on dark
  const [logoW, logoH] = p.logo;
  return (
    <div className={`${styles.hp} ${light ? styles.hpLight : ""} ${chip ? styles.hpChips : ""}`}>
      <div className={styles.hpBrand}>
        <img
          className={`${styles.hpLogo} ${logoW / logoH > 2 ? styles.logoWide : ""}`}
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
            src={`${IMG}/${dev || `dv-${p.place.dev.k}-${variant}`}.webp`}
            alt={p.developer}
            width={p.place.dev.w}
            height={p.place.dev.h}
            loading="lazy"
            decoding="async"
          />
        </p>
      </div>
      <div className={styles.hpInfo} ref={infoRef}>
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
        className={`${styles.hxLogo} ${place.logo.w / place.logo.h > 2 ? styles.logoWide : ""}`}
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

  // Skeleton: visible until the first photo has loaded (or failed, or timed out).
  const [imgReady, setImgReady] = useState(false);
  const firstSlideRef = useRef(null);
  useEffect(() => {
    const img = firstSlideRef.current?.querySelector("img");
    const done = () => setImgReady(true);
    // With server rendering the image may already be loaded before React
    // attaches onLoad, so check `complete` right away.
    if (!img || (img.complete && img.naturalWidth > 0)) {
      done();
      return;
    }
    img.addEventListener("load", done);
    img.addEventListener("error", done); // don't leave the skeleton stuck
    const safety = setTimeout(done, SKELETON_MAX_MS);
    return () => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
      clearTimeout(safety);
    };
  }, []);

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
          <div
            ref={firstSlideRef}
            className={styles.slideBase}
            style={{ "--mbg": PROJECTS[0].mobile.bg }}
          >
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

          {/* Placeholder until the first photo is ready */}
          <BannerSkeleton hidden={imgReady} />
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
