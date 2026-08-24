import styles from "./PropertyCardSkeleton.module.css";

// Placeholder cards shown while property results load — mirrors the real card layout.
export default function PropertyCardSkeleton({ count = 4 }) {
  return (
    <div className={styles.skelWrap} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className={styles.skelCard} key={i}>
          <div className={styles.skelImage} />
          <div className={styles.skelBody}>
            <div className={`${styles.skelLine} ${styles.skelTitle}`} />
            <div className={`${styles.skelLine} ${styles.skelSub}`} />
            <div className={styles.skelGrid}>
              <div className={styles.skelLine} />
              <div className={styles.skelLine} />
              <div className={styles.skelLine} />
              <div className={styles.skelLine} />
            </div>
            <div className={`${styles.skelLine} ${styles.skelDesc}`} />
            <div className={styles.skelButtons}>
              <div className={styles.skelBtn} />
              <div className={styles.skelBtn} />
              <div className={styles.skelBtn} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Placeholder for the left filter panel.
export function FilterSkeleton() {
  return (
    <div className={styles.filterSkel} aria-hidden="true">
      <div className={styles.filterSkelTop} />
      {Array.from({ length: 5 }).map((_, i) => (
        <div className={styles.filterSkelSection} key={i}>
          <div className={styles.filterSkelLabel} />
          <div className={styles.filterSkelTags}>
            <div className={styles.filterSkelTag} />
            <div className={styles.filterSkelTag} />
            <div className={styles.filterSkelTag} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Full first-load skeleton: mirrors the whole listing layout (filter + search + results)
// so the initial load shows ONE cohesive skeleton instead of a spinner then skeletons.
export function ListingPageSkeleton() {
  return (
    <div className={styles.pageSkel} aria-hidden="true">
      <div className={styles.pageSkelFilter}>
        <FilterSkeleton />
      </div>
      <div className={styles.pageSkelMain}>
        <div className={styles.searchSkelRow}>
          <div className={styles.searchSkelBar} />
          <div className={styles.searchSkelSort} />
        </div>
        <ContentSkeleton />
        <PropertyCardSkeleton count={4} />
        <FeaturedSkeleton count={4} />
        <FaqSkeleton count={5} />
      </div>
    </div>
  );
}

// Placeholder for the results header ("Properties in …" + count + about box).
export function ContentSkeleton() {
  return (
    <div aria-hidden="true">
      <div className={styles.contentH1} />
      <div className={styles.contentCount} />
      <div className={styles.contentBox}>
        <div className={styles.skelLine} style={{ width: "96%" }} />
        <div className={styles.skelLine} style={{ width: "88%" }} />
        <div className={styles.skelLine} style={{ width: "38%" }} />
      </div>
    </div>
  );
}

// Placeholder for the "Featured Properties" carousel row.
export function FeaturedSkeleton({ count = 4 }) {
  return (
    <div aria-hidden="true">
      <div className={styles.featuredHeading} />
      <div className={styles.featuredRow}>
        {Array.from({ length: count }).map((_, i) => (
          <div className={styles.featuredCard} key={i}>
            <div className={styles.featuredImg} />
            <div className={styles.featuredBody}>
              <div className={`${styles.skelLine} ${styles.skelTitle}`} />
              <div className={`${styles.skelLine} ${styles.skelSub}`} />
              <div className={styles.skelLine} style={{ width: "45%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Placeholder for the FAQ accordion section.
export function FaqSkeleton({ count = 5 }) {
  return (
    <div aria-hidden="true">
      <div className={styles.faqHeading} />
      <div className={styles.faqList}>
        {Array.from({ length: count }).map((_, i) => (
          <div className={styles.faqItem} key={i} />
        ))}
      </div>
    </div>
  );
}
