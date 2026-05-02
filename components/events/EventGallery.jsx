import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./EventGallery.module.css";

const EventGallery = ({
  images = [],
  autoplay = true,
  autoplayInterval = 4500,
  stats = [
    { number: "500+", label: "Families" },
    { number: "50+", label: "Projects" },
    { number: "12+", label: "Cities" },
  ],
  showStats = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const autoplayRef = useRef(null);
  const touchStartX = useRef(null);

  const totalImages = images.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  /* ============================================
     AUTOPLAY
     ============================================ */

  useEffect(() => {
    if (!autoplay || isPaused || isLightboxOpen || totalImages <= 1) return;

    autoplayRef.current = setInterval(() => {
      nextSlide();
    }, autoplayInterval);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [
    autoplay,
    autoplayInterval,
    isPaused,
    isLightboxOpen,
    nextSlide,
    totalImages,
  ]);

  /* ============================================
     LIGHTBOX
     ============================================ */

  useEffect(() => {
    if (!isLightboxOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen, nextSlide, prevSlide]);

  /* ============================================
     TOUCH SUPPORT
     ============================================ */

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const diff =
      touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }

    touchStartX.current = null;
  };

  if (!images || totalImages === 0) return null;

  return (
    <>
             <div className={styles.bottomCaptionWrap}>
            <p className={`${styles.bottomCaption} ${styles.fontClr} ${styles.fontWt}`}>
              Happy Clients at our successfull events
            </p>
          </div>

      <div className={styles.gallery}>
      
        <div
          className={styles.sliderWrap}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slides */}
          <div
            className={styles.sliderTrack}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {images.map((img, i) => (
              <div className={styles.slide} key={i}>
                <img
                  src={img.src}
                  alt={img.alt || `Event image ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          {/* Counter */}
          <div className={styles.counter}>
            <span className={styles.current}>
              {String(currentIndex + 1).padStart(2, "0")}
            </span>

            <span className={styles.divider}>/</span>

            <span>
              {String(totalImages).padStart(2, "0")}
            </span>
          </div>

          {/* Navigation */}
          {totalImages > 1 && (
            <>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navPrev}`}
                onClick={prevSlide}
                aria-label="Previous image"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M15 6L9 12L15 18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                className={`${styles.navBtn} ${styles.navNext}`}
                onClick={nextSlide}
                aria-label="Next image"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M9 6L15 12L9 18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Dots */}
          {totalImages > 1 && (
            <div className={styles.dots}>
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.dot} ${
                    i === currentIndex
                      ? styles.dotActive
                      : ""
                  }`}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Caption BELOW image */}
        {images[currentIndex]?.caption && (
          <div className={styles.bottomCaptionWrap}>
            <p className={styles.bottomCaption}>
              {images[currentIndex].caption}
            </p>
          </div>
        )}

      
      </div>

      {/* ============================================
         LIGHTBOX
         ============================================ */}

      {isLightboxOpen && (
        <div
          className={styles.lightbox}
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M6 6L18 18M6 18L18 6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {totalImages > 1 && (
            <>
              <button
                type="button"
                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                aria-label="Previous"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M15 6L9 12L15 18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                aria-label="Next"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M9 6L15 12L9 18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          <div
            className={styles.lightboxImageWrap}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex].src}
              alt={
                images[currentIndex].alt ||
                `Image ${currentIndex + 1}`
              }
              key={currentIndex}
              className={styles.lightboxImage}
            />

            {images[currentIndex].caption && (
              <p className={styles.lightboxCaption}>
                {images[currentIndex].caption}
              </p>
            )}
          </div>

          <div className={styles.lightboxCounter}>
            <span className={styles.lightboxCurrent}>
              {String(currentIndex + 1).padStart(2, "0")}
            </span>

            <span className={styles.lightboxDividerText}>
              /
            </span>

            <span>
              {String(totalImages).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default EventGallery;