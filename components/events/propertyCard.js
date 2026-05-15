import React, { useEffect, useState } from "react";
import styles from "./propertyCard.module.css";
import { PROJECTS } from "../nri/projectSlider";

function PropertyCard({ project }) {
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
    <div className={styles.r_card_pro}>

      <div className={styles.r_imageSlider}>

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
          {project.categories.map((cat) => (
            <span
              key={cat}
              className={styles.r_badge}
            >
              {cat}
            </span>
          ))}
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

      <div className={styles.r_cardBody}>

        <h3 className={styles.r_projectName}>
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
          >
            {project.name}
          </a>
        </h3>    

      </div>

    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section className={styles.r_sectionSlider}>

      <div className={styles.r_grid}>
        {PROJECTS.slice(0, 4).map((project) => (
          <PropertyCard
            key={project.id}
            project={project}
          />
        ))}
      </div>

    </section>
  );
}