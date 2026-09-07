import s from "./HomeSkeletons.module.css";

/*
  Loading skeletons for each home-page section. Each export mirrors the shape
  of its real section so the swap to real content feels seamless.

  Everything is built from the <Block/> helper (one grey box). To change a
  shape, add/remove a <Block/> here or edit a size in HomeSkeletons.module.css.
*/

// One grey box. `className` picks its size/shape; `style` allows small tweaks.
function Block({ className = "", style }) {
  return <div className={`${s.block} ${className}`} style={style} />;
}

// Card with an image on top and two text lines (Premium, generic cards).
function CardBlock() {
  return (
    <div className={s.card}>
      <Block className={s.thumb} />
      <Block className={s.line} />
      <Block className={`${s.line} ${s.lineShort}`} />
    </div>
  );
}

/*
  Home-page search bar.

  SearchOptions decides between a desktop and a mobile layout from window.innerWidth,
  which is only known after mount — so the server rendered the desktop bar and mobile
  visitors saw it restyle itself on hydration. This placeholder stands in for that one
  frame instead, and is sized from the real bar's own CSS at both breakpoints
  (desktop: 75% wide, 55px tall white card; mobile: 90vw grey input) so the swap does
  not move anything on the page.
*/
export function SearchBarSkeleton() {
  return (
    <div className={s.searchWrap} aria-hidden="true">
      <div className={s.searchBar}>
        <Block className={s.searchInput} />
        <Block className={s.searchBtn} />
      </div>
    </div>
  );
}

// ---- Premium Picks: heading + subtitle + city pills + a row of cards ----
export function PremiumSkeleton() {
  return (
    <div className={s.section} aria-hidden="true">
      <Block className={s.heading} />
      <Block className={s.sub} />
      <div className={s.pills}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Block key={i} className={s.pill} />
        ))}
      </div>
      <div className={s.row}>
        {[0, 1, 2, 3].map((i) => (
          <CardBlock key={i} />
        ))}
      </div>
    </div>
  );
}

// Just the card row (no heading/tabs) — used when switching city in Premium Picks,
// so the heading and city tabs stay visible while only the cards reload.
export function PremiumCardsSkeleton() {
  return (
    <div className={s.row} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <CardBlock key={i} />
      ))}
    </div>
  );
}

// ---- Blogs / Media: heading + a row of 3 cards (image + title) ----
export function BlogsSkeleton() {
  return (
    <div className={s.section} aria-hidden="true">
      <Block className={s.heading} />
      <div className={s.row}>
        {[0, 1, 2].map((i) => (
          <div className={s.card} key={i}>
            <Block className={s.thumb} />
            <Block className={s.line} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Statistics: 4 items, each icon + big number + label (no heading) ----
export function StatsSkeleton() {
  return (
    <div className={s.section} aria-hidden="true">
      <div className={s.statsGrid}>
        {[0, 1, 2, 3].map((i) => (
          <div className={s.statItem} key={i}>
            <Block className={s.statIcon} />
            <Block className={s.statNum} />
            <Block className={s.statLabel} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Image gallery: centered header + a horizontal accordion of panels ----
export function GallerySkeleton() {
  return (
    <div className={s.section} aria-hidden="true">
      <div className={s.center}>
        <Block className={`${s.eyebrow} ${s.mxAuto}`} />
        <Block className={`${s.heading} ${s.mxAuto}`} />
        <Block className={`${s.sub} ${s.mxAuto}`} />
      </div>
      <div className={s.galleryRow}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Block key={i} className={`${s.panel} ${i === 0 ? s.panelWide : ""}`} />
        ))}
      </div>
    </div>
  );
}

// ---- Reviews wall: left info panel + right scrolling review columns ----
function ReviewCard() {
  return (
    <div className={s.reviewCard}>
      <div className={s.reviewHead}>
        <Block className={s.avatar} />
        <Block className={s.line} style={{ width: "50%" }} />
      </div>
      <Block className={s.line} />
      <Block className={s.line} />
      <Block className={`${s.line} ${s.lineShort}`} />
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className={s.section} aria-hidden="true">
      <div className={s.reviewsWrap}>
        <div className={s.reviewsLeft}>
          <Block className={s.eyebrow} />
          <Block className={s.heading} style={{ marginTop: 16 }} />
          <Block className={s.heading} />
          <Block className={s.sub} style={{ marginTop: 16 }} />
          <div className={s.pills}>
            {[0, 1, 2, 3].map((i) => (
              <Block key={i} className={s.pill} />
            ))}
          </div>
        </div>
        <div className={s.reviewsRight}>
          {[0, 1].map((col) => (
            <div className={s.reviewCol} key={col}>
              {[0, 1, 2].map((i) => (
                <ReviewCard key={i} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Home CTA: image on one side + a contact form on the other ----
export function CtaSkeleton() {
  return (
    <div className={s.section} aria-hidden="true">
      <div className={s.ctaWrap}>
        <Block className={s.ctaImage} />
        <div className={s.ctaForm}>
          <Block className={s.heading} />
          <Block className={s.sub} />
          <Block className={s.input} />
          <Block className={s.input} />
          <Block className={s.input} />
          <Block className={s.button} />
        </div>
      </div>
    </div>
  );
}

/*
  Shorts strip: a row of chips over a row of 9:16 cards.

  Six cards, matching the data, so the row is the same width before and after and
  the horizontal scroller does not jump when the real strip mounts.
*/
export function ShortsSkeleton() {
  return (
    <div className={s.shortsSection} aria-hidden="true">
      <div className={s.shortsPills}>
        {[0, 1, 2, 3].map((i) => (
          <Block className={s.shortsPill} key={i} />
        ))}
      </div>
      <div className={s.shortsRow}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Block className={s.shortsCard} key={i} />
        ))}
      </div>
    </div>
  );
}
