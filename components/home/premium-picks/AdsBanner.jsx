"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./AdsBanner.module.css";
import hero from "../Banner.module.css";
import { PROJECTS } from "../heroProjects";
import { HeroSlide, slideClasses } from "../BannerVideo.jsx";

/*
  Home "Featured Project" card: the same slides as the hero banner (data in
  ../heroProjects.js, same order as the API), in a rounded card.
  It never slides by itself — only the arrows (beside the card on desktop,
  under it on phones/tablets) or a swipe change the slide.
*/

const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
    <path
      d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z"
      fill="currentColor"
    />
  </svg>
);

const Chevron = ({ direction }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path
      d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function AdsBanner() {
  // `active` = slide on screen, `prev` = slide fading out underneath it (-1 = none).
  const [{ active, prev }, setSlide] = useState({ active: 0, prev: -1 });

  // Slides 2-8 mount only once the card is near the screen.
  const [allMounted, setAllMounted] = useState(false);
  const cardRef = useRef(null);
  useEffect(() => {
    const card = cardRef.current;
    if (!card || typeof IntersectionObserver === "undefined") return setAllMounted(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setAllMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const goTo = (index) => {
    setAllMounted(true);
    setSlide(({ active: current }) => {
      const next = (index + PROJECTS.length) % PROJECTS.length;
      return next === current ? { active: current, prev: -1 } : { active: next, prev: current };
    });
  };

  // Swipe left/right on touch screens. A swipe must not also open the project.
  const touch = useRef({ startX: 0, swiped: false });
  const onTouchStart = (e) => {
    touch.current = { startX: e.touches[0].clientX, swiped: false };
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.startX;
    if (Math.abs(dx) > 40) {
      touch.current.swiped = true;
      goTo(active + (dx < 0 ? 1 : -1));
    }
  };
  const onSlideClick = (e) => {
    if (touch.current.swiped) {
      touch.current.swiped = false;
      e.preventDefault();
    }
  };

  return (
    <div className={styles.imgContainer}>
      <div className={styles.adFrame}>
        <div
          ref={cardRef}
          className={`${styles.adCard} ${hero.inCard}`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {PROJECTS.map((p, index) =>
            !allMounted && index > 0 ? null : (
              <a
                key={p.key}
                href={`/property/${p.slug}`}
                onClick={onSlideClick}
                className={slideClasses(index, active, prev)}
                style={{ "--mbg": p.mobile.bg }}
                aria-hidden={index !== active}
                tabIndex={index === active ? 0 : -1}
                aria-label={`${p.name}, explore project`}
              >
                <HeroSlide p={p} />
              </a>
            )
          )}

          <span className={styles.adTag}>
            <StarIcon />
            Featured Project
          </span>
        </div>

        <div className={styles.adNav}>
          <button
            type="button"
            className={`${styles.adArrow} ${styles.adArrowLeft}`}
            aria-label="Previous featured project"
            onClick={() => goTo(active - 1)}
          >
            <Chevron direction="prev" />
          </button>
          <button
            type="button"
            className={`${styles.adArrow} ${styles.adArrowRight}`}
            aria-label="Next featured project"
            onClick={() => goTo(active + 1)}
          >
            <Chevron direction="next" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdsBanner;
