import s from "./Skeleton.module.css";

/*
  Shared skeleton primitives. Use these for every loading placeholder so the
  whole site has one look (same colour, same shimmer).

  <SkeletonGroup>      wrapper: aria-busy + hidden "Loading…" text for screen readers
  <SkeletonBox>        any rectangle (width / height / radius)
  <SkeletonText>       N text lines, last one shorter
  <SkeletonCircle>     avatar / icon
  <SkeletonImage>      box that keeps an aspect ratio (e.g. "16 / 9")
  <SkeletonCard>       image + title + text lines

  Sizes accept numbers (px) or any CSS string ("100%", "2rem").
*/

// Shared helper: turns props into an inline style.
function sizeStyle({ width, height, radius, style }) {
  return { width, height, borderRadius: radius, ...style };
}

export function SkeletonGroup({
  children,
  label = "Loading…",
  dark = false,
  className = "",
  style,
}) {
  return (
    <div
      className={`${s.root} ${dark ? s.dark : ""} ${className}`}
      style={style}
      aria-busy="true"
      data-skeleton
      aria-live="polite"
    >
      <span className={s.srOnly}>{label}</span>
      {/* the shapes themselves are hidden from screen readers */}
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

export function SkeletonBox({ width = "100%", height = 16, radius, className = "", style }) {
  return (
    <span
      className={`${s.bone} ${className}`}
      style={sizeStyle({ width, height, radius, style })}
      aria-hidden="true"
    />
  );
}

export function SkeletonCircle({ size = 40, className = "", style }) {
  return (
    <span
      className={`${s.bone} ${s.circle} ${className}`}
      style={sizeStyle({ width: size, height: size, style })}
      aria-hidden="true"
    />
  );
}

export function SkeletonImage({ ratio = "16 / 9", radius = 10, className = "", style }) {
  return (
    <span
      className={`${s.bone} ${className}`}
      style={{ width: "100%", aspectRatio: ratio, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 3, lineHeight = 12, lastWidth = "60%", className = "" }) {
  return (
    <span className={`${s.lines} ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox
          key={i}
          height={lineHeight}
          radius={lineHeight / 2}
          width={i === lines - 1 && lines > 1 ? lastWidth : "100%"}
        />
      ))}
    </span>
  );
}

export function SkeletonCard({ ratio = "4 / 3", lines = 2, className = "" }) {
  return (
    <div className={`${s.card} ${className}`} aria-hidden="true">
      <SkeletonImage ratio={ratio} />
      <SkeletonBox height={16} width="80%" />
      <SkeletonText lines={lines} />
    </div>
  );
}

// The raw shimmer class, for older skeleton files that style their own boxes.
export const boneClass = s.bone;
export const skeletonRootClass = s.root;
