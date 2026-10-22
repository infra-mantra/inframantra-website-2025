import React, { useEffect, useRef, useState } from "react";
import { TEL_HREF, WHATSAPP_URL } from "../lib/siteConfig.js";
import Link from "next/link";
import { PROJECTS, PHOTO_VERSION } from "../home/heroProjects";
import styles from "./ListingAd.module.css";

/*
  "Featured project" slot shown in the middle of the listing results.

  Lightweight on purpose: the home AdsBanner is a full carousel (8 slides, swipe,
  timers) and would be far too heavy to repeat inside a results list. This draws
  one project from the same data (../home/heroProjects.js) per slot.

  - Picks projects in the current city that are NOT already among the visible
    results, rotating by page + slot so each page shows a different one.
  - Respects the price filter: only projects whose starting price is inside the
    chosen budget are featured; if none fit, the slot is left out.
  - Space is reserved with aspect-ratio before anything loads (no layout shift),
    and the photo is only requested once the slot nears the viewport.
*/

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/gurugram/g, "gurgaon");

// All hero projects today are in Gurgaon. Projects carry no city field, so match
// on the slug/location text (both name the city or a Gurgaon sector).
const inCity = (p, city) => {
  const c = norm(city);
  if (!c) return true;
  const hay = norm(`${p.slug} ${p.location}`);
  return hay.includes(c) || (c === "gurgaon" && /sector \d+/.test(hay));
};

// CMS slugs and hero slugs differ slightly (gurgaon/gurugram, extra words), so
// match visible results on the project name as well.
const nameKey = (s) => norm(s).replace(/[^a-z0-9]/g, "");
const sameName = (list) => (p) =>
  list.some((n) => n.includes(nameKey(p.name)) || nameKey(p.name).includes(n));

// "1.91 Cr." -> 1.91 (crores). Returns NaN when the price is missing.
const priceInCr = (p) => parseFloat(String(p.price || "").replace(/[^0-9.]/g, ""));

// True when the project's starting price is inside the user's price filter
// (minCr / maxCr in crores; empty = no limit on that side).
const inBudget = (p, minCr, maxCr) => {
  if (!minCr && !maxCr) return true;
  const price = priceInCr(p);
  if (Number.isNaN(price)) return false;
  return (!minCr || price >= Number(minCr)) && (!maxCr || price <= Number(maxCr));
};

export const pickAdProjects = ({
  city,
  excludeSlugs = [],
  excludeNames = [],
  softNames = [],
  minCr = null,
  maxCr = null,
  slot = 0,
  seed = 0,
  count = 1,
}) => {
  const exclude = new Set(excludeSlugs.map(norm));
  const names = excludeNames.map(nameKey).filter(Boolean);
  // only projects that match the price filter can ever be featured
  const fits = PROJECTS.filter((p) => inBudget(p, minCr, maxCr));
  let pool = fits.filter((p) => !exclude.has(norm(p.slug)) && !sameName(names)(p));
  const local = pool.filter((p) => inCity(p, city));
  if (local.length) pool = local;
  // Every hero project is already on this page (e.g. Gurgaon page 1): fall back
  // to ones at least not shown ABOVE the slot, then to anything in budget.
  if (!pool.length && softNames.length) {
    const soft = softNames.map(nameKey).filter(Boolean);
    pool = fits.filter((p) => inCity(p, city) && !sameName(soft)(p));
  }
  if (!pool.length) pool = fits;
  // Nothing in this budget, or fewer projects than ad slots on this page (the
  // 2nd slot would repeat the 1st): no featured card (ListingAd renders nothing)
  if (slot >= pool.length) return [];
  return Array.from({ length: count }, (_, i) => pool[(seed + i) % pool.length]);
};

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
  </svg>
);

function ListingAd({ project, onEnquire }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!project) return null;
  const base = `/banner/hero/${project.key}`;
  const logoV = project.place?.logo?.v || "w";
  const href = `/property/${project.slug}`;

  return (
    <aside
      ref={ref}
      className={styles.laAd}
      data-listing-ad={project.key}
      aria-label={`Featured project: ${project.name}`}
    >
      <div className={styles.laMedia}>
        {near && (
          <picture>
            <source
              media="(min-width: 769px)"
              type="image/avif"
              srcSet={`${base}-d1440.avif${PHOTO_VERSION}`}
            />
            <source
              media="(min-width: 769px)"
              type="image/webp"
              srcSet={`${base}-d1440.webp${PHOTO_VERSION}`}
            />
            <source type="image/avif" srcSet={`${base}-m780.avif${PHOTO_VERSION}`} />
            <img
              className={styles.laImg}
              src={`${base}-m780.webp${PHOTO_VERSION}`}
              alt={`${project.name} by ${project.developer}`}
              loading="lazy"
              decoding="async"
            />
          </picture>
        )}
        <span className={styles.laShade} aria-hidden="true" />
      </div>

      <div className={styles.laBody}>
        <span className={styles.laTag}>Featured Project</span>
        {near && (
          <img
            className={`${styles.laLogo} ${logoV === "w" ? "" : styles.laLogoOnLight}`}
            src={`/banner/hero/pl-${project.key}-${logoV}.webp`}
            alt={`${project.name} logo`}
            loading="lazy"
            decoding="async"
          />
        )}
        <h3 className={styles.laName}>{project.name}</h3>
        <p className={styles.laDev}>by {project.developer}</p>
        <p className={styles.laLoc}>
          <PinIcon />
          {project.location}
        </p>
        <div className={styles.laFacts}>
          {project.place?.head && <span className={styles.laBhk}>{project.place.head}</span>}
          {project.price && (
            <span className={styles.laPrice}>
              <small>Starting</small>₹ {project.price}*
            </span>
          )}
        </div>
        <div className={styles.laActions}>
          <button
            type="button"
            className={styles.laPrimary}
            onClick={() => onEnquire?.(project.name)}
          >
            Enquire now
          </button>
          <Link href={href} passHref>
            <a className={styles.laSecondary}>View project</a>
          </Link>
        </div>
      </div>
    </aside>
  );
}

/* Slim "talk to an expert" strip shown further down long result lists. */
export function ExpertStrip({ onEnquire }) {
  return (
    <aside className={styles.laExpert} aria-label="Talk to a property expert">
      <div className={styles.laExpertText}>
        <strong>Not sure which project fits?</strong>
        <span>Talk to an Inframantra expert — free site visits, honest advice.</span>
      </div>
      <div className={styles.laExpertActions}>
        <a className={styles.laExpertCall} href={TEL_HREF}>
          Call +91 86980 09900
        </a>
        <a
          className={styles.laExpertWa}
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
        <button type="button" className={styles.laExpertBtn} onClick={() => onEnquire?.("")}>
          Get a call back
        </button>
      </div>
    </aside>
  );
}

export default ListingAd;
