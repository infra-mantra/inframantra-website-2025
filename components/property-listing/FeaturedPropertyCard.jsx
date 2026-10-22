import React from "react";
import Link from "next/link";
import { optimizedSrc } from "../lib/imageUrl.js";
import fp from "./FeaturedPropertyCard.module.css";
import HeartButton from "../shared/shortlist/HeartButton.jsx";
import CompareToggle from "../compare/CompareToggle.jsx";

// Listing page "Featured Properties" card: photo with the developer's logo,
// shortlist + compare toggles, then name, location, starting price and status.
// (The home page keeps its own PropertyCard.)

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&auto=format";

// CMS status spellings vary ("UNDER CONSTRUCTION", "Under Construction ") — show one form
const titleCase = (s) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function FeaturedPropertyCard({ property }) {
  const image = property.imageGallery?.url || FALLBACK_IMG;
  const location = [property.subLocality?.name, property.locality?.name]
    .map((x) => (x || "").trim())
    .filter(Boolean)
    .join(", ");
  const status = titleCase(property.status);
  const logo = property.developer?.developerImg;

  return (
    <div className={fp["fp-card"]}>
      <Link href={`/property/${property.slug}`} passHref>
        <a className={fp["fp-link"]}>
          <div className={fp["fp-media"]}>
            <img
              className={fp["fp-img"]}
              src={optimizedSrc(image, 384)}
              alt={property.imageGallery?.title || property.name}
              width="282"
              height="180"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMG;
              }}
            />
            {logo && (
              <span className={fp["fp-logo"]}>
                <img
                  src={logo}
                  alt={`${property.developer?.name || "Developer"} logo`}
                  loading="lazy"
                />
              </span>
            )}
            {property.configuration && (
              <span className={fp["fp-config"]}>{property.configuration}</span>
            )}
          </div>

          <div className={fp["fp-body"]}>
            <h3 className={fp["fp-name"]}>{property.name?.trim()}</h3>
            {location && (
              <p className={fp["fp-loc"]}>
                <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                  <path
                    d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
                    fill="currentColor"
                  />
                </svg>
                <span>{location}</span>
              </p>
            )}
            <div className={fp["fp-foot"]}>
              <span className={fp["fp-price"]}>
                <span className={fp["fp-price-label"]}>
                  {property.startingPrice ? "Starting at" : "Price on request"}
                </span>
                <span className={fp["fp-price-row"]}>
                  {property.startingPrice && <strong>₹ {property.startingPrice}*</strong>}
                  {status && (
                    <span
                      className={`${fp["fp-status"]} ${/ready/i.test(status) ? fp["is-ready"] : ""}`}
                    >
                      {status}
                    </span>
                  )}
                </span>
              </span>
              <span className={fp["fp-go"]} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="15" height="15">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </a>
      </Link>
      {/* Toggles sit OUTSIDE the link (no buttons inside an <a>), over the photo */}
      <div className={fp["fp-tools"]}>
        <HeartButton property={property} />
        <CompareToggle property={property} />
      </div>
    </div>
  );
}
