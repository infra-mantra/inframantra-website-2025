import { useLayoutEffect, useRef, useState } from "react";
import {
  IoCalculatorOutline,
  IoConstructOutline,
  IoDiamondOutline,
  IoHomeOutline,
  IoKeyOutline,
  IoLeafOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import { buildListingUrl } from "../../shared/search/searchFilterConfig.js";
import { useCounts } from "../../shared/search/filterCounts.js";
import { Count, GoArrow } from "./FilterPopover.jsx";
import styles from "./FilterTabs.module.css";

/*
  Filter tabs on the banner, joined to the top of the search bar.
  Each tab has two parts:
    - the label: picks that filter in the search bar (SearchOptions.jsx state)
    - the arrow: goes straight to the listing page with that filter applied
  Link-only tabs (Penthouses, Calculators) just open their page.
  A gold pill slides behind the active tab (transform only).
  Wide screens: one glass bar on the search bar's left edge.
  Phones/tablets: chips that scroll sideways (snap, faded edges).
*/
const TABS = [
  { label: "Buy", Icon: IoHomeOutline, set: { status: [], unit: [] } },
  { label: "New Launch", Icon: IoSparklesOutline, set: { status: ["New Launch"], unit: [] } },
  {
    label: "Under Construction",
    Icon: IoConstructOutline,
    set: { status: ["Under Construction"], unit: [] },
  },
  { label: "Ready to Move", Icon: IoKeyOutline, set: { status: ["Ready to Move In"], unit: [] } },
  { label: "Villas", Icon: IoLeafOutline, set: { status: [], unit: ["Villa"] } },
  {
    label: "Penthouses",
    Icon: IoDiamondOutline,
    href: "/property-listing/configuration/penthouse",
    count: { configuration: "Penthouse" },
  },
  { label: "Calculators", Icon: IoCalculatorOutline, href: "/calculators" },
];

// what each tab counts (same params as the listing page); Calculators has none
const countOf = (t) =>
  t.count ||
  (t.set && {
    ...(t.set.status.length ? { status: t.set.status.join(",") } : {}),
    ...(t.set.unit.length ? { unitType: t.set.unit.join(",") } : {}),
  });
const COUNT_ITEMS = TABS.filter(countOf).map((t) => ({ id: t.label, params: countOf(t) }));

// index of the filter tab that matches the current filters (0 = Buy)
const activeIndex = (f) =>
  Math.max(
    0,
    TABS.findIndex(
      (t) => t.set && t.set.status.join() === f.status.join() && t.set.unit.join() === f.unit.join()
    )
  );

export default function FilterTabs({ filters, onChange }) {
  const active = activeIndex(filters);
  const listRef = useRef(null);
  const [pill, setPill] = useState(null); // { x, w } of the active tab
  // counts load the first time the row is hovered, focused or touched
  const [wantCounts, setWantCounts] = useState(false);
  const counts = useCounts(filters.city, COUNT_ITEMS, wantCounts);
  const askCounts = () => setWantCounts(true);

  // slide the gold pill behind the active tab (measured, then a CSS transform)
  useLayoutEffect(() => {
    const tab = listRef.current?.children[active];
    if (tab) setPill({ x: tab.offsetLeft, w: tab.offsetWidth });
  }, [active]);

  return (
    <div
      className={styles.ftWrap}
      onPointerEnter={askCounts}
      onFocus={askCounts}
      onTouchStart={askCounts}
    >
      <ul className={styles.ftList} ref={listRef} aria-label="Search filters">
        {TABS.map(({ label, Icon, set, href }, i) => {
          const on = i === active;
          const go = href || buildListingUrl({ ...filters, ...set });
          const icon = (
            <span className={styles.ftIcon}>
              <Icon aria-hidden="true" />
            </span>
          );
          return (
            <li
              key={label}
              className={on ? styles.ftOn : undefined}
              style={{ "--i": i }}
              hidden={counts[label] === 0 && !on} // nothing to show: no tab
            >
              {href ? (
                <a href={href} className={styles.ftTab}>
                  {icon}
                  {label}
                  {wantCounts && countOf(TABS[i]) && <Count n={counts[label]} />}
                </a>
              ) : (
                <button
                  type="button"
                  className={styles.ftTab}
                  aria-pressed={on}
                  onClick={() => onChange({ ...filters, ...set })}
                >
                  {icon}
                  {label}
                  {wantCounts && <Count n={counts[label]} />}
                </button>
              )}
              <a className={styles.ftGo} href={go} aria-label={`Go to ${label}`}>
                <GoArrow />
              </a>
            </li>
          );
        })}
        {pill && (
          <span
            className={styles.ftPill}
            aria-hidden="true"
            style={{ transform: `translateX(${pill.x}px) scaleX(${pill.w / 100})` }}
          />
        )}
      </ul>
    </div>
  );
}
