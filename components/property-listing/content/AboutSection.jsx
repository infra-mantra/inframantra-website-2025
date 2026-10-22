import React, { useState } from "react";
import { TEL_HREF, WHATSAPP_URL } from "../../lib/siteConfig.js";
import Link from "next/link";
import styles from "./AboutSection.module.css";
import { slugify } from "../../../utils/slugify.js";
import SortDropdown from "../search/PropertyListingSortBy.jsx";

function AboutSection({
  totalProperties,
  currentPage = 1,
  minPrice,
  maxPrice,
  type,
  name,
  state,
  city,
  locality,
  sublocality,
  customContent, // optional: overrides the auto-generated about paragraph
  crumbLabel, // optional: several places picked — breadcrumb shows them as one level
  customHeading, // optional: overrides the "Properties in <area>" H1 heading
  onSortChange, // mobile: renders the SORT BY dropdown next to the heading
  onEnquire, // opens the enquiry popup
  readyToMove = 0,
  highRise = 0,
  selectedCities = [], // cities ticked in the sidebar: named in the count line
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => setIsExpanded((prev) => !prev);

  const pageSize = 10; // ✅ Define the page size

  const startIndex = totalProperties === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalProperties);

  const normalizedType = type?.trim()?.toLowerCase();

  // Derived during render (was an effect, which painted an empty "Properties in"
  // heading first and then grew it — a layout shift on every load).
  const [displayArea, parentArea] = (() => {
    let newDisplayArea = "";
    let newParentArea = "";

    switch (normalizedType) {
      case "state":
        newDisplayArea = state;
        newParentArea = "";
        break;

      case "city":
        newDisplayArea = city;
        newParentArea = state || "";
        break;

      case "locality":
        newDisplayArea = locality;
        newParentArea = city || "";
        break;

      case "sublocality":
        newDisplayArea = sublocality ? `${sublocality}, ${locality || ""}` : locality;
        newParentArea = city || "";
        break;

      default:
        newDisplayArea = city;
        newParentArea = state;
        break;
    }

    return [newDisplayArea, newParentArea];
  })();

  const fullText = customContent
    ? customContent
    : type === "search"
      ? "Discover the finest properties with Inframantra — your gateway to premium living. Explore an exclusive collection of 2–5 BHK apartments, duplexes, villas, and penthouses, each crafted with world-class design and top-tier amenities. Located in one of the fastest-growing residential destinations, Inframantra offers best properties boasting unmatched connectivity, superior convenience, and a lifestyle perfectly suited for families and professionals seeking luxury, comfort, and long-term value."
      : `Explore the best properties in ${displayArea}${parentArea ? `, ${parentArea}` : ""}. In total, there are more than ${totalProperties} properties for sale in ${displayArea}. The prices of these properties range from Rs. ${minPrice} to Rs. ${maxPrice}. These ${displayArea} properties include 2–5 BHK apartments, duplexes, villas, and penthouses that are thoughtfully designed and come loaded with world-class amenities. It is one of the fastest growing residential areas that offers unmatched connectivity and convenience, making properties in ${displayArea} ideal for families and professionals seeking high-quality and luxurious living spaces.`;

  // "vatika" from /property-listing/search/vatika (slugs use "-" for spaces)
  const searchTerm = (() => {
    try {
      return decodeURIComponent(String(name || "")).replace(/-/g, " ");
    } catch (e) {
      return String(name || "").replace(/-/g, " ");
    }
  })();
  const picked = (selectedCities || []).filter(Boolean);
  const pickedText =
    picked.length <= 1
      ? picked[0] || ""
      : `${picked.slice(0, -1).join(", ")} & ${picked[picked.length - 1]}`;
  const isAllProps = type === "search" && String(name).toLowerCase() === "property-in-india";

  const slug = (s) => slugify(String(s || ""));
  // Home › Properties › <place> (or Home › City › Locality › Sub-locality)
  const crumbs = [{ label: "Home", href: "/" }];
  if (crumbLabel) {
    crumbs.push({ label: "Properties", href: "/property-listing/search/property-in-india" });
    crumbs.push({ label: crumbLabel });
  } else if (normalizedType === "search" || normalizedType === "configuration") {
    crumbs.push({ label: "Properties", href: "/property-listing/search/property-in-india" });
    if (pickedText) crumbs.push({ label: pickedText });
  } else {
    crumbs.push({ label: "Properties", href: "/property-listing/search/property-in-india" });
    if (city) crumbs.push({ label: city, href: `/property-listing/city/${slug(city)}` });
    if ((normalizedType === "locality" || normalizedType === "sublocality") && locality)
      crumbs.push({ label: locality, href: `/property-listing/locality/${slug(locality)}` });
    if (normalizedType === "sublocality" && sublocality) crumbs.push({ label: sublocality });
  }
  if (crumbs.length > 1) delete crumbs[crumbs.length - 1].href; // current page: plain text

  let heading;
  if (customHeading) heading = customHeading;
  else if (isAllProps) heading = pickedText ? `Properties in ${pickedText}` : "All Properties";
  else if (type === "search") heading = `Search results for “${searchTerm}”`;
  else heading = `Properties in ${displayArea}${parentArea ? `, ${parentArea}` : ""}`;

  // Real numbers only, from the stats the page already fetched
  const stats = [
    readyToMove > 0 && `Ready to move ${readyToMove}`,
    highRise > 0 && `High-rise ${highRise}`,
  ].filter(Boolean);

  return (
    <header className={styles.absHead}>
      <div className={styles.absMain}>
        <nav className={styles.absCrumbs} aria-label="Breadcrumb">
          <ol>
            {crumbs.map((c, i) => (
              <li key={`${c.label}-${i}`}>
                {c.href ? (
                  <Link href={c.href}>
                    <a>{c.label}</a>
                  </Link>
                ) : (
                  <span aria-current="page">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.headingRow}>
          <h1 className={styles.headerAbout}>{heading}</h1>

          {onSortChange && (
            <div className={styles.absSortPhone}>
              <SortDropdown onSortChange={onSortChange} />
            </div>
          )}
        </div>

        <div className={styles.absMeta}>
          {totalProperties === 0 ? (
            <span>No properties found</span>
          ) : (
            <span>
              <strong className={styles.absCount}>
                {totalProperties} {totalProperties === 1 ? "property" : "properties"}
              </strong>
              {pickedText && !isAllProps && (
                <>
                  {" "}
                  in <strong className={styles.cityNote}>{pickedText}</strong>
                </>
              )}
              <span className={styles.absRange}>
                {" "}
                · Showing {startIndex}–{endIndex}
              </span>
            </span>
          )}
          {stats.length > 0 && (
            <span className={styles.absStats}>
              {stats.map((s) => (
                <span key={s} className={styles.absStat}>
                  {s}
                </span>
              ))}
            </span>
          )}
        </div>

        {/* Full copy stays in the DOM (SEO); CSS clamps it to two lines until expanded */}
        <div className={styles.absIntro}>
          <p
            id="listing-intro"
            className={`${styles.absIntroText} ${isExpanded ? styles.absIntroOpen : ""}`}
          >
            {fullText}
          </p>
          <button
            type="button"
            className={styles.absMore}
            aria-expanded={isExpanded}
            aria-controls="listing-intro"
            onClick={toggleReadMore}
          >
            {isExpanded ? "Read less" : "Read more"}
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              aria-hidden="true"
              className={isExpanded ? styles.absMoreUp : ""}
            >
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop: help card fills the right of the header (real numbers only) */}
      <aside className={styles.absAside} aria-label="Talk to an expert">
        <span className={styles.absAsideEyebrow}>Need help choosing?</span>
        <p className={styles.absAsideText}>
          Free shortlist, site visits and price negotiation by an Inframantra expert.
        </p>
        {(minPrice || maxPrice) && !isAllProps ? (
          <dl className={styles.absFacts}>
            <div>
              <dt>Price range</dt>
              <dd>
                ₹{minPrice} – ₹{maxPrice}
              </dd>
            </div>
            <div>
              <dt>Projects</dt>
              <dd>{totalProperties}</dd>
            </div>
          </dl>
        ) : null}
        <div className={styles.absAsideActions}>
          <button type="button" className={styles.absAsideCta} onClick={() => onEnquire?.("")}>
            Get a call back
          </button>
          <a className={styles.absAsideLink} href={TEL_HREF}>
            Call
          </a>
          <a
            className={styles.absAsideLink}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </aside>
    </header>
  );
}

export default AboutSection;
