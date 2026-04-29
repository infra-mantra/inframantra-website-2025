import { useState, useCallback } from "react";
import styles from "./projectSlider.module.css";
import PopUpForm from '../detailSections/CTA_NEW';
// https://inframantra.blr1.cdn.digitaloceanspaces.com/propertyLogo/tulipmonsella/Tulip-Monsella-logo.avif  tulip monsella
// https://inframantra.blr1.cdn.digitaloceanspaces.com/propertyLogo/tulipcrimson/logo.avif   Tulip crimson
// https://inframantra.blr1.digitaloceanspaces.com/propertyLogo/tulipmelrose/images (2).jpeg    Tulip Melrose
// https://inframantra.blr1.cdn.digitaloceanspaces.com/propertyLogo/godrejsora/images%20(8).jpg   Godrej Sora
// https://inframantra.blr1.cdn.digitaloceanspaces.com/propertyLogo/godrejmiraya/Godrej Miraya logo.avif Miraya Godrej


const PROJECTS = [
  {
    id: "Godrej Sora",
    name: "Godrej Sora",
    logo: "https://inframantra.blr1.cdn.digitaloceanspaces.com/propertyLogo/godrejsora/images%20(8).jpg",
    size: "2771 sq.ft. Onwards",
    categories: ["Apartments"],
    beds: "3.5 & 4.5 BHK",
    price: "Starting at ₹9.5 Cr. / $1M",
    link: "https://inframantra.com/property/godrej-sora-sector-53-gurgaon",
    images: [
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Godrej%20Sora/godrej%20sora%201.webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Godrej%20Sora/godrej%20sora%203.webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Godrej%20Sora/godrej%20sora.webp",
    ],
  },
  {
    id: "Godrej Miraya",
    name: "Godrej Miraya",
    categories: ["Apartments"],
    logo: "https://inframantra.blr1.cdn.digitaloceanspaces.com/propertyLogo/godrejmiraya/Godrej Miraya logo.avif",
    size: "2711 sq.ft. Onwards",
    beds: "3 & 4 BHK",
    price: "Starting at ₹15 Cr. / $1.58M",
    link: "https://inframantra.com/property/godrej-miraya-sector-43-gurgaon",
    images: [
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Godrej%20Miraya/godrej%20Miraya%202.webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Godrej%20Miraya/godrej%20Miraya%203.webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Godrej%20Miraya/godrej%20Miraya.webp",
    ],
  },
  {
    id: "westin residences",
    name: "westin residences",
    categories: ["Apartments"],
    logo: "https://inframantra.blr1.cdn.digitaloceanspaces.com/propertyLogo/tulipmelrose/images%20(2).jpeg",
    size: "2537 sq.ft. Onwards",
    beds: "3 & 4 BHK",
    price: "Starting at ₹6.5 Cr. / $686K",
    link: "https://inframantra.com/property/whiteland-the-westin-residences-sector-103-gurugram",
    images: [
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/wenstin/westin%20residences.webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/wenstin/westin%20residences%202.webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/wenstin/westin%20residences%203.webp",
    ],
  },
  {
    id: "Tulip Monsella",
    name: "Tulip Monsella",
    categories: ["Apartments"],
    logo: "https://inframantra.blr1.cdn.digitaloceanspaces.com/propertyLogo/tulipmonsella/Tulip-Monsella-logo.avif",
    size: "2,299 sq. ft. Onwards",
    beds: "3.5, 4.5 & 5.5 BHK",
    price: "Starting at ₹7.99 Cr. / $844K",
    link: "https://inframantra.com/property/tulip-monsella-sector-53-gurgaon",
    images: [
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Tulip%20Monsella/monsella%20(1).webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Tulip%20Monsella/monsella%20(2).webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Tulip%20Monsella/monsella%20(3).webp",
    ],
  },
  {
    id: "Tulip Melrose",
    name: "Tulip Melrose",
    categories: ["Apartments"],
    logo: "https://inframantra.blr1.digitaloceanspaces.com/propertyLogo/tulipmelrose/images%20(2).jpeg",
    size: "3216 sq.ft.",
    beds: "5 BHK",
    price: "Starting at ₹4.66 Cr. / $492K",
    link: "https://inframantra.com/property/tulip-melrose-sector-70-gurgaon",
    images: [
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Tulip%20Melrose/melrose%202.webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Tulip%20Melrose/melrose.webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Tulip%20Melrose/melrose%203.webp",
    ],
  },
  {
    id: "Tulip Crimson",
    name: "Tulip Crimson",
    categories: ["Apartments"],
    logo: "https://inframantra.blr1.cdn.digitaloceanspaces.com/propertyLogo/tulipcrimson/logo.avif",
    size: "3090 sq.ft.",
    beds: "4 BHK",
    price: "Starting at ₹4.40 Cr. / $464K",
    link: "https://inframantra.com/property/tulip-crimson-sector-70-gurgaon",
    images: [
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Tulip%20Crimson/crimson%20(1).webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Tulip%20Crimson/crimson%20(2).webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Tulip%20Crimson/crimson%20(3).webp",
    ],
  },
];


const PAGE_SIZE = 6;

// ── Icons ─────────────────────────────────
const GetQuotesIcon = () => (
  <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h.01M12 10h.01M16 10h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
  </svg>
);

// ── Card ─────────────────────────────────
function ProjectCard({ project, onDownload }) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback((e) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + project.images.length) % project.images.length);
  }, [project.images.length]);

  const next = useCallback((e) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % project.images.length);
  }, [project.images.length]);

  return (
    <div className={styles.card_pro}>
      <div className={styles.imageSlider}>
        {project.images.map((src, i) => (
          <div key={src} className={`${styles.slide} ${i === current ? styles.active : ""}`}>
            <img src={src} alt={`${project.name} ${i + 1}`} loading="lazy" />
          </div>
        ))}

        <div className={styles.badgeContainer}>
          {project.categories.map((cat) => (
            <span key={cat} className={styles.badge}>{cat}</span>
          ))}
        </div>
        <div className={styles.badgeContainerLogo}>
         <img
    src={project.logo}
    alt={project.name}
    style={{
      height: "40px",
      objectFit: "contain",
      background: "#fff",
      padding: "4px",
      borderRadius: "6px"
    }}
  />
        </div>


        <button className={`${styles.arrowC} ${styles.arrowLeft}`} onClick={prev}>‹</button>
        <button className={`${styles.arrowC} ${styles.arrowRight}`} onClick={next}>›</button>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.projectName}>
          <a href={project.link}>{project.name}</a>
        </h3>

        <div className={styles.meta}>
          <span>{project.size}</span>
          <span className={styles.metaDivider} />
          <span>{project.beds}</span>
          <span className={styles.metaDivider} />
          <span>{project.price}</span>
        </div>

        {/* ✅ CONNECTED BUTTON */}
        <button onClick={() => onDownload(project)} className={styles.downloadBtn}>
          <GetQuotesIcon />
          Get Quote
        </button>
      </div>
    </div>
  );
}

// ── Main Section ─────────────────────────
export default function ProjectsSection() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);


  const [popForm, setPopForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const visible = PROJECTS.slice(0, visibleCount);
  const hasMore = visibleCount < PROJECTS.length;

 
  const handleDownload = (project) => {
    console.log(project)
    setSelectedProject(project);
    setPopForm(true);
  };

  const onClickOff = () => setPopForm(false);

  return (
    <section className={styles.sectionSlider} id="discover-projects">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Iconic Residences</p>
        <h2 className={styles.title}>Discover Gurgaon's Premium Luxury Residences</h2>
        <p className={styles.subtitle}>
          Explore extraordinary homes crafted by the master developer across Gurgaon
        </p>
      </div>

      <div className={styles.grid}>
        {visible.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDownload={handleDownload} // ✅ important
          />
        ))}
      </div>

  <PopUpForm
  popUpenable={popForm}
  onClickOff={onClickOff}
   text="TO UNLOCK EXCLUSIVE DEALS"
  name={`USA EXPO ${selectedProject?.name || ""}`}
  phone="+1 (213) 6575060"
  id="nriProject"

/>

      {hasMore && (
        <div className={styles.loadMoreWrapper}>
          <button
            className={styles.loadMoreBtn}
            onClick={() =>
              setVisibleCount((c) => Math.min(c + PAGE_SIZE, PROJECTS.length))
            }
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}