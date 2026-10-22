import React, { useEffect, useState } from "react";
import banner from "./Banner.module.css";
import styles from "./BrandSlide.module.css";
import { PHOTO_VERSION } from "./heroProjects";
import { useCounts } from "../shared/search/filterCounts.js";

/*
  Slide 1 of the home banner: Inframantra, channel partner of Gurugram's top
  developers. One photo (brand-d*.avif|webp 3:1, brand-m* 6:5): Guru Randhawa
  and the founders on a high-rise balcony at dusk, the city and a tower under
  construction behind them. It is the page's main (LCP) image, so it is a
  single static file. On top, a few light touches that move:
    - the crane's aviation lights pulse, windows of the new tower switch on
    - a slow push-in on the photo
  They play when the slide has the global class `bsLive` (BannerVideo.jsx);
  without it, or with reduced motion, the photo simply stays still.
*/

const IMG = "/banner/hero";
const PHONE = [780, 1170];
const DESKTOP = [1440, 1920, 2560];

// "brand-d1440.avif?v=13 1440w, ..." for srcSet
const srcSet = (size, widths, ext) =>
  widths.map((w) => `${IMG}/brand-${size}${w}.${ext}${PHOTO_VERSION} ${w}w`).join(", ");

// Lights on the photo, in % (left, top). d = desktop crop, m = phone crop.
// Measured on the source image (see the scratchpad script photo.js).
const BEACONS = {
  d: [
    [59.1, 31.8],
    [62.3, 45],
  ],
  m: [[55.5, 39.4]],
};
// windows of the tower under construction that switch on one after another
const WINDOWS = {
  d: [
    [58.9, 52],
    [60.6, 57.5],
    [62.4, 50.5],
    [59.7, 63],
    [61.8, 68],
    [63.3, 60],
  ],
  m: [],
};

function Lights({ size }) {
  return (
    <div className={`${styles.bsLights} ${size === "d" ? styles.bsOnDesk : styles.bsOnPhone}`}>
      {BEACONS[size].map(([x, y]) => (
        <i key={`b${x}`} className={styles.bsBeacon} style={{ left: `${x}%`, top: `${y}%` }} />
      ))}
      {WINDOWS[size].map(([x, y], i) => (
        <i
          key={`w${x}`}
          className={styles.bsWindow}
          style={{ left: `${x}%`, top: `${y}%`, "--i": i }}
        />
      ))}
    </div>
  );
}

// The photo, where the project slides have theirs (same box: banner.heroImg).
export function BrandScene({ priority }) {
  return (
    <div className={`${banner.heroImg} ${styles.bsScene}`}>
      <picture>
        <source
          media="(max-width: 1180px)"
          type="image/avif"
          srcSet={srcSet("m", PHONE, "avif")}
          sizes="100vw"
        />
        <source
          media="(max-width: 1180px)"
          type="image/webp"
          srcSet={srcSet("m", PHONE, "webp")}
          sizes="100vw"
        />
        <source type="image/avif" srcSet={srcSet("d", DESKTOP, "avif")} sizes="100vw" />
        <img
          className={styles.bsPhoto}
          src={`${IMG}/brand-d1920.webp${PHOTO_VERSION}`}
          srcSet={srcSet("d", DESKTOP, "webp")}
          sizes="100vw"
          alt={priority ? "" : "Guru Randhawa with the Inframantra founders"}
          width="1920"
          height="640"
          draggable="false"
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "low"}
          decoding={priority ? "sync" : "async"}
        />
      </picture>
      <Lights size="d" />
      <Lights size="m" />
    </div>
  );
}

/* ---------- live numbers ---------- */

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// After the page's load event (or straight away if it already happened).
function useAfterLoad() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const done = () => setLoaded(true);
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done, { once: true });
    return () => window.removeEventListener("load", done);
  }, []);
  return loaded;
}

// The real Google rating from the site's own API (the one ReviewsWall.jsx uses):
// { rating: 4.3, total: 109, ... }. Fetched once, after load. null = not (yet) known.
let ratingRequest = null;
function useGoogleRating() {
  const loaded = useAfterLoad();
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!loaded) return undefined;
    let alive = true;
    ratingRequest =
      ratingRequest ||
      fetch("/api/google-reviews")
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
    ratingRequest.then((j) => {
      if (alive && j?.rating > 0 && j?.total > 0) setData({ rating: j.rating, total: j.total });
    });
    return () => {
      alive = false;
    };
  }, [loaded]);
  return data;
}

// Shows `to`, counting up from `from` when `to` changes (1.2s, eased).
// Reduced motion: jumps straight to `to`. Only the text changes.
function useCountUp(to, decimals = 0) {
  const [n, setN] = useState(to);
  useEffect(() => {
    if (typeof to !== "number") return undefined;
    if (reducedMotion()) {
      setN(to);
      return undefined;
    }
    let frame;
    const from = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1200);
      setN(t === 1 ? to : from + (to - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to]);
  if (typeof n !== "number") return "";
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// true after the first render in the browser: animations start then, so the
// server-rendered text is painted straight away
function useHydrated() {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  return ok;
}

// Google "G" mark
const GoogleG = () => (
  <svg viewBox="0 0 48 48" width="15" height="15" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
    />
  </svg>
);

// Stars filled to the rating: 4.3 = four full stars and 30% of the fifth.
const Stars = ({ rating }) => (
  <span className={styles.bsStars} aria-hidden="true">
    ★★★★★
    <span style={{ width: `${(rating / 5) * 100}%` }}>★★★★★</span>
  </span>
);

const Heart = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 4.4 2.4h1.6c.8-1.3 2.3-2.4 4.4-2.4 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z"
    />
  </svg>
);

// [G 4.3 ★★★★☆ 109 reviews | ♥ 3,500+ happy customers]
// The rating part appears only once the API has answered with real numbers.
function Badge({ customers }) {
  const g = useGoogleRating();
  const rating = useCountUp(g?.rating, 1);
  const total = useCountUp(g?.total);
  return (
    <p className={styles.bsBadge}>
      <GoogleG />
      {g ? (
        <span className={styles.bsRated}>
          <b>{rating}</b>
          <Stars rating={g.rating} />
          <span>{total} reviews</span>
        </span>
      ) : (
        <span>Google reviews</span>
      )}
      <i className={styles.bsDivider} aria-hidden="true" />
      <span className={styles.bsHappy}>
        <Heart /> {customers.toLocaleString("en-IN")}+ happy customers
      </span>
    </p>
  );
}

// project count per city, from the same search API as the filter counts
const cityOf = (label) => ({ slug: label.toLowerCase() });

/*
  "Gurgaon" swaps with the other cities we sell in, every 2.4s: the new word
  slides up in a box as wide as the longest one, so nothing moves. Static
  "Gurgaon" before hydration and with reduced motion. Once a city is picked
  in the search bar (SearchOptions.jsx event), it stays on that city.
*/
// The city in the headline, "typed": letters appear one by one, the word
// holds, then is erased just before the next city (CITY_MS in useCity).
// Hidden copies of every city keep the box as wide as the longest one, so the
// headline never moves. Before hydration (and when a city is picked) the full
// word shows with no typing.
const TYPE_MS = 90; // per letter while typing
const ERASE_MS = 45; // per letter while erasing
const CITY_MS = 2800; // keep in step with the interval in useCity

function RotatingWord({ words, word, typing }) {
  const [shown, setShown] = useState(word);

  useEffect(() => {
    if (!typing) {
      setShown(word);
      return undefined;
    }
    const timers = [];
    const later = (ms, text) => timers.push(setTimeout(() => setShown(text), ms));
    setShown("");
    for (let i = 1; i <= word.length; i++) later(i * TYPE_MS, word.slice(0, i)); // type
    const eraseAt = CITY_MS - word.length * ERASE_MS - 120;
    for (let i = word.length - 1; i >= 0; i--) {
      later(eraseAt + (word.length - i) * ERASE_MS, word.slice(0, i)); // erase
    }
    return () => timers.forEach(clearTimeout);
  }, [word, typing]);

  // One hidden copy of the longest city reserves the width. Its hiding and the
  // stacking are inline styles, so they apply even before the CSS file loads
  // (otherwise the city could flash twice / stacked on refresh).
  const widest = words.reduce((a, w) => (w.length > a.length ? w : a), "");
  const cell = { gridArea: "1 / 1", whiteSpace: "nowrap" };
  return (
    <span className={styles.bsWords} style={{ display: "inline-grid" }}>
      <span style={{ ...cell, visibility: "hidden" }} aria-hidden="true">
        {widest}
      </span>
      <span className={`${styles.bsWordText} ${styles.bsWordOn}`} style={cell} aria-label={word}>
        {shown}
        {typing && <span className={styles.bsCaret} aria-hidden="true" />}
      </span>
    </span>
  );
}

// The city shown in the headline (rotating, or the one picked in the search
// bar) and its real number of projects (undefined until known).
function useCity(words) {
  const hydrated = useHydrated();
  const loaded = useAfterLoad();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [paused, setPaused] = useState(false); // while the pointer is on the headline

  useEffect(() => {
    const onCity = (e) => setPicked(words.includes(e.detail) ? e.detail : null);
    window.addEventListener("inframantra:city", onCity);
    return () => window.removeEventListener("inframantra:city", onCity);
  }, [words]);

  useEffect(() => {
    if (!hydrated || picked || paused) return undefined; // reduced motion: instant swaps (CSS)
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), CITY_MS);
    return () => clearInterval(timer);
  }, [hydrated, picked, paused, words.length]);

  const word = picked || words[index];
  const counts = useCounts(
    null,
    words.map((w) => ({ id: w, params: {}, city: cityOf(w) })),
    loaded
  );
  const hover = { onPointerEnter: () => setPaused(true), onPointerLeave: () => setPaused(false) };
  const typing = hydrated && !picked && !paused; // typewriter only while cycling
  return { word, hydrated, typing, count: counts[word], hover };
}

// "81 projects in Gurgaon · updated live" (only once the number is known)
function CityCount({ word, count }) {
  const n = useCountUp(count > 0 ? count : undefined);
  if (!(count > 0)) return null;
  return (
    <p className={styles.bsCityCount} key={word}>
      <i aria-hidden="true" className={styles.bsDot} />
      <b>{n}</b> {count === 1 ? "project" : "projects"} in {word}
      <span> · updated live</span>
    </p>
  );
}

// One short line at a time, every 4s: crossfade + slight rise. All lines are
// stacked in one grid cell, so the box keeps the tallest one's height and
// nothing below moves. {City} follows the headline's city. Reduced motion:
// the first line, still.
function RotatingLine({ lines, city, run }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!run) return undefined; // reduced motion: instant swaps (CSS)
    const timer = setInterval(() => setIndex((i) => (i + 1) % lines.length), 4000);
    return () => clearInterval(timer);
  }, [run, lines.length]);
  return (
    <p className={styles.bsLines}>
      {lines.map((line, i) => (
        <span key={line} className={i === index ? styles.bsLineOn : undefined}>
          {line.replace("{City}", city)}
        </span>
      ))}
    </p>
  );
}

// Desktop: badge, headline, live count, rotating line, partners on the left.
// Phones/tablets: badge, headline and the partners loop in the band above the photo.
export function BrandCopy({ p }) {
  const city = useCity(p.places);
  const logos = (hidden) =>
    p.partners.map((d) => (
      <li key={hidden ? `${d.k}-copy` : d.k} aria-hidden={hidden || undefined}>
        <img
          src={`${IMG}/dv-${d.k}.webp`}
          alt={hidden ? "" : d.name}
          width={d.w}
          height="119"
          loading="lazy"
          decoding="async"
        />
      </li>
    ));
  const badge = <Badge customers={p.customers} />;
  const head = (
    <p className={`${banner.bsHead} ${styles.bsTitle}`} {...city.hover}>
      {p.head}
      <span className={styles.bsCityLine}>
        in <RotatingWord words={p.places} word={city.word} typing={city.typing} />
      </span>
    </p>
  );
  const partnerRow = (
    <div className={styles.bsPartners}>
      {/* right-to-left loop: the logos twice, the copy hidden from screen readers */}
      <div className={styles.bsMarquee}>
        <ul className={styles.bsTrack}>
          {logos(false)}
          {logos(true)}
        </ul>
      </div>
    </div>
  );
  return (
    <>
      <div className={`${banner.bsCopy} ${styles.bsDeskCopy} ${styles.bsReveal}`}>
        {badge}
        {head}
        <RotatingLine lines={p.lines} city={city.word} run={city.hydrated} />
        {partnerRow}
      </div>
      <div className={`${banner.hp} ${banner.bsPoster} ${styles.bsReveal}`}>
        {badge}
        {head}
        {partnerRow}
      </div>
    </>
  );
}
