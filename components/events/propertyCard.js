import React, { useEffect, useState } from "react";
import styles from "./propertyCard.module.css";
import { PROJECTS } from "../nri/projectSlider";
import { downloadBrochure } from "../helper/downloadBrochurePdf";
import { FaHome, FaDownload } from "react-icons/fa";
import { TfiRulerAlt2 } from "react-icons/tfi";
import { CiClock2 } from "react-icons/ci";

// Same badge asset the property pages use.
const RERA_APPROVED_IMG =
  "https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/reraApproved.png";

// Formats 7.99 -> "7.99 Cr", 0.85 -> "85 Lakh"
const formatPrice = (cr) => {
  if (!cr && cr !== 0) return null;
  return cr >= 1
    ? `₹ ${cr} Cr`
    : `₹ ${Math.round(cr * 100)} Lakh`;
};

function PropertyCard({ project, detailed = false, onEnquire }) {

  // No brochure PDF on the project record -> fall back to the enquiry form,
  // which is the usual gated-brochure flow. If a `brochure` URL is added
  // later this downloads it directly, no code change needed.
  const handleBrochure = (proj) => {
    if (proj.brochure) {
      downloadBrochure(proj.brochure, proj.name);
      return;
    }
    if (onEnquire) onEnquire(proj);
  };

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [project.images.length]);

  const next = () => {
    setCurrent((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const onDownload = (project) => {
    window.open(project.link, "_blank");
  };

  return (
    <div
      className={`${styles.r_card_pro} ${
        detailed ? styles.r_card_proRich : ""
      }`}
    >

      <div
        className={`${styles.r_imageSlider} ${
          detailed ? styles.r_imageSliderTall : ""
        }`}
      >

        {project.images.map((src, i) => (
          <div
            key={src}
            className={`${styles.r_slide} ${
              i === current ? styles.r_active : ""
            }`}
          >
            <img
              src={src}
              alt={`${project.name} ${i + 1}`}
              loading="lazy"
            />
          </div>
        ))}

        <div className={styles.r_badgeContainer}>
          {detailed && project.developerLogo ? (
            <span className={styles.r_devLogoChip}>
              <img
                src={project.developerLogo}
                alt={project.developer || "Developer"}
                loading="lazy"
              />
            </span>
          ) : (
            project.categories.map((cat) => (
              <span
                key={cat}
                className={styles.r_badge}
              >
                {cat}
              </span>
            ))
          )}
        </div>

        <div className={styles.r_badgeContainerLogo}>
          <img
            src={project.logo}
            alt={project.name}
          />
        </div>

        <button
          className={`${styles.r_arrowC} ${styles.r_arrowLeft}`}
          onClick={prev}
        >
          ‹
        </button>

        <button
          className={`${styles.r_arrowC} ${styles.r_arrowRight}`}
          onClick={next}
        >
          ›
        </button>

      </div>

      <div
        className={`${styles.r_cardBody} ${
          detailed ? styles.r_cardBodyRich : ""
        }`}
      >

        {/* Rich card carries its own header, so only render this in plain mode */}
        {!detailed && (
          <h3 className={styles.r_projectName}>
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
            >
              {project.name}
            </a>
          </h3>
        )}

        {detailed && (
          <>
            {/* Header: name + location on the left, price on the right */}
            <div className={styles.r_lHeader}>

              <div className={styles.r_lHeadLeft}>

                <div className={styles.r_lNameRow}>
                  <h3 className={styles.r_lName}>{project.name}</h3>

                  {/* RERA tag sits beside the name - badge + hover tooltip,
                      same pattern as the property pages */}
                  {project.reraApproved && (
                    <span className={styles.r_reraTooltip}>
                      <img
                        className={styles.r_reraBadge}
                        src={RERA_APPROVED_IMG}
                        alt="RERA Approved"
                        loading="lazy"
                      />
                      <span className={styles.r_reraTooltipText}>
                        {project.rera
                          ? `RERA No. ${project.rera}`
                          : "RERA registered project"}
                      </span>
                    </span>
                  )}
                </div>

                {project.location && (
                  <p className={styles.r_lLocation}>
                    <img src="/icons/mapIconGreen.svg" height={10} alt="" />
                    {project.location}
                  </p>
                )}
              </div>

              {formatPrice(project.priceInrCr) && (
                <div className={styles.r_lHeadRight}>
                  <p className={styles.r_lStartingAt}>Starting at</p>
                  <h3 className={styles.r_lPrice}>
                    <img src="/logos/rupeesSymbol.svg" alt="Rs." />
                    {formatPrice(project.priceInrCr)}
                  </h3>
                </div>
              )}

            </div>

            {/* Overview strip */}
            <div className={styles.r_lOverview}>
              {project.beds && (
                <div className={styles.r_lOverviewItem}>
                  <FaHome className={styles.r_lIcon} />
                  <p>{project.beds}</p>
                </div>
              )}
              {project.size && (
                <div className={styles.r_lOverviewItem}>
                  <TfiRulerAlt2 className={styles.r_lIcon} />
                  <p>{project.size}</p>
                </div>
              )}
              {project.possession && (
                <div className={styles.r_lOverviewItem}>
                  <CiClock2 className={styles.r_lIcon} />
                  <p className={styles.r_lStatusPill}>{project.possession}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <div className={styles.r_lDescription}>
                <p className={styles.r_lClampTwo}>{project.description}</p>
              </div>
            )}

            {/* Buttons - same shape/colour as the listing card */}
            <div className={styles.r_lBtnWrapper}>

              <a
                className={styles.r_lBtn}
                href={project.link}
                target="_blank"
                rel="noreferrer"
              >
                View More
              </a>

              <button
                type="button"
                className={`${styles.r_lBtn} ${styles.r_lBtnBrochure}`}
                onClick={() => handleBrochure(project)}
              >
                <FaDownload className={styles.r_lBtnIcon} />
                Brochure
              </button>

              <button
                type="button"
                className={`${styles.r_lBtn} ${styles.r_lBtnEnquire}`}
                onClick={() => onEnquire && onEnquire(project)}
              >
                Enquire
              </button>

            </div>
          </>
        )}

      </div>

    </div>
  );
}

// `projectIds` lets a page show a specific subset (e.g. a single-project event).
// Omit it and the section keeps its original behaviour: the first 4 projects.
export default function ProjectsSection({ projectIds, detailed = false, onEnquire }) {
  const list = projectIds && projectIds.length
    ? projectIds
        .map((id) => PROJECTS.find((p) => p.id === id))
        .filter(Boolean)
    : PROJECTS.slice(0, 4);

  if (!list.length) return null;

  return (
    <section
      className={`${styles.r_sectionSlider} ${
        detailed ? styles.r_sectionSliderRich : ""
      }`}
    >

      <div
        className={`${styles.r_grid} ${
          list.length === 1 ? styles.r_gridSingle : ""
        }`}
      >
        {list.map((project) => (
          <PropertyCard
            key={project.id}
            project={project}
            detailed={detailed}
            onEnquire={onEnquire}
          />
        ))}
      </div>

    </section>
  );
}