import React, { useCallback, useMemo, useState } from "react";
import SHORTS, { CATEGORIES } from "./shortsData.js";
import styles from "./Shorts.module.css";

/*
  Shorts strip for the home page.

  Facade pattern, and that is the whole point of this component. A YouTube iframe is
  roughly 700 KB - 1 MB of third-party JavaScript each; six of them rendered on load
  would undo the work done on this page's script evaluation. So nothing from YouTube
  is loaded until someone actually clicks a card — until then each item is a single
  optimised thumbnail and a play triangle drawn in CSS.

  The thumbnail comes through /_next/image (i.ytimg.com is already allowlisted in
  next.config.js), which resizes the 720x1280 oardefault from ~107 KB down to a few
  KB and serves AVIF/WebP.
*/

// oardefault is the vertical 1080x1920 frame YouTube generates for Shorts, which is
// what a 9:16 card wants; hqdefault and mqdefault are 16:9 and would letterbox.
// Some videos have no oardefault at all (it returns a 120x90 grey placeholder) —
// those carry a `frame` in the data and fall back to the 16:9 maxresdefault.
// See shortsData.js for what each `frame` value means.
const ytThumb = (item) =>
  `https://i.ytimg.com/vi/${item.id}/${item.frame ? "maxresdefault" : "oardefault"}.jpg`;

const ytEmbed = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

const ShortCard = ({ item, playing, onPlay }) => {
  const isYouTube = item.platform === "youtube";
  // Until the thumbnail has decoded the card shows a pulsing skeleton instead of
  // a bare grey box with a play button and a title stranded on top of it.
  const [loaded, setLoaded] = useState(false);
  // onLoad does not fire for an image the browser already has cached (it can be
  // complete before React attaches the handler), which would leave the skeleton
  // up forever on a revisit. The ref catches that case.
  const thumbRef = useCallback((node) => {
    if (node && node.complete) setLoaded(true);
  }, []);
  // Only frame: "wide" gets this. A 16:9 upload in a 9:16 card would have both
  // edges sliced off by cover (it cut the "TIMES SEABOARD SUMMIT" title in half),
  // so it is contained over a blurred copy of itself. Same src, so the browser
  // serves the second one from cache.
  //
  // frame: "wide-crop" deliberately does NOT come through here: there, cover is
  // the correct treatment, because the centre of YouTube's 16:9 composite IS the
  // original vertical frame.
  const wide = isYouTube && item.frame === "wide";
  const thumb = isYouTube ? ytThumb(item) : item.thumb;
  const href = isYouTube ? `https://www.youtube.com/shorts/${item.id}` : item.url;

  // Instagram blocks iframe embedding of reels, so those open on Instagram instead
  // of playing here. YouTube plays inline once clicked.
  const playsInline = isYouTube;

  if (playing && playsInline) {
    return (
      <div className={styles.shrtCard}>
        <iframe
          className={styles.shrtFrame}
          src={ytEmbed(item.id)}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  const Tag = playsInline ? "button" : "a";
  const tagProps = playsInline
    ? { type: "button", onClick: () => onPlay(item.id) }
    : { href, target: "_blank", rel: "noopener noreferrer" };

  return (
    <Tag
      className={`${styles.shrtCard} ${loaded ? styles.shrtReady : ""}`}
      aria-label={`Play: ${item.title}`}
      {...tagProps}
    >
      {!loaded && <span className={styles.shrtSkel} aria-hidden="true" />}
      {/*
        Plain <img> with an explicit /_next/image URL rather than next/image: this
        sits inside a horizontal scroller where next/image's wrapper divs fight the
        flex sizing, and the src is known at build time so there is nothing the
        component adds beyond what is written here.
      */}
      {wide && (
        <img
          className={styles.shrtBlur}
          src={`/_next/image?url=${encodeURIComponent(thumb)}&w=256&q=70`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      )}
      {/* onError matters as much as onLoad here: a missing thumbnail must not
          leave the card pulsing forever. Dropping the skeleton lets the flat
          card background stand in. */}
      <img
        ref={thumbRef}
        className={`${styles.shrtThumb} ${wide ? styles.shrtFit : ""}`}
        src={`/_next/image?url=${encodeURIComponent(thumb)}&w=256&q=70`}
        alt=""
        width={180}
        height={320}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      <span className={styles.shrtPlay} aria-hidden="true" />
      <span className={styles.shrtTitle}>{item.title}</span>
    </Tag>
  );
};

/*
  Just the card row, no filter chips — for reusing this rail somewhere that has
  already decided which videos to show. The Frames of Excellence gallery uses it
  for the award films: they are Shorts, so they want this 9:16 card and the
  frame-aware thumbnail handling in ShortCard above, not a 16:9 frame.
*/
export const ShortsRail = ({ items }) => {
  const [playing, setPlaying] = useState(null);

  return (
    <div className={styles.shrtRow}>
      {items.map((item) => (
        <ShortCard
          key={item.id || item.url}
          item={item}
          playing={playing === (item.id || item.url)}
          onPlay={setPlaying}
        />
      ))}
    </div>
  );
};

const ShortsSection = () => {
  const [active, setActive] = useState("all");
  const [playing, setPlaying] = useState(null);

  // Six items filtered in memory — no request, no measurable cost.
  const visible = useMemo(
    () => (active === "all" ? SHORTS : SHORTS.filter((s) => s.category === active)),
    [active]
  );

  // Only offer a chip that actually has videos behind it.
  const chips = CATEGORIES.filter((c) => c.id === "all" || SHORTS.some((s) => s.category === c.id));

  return (
    <section className={styles.shrtSection} aria-label="Inframantra video shorts">
      <div className={styles.shrtChips} role="tablist" aria-label="Filter videos by topic">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={active === c.id}
            className={`${styles.shrtChip} ${active === c.id ? styles.shrtChipOn : ""}`}
            onClick={() => {
              setActive(c.id);
              // Stop whatever is playing: after filtering it may no longer be on screen.
              setPlaying(null);
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={styles.shrtRow}>
        {visible.map((item) => (
          <ShortCard
            key={item.id || item.url}
            item={item}
            playing={playing === (item.id || item.url)}
            onPlay={setPlaying}
          />
        ))}
      </div>
    </section>
  );
};

export default ShortsSection;
