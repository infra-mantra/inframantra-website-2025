import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import styles from "./PropertyCard.module.css";
import CustomBackdrop from "./Backdrop.jsx";

// Loaded only when a card's enquiry form is opened — no cost to the initial home-page load.
const PropertyPageFloatingContact = dynamic(
  () => import("../property-detail/PropertyPageFloatingContact.jsx"),
  { ssr: false }
);

const FALLBACK =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&auto=format";

export default function PropertyCard({ property }) {
  // next/image serves a resized, modern-format (WebP/AVIF) version sized to the
  // card instead of the full-resolution source — identical visually, far
  // lighter. This project is on Next 12, whose next/image uses the legacy API:
  // layout="fill" + objectFit (the bare `fill` boolean is Next 13+ and throws
  // "must use width and height … or layout='fill'"). Container is position:
  // relative with a fixed height, so fill matches the previous layout exactly.
  const [errored, setErrored] = React.useState(false);
  const [enquiryOpen, setEnquiryOpen] = React.useState(false);
  const router = useRouter();
  const src = errored ? FALLBACK : property.imageGallery?.url || FALLBACK;

  const goToProperty = () => {
    if (property?.slug) router.push(`/property/${property.slug}`);
  };
  const openEnquiry = () => setEnquiryOpen(true);

  return (
    <div className={styles.sharedPropCard}>
      <a href={`/property/${property.slug}`}>
        <div className={styles.propertyImageContainer}>
          <Image
            src={src}
            alt={property.imageGallery?.title || property.name}
            layout="fill"
            objectFit="cover"
            sizes="(max-width: 480px) 60vw, (max-width: 768px) 40vw, (max-width: 1024px) 25vw, 300px"
            className={styles.propertyImage}
            onError={() => setErrored(true)}
          />

          {/* Developer logo overlay — lazy-loaded so it never blocks the card image / initial paint */}
          {property.developer?.developerImg && (
            <img
              src={property.developer.developerImg}
              alt={property.developer.name ? `${property.developer.name} logo` : "Developer logo"}
              loading="lazy"
              decoding="async"
              width="56"
              height="38"
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                width: "56px",
                height: "auto",
                maxHeight: "38px",
                objectFit: "contain",
                background: "rgba(255,255,255,0.92)",
                borderRadius: "4px",
                padding: "3px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                zIndex: 2,
              }}
            />
          )}
        </div>

        <div className={styles.propertyContent}>
          <h3 className={styles.propertyTitle}>{property.name}</h3>

          <p className={styles.propertyLocation}>
            {[property.subLocality?.name, property.locality?.name].filter(Boolean).join(", ")}
          </p>

          {property.configuration && (
            <p className={styles.propertyConfig}>{property.configuration}</p>
          )}

          <p className={styles.propertyPrice}>Starting From Rs. {property.startingPrice}</p>
        </div>
      </a>

      {/* Three actions, outside the <a> — Enquire Now & Brochure open the same enquiry
          form. Sizing and wrapping now live in PropertyCard.module.css alongside the rest
          of the card, so the breakpoints can reach them. */}
      <div className={styles.propCardActions}>
        <button
          type="button"
          onClick={goToProperty}
          className={`${styles.propCardBtn} ${styles.propCardBtnPrimary}`}
        >
          View More
        </button>
        <button
          type="button"
          onClick={openEnquiry}
          className={`${styles.propCardBtn} ${styles.propCardBtnSecondary}`}
        >
          Enquire Now
        </button>
        <button
          type="button"
          onClick={openEnquiry}
          title="Download Brochure"
          className={`${styles.propCardBtn} ${styles.propCardBtnGhost}`}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={styles.propCardBtnIcon}
          >
            <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5z" />
          </svg>
          Brochure
        </button>
      </div>

      {/* Portal to <body> so the fixed-position backdrop escapes any transformed (Swiper) ancestor */}
      {enquiryOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <CustomBackdrop open={enquiryOpen} onClose={() => setEnquiryOpen(false)}>
            <PropertyPageFloatingContact
              name={property.name}
              configuration={property.configuration}
              onClose={() => setEnquiryOpen(false)}
            />
          </CustomBackdrop>,
          document.body
        )}
    </div>
  );
}
