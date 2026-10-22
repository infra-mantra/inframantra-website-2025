import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import Wrapper from "../components/shared/Wrapper.jsx";
import PropertyCard from "../components/shared/PropertyCard.jsx";
import {
  useShortlist,
  removeFromShortlist,
  restoreToShortlist,
} from "../components/shared/shortlist/shortlistStore.js";
import { notify } from "../components/shared/shortlist/toast.js";
import { MAX_COMPARE, setCompareList } from "../components/compare/compareStore.js";
import styles from "../components/shared/shortlist/ShortlistPage.module.css";

/*
  /shortlist — the properties a visitor hearted (♥). Lives only in this browser's
  localStorage (see shortlistStore.js), so the page is client-rendered and noindex.
*/

const PopUpForm = dynamic(() => import("../components/shared/forms/CTANEW.jsx"), { ssr: false });

// "1.25 Cr*", "95 Lac", "₹ 3.4 Cr onwards" -> rupees, for sorting. Unknown -> Infinity (last).
const priceValue = (s) => {
  const m = String(s || "")
    .replace(/,/g, "")
    .match(/(\d+(?:\.\d+)?)\s*(cr|crore|l|lac|lakh|k)?/i);
  if (!m) return Infinity;
  const unit = (m[2] || "").toLowerCase();
  const mult = unit.startsWith("c") ? 1e7 : unit.startsWith("l") ? 1e5 : unit === "k" ? 1e3 : 1;
  return parseFloat(m[1]) * mult;
};

// The shared card reads the API's property shape, so map the saved item back to it.
const toCardProperty = (p) => ({
  slug: p.slug,
  name: p.name,
  imageGallery: p.image ? { url: p.image, title: p.name } : undefined,
  locality: { name: p.location },
  startingPrice: p.price,
  configuration: p.configuration,
  status: p.status,
  developer: { name: p.developer, developerImg: p.developerImg },
});

const SORTS = {
  recent: { label: "Recently added", fn: (a, b) => (b.likedAt || 0) - (a.likedAt || 0) },
  priceAsc: {
    label: "Price: low to high",
    fn: (a, b) => priceValue(a.price) - priceValue(b.price),
  },
  priceDesc: {
    label: "Price: high to low",
    fn: (a, b) => {
      const pa = priceValue(a.price);
      const pb = priceValue(b.price);
      // keep "price on request" at the end in both directions
      if (pa === Infinity || pb === Infinity) return pa === pb ? 0 : pa === Infinity ? 1 : -1;
      return pb - pa;
    },
  },
};

export default function ShortlistPage() {
  const router = useRouter();
  const list = useShortlist();
  const [sort, setSort] = useState("recent");
  const [enquiry, setEnquiry] = useState("");

  const sorted = useMemo(() => [...list].sort(SORTS[sort].fn), [list, sort]);

  const remove = (item) => {
    removeFromShortlist(item.slug);
    notify({
      message: `Removed ${item.name || "property"}`,
      actionText: "Undo",
      onAction: () => restoreToShortlist(item),
    });
  };

  // Hand the first few (in the current order) to the compare feature
  const compareThese = () => {
    const picks = sorted.slice(0, MAX_COMPARE);
    setCompareList(picks);
    router.push(`/compare?p=${picks.map((p) => encodeURIComponent(p.slug)).join(",")}`);
  };

  return (
    <Wrapper
      title="My Shortlist | Infra Mantra"
      description="Properties you saved on Infra Mantra."
      seo="noindex, follow"
    >
      <div className={styles.slp_page}>
        <header className={styles.slp_top}>
          <div>
            <h1 className={`section-title ${styles.slp_title}`}>
              My <span>shortlist</span>
            </h1>
            <p className={styles.slp_subtitle}>
              {list.length
                ? `${list.length} saved ${list.length === 1 ? "property" : "properties"} · saved on this device`
                : "Tap ♥ on any property to save it here."}
            </p>
          </div>

          {list.length > 0 && (
            <div className={styles.slp_actions}>
              <label className={styles.slp_sort}>
                <span>Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  {Object.entries(SORTS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </label>
              {list.length > 1 && (
                <button type="button" className={styles.slp_btn} onClick={compareThese}>
                  {list.length > MAX_COMPARE ? `Compare top ${MAX_COMPARE}` : "Compare these"}
                </button>
              )}
              <button
                type="button"
                className={`${styles.slp_btn} ${styles.slp_btnPrimary}`}
                onClick={() => setEnquiry(`Shortlist: ${sorted.map((p) => p.name).join(", ")}`)}
              >
                Enquire for all
              </button>
            </div>
          )}
        </header>

        {list.length === 0 ? (
          <div className={styles.slp_empty}>
            <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
              <path
                d="M12 20.6s-7.6-4.6-9.4-9.3C1.4 8 3.4 4.5 6.9 4.5c2 0 3.7 1.1 5.1 3 1.4-1.9 3.1-3 5.1-3 3.5 0 5.5 3.5 4.3 6.8-1.8 4.7-9.4 9.3-9.4 9.3z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            <h2>Your shortlist is empty</h2>
            <p>Save properties you like and compare or enquire about them together.</p>
            <Link href="/property-listing/search/property-in-india">
              <a className={`${styles.slp_btn} ${styles.slp_btnPrimary}`}>Explore properties</a>
            </Link>
          </div>
        ) : (
          <ul className={styles.slp_grid}>
            {sorted.map((item) => (
              <li key={item.slug} className={styles.slp_item}>
                <PropertyCard property={toCardProperty(item)} />
                <button type="button" className={styles.slp_remove} onClick={() => remove(item)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {enquiry && (
        <PopUpForm
          popUpenable={!!enquiry}
          onClickOff={() => setEnquiry("")}
          name={enquiry}
          text="To Connect With Our Property Advisor"
          phone="+91 86 9800 9900"
          id="shortlistEnquiry"
        />
      )}
    </Wrapper>
  );
}
