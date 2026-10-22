import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import s from "./DeveloperShowcase.module.css";

/*
  "Our Developer Partners" — the home banner's partner marquee, in 3D.

  - Same idea as the hero row (components/home/BrandSlide.jsx): logos slide right
    to left forever, the list is rendered twice so the loop is seamless, and it
    pauses on hover / keyboard focus.
  - 3D: the row sits on a plane tilted back (CSS perspective + rotateX). Every
    frame a small requestAnimationFrame loop moves the row and, from each tile's
    distance to the centre, brings centre tiles forward (translateZ + scale) and
    lets edge tiles recede and fade. Only transform / opacity are written, and tile
    positions are measured once, so a frame does no layout work.
  - Data: the /developer API the About page uses (real names + logos), fetched only
    when the section is near the screen. The stage has a fixed height (CSS), so
    nothing shifts when the logos arrive. The loop stops while off-screen.
*/

const SPEED = 40; // pixels per second

export default function DeveloperShowcase() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const paused = useRef(false);
  const [near, setNear] = useState(false);
  const [devs, setDevs] = useState([]);

  // Watch visibility: fetch once when near, run the loop only while visible.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: "300px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Fetch the developers the first time the section comes near.
  useEffect(() => {
    if (!near || devs.length) return;
    // Ajax1 pulls in axios (~21 KB gzipped). This section sits far down the home
    // page, so importing it here (not at the top of the file) keeps axios out of
    // the scripts the page downloads before its first paint.
    import("../lib/ajax1.js")
      .then(({ default: Ajax1 }) => Ajax1({ url: "/developer?page=1&limit=24" }))
      .then((res) => {
        const list = res?.data?.data?.developers || [];
        // Keep entries that have a logo, and drop duplicate names.
        const seen = new Set();
        setDevs(
          list.filter((d) => {
            const key = (d?.name || "").trim().toLowerCase();
            if (!d?.developerImg || !key || seen.has(key)) return false;
            seen.add(key);
            return true;
          })
        );
      })
      .catch(() => setDevs([]));
  }, [near, devs.length]);

  // The animation loop (runs only while the section is near the screen).
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!near || !track || !stage || !devs.length) return undefined;

    const tiles = [...track.children];
    // Where each tile's centre sits inside the track, the width of one copy of the
    // list, and half the stage width. Measured here (not every frame) and again
    // when the stage is resized — tile sizes change at the CSS breakpoints.
    let centres = [];
    let loopWidth = 1;
    let half = 1;
    const measure = () => {
      centres = tiles.map((t) => t.offsetLeft + t.offsetWidth / 2);
      loopWidth = track.scrollWidth / 2 || 1;
      half = stage.clientWidth / 2 || 1;
    };
    measure();

    // Re-measure on resize, at most once per 200ms.
    let resizeTimer;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(measure, 200);
          })
        : null;
    if (ro) ro.observe(stage);

    let x = 0;
    let last = performance.now();
    let frame;

    const tick = (now) => {
      const dt = Math.min(now - last, 64) / 1000; // seconds; capped after a tab switch
      last = now;
      if (!paused.current) x = (x + SPEED * dt) % loopWidth;
      track.style.transform = `translate3d(${-x}px, 0, 0)`;

      tiles.forEach((tile, i) => {
        // -1 (left edge) .. 0 (centre) .. 1 (right edge)
        const d = Math.max(-1, Math.min(1, (centres[i] - x - half) / half));
        const centreness = 1 - Math.abs(d); // 1 at the centre, 0 at the edges
        tile.style.transform = `translateZ(${centreness * 70}px) rotateY(${d * -18}deg) scale(${
          0.82 + centreness * 0.22
        })`;
        tile.style.opacity = 0.35 + centreness * 0.65;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      if (ro) ro.disconnect();
    };
  }, [near, devs]);

  const pause = (on) => () => {
    paused.current = on;
  };

  // The logos twice in a row; the second copy is hidden from screen readers.
  const tiles = (copy) =>
    devs.map((dev) => (
      <li key={`${dev._id || dev.name}${copy ? "-copy" : ""}`} aria-hidden={copy || undefined}>
        <Link href={`/property-listing/developer/${encodeURIComponent(dev.name)}`}>
          <a className={s.dsxTile} tabIndex={copy ? -1 : 0} title={dev.name}>
            <img src={dev.developerImg} alt={copy ? "" : dev.name} loading="lazy" />
          </a>
        </Link>
      </li>
    ));

  return (
    <section ref={rootRef} className={s.dsxSection} aria-labelledby="dsx-title">
      <div className={s.dsxHead}>
        <h2 id="dsx-title" className={s.dsxTitle}>
          Our Developer <span>Partners</span>
        </h2>
      </div>

      <div
        ref={stageRef}
        className={s.dsxStage}
        onMouseEnter={pause(true)}
        onMouseLeave={pause(false)}
        onFocus={pause(true)}
        onBlur={pause(false)}
      >
        {/* The tilted 3D plane the row slides along */}
        <div className={s.dsxPlane}>
          <ul ref={trackRef} className={s.dsxTrack}>
            {tiles(false)}
            {tiles(true)}
          </ul>
        </div>
      </div>
    </section>
  );
}
