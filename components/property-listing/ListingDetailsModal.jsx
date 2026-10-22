import React, { useEffect, useRef } from "react";
import Link from "next/link";
import md from "./ListingDetailsModal.module.css";

/*
  "Read more" dialog for a listing card: key facts, the full description and the
  same actions as the card. Loaded lazily (next/dynamic) the first time it opens.
  Esc / backdrop close, focus is trapped inside and returned to the trigger,
  page scroll is locked. On phones it is a bottom sheet. Prefixed ldm-.
*/

const titleCase = (s) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function ListingDetailsModal({ property: p, onClose, onEnquire }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const opener = document.activeElement;
    // lock page scroll on both <html> and <body> (this site scrolls on <html>)
    const html = document.documentElement;
    const prev = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector("[data-autofocus]")?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll("a[href], button:not([disabled])")];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      [html.style.overflow, document.body.style.overflow] = prev;
      // return focus without scrolling the page to the "Read more" link
      if (opener && typeof opener.focus === "function") opener.focus({ preventScroll: true });
    };
  }, [onClose]);

  if (!p) return null;
  const location = [p.subLocality?.name, p.locality?.name, p.city?.name]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(", ");
  const status = titleCase(p.status);
  const facts = [
    ["Price", p.startingPrice ? `₹ ${p.startingPrice}*` : "On request"],
    ["Configuration", p.configuration],
    ["Area", p.area],
    ["Possession", p.possesion],
    ["Status", status],
    ["RERA", p.rera],
  ].filter(([, v]) => v);
  const enquire = () => {
    onClose();
    onEnquire?.(p.name);
  };

  return (
    <div className={md.ldmWrap}>
      <button
        type="button"
        className={md.ldmScrim}
        aria-label="Close details"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={md.ldmPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ldm-title"
      >
        <div className={md.ldmHead}>
          <div className={md.ldmHeadText}>
            <h2 id="ldm-title" className={md.ldmTitle}>
              {p.name}
            </h2>
            {location && <p className={md.ldmLoc}>{location}</p>}
          </div>
          <button
            type="button"
            className={md.ldmClose}
            onClick={onClose}
            aria-label="Close"
            data-autofocus
          >
            ×
          </button>
        </div>

        <div className={md.ldmBody}>
          <dl className={md.ldmFacts}>
            {facts.map(([k, v]) => (
              <div key={k} className={md.ldmFact}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {p.description && <p className={md.ldmDesc}>{p.description}</p>}
          <p className={md.ldmNote}>* Starting price; final prices vary by unit and floor.</p>
        </div>

        <div className={md.ldmActions}>
          <button type="button" className={md.ldmPrimary} onClick={enquire}>
            Enquire Now
          </button>
          <Link href={`/property/${p.slug}`} passHref>
            <a className={md.ldmOutline}>View project</a>
          </Link>
        </div>
        {/* brochure as a quiet link under the two main buttons (same enquiry flow) */}
        <button type="button" className={md.ldmBrochureLink} onClick={enquire}>
          ⤓ Download brochure
        </button>
      </div>
    </div>
  );
}
