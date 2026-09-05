import { useRef, useEffect, useState } from "react";
import Section from "../shared/Section.jsx";
import NoImage from "../shared/NoImage.jsx";
import style from "./MemberTimeline.module.css";

/**
 * Career timeline for a team member (/team/[teamId]).
 *
 * This markup was previously commented out in its entirety, so the component
 * rendered an empty <Section> and the journey never appeared — even though the
 * CMS supplies a full set of entries per director. It is restored here.
 *
 * The reveal used to be driven by GSAP ScrollTrigger, which added an `active`
 * class as each entry scrolled past centre; the stylesheet still hides
 * `.tmlContent` until `.active` is present, so simply restoring the markup would
 * have rendered invisible text. GSAP was removed (and is not a declared
 * dependency), so the same behaviour is reproduced with IntersectionObserver:
 * no new package, and the sticky image on the left stays in step with whichever
 * entry is currently in view, which is what the clip-path rules expect.
 */
const MemberTimeline = ({ journey, content }) => {
  const itemRefs = useRef([]);
  // Index of the entry currently in view — drives both the `active` class and
  // which sticky image is un-clipped. Starts at 0 so the first entry is visible
  // immediately (and stays visible if IntersectionObserver is unavailable).
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean);
    if (!nodes.length) return;

    if (typeof IntersectionObserver === "undefined") {
      setActiveIndex(-1); // sentinel: reveal every entry rather than none
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the middle of the viewport, matching the
        // old ScrollTrigger `start: 'top center'` behaviour.
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const best = visible.reduce((a, b) =>
          Math.abs(a.boundingClientRect.top) < Math.abs(b.boundingClientRect.top) ? a : b
        );
        const idx = nodes.indexOf(best.target);
        if (idx !== -1) setActiveIndex(idx);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [journey]);

  if (!journey || journey.length === 0) return "";

  const isActive = (index) => activeIndex === -1 || index === activeIndex;

  return (
    <Section classes={`${style.secP} ${style.memberTimeline}`} pageWidth="fluid">
      <div className={style.tmlContainer}>
        <div className={`${style.sectionHead} ${style.textCenter}`}>
          <h2>{content?.name ? `${content.name} Journey` : "Journey"}</h2>
          {content?.description && <p>{content.description}</p>}
        </div>

        <div className={style.timelineWithImg}>
          {/* Sticky image column (hidden under 900px by the stylesheet). Each
              image is clipped away unless its entry is the active one. */}
          <div className={style.stickyImgWrap}>
            {journey.map((data, index) => (
              <div
                key={`image-${data.id}`}
                className={style.memTmlImg}
                id={`mem-tml-${index + 1}`}
                style={{ clipPath: isActive(index) ? "inset(0 0 0)" : "inset(100% 0 0)" }}
              >
                {data.image ? (
                  <img src={data.image} alt={data.title || "Timeline"} loading="lazy" />
                ) : (
                  <NoImage />
                )}
              </div>
            ))}
          </div>

          <div className={style.timelineWrapper}>
            <div className={style.mainDot}></div>
            {journey.map((data, index) => (
              <div
                key={data.id}
                ref={(el) => (itemRefs.current[index] = el)}
                className={`${style.timelineItem} ${isActive(index) ? "active" : ""}`}
              >
                <div className={style.tmlDot}></div>
                <div className={style.tmlContent}>
                  <h3>{data.title}</h3>
                  {/* Mobile-only inline image; the sticky column is hidden there. */}
                  <div className={`${style.mobShow} ${style.mobileTimeImage}`}>
                    {data.image ? (
                      <img src={data.image} alt={data.title || "Timeline"} loading="lazy" />
                    ) : (
                      <NoImage />
                    )}
                  </div>
                  <p>{data.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default MemberTimeline;
