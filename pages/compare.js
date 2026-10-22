import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Wrapper from "../components/shared/Wrapper.jsx";
import Ajax1 from "../components/lib/ajax1.js";
import { optimizedSrc } from "../components/lib/imageUrl.js";
import {
  MAX_COMPARE,
  setCompareList,
  toCompareItem,
  useCompareList,
} from "../components/compare/compareStore.js";
import {
  DASH,
  buildGroups,
  fetchProperty,
  hasAmenity,
  mapUrl,
  parseSlugs,
  sqftText,
  summaries,
  titleCase,
} from "../components/compare/compareData.js";
import { useShortlist } from "../components/shared/shortlist/shortlistStore.js";
import { notify } from "../components/shared/shortlist/toast.js";
import { loadCityProjects } from "../components/shared/search/cityProjects.js";
import styles from "../components/compare/Compare.module.css";

/*
  /compare?p=slug1,slug2,slug3 — side-by-side property comparison.

  - The URL is the source of truth, so a copied link opens the same comparison.
    Without ?p= the page falls back to the visitor's saved compare list.
  - Details come from the same endpoint the property page uses
    (GET {apiUrl1}/property/slug/:slug): on the server for the URL's slugs, in the
    browser when a property is added here. Row definitions: compareData.js.
  - Anything the API does not have is shown as "—". Nothing is made up.
*/

const PopUpForm = dynamic(() => import("../components/shared/forms/CTANEW.jsx"), { ssr: false });

// ---------- small icons (inline, no icon library) ----------

const Icon = ({ d, size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ICONS = {
  overview: "M4 5h16M4 12h16M4 19h10",
  location:
    "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  project: "M4 21V8l8-5 8 5v13M9 21v-6h6v6",
  amenities: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z",
  highlights: "M5 12l4 4L19 6",
  share: "M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13",
  chevron: "M6 9l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  close: "M6 6l12 12M18 6L6 18",
  arrow: "M5 12h14M13 6l6 6-6 6",
};

// ---------- add-a-property slot ----------

function AddProperty({ exclude, onAdd, busy }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState([]); // top Gurgaon projects, fallback quick picks
  const shortlist = useShortlist();

  // Quick picks: the visitor's ♥ shortlist first, else the city's top projects
  const liked = shortlist
    .filter((s) => !exclude.includes(s.slug))
    .map((s) => ({ slug: s.slug, title: s.name, image: s.image, price: s.price }));
  useEffect(() => {
    if (liked.length) return undefined;
    let alive = true;
    loadCityProjects("Gurgaon").then((list) => alive && setTop(list.slice(0, 8)));
    return () => {
      alive = false;
    };
  }, [liked.length]);
  const picks = (liked.length ? liked : top.filter((t) => !exclude.includes(t.slug))).slice(0, 3);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      return undefined;
    }
    let alive = true;
    const t = setTimeout(async () => {
      const res = await Ajax1({ url: "/suggest", method: "GET", params: { q: term } });
      if (!alive) return;
      const list = (res?.data?.suggestions || []).filter(
        (s) => s.type === "property" && s.slug && !exclude.includes(s.slug)
      );
      setResults(list.slice(0, 6));
      setOpen(true);
    }, 250);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [q, exclude]);

  const choose = (slug) => {
    onAdd(slug);
    setQ("");
    setResults([]);
  };

  return (
    <div className={styles.cmpp_addBox}>
      <span className={styles.cmpp_addIcon} aria-hidden="true">
        <Icon d={ICONS.plus} size={18} />
      </span>
      <label className={styles.cmpp_addLabel} htmlFor="compare-add">
        Add a property
      </label>
      <div className={styles.cmpp_addField}>
        <input
          id="compare-add"
          type="search"
          value={q}
          placeholder="Search project or developer"
          autoComplete="off"
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          disabled={busy}
        />
        {open && results.length > 0 && (
          <ul className={styles.cmpp_addResults} role="listbox" aria-label="Matching projects">
            {results.map((s) => (
              <li key={s.slug}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(s.slug)}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {busy ? (
        <span className={styles.cmpp_addBusy}>Adding…</span>
      ) : (
        picks.length > 0 && (
          <div className={styles.cmpp_picks}>
            <span className={styles.cmpp_picksTitle}>
              {liked.length ? "From your shortlist" : "Popular in Gurgaon"}
            </span>
            {picks.map((p) => (
              <button
                type="button"
                key={p.slug}
                className={styles.cmpp_pick}
                onClick={() => choose(p.slug)}
              >
                {p.image ? (
                  <img src={optimizedSrc(p.image, 96)} alt="" width="34" height="26" />
                ) : (
                  <span className={styles.cmpp_pickNoImg} />
                )}
                <span className={styles.cmpp_pickName}>{p.title}</span>
                <Icon d={ICONS.plus} size={13} />
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// ---------- a property's header card ----------

function PropertyHead({ p, onRemove, onEnquire }) {
  const ready = /ready/i.test(p.status);
  return (
    <div className={styles.cmpp_card}>
      <div className={styles.cmpp_media}>
        {p.image ? (
          <img src={optimizedSrc(p.image, 384)} alt={p.name} width="280" height="150" />
        ) : (
          <span className={styles.cmpp_noImg} />
        )}
        {p.developerImg && (
          <span className={styles.cmpp_logo}>
            <img
              src={p.developerImg}
              alt={`${p.developer || "Developer"} logo`}
              width="64"
              height="24"
              loading="lazy"
            />
          </span>
        )}
        {p.status && (
          <span className={`${styles.cmpp_status} ${ready ? styles.cmpp_statusReady : ""}`}>
            {titleCase(p.status)}
          </span>
        )}
        <button
          type="button"
          className={styles.cmpp_remove}
          onClick={onRemove}
          aria-label={`Remove ${p.name} from comparison`}
        >
          <Icon d={ICONS.close} size={14} />
        </button>
      </div>
      <a href={`/property/${p.slug}`} className={styles.cmpp_name}>
        {p.name}
      </a>
      <span className={styles.cmpp_dev}>{p.developer ? `by ${p.developer}` : DASH}</span>
      <span className={styles.cmpp_price}>
        {p.startingPrice ? (
          <>
            ₹ {p.startingPrice} <small>onwards</small>
          </>
        ) : (
          "Price on request"
        )}
      </span>
      <span className={styles.cmpp_sqft}>
        {p.squarePrice ? sqftText(p.squarePrice) : "Price / sq.ft —"}
      </span>
      <div className={styles.cmpp_cardBtns}>
        <button type="button" className={styles.cmpp_enquire} onClick={onEnquire}>
          Enquire now
        </button>
        <a href={`/property/${p.slug}`} className={styles.cmpp_view}>
          View project
        </a>
      </div>
    </div>
  );
}

// ---------- one table cell's content ----------

function CellValue({ row, p }) {
  if (row.kind === "amenity") {
    return hasAmenity(p, row.label) ? (
      <span className={styles.cmpp_yes} aria-label="Available">
        ✓
      </span>
    ) : (
      <span className={styles.cmpp_no} aria-label="Not listed">
        {DASH}
      </span>
    );
  }
  if (row.kind === "list") {
    return p.keyHighlights.length ? (
      <ul className={styles.cmpp_highlights}>
        {p.keyHighlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    ) : (
      DASH
    );
  }
  if (row.id === "map") {
    return mapUrl(p) ? (
      <a href={mapUrl(p)} target="_blank" rel="noopener noreferrer" className={styles.cmpp_link}>
        View on map ↗
      </a>
    ) : (
      DASH
    );
  }
  return row.value(p);
}

// ---------- compact header that follows the page while scrolling ----------

/*
  Shown once the big header cards scroll away. It lines up with the table's
  columns (widths are measured from the real header cells) and follows the
  table's sideways scroll on phones. It sits just below the site header while
  that header is on screen.
*/
function useMiniHeader(scrollerRef, theadRef, deps) {
  const [box, setBox] = useState(null);

  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    const thead = theadRef.current;
    if (!scroller || !thead) return setBox(null);
    const head = thead.getBoundingClientRect();
    const sRect = scroller.getBoundingClientRect();

    // Bottom edge of whatever fixed/sticky bar covers the top of the viewport
    let offset = 0;
    const els = document.elementsFromPoint(window.innerWidth / 2, 2);
    for (const el of els) {
      if (el.closest("[data-mini-header]")) continue;
      let n = el;
      while (n && n !== document.body) {
        const pos = getComputedStyle(n).position;
        if (pos === "fixed" || pos === "sticky") {
          const r = n.getBoundingClientRect();
          if (r.top <= 2 && r.bottom > offset && r.height < window.innerHeight / 3) {
            offset = r.bottom;
          }
          break;
        }
        n = n.parentElement;
      }
    }

    const visible = head.bottom < offset + 8 && sRect.bottom > offset + 140;
    if (!visible) return setBox(null);
    const cells = [...thead.querySelectorAll("tr > th")];
    setBox({
      top: Math.max(0, Math.round(offset)),
      left: sRect.left,
      width: sRect.width,
      widths: cells.map((c) => c.getBoundingClientRect().width),
      scrollLeft: scroller.scrollLeft,
    });
  }, [scrollerRef, theadRef]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const scroller = scrollerRef.current;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    scroller?.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      scroller?.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps]);

  return box;
}

function MiniHeader({ box, list, canAdd }) {
  if (!box) return null;
  const [labelW, ...colW] = box.widths;
  return (
    <div
      className={styles.cmpp_mini}
      style={{ top: box.top, left: box.left, width: box.width }}
      data-mini-header
      aria-hidden="true"
    >
      <div className={styles.cmpp_miniLabel} style={{ width: labelW }}>
        Comparing {list.length}
      </div>
      <div className={styles.cmpp_miniViewport}>
        <div
          className={styles.cmpp_miniTrack}
          style={{ transform: `translateX(${-box.scrollLeft}px)` }}
        >
          {list.map((p, i) => (
            <div key={p.slug} className={styles.cmpp_miniCell} style={{ width: colW[i] }}>
              {p.image ? (
                <img src={optimizedSrc(p.image, 96)} alt="" width="44" height="34" />
              ) : (
                <span className={styles.cmpp_pickNoImg} />
              )}
              <span className={styles.cmpp_miniText}>
                <span className={styles.cmpp_miniName}>{p.name}</span>
                <span className={styles.cmpp_miniPrice}>
                  {p.startingPrice ? `₹ ${p.startingPrice}` : DASH}
                </span>
              </span>
            </div>
          ))}
          {canAdd && <div style={{ width: colW[list.length] }} />}
        </div>
      </div>
    </div>
  );
}

// ---------- page ----------

export default function ComparePage({ initial, apiBase }) {
  const [list, setList] = useState(initial);
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [busy, setBusy] = useState(false);
  const [enquiry, setEnquiry] = useState(""); // property name whose form is open
  const [closed, setClosed] = useState({}); // collapsed sections by id
  const saved = useCompareList();
  const firstRun = useRef(true);
  const scrollerRef = useRef(null);
  const theadRef = useRef(null);

  // No ?p= in the URL: show the visitor's saved compare list instead.
  useEffect(() => {
    if (initial.length || !saved.length || !firstRun.current) return undefined;
    firstRun.current = false;
    let alive = true;
    setBusy(true);
    Promise.all(saved.map((s) => fetchProperty(s.slug, apiBase))).then((rows) => {
      if (!alive) return;
      setList(rows.filter(Boolean));
      setBusy(false);
    });
    return () => {
      alive = false;
    };
  }, [initial.length, saved, apiBase]);

  // Keep the URL (shareable) and the saved list (tray) in step with the table.
  useEffect(() => {
    if (firstRun.current && !initial.length && !list.length) return;
    firstRun.current = false;
    const url = list.length
      ? `/compare?p=${list.map((p) => encodeURIComponent(p.slug)).join(",")}`
      : "/compare";
    try {
      // replaceState keeps Next's router state but skips its scroll-to-top
      window.history.replaceState({ ...window.history.state, url, as: url }, "", url);
    } catch (err) {
      // the table still works; only the address bar stays stale
    }
    setCompareList(list.map(toCompareItem));
  }, [list, initial.length]);

  const remove = (slug) => setList((l) => l.filter((p) => p.slug !== slug));
  const add = async (slug) => {
    if (list.length >= MAX_COMPARE || list.some((p) => p.slug === slug)) return;
    setBusy(true);
    const p = await fetchProperty(slug, apiBase);
    setBusy(false);
    if (p) setList((l) => (l.length < MAX_COMPARE ? [...l, p] : l));
  };

  const share = async () => {
    const link = window.location.href;
    try {
      if (navigator.share && window.matchMedia("(max-width: 768px)").matches) {
        await navigator.share({ title: "Property comparison", url: link });
        return;
      }
      await navigator.clipboard.writeText(link);
      notify({ message: "Comparison link copied" });
    } catch (err) {
      // share sheet dismissed or clipboard blocked: show the link instead
      if (err?.name !== "AbortError") window.prompt("Copy this link", link);
    }
  };

  const groups = useMemo(() => buildGroups(list), [list]);
  const notes = useMemo(() => summaries(list, groups), [list, groups]);
  const exclude = useMemo(() => list.map((p) => p.slug), [list]);
  const canAdd = list.length < MAX_COMPARE;
  const cols = list.length + (canAdd ? 1 : 0);
  const mini = useMiniHeader(scrollerRef, theadRef, [list.length, onlyDiff, closed]);

  // a row "differs" when the properties do not all show the same value
  const differs = (row) => !row.noDiff && new Set(list.map((p) => row.value(p))).size > 1;

  return (
    <Wrapper
      title="Compare Properties | Infra Mantra"
      description="Compare new projects side by side: price, price per sq.ft, configuration, possession, location and amenities."
      seo="noindex, follow"
    >
      <div className={styles.cmpp_page}>
        <header className={styles.cmpp_top}>
          <p className={styles.cmpp_eyebrow}>Side by side</p>
          <h1 className={`section-title ${styles.cmpp_title}`}>
            Compare <span>properties</span>
          </h1>
          <p className={styles.cmpp_subtitle}>
            Price, possession, location and amenities of up to {MAX_COMPARE} projects in one view.
          </p>
        </header>

        {!list.length ? (
          <div className={styles.cmpp_empty}>
            {busy ? (
              <p className={styles.cmpp_emptySub}>Loading your comparison…</p>
            ) : (
              <>
                <p>No properties selected yet.</p>
                <p className={styles.cmpp_emptySub}>
                  Tap <strong>+ Compare</strong> on any property card, or add one here.
                </p>
                <AddProperty exclude={exclude} onAdd={add} busy={busy} />
              </>
            )}
          </div>
        ) : (
          <div className={styles.cmpp_scroller} ref={scrollerRef} style={{ "--cols": cols }}>
            <table className={styles.cmpp_table}>
              <colgroup>
                <col className={styles.cmpp_labelCol} />
                {Array.from({ length: cols }).map((_, i) => (
                  <col key={i} />
                ))}
              </colgroup>
              <thead ref={theadRef}>
                <tr>
                  <th scope="col" className={styles.cmpp_corner}>
                    <div className={styles.cmpp_summary}>
                      <span className={styles.cmpp_summaryKicker}>Comparing</span>
                      <span className={styles.cmpp_summaryCount}>
                        {list.length} {list.length === 1 ? "project" : "projects"}
                      </span>
                      {list.length > 1 && (
                        <label className={styles.cmpp_switch}>
                          <input
                            type="checkbox"
                            checked={onlyDiff}
                            onChange={(e) => setOnlyDiff(e.target.checked)}
                          />
                          <span className={styles.cmpp_track} aria-hidden="true" />
                          Only differences
                        </label>
                      )}
                      <div className={styles.cmpp_summaryBtns}>
                        <button type="button" className={styles.cmpp_share} onClick={share}>
                          <Icon d={ICONS.share} size={14} />
                          Share comparison
                        </button>
                        <button
                          type="button"
                          className={styles.cmpp_clearAll}
                          onClick={() => setList([])}
                        >
                          Clear all
                        </button>
                      </div>
                    </div>
                  </th>
                  {list.map((p) => (
                    <th scope="col" key={p.slug} className={styles.cmpp_headCell}>
                      <PropertyHead
                        p={p}
                        onRemove={() => remove(p.slug)}
                        onEnquire={() => setEnquiry(p.name)}
                      />
                    </th>
                  ))}
                  {canAdd && (
                    <th scope="col" className={`${styles.cmpp_headCell} ${styles.cmpp_addCell}`}>
                      <AddProperty exclude={exclude} onAdd={add} busy={busy} />
                    </th>
                  )}
                </tr>
              </thead>

              {groups.map((g) => {
                const rows = onlyDiff && list.length > 1 ? g.rows.filter(differs) : g.rows;
                if (!rows.length) return null;
                const isOpen = !closed[g.id];
                return (
                  <tbody key={g.id} className={styles.cmpp_group}>
                    <tr className={styles.cmpp_groupRow}>
                      <th scope="colgroup" colSpan={cols + 1}>
                        <button
                          type="button"
                          className={styles.cmpp_groupBtn}
                          aria-expanded={isOpen}
                          onClick={() => setClosed((c) => ({ ...c, [g.id]: isOpen }))}
                        >
                          <span className={styles.cmpp_groupIcon}>
                            <Icon d={ICONS[g.id] || ICONS.overview} />
                          </span>
                          {g.title}
                          {g.count ? (
                            <span className={styles.cmpp_groupCount}>{g.count}</span>
                          ) : null}
                          <span className={styles.cmpp_chev}>
                            <Icon d={ICONS.chevron} size={16} />
                          </span>
                        </button>
                      </th>
                    </tr>
                    {isOpen &&
                      rows.map((row) => {
                        const best = row.best || [];
                        const diff = list.length > 1 && differs(row);
                        return (
                          <tr
                            key={row.id}
                            className={`${styles.cmpp_row} ${diff ? styles.cmpp_rowDiff : ""}`}
                          >
                            <th scope="row" className={styles.cmpp_label}>
                              <span className={styles.cmpp_labelText}>{row.label}</span>
                              {row.tip && (
                                <span className={styles.cmpp_tip} tabIndex={0} aria-label={row.tip}>
                                  i<span role="tooltip">{row.tip}</span>
                                </span>
                              )}
                            </th>
                            {list.map((p, i) => {
                              const isBest = best.includes(i);
                              return (
                                <td
                                  key={p.slug}
                                  className={isBest ? styles.cmpp_bestCell : undefined}
                                >
                                  <CellValue row={row} p={p} />
                                  {isBest && (
                                    <span className={styles.cmpp_best} title={row.reason}>
                                      Best
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                            {canAdd && <td className={styles.cmpp_addFill} />}
                          </tr>
                        );
                      })}
                  </tbody>
                );
              })}

              {list.length > 1 && (
                <tfoot>
                  <tr className={styles.cmpp_footRow}>
                    <th scope="row" className={styles.cmpp_label}>
                      <span className={styles.cmpp_labelText}>At a glance</span>
                    </th>
                    {list.map((p, i) => (
                      <td key={p.slug}>
                        {notes[i].length ? (
                          <ul className={styles.cmpp_notes}>
                            {notes[i].map((n) => (
                              <li key={n}>{n}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className={styles.cmpp_no}>No category lead</span>
                        )}
                      </td>
                    ))}
                    {canAdd && <td className={styles.cmpp_addFill} />}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        {list.length > 0 && (
          <p className={styles.cmpp_note}>
            Prices and possession dates are as listed by the developer and may change. “Best” marks
            the lowest starting price, lowest price per sq.ft, earliest possession and most
            amenities among these projects.
          </p>
        )}
      </div>

      <MiniHeader box={mini} list={list} canAdd={canAdd} />

      {enquiry && (
        <PopUpForm
          popUpenable={!!enquiry}
          onClickOff={() => setEnquiry("")}
          name={enquiry}
          text="To Connect With Our Property Advisor"
          phone="+91 86 9800 9900"
          id="compareEnquiry"
        />
      )}
    </Wrapper>
  );
}

export async function getServerSideProps({ query }) {
  const apiBase = process.env.apiUrl1;
  const slugs = parseSlugs(query.p);
  const rows = await Promise.all(slugs.map((s) => fetchProperty(s, apiBase)));
  return { props: { initial: rows.filter(Boolean), apiBase } };
}
