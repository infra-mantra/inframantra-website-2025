import { useState, useCallback, useEffect } from "react";
import styles from "./projectSlider.module.css";
import PopUpForm from "../detailSections/POPUPCTA";

// =====================================================
// CURRENCY CONVERSION (free API, no key needed)
// =====================================================
const RATE_CACHE_KEY = "usd_inr_rate";
const RATE_TTL_MS = 12 * 60 * 60 * 1000; // refresh every 12 hours
const FALLBACK_RATE = 95.84; // safety fallback if API fails

// Free APIs (no auth):
//   https://open.er-api.com/v6/latest/USD       (returns rates.INR)
//   https://api.frankfurter.app/latest?from=USD&to=INR
// We try the first; if it fails, fall back to the second, then to FALLBACK_RATE.

async function fetchUsdInrRate() {
  // Try open.er-api.com
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    const rate = data && data.rates && data.rates.INR;
    if (rate && typeof rate === "number") return rate;
  } catch (err) {
    // fall through
  }

  // Try frankfurter.app
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=INR");
    const data = await res.json();
    const rate = data && data.rates && data.rates.INR;
    if (rate && typeof rate === "number") return rate;
  } catch (err) {
    // fall through
  }

  return FALLBACK_RATE;
}

// Custom hook — fetches once per session, caches in localStorage for 12h
function useUsdInrRate() {
  const [rate, setRate] = useState(FALLBACK_RATE);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Check cache
      try {
        const raw = localStorage.getItem(RATE_CACHE_KEY);
        if (raw) {
          const cached = JSON.parse(raw);
          if (cached && cached.rate && Date.now() - cached.ts < RATE_TTL_MS) {
            if (!cancelled) setRate(cached.rate);
            return;
          }
        }
      } catch (err) {
        // ignore
      }

      // Fetch fresh
      const fresh = await fetchUsdInrRate();
      if (cancelled) return;
      setRate(fresh);
      try {
        localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({ rate: fresh, ts: Date.now() }));
      } catch (err) {
        // ignore
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return rate;
}

// Convert INR (in crores) to USD with standard formatting
//   $1,250,000 -> "$1.25M"
//   $844,000   -> "$844K"
//   $1,575,000 -> "$1.58M"
function formatUsdFromInrCr(inrCr, usdInrRate) {
  if (!inrCr || !usdInrRate) return "";
  const inrAbsolute = inrCr * 1e7; // 1 Cr = 10,000,000
  const usd = inrAbsolute / usdInrRate;

  if (usd >= 1_000_000) {
    // Millions — show one or two decimals
    const m = usd / 1_000_000;
    return `$${m.toFixed(m >= 10 ? 1 : 2)}M`;
  }
  if (usd >= 1_000) {
    // Thousands — round to nearest thousand
    const k = Math.round(usd / 1_000);
    return `$${k}K`;
  }
  return `$${Math.round(usd)}`;
}

// Standard INR display: "₹9.5 Cr." style
function formatInrCr(inrCr) {
  if (inrCr >= 100) return `₹${(inrCr / 100).toFixed(2)} Cr.`; // 100 Cr+ unusual
  // Keep at most 2 decimals, strip trailing zeros
  const str = inrCr.toFixed(2).replace(/\.?0+$/, "");
  return `₹${str} Cr.`;
}

function buildPriceLabel(inrCr, usdInrRate) {
  return `Starting at ${formatInrCr(inrCr)} / ${formatUsdFromInrCr(inrCr, usdInrRate)}`;
}
// =====================================================

// PROJECTS — now use `priceInrCr` (numeric, in crores) instead of hardcoded string
export const PROJECTS = [
  {
    id: "Godrej Sora",
    name: "Godrej Sora",
    logo: "https://inframantra.blr1.cdn.digitaloceanspaces.com/propertyLogo/godrejsora/images%20(8).jpg",
    size: "2771 sq.ft. Onwards",
    categories: ["Apartments"],
    beds: "3.5 & 4.5 BHK",
    priceInrCr: 9.5,
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
    priceInrCr: 15,
    link: "https://inframantra.com/property/godrej-miraya-sector-43-gurgaon",
    images: [
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Godrej%20Miraya/godrej%20Miraya%202.webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Godrej%20Miraya/godrej%20Miraya%203.webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Godrej%20Miraya/godrej%20Miraya.webp",
    ],
  },
  {
    id: "Tulip Monsella",
    name: "Tulip Monsella",
    categories: ["Apartments"],
    logo: "https://inframantra.blr1.cdn.digitaloceanspaces.com/propertyLogo/tulipmonsella/Tulip-Monsella-logo.avif",
    size: "2,299 sq. ft. Onwards",
    beds: "3.5, 4.5 & 5.5 BHK",
    priceInrCr: 7.99,
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
    priceInrCr: 4.66,
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
    priceInrCr: 4.4,
    link: "https://inframantra.com/property/tulip-crimson-sector-70-gurgaon",
    images: [
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Tulip%20Crimson/crimson%20(1).webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Tulip%20Crimson/crimson%20(2).webp",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-page%20/Tulip%20Crimson/crimson%20(3).webp",
    ],
  },
  {
    id: "BPTP Downtown 66",
    name: "BPTP Downtown 66",
    categories: ["Apartments"],
    logo: "https://inframantra.blr1.cdn.digitaloceanspaces.com/developer/bptplimited/bptplimited.avif",
    size: "2600 sq.ft. Onwards",
    beds: "3.5BHK",
    priceInrCr: 6.5,
    link: "https://inframantra.com/property/bptp-downtown-66-sector-66-gurgaon",
    images: [
      "https://inframantra.blr1.digitaloceanspaces.com/properties/bptpdowntown66/BPTP%20Downtown%2066%20Gurgaon%202.jpg",
      "https://inframantra.blr1.digitaloceanspaces.com/properties/bptpdowntown66/BPTP%20Downtown%2066%20Gurgaon%203.jpg",
      "https://inframantra.blr1.digitaloceanspaces.com/properties/bptpdowntown66/BPTP%20Downtown%2066%20Gurgaon%201.jpg",
    ],
  },
  {
    id: "DLF Arbour",
    name: "DLF Arbour",
    categories: ["Apartments"],
    logo: "https://inframantra.blr1.cdn.digitaloceanspaces.com/propertyLogo/dlfthearbour/dlfthearbour.avif",
    size: "4200 sq.ft.",
    beds: "4BHK + STUDY",
    priceInrCr: 12,
    link: "",
    images: [
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/properties/dlfthearbour/1.avif",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/properties/dlfthearbour/2.avif",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/properties/dlfthearbour/3.avif",
      "https://inframantra.blr1.cdn.digitaloceanspaces.com/properties/dlfthearbour/4.avif",
    ],
  },
];

const PAGE_SIZE = 8;

// ── Icons ─────────────────────────────────
const GetQuotesIcon = () => (
  <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h.01M12 10h.01M16 10h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
  </svg>
);

// ── Card ─────────────────────────────────
export function ProjectCard({ project, onDownload, usdInrRate }) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrent((c) => (c - 1 + project.images.length) % project.images.length);
    },
    [project.images.length]
  );

  const next = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrent((c) => (c + 1) % project.images.length);
    },
    [project.images.length]
  );

  const priceLabel = buildPriceLabel(project.priceInrCr, usdInrRate);

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
            <span key={cat} className={styles.badge}>
              {cat}
            </span>
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
              borderRadius: "6px",
            }}
          />
        </div>

        <button className={`${styles.arrowC} ${styles.arrowLeft}`} onClick={prev}>
          ‹
        </button>
        <button className={`${styles.arrowC} ${styles.arrowRight}`} onClick={next}>
          ›
        </button>
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
          <span>{priceLabel}</span>
        </div>

        <button onClick={() => onDownload(project)} className={styles.downloadBtn}>
          <GetQuotesIcon />
          Get Quote
        </button>
      </div>
    </div>
  );
}

// ── Main Section ─────────────────────────
export default function ProjectsSection({ name }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [popForm, setPopForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch live USD/INR rate (cached for 12h)
  const usdInrRate = useUsdInrRate();

  const visible = PROJECTS.slice(0, visibleCount);
  const hasMore = visibleCount < PROJECTS.length;

  const handleDownload = (project) => {
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
            onDownload={handleDownload}
            usdInrRate={usdInrRate}
          />
        ))}
      </div>

      <PopUpForm
        popUpenable={popForm}
        onClickOff={onClickOff}
        text="TO UNLOCK EXCLUSIVE DEALS"
        name={name}
        phone="+1 (213) 6575060"
        id="nriProject"
        countryCode="us"
      />

      {hasMore && (
        <div className={styles.loadMoreWrapper}>
          <button
            className={styles.loadMoreBtn}
            onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, PROJECTS.length))}
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}